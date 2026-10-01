import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapValidationService } from './roadmap-validation.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RoadmapStatus, ChecklistItemType, ExerciseDifficulty } from '@prisma/client';

describe('RoadmapValidationService', () => {
  let service: RoadmapValidationService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      studyDay: {
        findMany: jest.fn(),
      },
      roadmapSetting: {
        findUnique: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoadmapValidationService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<RoadmapValidationService>(RoadmapValidationService);
  });

  it('1. should detect empty roadmap', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([]);
    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.summary.errors).toBe(1);
    expect(res.issues[0].code).toBe('ROADMAP_EMPTY');
  });

  it('2. should validate a completely valid roadmap with zero errors', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'Day 1 Title',
        description: 'Day 1 Description',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Ex 1',
            description: 'Desc 1',
            order: 1,
            isCoding: false,
          },
        ],
        checklistItems: [
          {
            id: 'chk-1',
            studyDayId: 'day-1',
            title: 'Chk 1',
            type: ChecklistItemType.EXERCISE,
            exerciseId: 'ex-1',
            order: 1,
          },
        ],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(true);
    expect(res.summary.errors).toBe(0);
  });

  it('3. should detect duplicate Study Day order', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      { id: 'day-1', dayNumber: 1, title: 'D1', description: 'D1', order: 1, exercises: [], checklistItems: [] },
      { id: 'day-2', dayNumber: 2, title: 'D2', description: 'D2', order: 1, exercises: [], checklistItems: [] },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'STUDY_DAY_DUPLICATE_ORDER')).toBe(true);
  });

  it('4. should detect duplicate Exercise order within same Study Day', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          { id: 'ex-1', studyDayId: 'day-1', title: 'E1', description: 'E1', order: 1, isCoding: false },
          { id: 'ex-2', studyDayId: 'day-1', title: 'E2', description: 'E2', order: 1, isCoding: false },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'EXERCISE_DUPLICATE_ORDER')).toBe(true);
  });

  it('5. should detect duplicate Checklist order within same Study Day', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [],
        checklistItems: [
          { id: 'c1', studyDayId: 'day-1', title: 'C1', type: ChecklistItemType.LESSON, order: 1 },
          { id: 'c2', studyDayId: 'day-1', title: 'C2', type: ChecklistItemType.LESSON, order: 1 },
        ],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CHECKLIST_DUPLICATE_ORDER')).toBe(true);
  });

  it('7. should detect checklist referencing non-existent Exercise', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [],
        checklistItems: [
          { id: 'c1', studyDayId: 'day-1', title: 'C1', type: ChecklistItemType.EXERCISE, exerciseId: 'missing-ex', order: 1 },
        ],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CHECKLIST_EXERCISE_NOT_FOUND')).toBe(true);
  });

  it('8. should detect checklist referencing Exercise from another Study Day', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [],
        checklistItems: [
          { id: 'c1', studyDayId: 'day-1', title: 'C1', type: ChecklistItemType.EXERCISE, exerciseId: 'ex-day2', order: 1 },
        ],
      },
      {
        id: 'day-2',
        dayNumber: 2,
        title: 'D2',
        description: 'D2',
        order: 2,
        exercises: [
          { id: 'ex-day2', studyDayId: 'day-2', title: 'E2', description: 'E2', order: 1, isCoding: false },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CHECKLIST_EXERCISE_MISMATCH')).toBe(true);
  });

  it('9. should detect EXERCISE checklist item missing exerciseId', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [],
        checklistItems: [
          { id: 'c1', studyDayId: 'day-1', title: 'C1', type: ChecklistItemType.EXERCISE, exerciseId: null, order: 1 },
        ],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CHECKLIST_EXERCISE_MISSING')).toBe(true);
  });

  it('10. should detect Coding Exercise without codingConfig', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          { id: 'ex-1', studyDayId: 'day-1', title: 'Coding Ex', description: 'C', order: 1, isCoding: true, codingConfig: null },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_CONFIG_INVALID')).toBe(true);
  });

  it('11. should detect Coding Exercise invalid language', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Coding Ex',
            description: 'C',
            order: 1,
            isCoding: true,
            codingConfig: { language: 'python', mode: 'function', functionName: 'foo', tests: [{ id: 't1', name: 't1', expected: 1 }] },
          },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_LANGUAGE_INVALID')).toBe(true);
  });

  it('12. should detect Coding Exercise missing functionName in function mode', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Coding Ex',
            description: 'C',
            order: 1,
            isCoding: true,
            codingConfig: { language: 'javascript', mode: 'function', functionName: '', tests: [{ id: 't1', name: 't1', expected: 1 }] },
          },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_FUNCTION_NAME_MISSING')).toBe(true);
  });

  it('13. should detect Coding Exercise with zero tests', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Coding Ex',
            description: 'C',
            order: 1,
            isCoding: true,
            codingConfig: { language: 'javascript', mode: 'function', functionName: 'sum', tests: [] },
          },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_NO_TESTS')).toBe(true);
  });

  it('14. should detect duplicate test IDs in coding exercise', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Coding Ex',
            description: 'C',
            order: 1,
            isCoding: true,
            codingConfig: {
              language: 'javascript',
              mode: 'function',
              functionName: 'sum',
              tests: [
                { id: 't1', name: 't1', expected: 1 },
                { id: 't1', name: 't2', expected: 2 },
              ],
            },
          },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_DUPLICATE_TEST_ID')).toBe(true);
  });

  it('15. should detect invalid console test missing expectedOutput', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Console Ex',
            description: 'C',
            order: 1,
            isCoding: true,
            codingConfig: {
              language: 'javascript',
              mode: 'console',
              tests: [{ id: 't1', name: 't1' }],
            },
          },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_CONSOLE_TEST_INVALID')).toBe(true);
  });

  it('16. should detect invalid function test missing expected return value', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'D1',
        order: 1,
        exercises: [
          {
            id: 'ex-1',
            studyDayId: 'day-1',
            title: 'Function Ex',
            description: 'F',
            order: 1,
            isCoding: true,
            codingConfig: {
              language: 'javascript',
              mode: 'function',
              functionName: 'foo',
              tests: [{ id: 't1', name: 't1', args: [] }],
            },
          },
        ],
        checklistItems: [],
      },
    ]);

    const res = await service.validateRoadmap();
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === 'CODING_FUNCTION_TEST_INVALID')).toBe(true);
  });

  it('17. should allow publishing when only WARNINGs exist', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: '', // Warning: no description
        order: 1,
        exercises: [
          { id: 'ex-1', studyDayId: 'day-1', title: 'E1', description: '', order: 1, isCoding: false },
        ],
        checklistItems: [], // Warning: no checklist items
      },
    ]);
    prismaService.roadmapSetting.upsert.mockResolvedValue({
      id: 'global',
      status: RoadmapStatus.PUBLISHED,
      publishedAt: new Date(),
    });

    const res = await service.publishRoadmap();
    expect(res.status).toBe(RoadmapStatus.PUBLISHED);
    expect(res.validationResult.valid).toBe(true);
    expect(res.validationResult.summary.warnings).toBeGreaterThan(0);
  });

  it('18. & 20. should block publishing when ERRORs exist', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([]); // Error: empty roadmap

    await expect(service.publishRoadmap()).rejects.toThrow(BadRequestException);
  });

  it('19. should publish successfully when zero errors exist', async () => {
    prismaService.studyDay.findMany.mockResolvedValue([
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'D1',
        description: 'Desc',
        order: 1,
        exercises: [
          { id: 'ex-1', studyDayId: 'day-1', title: 'E1', description: 'Desc', order: 1, isCoding: false },
        ],
        checklistItems: [
          { id: 'c1', studyDayId: 'day-1', title: 'C1', type: ChecklistItemType.EXERCISE, exerciseId: 'ex-1', order: 1 },
        ],
      },
    ]);
    prismaService.roadmapSetting.upsert.mockResolvedValue({
      id: 'global',
      status: RoadmapStatus.PUBLISHED,
      publishedAt: new Date(),
    });

    const res = await service.publishRoadmap();
    expect(res.status).toBe(RoadmapStatus.PUBLISHED);
    expect(res.validationResult.valid).toBe(true);
  });

  it('21. should unpublish roadmap successfully', async () => {
    prismaService.roadmapSetting.upsert.mockResolvedValue({
      id: 'global',
      status: RoadmapStatus.DRAFT,
    });

    const res = await service.unpublishRoadmap();
    expect(res.status).toBe(RoadmapStatus.DRAFT);
  });
});
