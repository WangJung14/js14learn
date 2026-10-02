import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ReorderExercisesDto } from './dto/reorder-exercises.dto';
import { Role, AssessmentType, QuestionStatus } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  private async checkStudentVisibility(userId?: string) {
    if (!userId) return;

    const setting = await (this.prisma.roadmapSetting?.findUnique({
      where: { id: 'global' },
    }) ?? null);
    if (setting && setting.status === 'DRAFT') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!user || user.role !== Role.ADMIN) {
        throw new ForbiddenException(
          'Roadmap is currently in draft mode. Only administrators can view unpublished content.',
        );
      }
    }
  }

  private sanitizeAssessmentConfig(config: any): any {
    if (!config || typeof config !== 'object') return null;
    const sanitized = { ...config };
    delete sanitized.expectedOutput;
    delete sanitized.expectedAnswer;
    delete sanitized.requiredKeywords;
    delete sanitized.rubric;
    delete sanitized.correctOptionId;
    if (Array.isArray(sanitized.choices)) {
      sanitized.choices = sanitized.choices.map((c: any) => {
        const choiceCopy = { ...c };
        delete choiceCopy.isCorrect;
        return choiceCopy;
      });
    }
    return sanitized;
  }

  private sanitizeQuestion(
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

  async findOne(id: string, userId?: string) {
    await this.checkStudentVisibility(userId);
    let isAdmin = false;
    if (userId) {
      const user = await (this.prisma.user?.findUnique({
        where: { id: userId },
        select: { role: true },
      }) ?? null);
      isAdmin = user?.role === Role.ADMIN;
    }

    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        studyDay: {
          select: { id: true, dayNumber: true, title: true },
        },
        exerciseQuestions: {
          include: { question: true },
          orderBy: { order: 'asc' },
        },
        ...(userId && {
          submissions: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
          },
          assessmentAttempts: {
            where: { userId },
            orderBy: { attemptNumber: 'desc' },
            take: 5,
          },
        }),
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    const exData = exercise as any;
    const latestSubmission =
      exData.submissions && exData.submissions.length > 0
        ? exData.submissions[0]
        : null;

    const latestAttempt =
      exData.assessmentAttempts && exData.assessmentAttempts.length > 0
        ? exData.assessmentAttempts[0]
        : null;

    const rawConfig = exercise.assessmentConfig;
    const assessmentConfig = isAdmin
      ? rawConfig
      : this.sanitizeAssessmentConfig(rawConfig);

    const questions = (exercise.exerciseQuestions || []).map((eq) => ({
      ...this.sanitizeQuestion(eq.question, eq.points, isAdmin),
      order: eq.order,
      isRequired: eq.isRequired,
      exerciseQuestionId: eq.id,
    }));

    return {
      id: exercise.id,
      studyDayId: exercise.studyDayId,
      title: exercise.title,
      description: exercise.description,
      difficulty: exercise.difficulty,
      order: exercise.order,
      isCoding: exercise.isCoding,
      starterCode: exercise.starterCode,
      codingConfig: exercise.codingConfig,
      assessmentType: exercise.assessmentType,
      assessmentConfig,
      passingScore: exercise.passingScore ?? 70,
      maxAttempts: exercise.maxAttempts ?? null,
      questions,
      totalQuestions: questions.length,
      totalPoints: questions.reduce((sum, q) => sum + (q.points || 0), 0),
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
      studyDay: exercise.studyDay,
      latestSubmission,
      submissionStatus: latestSubmission ? latestSubmission.status : null,
      latestAttempt,
    };
  }

  async findByStudyDay(studyDayId: string, userId?: string) {
    await this.checkStudentVisibility(userId);
    let isAdmin = false;
    if (userId) {
      const user = await (this.prisma.user?.findUnique({
        where: { id: userId },
        select: { role: true },
      }) ?? null);
      isAdmin = user?.role === Role.ADMIN;
    }

    const exercises = await this.prisma.exercise.findMany({
      where: { studyDayId },
      orderBy: { order: 'asc' },
      include: {
        exerciseQuestions: {
          include: { question: true },
          orderBy: { order: 'asc' },
        },
        ...(userId && {
          submissions: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: 1,
          },
          assessmentAttempts: {
            where: { userId },
            orderBy: { attemptNumber: 'desc' },
            take: 1,
          },
        }),
      },
    });

    return exercises.map((ex) => {
      const exData = ex as any;
      const latestSubmission =
        exData.submissions && exData.submissions.length > 0
          ? exData.submissions[0]
          : null;

      const latestAttempt =
        exData.assessmentAttempts && exData.assessmentAttempts.length > 0
          ? exData.assessmentAttempts[0]
          : null;

      const rawConfig = ex.assessmentConfig;
      const assessmentConfig = isAdmin
        ? rawConfig
        : this.sanitizeAssessmentConfig(rawConfig);

      const questions = (ex.exerciseQuestions || []).map((eq: any) => ({
        ...this.sanitizeQuestion(eq.question, eq.points, isAdmin),
        order: eq.order,
        isRequired: eq.isRequired,
        exerciseQuestionId: eq.id,
      }));

      return {
        id: ex.id,
        studyDayId: ex.studyDayId,
        title: ex.title,
        description: ex.description,
        difficulty: ex.difficulty,
        order: ex.order,
        isCoding: ex.isCoding,
        starterCode: ex.starterCode,
        codingConfig: ex.codingConfig,
        assessmentType: ex.assessmentType,
        assessmentConfig,
        passingScore: ex.passingScore ?? 70,
        maxAttempts: ex.maxAttempts ?? null,
        questions,
        totalQuestions: questions.length,
        totalPoints: questions.reduce(
          (sum: number, q: any) => sum + (q.points || 0),
          0,
        ),
        createdAt: ex.createdAt,
        updatedAt: ex.updatedAt,
        latestSubmission,
        submissionStatus: latestSubmission ? latestSubmission.status : null,
        latestAttempt,
      };
    });
  }

  private validateCodingConfig(
    isCoding?: boolean,
    config?: Record<string, unknown> | null,
  ): void {
    if (!isCoding) return;
    if (!config || typeof config !== 'object') {
      throw new BadRequestException(
        'codingConfig object must be provided for coding exercises',
      );
    }
    const cfg = config as {
      language?: string;
      mode?: string;
      functionName?: string;
      tests?: unknown[];
    };
    if (cfg.language !== 'javascript') {
      throw new BadRequestException(
        'Invalid coding language. Only "javascript" is supported.',
      );
    }
    if (cfg.mode && !['function', 'console'].includes(cfg.mode)) {
      throw new BadRequestException(
        'Invalid execution mode. Allowed: "function" or "console"',
      );
    }
    if (
      cfg.mode === 'function' &&
      (!cfg.functionName ||
        typeof cfg.functionName !== 'string' ||
        !cfg.functionName.trim())
    ) {
      throw new BadRequestException(
        'functionName is required for function-mode coding exercises',
      );
    }
    if (cfg.tests && !Array.isArray(cfg.tests)) {
      throw new BadRequestException('codingConfig.tests must be an array');
    }
  }

  async create(dto: CreateExerciseDto) {
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id: dto.studyDayId },
    });

    if (!studyDay) {
      throw new NotFoundException(
        `Study Day with ID ${dto.studyDayId} not found`,
      );
    }

    this.validateCodingConfig(
      dto.isCoding,
      dto.codingConfig as Record<string, unknown> | null,
    );

    const { questions, questionIds, ...exerciseData } = dto;

    const exercise = await this.prisma.exercise.create({
      data: exerciseData,
    });

    // If question objects or IDs provided, link them
    if (Array.isArray(questions) && questions.length > 0) {
      let orderIndex = 1;
      for (const item of questions) {
        const q = await this.prisma.question.findUnique({
          where: { id: item.questionId },
        });
        if (q) {
          await this.prisma.exerciseQuestion.create({
            data: {
              exerciseId: exercise.id,
              questionId: q.id,
              order: item.order !== undefined ? item.order : orderIndex++,
              points: item.points !== undefined ? item.points : q.defaultPoints,
              isRequired:
                item.isRequired !== undefined ? item.isRequired : true,
            },
          });
        }
      }
    } else if (Array.isArray(questionIds) && questionIds.length > 0) {
      let orderIndex = 1;
      for (const qId of questionIds) {
        const q = await this.prisma.question.findUnique({
          where: { id: qId },
        });
        if (q) {
          await this.prisma.exerciseQuestion.create({
            data: {
              exerciseId: exercise.id,
              questionId: q.id,
              order: orderIndex++,
              points: q.defaultPoints,
              isRequired: true,
            },
          });
        }
      }
    } else if (
      dto.assessmentType &&
      dto.assessmentType !== AssessmentType.NONE &&
      dto.assessmentConfig
    ) {
      // Legacy single-question payload auto-link
      const qConfig = dto.assessmentConfig;
      const defaultPoints =
        typeof qConfig.points === 'number' ? qConfig.points : 10;

      const question = await this.prisma.question.create({
        data: {
          type: dto.assessmentType,
          title: dto.title,
          description: dto.description,
          difficulty: dto.difficulty,
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

    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);
    this.validateCodingConfig(
      dto.isCoding,
      dto.codingConfig as Record<string, unknown> | null,
    );

    const { questions, questionIds, ...exerciseData } = dto;

    await this.prisma.exercise.update({
      where: { id },
      data: exerciseData,
    });

    if (Array.isArray(questions)) {
      await this.prisma.exerciseQuestion.deleteMany({
        where: { exerciseId: id },
      });
      let orderIndex = 1;
      for (const item of questions) {
        const q = await this.prisma.question.findUnique({
          where: { id: item.questionId },
        });
        if (q) {
          await this.prisma.exerciseQuestion.create({
            data: {
              exerciseId: id,
              questionId: q.id,
              order: item.order !== undefined ? item.order : orderIndex++,
              points: item.points !== undefined ? item.points : q.defaultPoints,
              isRequired:
                item.isRequired !== undefined ? item.isRequired : true,
            },
          });
        }
      }
    } else if (Array.isArray(questionIds)) {
      await this.prisma.exerciseQuestion.deleteMany({
        where: { exerciseId: id },
      });
      let orderIndex = 1;
      for (const qId of questionIds) {
        const q = await this.prisma.question.findUnique({
          where: { id: qId },
        });
        if (q) {
          await this.prisma.exerciseQuestion.create({
            data: {
              exerciseId: id,
              questionId: q.id,
              order: orderIndex++,
              points: q.defaultPoints,
              isRequired: true,
            },
          });
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.exercise.delete({
      where: { id },
    });
  }

  async reorder(dto: ReorderExercisesDto) {
    const { studyDayId, items } = dto;

    if (!studyDayId) {
      throw new BadRequestException('studyDayId is required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('items must be a non-empty array');
    }

    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id: studyDayId },
    });

    if (!studyDay) {
      throw new NotFoundException(`Study Day with ID ${studyDayId} not found`);
    }

    const itemIds = items.map((i) => i.id);
    if (new Set(itemIds).size !== itemIds.length) {
      throw new BadRequestException('Duplicate exercise IDs in reorder items');
    }

    const orders = items.map((i) => i.order);
    if (new Set(orders).size !== orders.length) {
      throw new BadRequestException('Duplicate order values in reorder items');
    }

    const existingExercises = await this.prisma.exercise.findMany({
      where: { studyDayId },
    });

    const existingMap = new Map(existingExercises.map((e) => [e.id, e]));

    for (const item of items) {
      if (!existingMap.has(item.id)) {
        const foreignEx = await this.prisma.exercise.findUnique({
          where: { id: item.id },
        });
        if (!foreignEx) {
          throw new NotFoundException(`Exercise with ID ${item.id} not found`);
        }
        throw new BadRequestException(
          `Exercise ${item.id} does not belong to Study Day ${studyDayId}`,
        );
      }
    }

    if (items.length !== existingExercises.length) {
      throw new BadRequestException(
        `Reorder items count (${items.length}) does not match existing exercises count (${existingExercises.length}) for Study Day ${studyDayId}`,
      );
    }

    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.exercise.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findByStudyDay(studyDayId);
  }
}
