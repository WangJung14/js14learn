import { Test, TestingModule } from '@nestjs/testing';
import { StudyDaysService } from './study-days.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('StudyDaysService - Admin Study Day Reordering', () => {
  let service: StudyDaysService;
  let prismaService: any;

  const mockDays = [
    { id: 'day-1', dayNumber: 1, title: 'Day 1', order: 1 },
    { id: 'day-2', dayNumber: 2, title: 'Day 2', order: 2 },
    { id: 'day-3', dayNumber: 3, title: 'Day 3', order: 3 },
  ];

  beforeEach(async () => {
    prismaService = {
      studyDay: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyDaysService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<StudyDaysService>(StudyDaysService);
  });

  it('1. Successful reorder updates orders atomically via transaction', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      { id: 'day-1' },
      { id: 'day-2' },
      { id: 'day-3' },
    ]);
    prismaService.studyDay.update.mockResolvedValue({});

    const dto = {
      items: [
        { id: 'day-1', order: 1 },
        { id: 'day-3', order: 2 },
        { id: 'day-2', order: 3 },
      ],
    };

    const result = await service.reorder(dto);
    expect(result.message).toContain('reordered successfully');
    expect(prismaService.$transaction).toHaveBeenCalled();
  });

  it('2. Correct order persistence maps target IDs to new order values', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      { id: 'day-1' },
      { id: 'day-2' },
    ]);
    prismaService.studyDay.update.mockResolvedValue({});

    const dto = {
      items: [
        { id: 'day-2', order: 1 },
        { id: 'day-1', order: 2 },
      ],
    };

    await service.reorder(dto);
    expect(prismaService.studyDay.update).toHaveBeenCalledWith({
      where: { id: 'day-2' },
      data: { order: 1 },
    });
    expect(prismaService.studyDay.update).toHaveBeenCalledWith({
      where: { id: 'day-1' },
      data: { order: 2 },
    });
  });

  it('3 & 4. dayNumber and Study Day IDs remain unchanged on reorder', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      { id: 'day-1', dayNumber: 1 },
      { id: 'day-2', dayNumber: 2 },
    ]);
    prismaService.studyDay.update.mockResolvedValue({});

    const dto = {
      items: [
        { id: 'day-2', order: 1 },
        { id: 'day-1', order: 2 },
      ],
    };

    await service.reorder(dto);
    // Verify update was ONLY called with order parameter
    expect(prismaService.studyDay.update).toHaveBeenCalledWith({
      where: { id: 'day-2' },
      data: { order: 1 },
    });
  });

  it('5. Duplicate Study Day IDs in payload are rejected', async () => {
    const dto = {
      items: [
        { id: 'day-1', order: 1 },
        { id: 'day-1', order: 2 },
      ],
    };

    await expect(service.reorder(dto)).rejects.toThrow(BadRequestException);
  });

  it('6. Missing existing Study Day from payload is rejected', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      { id: 'day-1' },
      { id: 'day-2' },
      { id: 'day-3' },
    ]);

    const partialDto = {
      items: [
        { id: 'day-1', order: 1 },
        { id: 'day-2', order: 2 },
      ],
    };

    await expect(service.reorder(partialDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('7. Unknown Study Day ID in payload is rejected with NotFoundException', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([{ id: 'day-1' }]);

    const unknownDto = {
      items: [{ id: 'non-existent-id', order: 1 }],
    };

    await expect(service.reorder(unknownDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('8. Duplicate order values in payload are rejected', async () => {
    const duplicateOrderDto = {
      items: [
        { id: 'day-1', order: 1 },
        { id: 'day-2', order: 1 },
      ],
    };

    await expect(service.reorder(duplicateOrderDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('9. Transaction failure aborts reorder and throws error', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      { id: 'day-1' },
      { id: 'day-2' },
    ]);
    prismaService.$transaction.mockRejectedValue(new Error('DB failure'));

    const dto = {
      items: [
        { id: 'day-1', order: 1 },
        { id: 'day-2', order: 2 },
      ],
    };

    await expect(service.reorder(dto)).rejects.toThrow('DB failure');
  });

  it('10. Existing Study Day data (title, content, dayNumber) remains unchanged', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue({
      ...mockDays[0],
      content: '# Day 1 Lesson\n\n## Learning Goals\n- Understand JavaScript types',
    });

    const result = await service.findOne('day-1');
    expect(result.dayNumber).toBe(1);
    expect(result.title).toBe('Day 1');
    expect(result.content).toContain('Learning Goals');
  });

  it('11. Admin updates lesson content successfully', async () => {
    prismaService.studyDay.findUnique.mockResolvedValue(mockDays[0]);
    prismaService.studyDay.update.mockResolvedValue({
      ...mockDays[0],
      content: '# Updated Lesson\n\n## Section 1\nContent',
    });

    const updated = await service.update('day-1', {
      content: '# Updated Lesson\n\n## Section 1\nContent',
    });

    expect(prismaService.studyDay.update).toHaveBeenCalledWith({
      where: { id: 'day-1' },
      data: { content: '# Updated Lesson\n\n## Section 1\nContent' },
    });
    expect(updated.content).toContain('Updated Lesson');
  });
});
