import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ChecklistsService } from '../checklists/checklists.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubmissionStatus, ProgressStatus, ActivityType } from '@prisma/client';

describe('SubmissionsService - Code Submissions', () => {
  let service: SubmissionsService;
  let prismaService: any;
  let checklistsService: any;

  const mockExercise = {
    id: 'ex-1',
    studyDayId: 'day-1',
    title: 'Calculate Test',
    description: 'Calculate numbers',
    isCoding: true,
    studyDay: {
      id: 'day-1',
      dayNumber: 1,
      title: 'Day 1',
    },
  };

  const mockUser = {
    id: 'user-1',
    name: 'Student One',
    email: 'student@test.local',
  };

  beforeEach(async () => {
    prismaService = {
      exercise: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      submission: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      progress: {
        upsert: jest.fn(),
      },
      activity: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prismaService)),
    };

    checklistsService = {
      autoCompleteLinkedExerciseItem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        { provide: PrismaService, useValue: prismaService },
        { provide: StorageService, useValue: { createSignedUrl: jest.fn() } },
        { provide: ChecklistsService, useValue: checklistsService },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should reject code submission exceeding 20KB limit', async () => {
    const hugeCode = 'a'.repeat(20481);
    await expect(
      service.submitCode('user-1', {
        exerciseId: 'ex-1',
        code: hugeCode,
        executionSummary: { passed: 1, total: 1, durationMs: 10 },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if exercise does not exist', async () => {
    prismaService.exercise.findUnique.mockResolvedValue(null);

    await expect(
      service.submitCode('user-1', {
        exerciseId: 'non-existent',
        code: 'console.log(1);',
        executionSummary: { passed: 1, total: 1, durationMs: 5 },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should successfully persist code submission and trigger progress/checklist when all tests pass', async () => {
    prismaService.exercise.findUnique.mockResolvedValue(mockExercise);
    prismaService.user.findUnique.mockResolvedValue(mockUser);
    prismaService.exercise.findMany.mockResolvedValue([{ id: 'ex-1' }]);
    prismaService.submission.findMany.mockResolvedValue([
      { exerciseId: 'ex-1' },
    ]);

    const mockCreatedSub = {
      id: 'sub-1',
      exerciseId: 'ex-1',
      userId: 'user-1',
      submissionType: 'CODE',
      code: 'function sum(a,b){return a+b;}',
      status: SubmissionStatus.APPROVED,
      fileUrl: null,
      signedUrl: '',
    };

    prismaService.submission.create.mockResolvedValue(mockCreatedSub);

    const result = await service.submitCode('user-1', {
      exerciseId: 'ex-1',
      code: 'function sum(a,b){return a+b;}',
      executionSummary: { passed: 3, total: 3, durationMs: 15 },
    });

    expect(result.status).toBe(SubmissionStatus.APPROVED);
    expect(
      checklistsService.autoCompleteLinkedExerciseItem,
    ).toHaveBeenCalledWith('user-1', 'ex-1');
  });
});
