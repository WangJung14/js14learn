import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { AssessmentType, QuestionStatus } from '@prisma/client';

describe('QuestionsService', () => {
  let service: QuestionsService;

  const mockPrismaService = {
    question: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    jest.clearAllMocks();
  });

  describe('Question Validation', () => {
    it('should validate CODE_OUTPUT requires codeSnippet and expectedOutput', () => {
      expect(() =>
        service.validateQuestionConfig(AssessmentType.CODE_OUTPUT, {
          expectedOutput: '42',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.CODE_OUTPUT, {
          codeSnippet: 'console.log(42)',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.CODE_OUTPUT, {
          codeSnippet: 'console.log(42)',
          expectedOutput: '42',
          normalizationMode: 'NORMALIZED',
        }),
      ).not.toThrow();
    });

    it('should validate MULTIPLE_CHOICE requires valid choices and correctOptionId', () => {
      expect(() =>
        service.validateQuestionConfig(AssessmentType.MULTIPLE_CHOICE, {
          choices: [{ id: '1', text: 'One' }],
          correctOptionId: '1',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.MULTIPLE_CHOICE, {
          choices: [
            { id: '1', text: 'One' },
            { id: '2', text: 'Two' },
          ],
          correctOptionId: '99',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.MULTIPLE_CHOICE, {
          choices: [
            { id: '1', text: 'One' },
            { id: '2', text: 'Two' },
          ],
          correctOptionId: '1',
        }),
      ).not.toThrow();
    });

    it('should validate ESSAY requirements', () => {
      expect(() =>
        service.validateQuestionConfig(AssessmentType.ESSAY, {
          gradingMode: 'INVALID',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.ESSAY, {
          gradingMode: 'EXACT',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.ESSAY, {
          gradingMode: 'KEYWORDS',
          requiredKeywords: [],
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateQuestionConfig(AssessmentType.ESSAY, {
          gradingMode: 'MANUAL',
        }),
      ).not.toThrow();
    });
  });

  describe('CRUD and Actions', () => {
    const sampleQuestion = {
      id: 'q-1',
      type: AssessmentType.MULTIPLE_CHOICE,
      title: 'typeof null return value',
      description: 'Test question',
      difficulty: 'EASY',
      status: QuestionStatus.PUBLISHED,
      defaultPoints: 10,
      config: {
        choices: [
          { id: 'a', text: 'object' },
          { id: 'b', text: 'null' },
        ],
        correctOptionId: 'a',
      },
      _count: { exerciseQuestions: 0, assessmentAnswers: 0 },
    };

    it('should create question with DRAFT default status', async () => {
      mockPrismaService.question.create.mockResolvedValue({
        ...sampleQuestion,
        status: QuestionStatus.DRAFT,
      });

      const result = await service.create(
        {
          type: AssessmentType.MULTIPLE_CHOICE,
          title: 'typeof null return value',
          config: sampleQuestion.config,
        },
        'admin-user',
      );

      expect(mockPrismaService.question.create).toHaveBeenCalled();
      expect(result.title).toBe('typeof null return value');
    });

    it('should duplicate a question as DRAFT copy', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(sampleQuestion);
      mockPrismaService.question.create.mockImplementation(({ data }) => ({
        id: 'q-copy-1',
        ...data,
      }));

      const copy = await service.duplicate('q-1', 'admin-user');

      expect(copy.title).toBe('typeof null return value (Copy)');
      expect(copy.status).toBe(QuestionStatus.DRAFT);
    });

    it('should archive a question', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(sampleQuestion);
      mockPrismaService.question.update.mockResolvedValue({
        ...sampleQuestion,
        status: QuestionStatus.ARCHIVED,
      });

      const archived = await service.archive('q-1');
      expect(archived.status).toBe(QuestionStatus.ARCHIVED);
    });

    it('should prevent hard deletion if question is used in exercises or attempts', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue({
        ...sampleQuestion,
        _count: { exerciseQuestions: 2, assessmentAnswers: 5 },
      });

      await expect(service.remove('q-1')).rejects.toThrow(BadRequestException);
    });
  });
});
