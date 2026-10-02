import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentsService } from './assessments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChecklistsService } from '../checklists/checklists.service';
import { BadRequestException } from '@nestjs/common';
import { AssessmentType, AttemptStatus, QuestionStatus } from '@prisma/client';

describe('AssessmentsService', () => {
  let service: AssessmentsService;

  const mockPrismaService = {
    $transaction: jest.fn((cb) =>
      typeof cb === 'function' ? cb(mockPrismaService) : Promise.all(cb),
    ),
    exercise: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    question: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    exerciseQuestion: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    assessmentAttempt: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    assessmentAnswer: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    roadmapSetting: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue({ name: 'Test Student' }),
    },
    progress: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    submission: {
      findMany: jest.fn(),
    },
    activity: {
      create: jest.fn(),
    },
  };

  const mockChecklistsService = {
    autoCompleteLinkedExerciseItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ChecklistsService, useValue: mockChecklistsService },
      ],
    }).compile();

    service = module.get<AssessmentsService>(AssessmentsService);
    jest.clearAllMocks();
    mockPrismaService.user.findUnique.mockResolvedValue({
      name: 'Test Student',
    });
  });

  describe('CODE_OUTPUT Question Assessment', () => {
    const codeExercise = {
      id: 'ex-code-1',
      studyDayId: 'day-1',
      title: 'Type Coercion Output',
      studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
      passingScore: 70,
      maxAttempts: 3,
      exerciseQuestions: [
        {
          id: 'eq-1',
          exerciseId: 'ex-code-1',
          questionId: 'q-code-1',
          order: 1,
          points: 10,
          isRequired: true,
          question: {
            id: 'q-code-1',
            type: AssessmentType.CODE_OUTPUT,
            title: 'Predict output',
            defaultPoints: 10,
            status: QuestionStatus.PUBLISHED,
            config: {
              codeSnippet: 'const x = "5";\nconsole.log(x + 2);',
              expectedOutput: '52',
              normalizationMode: 'NORMALIZED',
              explanation: 'String concatenation occurs with + operator.',
            },
          },
        },
      ],
    };

    it('should grade correct answer with whitespace normalization', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(codeExercise);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'attempt-1',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([codeExercise]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-code-1', {
        answers: [{ questionId: 'q-code-1', answer: '  52  \n' }],
      });

      expect(result.status).toBe(AttemptStatus.PASSED);
      expect(result.score).toBe(10);
      expect(result.percentage).toBe(100);
      expect(result.isPassed).toBe(true);
      expect(
        mockChecklistsService.autoCompleteLinkedExerciseItem,
      ).toHaveBeenCalledWith('user-1', 'ex-code-1');
    });

    it('should grade multiline output normalized correctly', async () => {
      const multilineEx = {
        ...codeExercise,
        exerciseQuestions: [
          {
            ...codeExercise.exerciseQuestions[0],
            question: {
              ...codeExercise.exerciseQuestions[0].question,
              config: {
                ...codeExercise.exerciseQuestions[0].question.config,
                expectedOutput: 'Hello\n42',
                normalizationMode: 'NORMALIZED',
              },
            },
          },
        ],
      };
      mockPrismaService.exercise.findUnique.mockResolvedValue(multilineEx);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'attempt-2',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([multilineEx]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-code-1', {
        answers: [{ questionId: 'q-code-1', answer: 'Hello  \r\n42\n\n' }],
      });

      expect(result.status).toBe(AttemptStatus.PASSED);
      expect(result.score).toBe(10);
      expect(result.isPassed).toBe(true);
    });

    it('should fail when answer is incorrect and not update checklist', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(codeExercise);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'attempt-3',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([codeExercise]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-code-1', {
        answers: [{ questionId: 'q-code-1', answer: '7' }],
      });

      expect(result.status).toBe(AttemptStatus.FAILED);
      expect(result.score).toBe(0);
      expect(result.isPassed).toBe(false);
      expect(
        mockChecklistsService.autoCompleteLinkedExerciseItem,
      ).not.toHaveBeenCalled();
    });

    it('should enforce maxAttempts limit', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(codeExercise);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ]);

      await expect(
        service.submitAttempt('user-1', 'ex-code-1', {
          answers: [{ questionId: 'q-code-1', answer: '52' }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('MULTIPLE_CHOICE Question Grading', () => {
    const mcqExercise = {
      id: 'ex-mcq-1',
      studyDayId: 'day-1',
      studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
      passingScore: 70,
      exerciseQuestions: [
        {
          id: 'eq-mcq-1',
          exerciseId: 'ex-mcq-1',
          questionId: 'q-mcq-1',
          order: 1,
          points: 10,
          isRequired: true,
          question: {
            id: 'q-mcq-1',
            type: AssessmentType.MULTIPLE_CHOICE,
            title: 'typeof null quiz',
            defaultPoints: 10,
            status: QuestionStatus.PUBLISHED,
            config: {
              choices: [
                { id: 'c1', text: '"null"' },
                { id: 'c2', text: '"undefined"' },
                { id: 'c3', text: '"object"' },
                { id: 'c4', text: '"boolean"' },
              ],
              correctOptionId: 'c3',
            },
          },
        },
      ],
    };

    it('should grade correct option as PASSED', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(mcqExercise);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'att-mcq-1',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([mcqExercise]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-mcq-1', {
        answers: [{ questionId: 'q-mcq-1', answer: 'c3' }],
      });

      expect(result.isPassed).toBe(true);
      expect(result.score).toBe(10);
      expect(result.status).toBe(AttemptStatus.PASSED);
      expect(
        mockChecklistsService.autoCompleteLinkedExerciseItem,
      ).toHaveBeenCalledWith('user-1', 'ex-mcq-1');
    });

    it('should reject invalid choice option ID', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(mcqExercise);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);

      await expect(
        service.submitAttempt('user-1', 'ex-mcq-1', {
          answers: [{ questionId: 'q-mcq-1', answer: 'invalid-choice-id' }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('ESSAY Question Grading', () => {
    it('should grade EXACT essay mode match', async () => {
      const exactEssay = {
        id: 'ex-essay-1',
        studyDayId: 'day-1',
        studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
        passingScore: 70,
        exerciseQuestions: [
          {
            id: 'eq-essay-1',
            exerciseId: 'ex-essay-1',
            questionId: 'q-essay-1',
            order: 1,
            points: 10,
            isRequired: true,
            question: {
              id: 'q-essay-1',
              type: AssessmentType.ESSAY,
              title: 'Closure explanation',
              defaultPoints: 10,
              status: QuestionStatus.PUBLISHED,
              config: {
                gradingMode: 'EXACT',
                expectedAnswer:
                  'Closure is the combination of a function bundled with references to its surrounding state.',
              },
            },
          },
        ],
      };
      mockPrismaService.exercise.findUnique.mockResolvedValue(exactEssay);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'att-essay-1',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([exactEssay]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-essay-1', {
        answers: [
          {
            questionId: 'q-essay-1',
            answer:
              '  Closure is the combination of a function bundled with references to its surrounding state.  ',
          },
        ],
      });

      expect(result.isPassed).toBe(true);
      expect(result.score).toBe(10);
    });

    it('should set status to PENDING_REVIEW for MANUAL essay grading', async () => {
      const manualEssay = {
        id: 'ex-essay-3',
        studyDayId: 'day-1',
        studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
        passingScore: 70,
        exerciseQuestions: [
          {
            id: 'eq-manual-1',
            exerciseId: 'ex-essay-3',
            questionId: 'q-manual-1',
            order: 1,
            points: 20,
            isRequired: true,
            question: {
              id: 'q-manual-1',
              type: AssessmentType.ESSAY,
              title: 'Event Loop',
              defaultPoints: 20,
              status: QuestionStatus.PUBLISHED,
              config: {
                gradingMode: 'MANUAL',
                rubric: 'Score based on explanation depth',
              },
            },
          },
        ],
      };
      mockPrismaService.exercise.findUnique.mockResolvedValue(manualEssay);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'att-manual-1',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([manualEssay]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-essay-3', {
        answers: [
          {
            questionId: 'q-manual-1',
            answer:
              'JavaScript event loop manages execution stack, microtask queue, and macrotask queue.',
          },
        ],
      });

      expect(result.status).toBe(AttemptStatus.PENDING_REVIEW);
      expect(result.isPassed).toBe(false);
      expect(result.score).toBe(0);
      expect(
        mockChecklistsService.autoCompleteLinkedExerciseItem,
      ).not.toHaveBeenCalled();
    });

    it('should complete checklist and progress when Admin reviews and passes MANUAL essay', async () => {
      const manualAttempt = {
        id: 'att-manual-1',
        userId: 'user-1',
        exerciseId: 'ex-essay-3',
        totalPoints: 20,
        status: AttemptStatus.PENDING_REVIEW,
        exercise: {
          id: 'ex-essay-3',
          studyDayId: 'day-1',
          passingScore: 70,
          studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
        },
        answers: [
          {
            id: 'ans-1',
            questionId: 'q-manual-1',
            status: AttemptStatus.PENDING_REVIEW,
            maxScore: 20,
            score: 0,
            question: {
              id: 'q-manual-1',
              title: 'Event Loop',
              type: AssessmentType.ESSAY,
            },
          },
        ],
      };

      mockPrismaService.assessmentAttempt.findUnique.mockResolvedValue(
        manualAttempt,
      );
      mockPrismaService.assessmentAnswer.findMany.mockResolvedValue([
        {
          id: 'ans-1',
          questionId: 'q-manual-1',
          status: AttemptStatus.PASSED,
          maxScore: 20,
          score: 18,
        },
      ]);
      mockPrismaService.assessmentAttempt.update.mockImplementation(
        ({ data }) => ({
          ...manualAttempt,
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'ex-essay-3', studyDayId: 'day-1' }]);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([
        { id: 'att-manual-1', isPassed: true },
      ]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const reviewResult = await service.reviewAttempt('att-manual-1', {
        answers: [{ answerId: 'ans-1', score: 18, feedback: 'Great answer!' }],
        isPassed: true,
      });

      expect(reviewResult.status).toBe(AttemptStatus.PASSED);
      expect(reviewResult.score).toBe(18);
      expect(reviewResult.percentage).toBe(90);
      expect(reviewResult.isPassed).toBe(true);
      expect(
        mockChecklistsService.autoCompleteLinkedExerciseItem,
      ).toHaveBeenCalledWith('user-1', 'ex-essay-3');
    });
  });

  describe('Multi-Question Assessment Composition', () => {
    const multiEx = {
      id: 'ex-multi-1',
      studyDayId: 'day-1',
      title: 'JavaScript Checkpoint Exam',
      studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
      passingScore: 70,
      exerciseQuestions: [
        {
          id: 'eq-1',
          exerciseId: 'ex-multi-1',
          questionId: 'q1',
          order: 1,
          points: 10,
          isRequired: true,
          question: {
            id: 'q1',
            type: AssessmentType.MULTIPLE_CHOICE,
            title: 'Q1 MCQ',
            defaultPoints: 10,
            status: QuestionStatus.PUBLISHED,
            config: {
              choices: [
                { id: 'a', text: 'Option A' },
                { id: 'b', text: 'Option B' },
              ],
              correctOptionId: 'a',
            },
          },
        },
        {
          id: 'eq-2',
          exerciseId: 'ex-multi-1',
          questionId: 'q2',
          order: 2,
          points: 10,
          isRequired: true,
          question: {
            id: 'q2',
            type: AssessmentType.CODE_OUTPUT,
            title: 'Q2 Code Output',
            defaultPoints: 10,
            status: QuestionStatus.PUBLISHED,
            config: {
              codeSnippet: 'console.log(1+1);',
              expectedOutput: '2',
              normalizationMode: 'NORMALIZED',
            },
          },
        },
      ],
    };

    it('should grade multi-question attempt and compute total score correctly', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(multiEx);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'att-multi-1',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([multiEx]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-multi-1', {
        answers: [
          { questionId: 'q1', answer: 'a' }, // 10/10
          { questionId: 'q2', answer: '2' }, // 10/10
        ],
      });

      expect(result.status).toBe(AttemptStatus.PASSED);
      expect(result.score).toBe(20);
      expect(result.totalPoints).toBe(20);
      expect(result.percentage).toBe(100);
      expect(result.isPassed).toBe(true);
    });

    it('should compute partial score when one question is wrong', async () => {
      mockPrismaService.exercise.findUnique.mockResolvedValue(multiEx);
      mockPrismaService.assessmentAttempt.findMany.mockResolvedValue([]);
      mockPrismaService.assessmentAttempt.create.mockImplementation(
        ({ data }) => ({
          id: 'att-multi-2',
          ...data,
        }),
      );
      mockPrismaService.exercise.findMany = jest
        .fn()
        .mockResolvedValue([multiEx]);
      mockPrismaService.submission.findMany.mockResolvedValue([]);

      const result = await service.submitAttempt('user-1', 'ex-multi-1', {
        answers: [
          { questionId: 'q1', answer: 'a' }, // 10/10
          { questionId: 'q2', answer: 'wrong' }, // 0/10
        ],
      });

      expect(result.status).toBe(AttemptStatus.FAILED);
      expect(result.score).toBe(10);
      expect(result.totalPoints).toBe(20);
      expect(result.percentage).toBe(50);
      expect(result.isPassed).toBe(false);
    });
  });
});
