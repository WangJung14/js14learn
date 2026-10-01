import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistsService } from './checklists.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChecklistItemType, SubmissionStatus } from '@prisma/client';

describe('ChecklistsService - Admin Checklist Manager', () => {
  let service: ChecklistsService;
  let prismaService: any;

  const mockStudyDay = {
    id: 'day-1',
    dayNumber: 1,
    title: 'Values and Operators',
    description: 'Basics of JS values',
  };

  const mockExercise = {
    id: 'ex-1',
    studyDayId: 'day-1',
    title: 'Sum function',
    difficulty: 'EASY',
  };

  beforeEach(async () => {
    prismaService = {
      studyDay: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      exercise: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      checklistItem: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      checklistCompletion: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
      },
      submission: {
        findFirst: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChecklistsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<ChecklistsService>(ChecklistsService);
  });

  it('1. Admin creates LESSON checklist item', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    const dto = {
      studyDayId: 'day-1',
      title: 'Read Higher-Order Functions',
      description: 'Chapter 5 reading',
      type: ChecklistItemType.LESSON,
      order: 0,
      isRequired: true,
    };
    prismaService.checklistItem.create.mockResolvedValue({
      id: 'item-1',
      ...dto,
    });

    const result = await service.createItem(dto);
    expect(result.id).toBe('item-1');
    expect(result.type).toBe(ChecklistItemType.LESSON);
  });

  it('2. Admin creates EXERCISE checklist item linked to valid Exercise', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    prismaService.exercise.findUnique.mockResolvedValue(mockExercise);

    const dto = {
      studyDayId: 'day-1',
      title: 'Solve sum exercise',
      type: ChecklistItemType.EXERCISE,
      exerciseId: 'ex-1',
      order: 1,
      isRequired: true,
    };
    prismaService.checklistItem.create.mockResolvedValue({
      id: 'item-2',
      ...dto,
    });

    const result = await service.createItem(dto);
    expect(result.id).toBe('item-2');
    expect(result.exerciseId).toBe('ex-1');
  });

  it('3. Reject invalid StudyDay/Exercise cross-linking relationship', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    // Exercise belongs to day-2 instead of day-1
    prismaService.exercise.findUnique.mockResolvedValue({
      id: 'ex-2',
      studyDayId: 'day-2',
      title: 'Foreign Exercise',
    });

    await expect(
      service.createItem({
        studyDayId: 'day-1',
        title: 'Cross day exercise item',
        type: ChecklistItemType.EXERCISE,
        exerciseId: 'ex-2',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('4. Admin updates item title, type, and required flag', async () => {
    prismaService.checklistItem.findUnique.mockResolvedValue({
      id: 'item-1',
      studyDayId: 'day-1',
      title: 'Old Title',
      type: ChecklistItemType.LESSON,
      isRequired: false,
    });
    prismaService.checklistItem.update.mockResolvedValue({
      id: 'item-1',
      studyDayId: 'day-1',
      title: 'New Title',
      type: ChecklistItemType.CHECKPOINT,
      isRequired: true,
    });

    const result = await service.updateItem('item-1', {
      title: 'New Title',
      type: ChecklistItemType.CHECKPOINT,
      isRequired: true,
    });

    expect(result.title).toBe('New Title');
    expect(result.type).toBe(ChecklistItemType.CHECKPOINT);
    expect(result.isRequired).toBe(true);
  });

  it('5. Admin deletes item', async () => {
    prismaService.checklistItem.findUnique.mockResolvedValue({ id: 'item-1' });
    prismaService.checklistItem.delete.mockResolvedValue({ id: 'item-1' });

    const result = await service.deleteItem('item-1');
    expect(result.id).toBe('item-1');
  });

  it('6. Reorder updates all items atomically via transaction', async () => {
    const reorderDto = {
      items: [
        { id: 'item-2', order: 0 },
        { id: 'item-1', order: 1 },
      ],
    };
    prismaService.checklistItem.update.mockResolvedValue({});

    const res = await service.reorderItems(reorderDto);
    expect(res.message).toContain('reordered successfully');
    expect(prismaService.$transaction).toHaveBeenCalled();
  });

  it('7 & 8. Required/optional and Type persisted correctly on query', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    prismaService.checklistItem.findMany.mockResolvedValue([
      {
        id: 'item-1',
        studyDayId: 'day-1',
        title: 'Task 1',
        description: 'Desc',
        type: ChecklistItemType.PROJECT,
        order: 0,
        isRequired: false,
        exerciseId: null,
        exercise: null,
      },
    ]);
    prismaService.checklistCompletion.findMany.mockResolvedValue([]);

    const result = await service.getStudyDayChecklist('user-1', 'day-1');
    expect(result.items[0].type).toBe(ChecklistItemType.PROJECT);
    expect(result.items[0].isRequired).toBe(false);
  });

  it('9. Student completion remains user-specific', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    prismaService.checklistItem.findMany.mockResolvedValue([
      {
        id: 'item-1',
        studyDayId: 'day-1',
        title: 'Task 1',
        type: ChecklistItemType.LESSON,
        order: 0,
        isRequired: true,
      },
    ]);

    // User A has completed it
    prismaService.checklistCompletion.findMany.mockImplementation(
      ({ where }: any) => {
        if (where.userId === 'user-A') {
          return Promise.resolve([
            { checklistItemId: 'item-1', completedAt: new Date() },
          ]);
        }
        return Promise.resolve([]);
      },
    );

    const resA = await service.getStudyDayChecklist('user-A', 'day-1');
    const resB = await service.getStudyDayChecklist('user-B', 'day-1');

    expect(resA.items[0].isCompleted).toBe(true);
    expect(resB.items[0].isCompleted).toBe(false);
  });

  it('10. Existing automatic exercise completion works when triggered', async () => {
    prismaService.checklistItem.findMany.mockResolvedValue([
      { id: 'item-ex-1', exerciseId: 'ex-1' },
    ]);
    prismaService.checklistCompletion.upsert.mockResolvedValue({});

    await service.autoCompleteLinkedExerciseItem('user-1', 'ex-1');
    expect(prismaService.checklistCompletion.upsert).toHaveBeenCalledWith({
      where: {
        userId_checklistItemId: {
          userId: 'user-1',
          checklistItemId: 'item-ex-1',
        },
      },
      update: {},
      create: {
        userId: 'user-1',
        checklistItemId: 'item-ex-1',
      },
    });
  });

  it('11. Duplicate completion remains idempotent', async () => {
    prismaService.checklistItem.findUnique.mockResolvedValue({
      id: 'item-1',
      studyDayId: 'day-1',
      type: ChecklistItemType.LESSON,
    });
    prismaService.checklistCompletion.upsert.mockResolvedValue({
      id: 'c-1',
      userId: 'user-1',
      checklistItemId: 'item-1',
    });
    prismaService.studyDay.findUnique.mockResolvedValue(mockStudyDay);
    prismaService.checklistItem.findMany.mockResolvedValue([]);
    prismaService.checklistCompletion.findMany.mockResolvedValue([]);

    await service.completeItem('user-1', 'item-1');
    await service.completeItem('user-1', 'item-1');

    expect(prismaService.checklistCompletion.upsert).toHaveBeenCalledTimes(2);
  });
});
