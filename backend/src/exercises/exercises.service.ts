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
import { Role } from '@prisma/client';

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

  async findOne(id: string, userId?: string) {
    await this.checkStudentVisibility(userId);
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        studyDay: {
          select: { id: true, dayNumber: true, title: true },
        },
        ...(userId && {
          submissions: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
          },
        }),
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    const exData = exercise;
    const latestSubmission =
      exData.submissions && exData.submissions.length > 0
        ? exData.submissions[0]
        : null;

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
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
      studyDay: exercise.studyDay,
      latestSubmission,
      submissionStatus: latestSubmission ? latestSubmission.status : null,
    };
  }

  async findByStudyDay(studyDayId: string, userId?: string) {
    await this.checkStudentVisibility(userId);
    const exercises = await this.prisma.exercise.findMany({
      where: { studyDayId },
      orderBy: { order: 'asc' },
      include: {
        ...(userId && {
          submissions: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: 1,
          },
        }),
      },
    });

    return exercises.map((ex) => {
      const exData = ex;
      const latestSubmission =
        exData.submissions && exData.submissions.length > 0
          ? exData.submissions[0]
          : null;

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
        createdAt: ex.createdAt,
        updatedAt: ex.updatedAt,
        latestSubmission,
        submissionStatus: latestSubmission ? latestSubmission.status : null,
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

    return this.prisma.exercise.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);
    this.validateCodingConfig(
      dto.isCoding,
      dto.codingConfig as Record<string, unknown> | null,
    );

    return this.prisma.exercise.update({
      where: { id },
      data: dto,
    });
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
