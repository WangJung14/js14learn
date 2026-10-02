import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChecklistsService } from '../checklists/checklists.service';
import { CreateAssessmentAttemptDto } from './dto/create-assessment-attempt.dto';
import { ReviewAssessmentAttemptDto } from './dto/review-assessment-attempt.dto';
import {
  AssessmentType,
  AttemptStatus,
  ProgressStatus,
  ActivityType,
  Role,
  QuestionStatus,
} from '@prisma/client';

export interface CodeOutputConfig {
  codeSnippet: string;
  expectedOutput: string;
  normalizationMode?: 'NORMALIZED' | 'STRICT';
  points?: number;
  explanation?: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface MultipleChoiceConfig {
  question?: string;
  choices?: MultipleChoiceOption[];
  options?: MultipleChoiceOption[];
  correctOptionId?: string;
  points?: number;
  explanation?: string;
}

export interface EssayConfig {
  gradingMode: 'EXACT' | 'KEYWORDS' | 'MANUAL';
  expectedAnswer?: string;
  requiredKeywords?: string[];
  keywords?: string[];
  minLength?: number;
  maxLength?: number;
  rubric?: string;
  points?: number;
  explanation?: string;
}

@Injectable()
export class AssessmentsService {
  private readonly logger = new Logger(AssessmentsService.name);

  constructor(
    private prisma: PrismaService,
    private checklistsService: ChecklistsService,
  ) {}

  // Output string normalizer
  public normalizeOutput(str: string): string {
    if (!str) return '';
    return str
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();
  }

  // Sanitize question for student visibility
  public sanitizeQuestion(
    question: any,
    pointsOverride?: number | null,
    isAdmin = false,
  ): any {
    if (!question) return null;

    const points =
      pointsOverride !== undefined && pointsOverride !== null
        ? pointsOverride
        : (question.defaultPoints ?? 10);

    const rawConfig = question.config || {};
    const sanitizedConfig = { ...rawConfig };

    if (!isAdmin) {
      if (question.type === AssessmentType.CODE_OUTPUT) {
        delete sanitizedConfig.expectedOutput;
      } else if (question.type === AssessmentType.MULTIPLE_CHOICE) {
        delete sanitizedConfig.correctOptionId;
        const choices = Array.isArray(sanitizedConfig.choices)
          ? sanitizedConfig.choices
          : Array.isArray(sanitizedConfig.options)
            ? sanitizedConfig.options
            : [];
        sanitizedConfig.choices = choices.map((c: any) => {
          const copy = { ...c };
          delete copy.isCorrect;
          return copy;
        });
        delete sanitizedConfig.options;
      } else if (question.type === AssessmentType.ESSAY) {
        delete sanitizedConfig.expectedAnswer;
        delete sanitizedConfig.keywords;
        delete sanitizedConfig.requiredKeywords;
        delete sanitizedConfig.rubric;
      }
    }

    return {
      id: question.id,
      type: question.type,
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      status: question.status,
      points,
      defaultPoints: question.defaultPoints,
      explanation: isAdmin ? question.explanation : undefined,
      config: sanitizedConfig,
    };
  }

  // Get assessment details for an exercise with all its questions
  async getAssessment(exerciseId: string, userId: string, role: Role) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        studyDay: {
          select: { id: true, dayNumber: true, title: true },
        },
        exerciseQuestions: {
          include: {
            question: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    const isAdmin = role === Role.ADMIN;

    // Backward compatibility: If no ExerciseQuestions exist yet but legacy assessmentConfig exists, ensure Question & link
    let exerciseQuestions = exercise.exerciseQuestions;
    if (
      exerciseQuestions.length === 0 &&
      exercise.assessmentType !== AssessmentType.NONE &&
      exercise.assessmentConfig
    ) {
      await this.ensureLegacyQuestionLink(exercise);
      const reloaded = await this.prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
          exerciseQuestions: {
            include: { question: true },
            orderBy: { order: 'asc' },
          },
        },
      });
      exerciseQuestions = reloaded?.exerciseQuestions || [];
    }

    const questions = exerciseQuestions.map((eq) => ({
      ...this.sanitizeQuestion(eq.question, eq.points, isAdmin),
      order: eq.order,
      isRequired: eq.isRequired,
      exerciseQuestionId: eq.id,
    }));

    const totalQuestions = questions.length;
    const totalPoints = questions.reduce((acc, q) => acc + (q.points || 0), 0);
    const passingScore = exercise.passingScore ?? 70;
    const maxAttempts = exercise.maxAttempts ?? null;

    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: { exerciseId, userId },
      include: {
        answers: {
          include: {
            question: {
              select: { id: true, title: true, type: true },
            },
          },
        },
      },
      orderBy: { attemptNumber: 'desc' },
    });

    const bestAttempt =
      attempts.length > 0
        ? [...attempts].sort((a, b) => b.score - a.score)[0]
        : null;

    const hasPassed = attempts.some((a) => a.isPassed);

    return {
      exerciseId: exercise.id,
      title: exercise.title,
      description: exercise.description,
      difficulty: exercise.difficulty,
      order: exercise.order,
      passingScore,
      maxAttempts,
      totalQuestions,
      totalPoints,
      questions,
      studyDay: exercise.studyDay,
      totalAttempts: attempts.length,
      hasPassed,
      bestScore: bestAttempt ? bestAttempt.score : 0,
      bestPercentage: bestAttempt ? bestAttempt.percentage : 0,
      latestAttempt: attempts[0] || null,
    };
  }

  // Get student's attempt history for an exercise
  async getAttempts(exerciseId: string, userId: string) {
    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: { exerciseId, userId },
      include: {
        answers: {
          include: {
            question: {
              select: { id: true, title: true, type: true, explanation: true },
            },
          },
        },
      },
      orderBy: { attemptNumber: 'desc' },
    });

    return attempts;
  }

  // Get assessment summary (best score, pass state, total attempts)
  async getSummary(exerciseId: string, userId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { maxAttempts: true, passingScore: true },
    });

    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: { exerciseId, userId },
      orderBy: { createdAt: 'desc' },
    });

    const bestAttempt =
      attempts.length > 0
        ? [...attempts].sort((a, b) => b.score - a.score)[0]
        : null;

    const hasPassed = attempts.some((a) => a.isPassed);

    return {
      exerciseId,
      totalAttempts: attempts.length,
      maxAttempts: exercise?.maxAttempts ?? null,
      passingScore: exercise?.passingScore ?? 70,
      hasPassed,
      bestScore: bestAttempt?.score ?? 0,
      bestPercentage: bestAttempt?.percentage ?? 0,
      latestAttempt: attempts[0] ?? null,
    };
  }

  // Submit and grade a multi-question assessment attempt
  async submitAttempt(
    userId: string,
    exerciseId: string,
    dto: CreateAssessmentAttemptDto,
  ) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        studyDay: true,
        exerciseQuestions: {
          include: { question: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    let exerciseQuestions = exercise.exerciseQuestions;
    if (
      exerciseQuestions.length === 0 &&
      exercise.assessmentType !== AssessmentType.NONE &&
      exercise.assessmentConfig
    ) {
      await this.ensureLegacyQuestionLink(exercise);
      const reloaded = await this.prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
          exerciseQuestions: {
            include: { question: true },
            orderBy: { order: 'asc' },
          },
        },
      });
      exerciseQuestions = reloaded?.exerciseQuestions || [];
    }

    if (exerciseQuestions.length === 0) {
      throw new BadRequestException(
        `Exercise "${exercise.title}" has no questions configured.`,
      );
    }

    const previousAttempts = await this.prisma.assessmentAttempt.findMany({
      where: { exerciseId, userId },
    });

    const maxAttempts = exercise.maxAttempts;
    if (maxAttempts && previousAttempts.length >= maxAttempts) {
      throw new BadRequestException(
        `Maximum attempt limit of ${maxAttempts} has been reached for this assessment.`,
      );
    }

    // Build submitted answers map
    const submittedAnswersMap = new Map<string, string>();

    if (Array.isArray(dto.answers) && dto.answers.length > 0) {
      for (const item of dto.answers) {
        if (!item.questionId) continue;
        const val = item.answer !== undefined ? item.answer : '';
        submittedAnswersMap.set(
          item.questionId,
          typeof val === 'string' ? val : String(val),
        );
      }
    } else {
      // Legacy single-question payload support
      const singleRaw =
        dto.answer !== undefined ? dto.answer : dto.studentAnswer;
      if (
        singleRaw !== undefined &&
        singleRaw !== null &&
        exerciseQuestions.length === 1
      ) {
        const singleVal =
          typeof singleRaw === 'string' ? singleRaw : String(singleRaw);
        submittedAnswersMap.set(exerciseQuestions[0].questionId, singleVal);
      } else {
        throw new BadRequestException(
          'Answers must be provided for the assessment questions.',
        );
      }
    }

    // Check for unexpected questions
    const validQuestionIds = new Set(
      exerciseQuestions.map((eq) => eq.questionId),
    );
    for (const qId of submittedAnswersMap.keys()) {
      if (!validQuestionIds.has(qId)) {
        throw new BadRequestException(
          `Question ID "${qId}" does not belong to this exercise.`,
        );
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    let totalScore = 0;
    let totalMaxScore = 0;
    let hasPendingReview = false;
    const answersToCreate: any[] = [];

    // Grade each question
    for (const eq of exerciseQuestions) {
      const q = eq.question;
      const maxScore = eq.points !== null ? eq.points : (q.defaultPoints ?? 10);
      totalMaxScore += maxScore;

      const studentAnswer = submittedAnswersMap.get(q.id) || '';

      if (eq.isRequired && !studentAnswer.trim()) {
        throw new BadRequestException(
          `Answer is required for question: "${q.title}"`,
        );
      }

      let qScore = 0;
      let qIsCorrect = false;
      let qStatus: AttemptStatus = AttemptStatus.SUBMITTED;
      let qFeedback = '';
      const qConfig = (q.config as any) || {};

      if (q.type === AssessmentType.CODE_OUTPUT) {
        const expectedOutput = (qConfig.expectedOutput || '').trim();
        const mode = qConfig.normalizationMode || 'NORMALIZED';

        if (mode === 'STRICT') {
          qIsCorrect = studentAnswer === expectedOutput;
        } else {
          const normStudent = this.normalizeOutput(studentAnswer);
          const normExpected = this.normalizeOutput(expectedOutput);
          qIsCorrect = normStudent === normExpected;
        }

        qScore = qIsCorrect ? maxScore : 0;
        qStatus = qIsCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED;
        qFeedback = qIsCorrect
          ? 'Correct! Your predicted output matches the execution result.'
          : 'Incorrect output. Review the code logic and operator precedence, then try again.';
      } else if (q.type === AssessmentType.MULTIPLE_CHOICE) {
        const choices = Array.isArray(qConfig.choices)
          ? qConfig.choices
          : Array.isArray(qConfig.options)
            ? qConfig.options
            : [];
        if (
          choices.length > 0 &&
          studentAnswer &&
          !choices.some((c: any) => c.id === studentAnswer)
        ) {
          throw new BadRequestException(
            `Invalid option selected for question "${q.title}".`,
          );
        }
        const correctOptionId = qConfig.correctOptionId || '';
        qIsCorrect = Boolean(
          studentAnswer && studentAnswer === correctOptionId,
        );
        qScore = qIsCorrect ? maxScore : 0;
        qStatus = qIsCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED;
        qFeedback = qIsCorrect
          ? 'Correct answer selected!'
          : 'Incorrect option selected. Read the question carefully and try again.';
      } else if (q.type === AssessmentType.ESSAY) {
        const gradingMode = qConfig.gradingMode || 'EXACT';

        if (qConfig.minLength && studentAnswer.length < qConfig.minLength) {
          throw new BadRequestException(
            `Answer length for "${q.title}" (${studentAnswer.length} chars) is below the minimum requirement of ${qConfig.minLength} characters.`,
          );
        }

        if (qConfig.maxLength && studentAnswer.length > qConfig.maxLength) {
          throw new BadRequestException(
            `Answer length for "${q.title}" (${studentAnswer.length} chars) exceeds the maximum limit of ${qConfig.maxLength} characters.`,
          );
        }

        if (gradingMode === 'MANUAL') {
          hasPendingReview = true;
          qScore = 0;
          qIsCorrect = false;
          qStatus = AttemptStatus.PENDING_REVIEW;
          qFeedback =
            'Your answer has been submitted and is pending instructor review.';
        } else if (gradingMode === 'EXACT') {
          const expected = (qConfig.expectedAnswer || '').trim();
          qIsCorrect =
            this.normalizeOutput(studentAnswer).toLowerCase() ===
            this.normalizeOutput(expected).toLowerCase();
          qScore = qIsCorrect ? maxScore : 0;
          qStatus = qIsCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED;
          qFeedback = qIsCorrect
            ? 'Correct! Your explanation accurately matches the expected key.'
            : 'Answer does not match the expected explanation.';
        } else if (
          gradingMode === 'KEYWORDS' ||
          gradingMode === 'KEYWORD_BASED'
        ) {
          const keywords = Array.isArray(qConfig.requiredKeywords)
            ? qConfig.requiredKeywords
            : Array.isArray(qConfig.keywords)
              ? qConfig.keywords
              : [];
          const lowerAnswer = studentAnswer.toLowerCase();
          const missing = keywords.filter(
            (kw: string) => !lowerAnswer.includes(kw.toLowerCase().trim()),
          );

          qIsCorrect = keywords.length > 0 && missing.length === 0;
          qScore = qIsCorrect ? maxScore : 0;
          qStatus = qIsCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED;
          qFeedback = qIsCorrect
            ? 'Great explanation! All required core concepts and keywords were covered.'
            : `Your explanation is missing key concepts. Missing: ${missing.join(', ')}`;
        }
      }

      totalScore += qScore;

      const qPercentage = maxScore > 0 ? (qScore / maxScore) * 100 : 0;

      answersToCreate.push({
        questionId: q.id,
        studentAnswer,
        score: qScore,
        maxScore,
        percentage: qPercentage,
        isCorrect: qIsCorrect,
        status: qStatus,
        feedback: qFeedback,
        gradedAt: qStatus === AttemptStatus.PENDING_REVIEW ? null : new Date(),
      });
    }

    const percentage =
      totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    const passingThreshold = exercise.passingScore ?? 70;
    const isPassed = !hasPendingReview && percentage >= passingThreshold;
    const attemptStatus: AttemptStatus = hasPendingReview
      ? AttemptStatus.PENDING_REVIEW
      : isPassed
        ? AttemptStatus.PASSED
        : AttemptStatus.FAILED;

    const attemptNumber = previousAttempts.length + 1;

    // Transactionally create AssessmentAttempt and AssessmentAnswers
    const savedAttempt = await this.prisma.$transaction(async (tx) => {
      const attempt = await tx.assessmentAttempt.create({
        data: {
          userId,
          exerciseId,
          attemptNumber,
          status: attemptStatus,
          score: totalScore,
          totalPoints: totalMaxScore,
          percentage,
          isPassed,
          studentAnswer: Array.from(submittedAnswersMap.values()).join(' | '),
          feedback: isPassed
            ? `Passed assessment with score ${totalScore}/${totalMaxScore} (${percentage.toFixed(0)}%)`
            : hasPendingReview
              ? 'Assessment submitted and contains questions pending instructor review.'
              : `Scored ${totalScore}/${totalMaxScore} (${percentage.toFixed(0)}%). Passing score is ${passingThreshold}%.`,
          submittedAt: new Date(),
          gradedAt: hasPendingReview ? null : new Date(),
          answers: {
            create: answersToCreate,
          },
        },
        include: {
          answers: {
            include: {
              question: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  explanation: true,
                },
              },
            },
          },
        },
      });

      if (isPassed) {
        // Check if all exercises in this StudyDay have at least one approved submission or passed attempt
        const allExercisesInDay = await tx.exercise.findMany({
          where: { studyDayId: exercise.studyDayId },
          select: { id: true, assessmentType: true },
        });

        const exerciseIdsInDay = allExercisesInDay.map((e) => e.id);

        const approvedSubmissions = await tx.submission.findMany({
          where: {
            userId,
            exerciseId: { in: exerciseIdsInDay },
            status: 'APPROVED',
          },
          select: { exerciseId: true },
        });

        const passedAssessments = await tx.assessmentAttempt.findMany({
          where: {
            userId,
            exerciseId: { in: exerciseIdsInDay },
            isPassed: true,
          },
          select: { exerciseId: true },
        });

        const completedExerciseIds = new Set([
          ...approvedSubmissions.map((s) => s.exerciseId),
          ...passedAssessments.map((a) => a.exerciseId),
          exerciseId,
        ]);

        const isDayFullyCompleted = exerciseIdsInDay.every((exId) =>
          completedExerciseIds.has(exId),
        );

        if (isDayFullyCompleted) {
          await tx.progress.upsert({
            where: {
              userId_studyDayId: {
                userId,
                studyDayId: exercise.studyDayId,
              },
            },
            update: {
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
            create: {
              userId,
              studyDayId: exercise.studyDayId,
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
          });

          const dayNum = exercise.studyDay?.dayNumber ?? '';
          const dayTitle = exercise.studyDay?.title ?? '';
          await tx.activity.create({
            data: {
              userId,
              type: ActivityType.COMPLETED_DAY,
              message: `${user?.name || 'Student'} completed Day ${dayNum}: ${dayTitle}`,
            },
          });
        } else {
          await tx.progress.upsert({
            where: {
              userId_studyDayId: {
                userId,
                studyDayId: exercise.studyDayId,
              },
            },
            update: {},
            create: {
              userId,
              studyDayId: exercise.studyDayId,
              status: ProgressStatus.IN_PROGRESS,
            },
          });
        }

        await tx.activity.create({
          data: {
            userId,
            type: ActivityType.SUBMITTED_EXERCISE,
            message: `${user?.name || 'Student'} passed assessment "${exercise.title}" (${percentage.toFixed(0)}%)`,
          },
        });
      }

      return attempt;
    });

    if (isPassed) {
      await this.checklistsService.autoCompleteLinkedExerciseItem(
        userId,
        exerciseId,
      );
    }

    return {
      ...savedAttempt,
      explanation: exerciseQuestions[0]?.question?.explanation || undefined,
    };
  }

  // Admin list pending essay reviews
  async getPendingReviews() {
    return this.prisma.assessmentAttempt.findMany({
      where: { status: AttemptStatus.PENDING_REVIEW },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        exercise: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            passingScore: true,
            studyDay: {
              select: { id: true, dayNumber: true, title: true },
            },
          },
        },
        answers: {
          where: { status: AttemptStatus.PENDING_REVIEW },
          include: {
            question: {
              select: {
                id: true,
                title: true,
                type: true,
                explanation: true,
                config: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  // Admin grade/review a manual essay attempt or individual answers
  async reviewAttempt(attemptId: string, dto: ReviewAssessmentAttemptDto) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exercise: {
          include: { studyDay: true },
        },
        user: true,
        answers: {
          include: { question: true },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Assessment attempt ${attemptId} not found`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // 1. If individual answers are provided, update each
      if (Array.isArray(dto.answers) && dto.answers.length > 0) {
        for (const item of dto.answers) {
          const ans = attempt.answers.find((a) => a.id === item.answerId);
          if (ans) {
            const score = Math.min(Math.max(0, item.score), ans.maxScore);
            const percentage =
              ans.maxScore > 0 ? (score / ans.maxScore) * 100 : 0;
            const isCorrect = percentage >= 70;
            await tx.assessmentAnswer.update({
              where: { id: item.answerId },
              data: {
                score,
                percentage,
                isCorrect,
                status: isCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED,
                adminFeedback: item.feedback?.trim() || null,
                gradedAt: new Date(),
              },
            });
          }
        }
      } else if (dto.score !== undefined) {
        // Single essay attempt legacy review: update the pending answer
        const pendingAnswer = attempt.answers.find(
          (a) => a.status === AttemptStatus.PENDING_REVIEW,
        );
        if (pendingAnswer) {
          const maxScore =
            pendingAnswer.maxScore > 0
              ? pendingAnswer.maxScore
              : attempt.totalPoints;
          const score = Math.min(Math.max(0, dto.score), maxScore);
          const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
          const isCorrect =
            dto.isPassed !== undefined ? dto.isPassed : percentage >= 70;
          await tx.assessmentAnswer.update({
            where: { id: pendingAnswer.id },
            data: {
              score,
              percentage,
              isCorrect,
              status: isCorrect ? AttemptStatus.PASSED : AttemptStatus.FAILED,
              adminFeedback:
                (dto.feedback || dto.adminFeedback || '').trim() || null,
              gradedAt: new Date(),
            },
          });
        }
      }

      // 2. Fetch fresh answers and recalculate total score & status
      const freshAnswers = await tx.assessmentAnswer.findMany({
        where: { attemptId },
      });

      const totalScore = freshAnswers.reduce((sum, a) => sum + a.score, 0);
      const totalMaxScore = freshAnswers.reduce(
        (sum, a) => sum + a.maxScore,
        0,
      );
      const percentage =
        totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
      const passingThreshold = attempt.exercise?.passingScore ?? 70;

      const stillHasPending = freshAnswers.some(
        (a) => a.status === AttemptStatus.PENDING_REVIEW,
      );

      const isPassed =
        !stillHasPending &&
        (dto.isPassed !== undefined
          ? dto.isPassed
          : percentage >= passingThreshold);

      const status: AttemptStatus = stillHasPending
        ? AttemptStatus.PENDING_REVIEW
        : isPassed
          ? AttemptStatus.PASSED
          : AttemptStatus.FAILED;

      const feedbackText =
        dto.feedback || dto.adminFeedback || attempt.feedback;

      const res = await tx.assessmentAttempt.update({
        where: { id: attemptId },
        data: {
          score: totalScore,
          percentage,
          isPassed,
          status,
          adminFeedback: feedbackText ? feedbackText.trim() : null,
          gradedAt: stillHasPending ? null : new Date(),
        },
        include: {
          answers: {
            include: { question: true },
          },
        },
      });

      if (isPassed) {
        const exerciseIdsInDay = (
          await tx.exercise.findMany({
            where: { studyDayId: attempt.exercise.studyDayId },
            select: { id: true },
          })
        ).map((e) => e.id);

        const approvedSubmissions = await tx.submission.findMany({
          where: {
            userId: attempt.userId,
            exerciseId: { in: exerciseIdsInDay },
            status: 'APPROVED',
          },
          select: { exerciseId: true },
        });

        const passedAssessments = await tx.assessmentAttempt.findMany({
          where: {
            userId: attempt.userId,
            exerciseId: { in: exerciseIdsInDay },
            isPassed: true,
          },
          select: { exerciseId: true },
        });

        const completedExerciseIds = new Set([
          ...approvedSubmissions.map((s) => s.exerciseId),
          ...passedAssessments.map((a) => a.exerciseId),
          attempt.exerciseId,
        ]);

        const isDayFullyCompleted = exerciseIdsInDay.every((exId) =>
          completedExerciseIds.has(exId),
        );

        if (isDayFullyCompleted) {
          await tx.progress.upsert({
            where: {
              userId_studyDayId: {
                userId: attempt.userId,
                studyDayId: attempt.exercise.studyDayId,
              },
            },
            update: {
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
            create: {
              userId: attempt.userId,
              studyDayId: attempt.exercise.studyDayId,
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
          });

          await tx.activity.create({
            data: {
              userId: attempt.userId,
              type: ActivityType.COMPLETED_DAY,
              message: `${attempt.user?.name || 'Student'} completed Day ${attempt.exercise.studyDay.dayNumber}: ${attempt.exercise.studyDay.title}`,
            },
          });
        }
      }

      return res;
    });

    if (updated.isPassed) {
      await this.checklistsService.autoCompleteLinkedExerciseItem(
        attempt.userId,
        attempt.exerciseId,
      );
    }

    return updated;
  }

  // Helper: auto-create question and link for legacy single-config exercises
  private async ensureLegacyQuestionLink(exercise: any) {
    if (!exercise.assessmentConfig) return;

    const existingLink = await this.prisma.exerciseQuestion.findFirst({
      where: { exerciseId: exercise.id },
    });
    if (existingLink) return;

    const qConfig = exercise.assessmentConfig;
    const defaultPoints =
      typeof qConfig.points === 'number' ? qConfig.points : 10;

    const question = await this.prisma.question.create({
      data: {
        type: exercise.assessmentType,
        title: exercise.title,
        description: exercise.description,
        difficulty: exercise.difficulty,
        status: QuestionStatus.PUBLISHED,
        explanation: qConfig.explanation || null,
        defaultPoints,
        config: qConfig,
      },
    });

    await this.prisma.exerciseQuestion.create({
      data: {
        exerciseId: exercise.id,
        questionId: question.id,
        order: 1,
        points: defaultPoints,
        isRequired: true,
      },
    });
  }

  // Admin: Add questions to exercise
  async addQuestionsToExercise(
    exerciseId: string,
    questionData: Array<{
      questionId: string;
      points?: number;
      order?: number;
      isRequired?: boolean;
    }>,
  ) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { exerciseQuestions: true },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    let currentOrder = exercise.exerciseQuestions.length;

    for (const item of questionData) {
      const question = await this.prisma.question.findUnique({
        where: { id: item.questionId },
      });

      if (!question) {
        throw new NotFoundException(`Question ${item.questionId} not found`);
      }

      if (question.status === QuestionStatus.DRAFT) {
        throw new BadRequestException(
          `Cannot add draft question "${question.title}" to exercise. Publish the question first.`,
        );
      }

      currentOrder += 1;
      const order = item.order !== undefined ? item.order : currentOrder;
      const points =
        item.points !== undefined ? item.points : question.defaultPoints;

      await this.prisma.exerciseQuestion.upsert({
        where: {
          exerciseId_questionId: {
            exerciseId,
            questionId: item.questionId,
          },
        },
        update: {
          order,
          points,
          isRequired: item.isRequired !== undefined ? item.isRequired : true,
        },
        create: {
          exerciseId,
          questionId: item.questionId,
          order,
          points,
          isRequired: item.isRequired !== undefined ? item.isRequired : true,
        },
      });
    }

    return this.prisma.exerciseQuestion.findMany({
      where: { exerciseId },
      include: { question: true },
      orderBy: { order: 'asc' },
    });
  }

  // Admin: Remove question from exercise
  async removeQuestionFromExercise(exerciseId: string, questionId: string) {
    const link = await this.prisma.exerciseQuestion.findUnique({
      where: {
        exerciseId_questionId: {
          exerciseId,
          questionId,
        },
      },
    });

    if (!link) {
      throw new NotFoundException(
        `Question ${questionId} is not part of exercise ${exerciseId}`,
      );
    }

    await this.prisma.exerciseQuestion.delete({
      where: {
        exerciseId_questionId: {
          exerciseId,
          questionId,
        },
      },
    });

    return { success: true };
  }

  // Admin: Reorder questions in an exercise
  async reorderExerciseQuestions(
    exerciseId: string,
    orders: Array<{ questionId: string; order: number }>,
  ) {
    await this.prisma.$transaction(
      orders.map((item) =>
        this.prisma.exerciseQuestion.update({
          where: {
            exerciseId_questionId: {
              exerciseId,
              questionId: item.questionId,
            },
          },
          data: { order: item.order },
        }),
      ),
    );

    return this.prisma.exerciseQuestion.findMany({
      where: { exerciseId },
      include: { question: true },
      orderBy: { order: 'asc' },
    });
  }

  // Admin: Update single exercise question override
  async updateExerciseQuestion(
    exerciseId: string,
    questionId: string,
    dto: { points?: number; order?: number; isRequired?: boolean },
  ) {
    const link = await this.prisma.exerciseQuestion.findUnique({
      where: {
        exerciseId_questionId: {
          exerciseId,
          questionId,
        },
      },
    });

    if (!link) {
      throw new NotFoundException(
        `Question ${questionId} is not linked to exercise ${exerciseId}`,
      );
    }

    return this.prisma.exerciseQuestion.update({
      where: {
        exerciseId_questionId: {
          exerciseId,
          questionId,
        },
      },
      data: {
        ...(dto.points !== undefined && { points: dto.points }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.isRequired !== undefined && { isRequired: dto.isRequired }),
      },
      include: { question: true },
    });
  }
}
