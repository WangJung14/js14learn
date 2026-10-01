import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExerciseDifficulty } from '@prisma/client';

describe('ExercisesService - Admin Coding Exercise Builder', () => {
  let service: ExercisesService;
  let prismaService: any;

  const mockStudyDay = {
    id: 'day-1',
    dayNumber: 1,
    title: 'Values and Operators',
  };

  beforeEach(async () => {
    prismaService = {
      studyDay: {
        findUnique: jest.fn(),
      },
      exercise: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(async (promises) => {
        return Promise.all(promises);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
  });

  it('should create a normal exercise successfully', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    const dto = {
      studyDayId: 'day-1',
      title: 'Standard Exercise',
      description: 'Solve questions',
      difficulty: ExerciseDifficulty.EASY,
      order: 1,
    };
    prismaService.exercise.create.mockResolvedValue({ id: 'ex-1', ...dto });

    const result = await service.create(dto);
    expect(result.id).toBe('ex-1');
    expect(prismaService.exercise.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should create a function-mode coding exercise with valid codingConfig', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    const codingDto = {
      studyDayId: 'day-1',
      title: 'Function Sum',
      description: 'Implement sum(a, b)',
      difficulty: ExerciseDifficulty.EASY,
      order: 1,
      isCoding: true,
      starterCode: 'function sum(a, b) { return a + b; }',
      codingConfig: {
        language: 'javascript',
        mode: 'function',
        functionName: 'sum',
        tests: [
          { id: 't1', name: 'sum(2, 3)', args: [2, 3], expected: 5 },
          { id: 't2', name: 'sum(10, 20)', args: [10, 20], expected: 30 },
        ],
      },
    };
    prismaService.exercise.create.mockResolvedValue({
      id: 'ex-coding-1',
      ...codingDto,
    });

    const result = await service.create(codingDto);
    expect(result.id).toBe('ex-coding-1');
    expect(result.isCoding).toBe(true);
    expect(result.codingConfig).toEqual(codingDto.codingConfig);
  });

  it('should create a console-mode coding exercise with valid codingConfig', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    const consoleDto = {
      studyDayId: 'day-1',
      title: 'Console Print',
      description: 'Print Hello',
      difficulty: ExerciseDifficulty.EASY,
      order: 2,
      isCoding: true,
      starterCode: 'console.log("Hello World");',
      codingConfig: {
        language: 'javascript',
        mode: 'console',
        tests: [
          { id: 't1', name: 'Prints Hello World', expected: 'Hello World' },
        ],
      },
    };
    prismaService.exercise.create.mockResolvedValue({
      id: 'ex-console-1',
      ...consoleDto,
    });

    const result = await service.create(consoleDto);
    expect(result.id).toBe('ex-console-1');
  });

  it('should reject coding exercise if codingConfig is missing', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    await expect(
      service.create({
        studyDayId: 'day-1',
        title: 'Broken Coding Exercise',
        description: 'Missing config',
        difficulty: ExerciseDifficulty.EASY,
        order: 1,
        isCoding: true,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject coding exercise if language is invalid', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    await expect(
      service.create({
        studyDayId: 'day-1',
        title: 'Python Exercise',
        description: 'Not supported',
        difficulty: ExerciseDifficulty.EASY,
        order: 1,
        isCoding: true,
        codingConfig: {
          language: 'python',
          mode: 'function',
          functionName: 'sum',
          tests: [],
        },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should preserve isCoding, starterCode, and codingConfig on findOne', async () => {
    const dbExercise = {
      id: 'ex-get-1',
      studyDayId: 'day-1',
      title: 'GET Test Exercise',
      description: 'Preserve fields',
      difficulty: ExerciseDifficulty.MEDIUM,
      order: 1,
      isCoding: true,
      starterCode: 'function foo() {}',
      codingConfig: {
        language: 'javascript',
        mode: 'function',
        functionName: 'foo',
        tests: [
          { id: 't1', name: 'visible', args: [], expected: 1, hidden: false },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      studyDay: { id: 'day-1', dayNumber: 1, title: 'Day 1' },
      submissions: [],
    };
    prismaService.exercise.findUnique.mockResolvedValue(dbExercise);

    const result = await service.findOne('ex-get-1', 'user-1');
    expect(result.isCoding).toBe(true);
    expect(result.starterCode).toBe('function foo() {}');
    expect(result.codingConfig).toEqual(dbExercise.codingConfig);
  });

  describe('reorder', () => {
    const exA = {
      id: 'ex-a',
      studyDayId: 'day-1',
      title: 'Exercise A',
      description: 'A',
      difficulty: ExerciseDifficulty.EASY,
      order: 1,
      isCoding: false,
      starterCode: null,
      codingConfig: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const exB = {
      id: 'ex-b',
      studyDayId: 'day-1',
      title: 'Exercise B',
      description: 'B',
      difficulty: ExerciseDifficulty.MEDIUM,
      order: 2,
      isCoding: true,
      starterCode: 'function b() {}',
      codingConfig: {
        language: 'javascript',
        mode: 'function',
        functionName: 'b',
        tests: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const exC = {
      id: 'ex-c',
      studyDayId: 'day-1',
      title: 'Exercise C',
      description: 'C',
      difficulty: ExerciseDifficulty.HARD,
      order: 3,
      isCoding: false,
      starterCode: null,
      codingConfig: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('1. should reorder exercises successfully in atomic transaction', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB, exC]);
      prismaService.exercise.update.mockImplementation(({ where, data }) => ({
        ...(where.id === 'ex-a' ? exA : where.id === 'ex-b' ? exB : exC),
        order: data.order,
      }));

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-c', order: 1 },
          { id: 'ex-b', order: 2 },
          { id: 'ex-a', order: 3 },
        ],
      };

      await service.reorder(dto);

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(prismaService.exercise.update).toHaveBeenCalledTimes(3);
    });

    it('2. should map order correctly', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB, exC]);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-b', order: 1 },
          { id: 'ex-a', order: 2 },
          { id: 'ex-c', order: 3 },
        ],
      };

      await service.reorder(dto);

      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: { id: 'ex-b' },
        data: { order: 1 },
      });
      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: { id: 'ex-a' },
        data: { order: 2 },
      });
    });

    it('3. should preserve Exercise IDs', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB]);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-b', order: 1 },
          { id: 'ex-a', order: 2 },
        ],
      };

      await service.reorder(dto);

      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: { id: 'ex-b' },
        data: { order: 1 },
      });
      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: { id: 'ex-a' },
        data: { order: 2 },
      });
    });

    it('4. should preserve studyDayId', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB]);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-b', order: 1 },
          { id: 'ex-a', order: 2 },
        ],
      };

      await service.reorder(dto);

      // Verify update only modified order field
      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: { id: 'ex-b' },
        data: { order: 1 },
      });
    });

    it('5. should reject duplicate IDs', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-a', order: 1 },
          { id: 'ex-a', order: 2 },
        ],
      };

      await expect(service.reorder(dto)).rejects.toThrow(BadRequestException);
    });

    it('6. should reject duplicate orders', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-a', order: 1 },
          { id: 'ex-b', order: 1 },
        ],
      };

      await expect(service.reorder(dto)).rejects.toThrow(BadRequestException);
    });

    it('7. should reject unknown exercise', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB]);
      prismaService.exercise.findUnique.mockResolvedValue(null);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-a', order: 1 },
          { id: 'unknown-id', order: 2 },
        ],
      };

      await expect(service.reorder(dto)).rejects.toThrow(NotFoundException);
    });

    it('8. should reject exercise from another Study Day', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB]);
      prismaService.exercise.findUnique.mockResolvedValue({
        id: 'foreign-ex',
        studyDayId: 'day-99',
      });

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-a', order: 1 },
          { id: 'foreign-ex', order: 2 },
        ],
      };

      await expect(service.reorder(dto)).rejects.toThrow(BadRequestException);
    });

    it('9. should reject missing exercise from payload', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB, exC]);

      // Sending only 2 items when study day has 3 exercises
      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-a', order: 1 },
          { id: 'ex-b', order: 2 },
        ],
      };

      await expect(service.reorder(dto)).rejects.toThrow(BadRequestException);
    });

    it('10. should roll back transaction on failure', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB]);
      prismaService.$transaction.mockRejectedValue(
        new Error('DB connection failed'),
      );

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-b', order: 1 },
          { id: 'ex-a', order: 2 },
        ],
      };

      await expect(service.reorder(dto)).rejects.toThrow(
        'DB connection failed',
      );
    });

    it('11. should preserve existing Exercise fields unchanged', async () => {
      prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
      prismaService.exercise.findMany.mockResolvedValue([exA, exB]);

      const dto = {
        studyDayId: 'day-1',
        items: [
          { id: 'ex-b', order: 1 },
          { id: 'ex-a', order: 2 },
        ],
      };

      await service.reorder(dto);

      // Verify that update is called only with data: { order }
      expect(prismaService.exercise.update).toHaveBeenNthCalledWith(1, {
        where: { id: 'ex-b' },
        data: { order: 1 },
      });
      expect(prismaService.exercise.update).toHaveBeenNthCalledWith(2, {
        where: { id: 'ex-a' },
        data: { order: 2 },
      });
    });
  });
});
