import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ReorderChecklistItemsDto } from './dto/reorder-checklist-items.dto';
import {
  ChecklistItemType,
  SubmissionStatus,
  ProgressStatus,
} from '@prisma/client';

@Injectable()
export class ChecklistsService {
  constructor(private prisma: PrismaService) {}

  async getTodayChecklist(userId: string) {
    // Determine active study day for user
    const userProgress = await this.prisma.progress.findMany({
      where: { userId },
      include: { studyDay: true },
      orderBy: { studyDay: { dayNumber: 'asc' } },
    });

    const inProgressDay = userProgress.find(
      (p) => p.status === ProgressStatus.IN_PROGRESS,
    );

    let targetStudyDayId: string | null = inProgressDay
      ? inProgressDay.studyDayId
      : null;

    if (!targetStudyDayId) {
      const completedDayIds = new Set(
        userProgress
          .filter((p) => p.status === ProgressStatus.COMPLETED)
          .map((p) => p.studyDayId),
      );

      const nextDay = await this.prisma.studyDay.findFirst({
        where: { id: { notIn: Array.from(completedDayIds) } },
        orderBy: { dayNumber: 'asc' },
      });

      targetStudyDayId = nextDay
        ? nextDay.id
        : (
            await this.prisma.studyDay.findFirst({
              orderBy: { dayNumber: 'asc' },
            })
          )?.id || null;
    }

    if (!targetStudyDayId) {
      throw new NotFoundException('No study days found in curriculum');
    }

    return this.getStudyDayChecklist(userId, targetStudyDayId);
  }

  async getStudyDayChecklist(userId: string, studyDayId: string) {
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id: studyDayId },
      select: {
        id: true,
        dayNumber: true,
        title: true,
        description: true,
      },
    });

    if (!studyDay) {
      throw new NotFoundException(
        `Study Day with ID "${studyDayId}" not found`,
      );
    }

    const items = await this.prisma.checklistItem.findMany({
      where: { studyDayId },
      orderBy: { order: 'asc' },
      include: {
        exercise: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    const itemIds = items.map((i) => i.id);

    const completions = await this.prisma.checklistCompletion.findMany({
      where: {
        userId,
        checklistItemId: { in: itemIds },
      },
    });

    const completionMap = new Map(
      completions.map((c) => [c.checklistItemId, c.completedAt]),
    );

    const formattedItems = items.map((item) => {
      const completedAt = completionMap.get(item.id) || null;
      return {
        id: item.id,
        studyDayId: item.studyDayId,
        title: item.title,
        description: item.description,
        type: item.type,
        order: item.order,
        isRequired: item.isRequired,
        exerciseId: item.exerciseId,
        exercise: item.exercise,
        isCompleted: Boolean(completedAt),
        completedAt,
        isAutoManaged: item.type === ChecklistItemType.EXERCISE,
      };
    });

    const totalItems = formattedItems.length;
    const completedItems = formattedItems.filter((i) => i.isCompleted).length;
    const requiredItems = formattedItems.filter((i) => i.isRequired).length;
    const completedRequiredItems = formattedItems.filter(
      (i) => i.isRequired && i.isCompleted,
    ).length;
    const percentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      studyDay,
      summary: {
        totalItems,
        completedItems,
        requiredItems,
        completedRequiredItems,
        percentage,
      },
      items: formattedItems,
    };
  }

  async completeItem(userId: string, checklistItemId: string) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
      include: { exercise: true },
    });

    if (!item) {
      throw new NotFoundException(
        `Checklist item with ID "${checklistItemId}" not found`,
      );
    }

    // Business rule for EXERCISE type items
    if (item.type === ChecklistItemType.EXERCISE && item.exerciseId) {
      const approvedSubmission = await this.prisma.submission.findFirst({
        where: {
          userId,
          exerciseId: item.exerciseId,
          status: SubmissionStatus.APPROVED,
        },
      });

      if (!approvedSubmission) {
        throw new BadRequestException(
          'Linked exercise solution must be approved by admin before completing this checklist item',
        );
      }
    }

    // Upsert completion record (idempotent)
    await this.prisma.checklistCompletion.upsert({
      where: {
        userId_checklistItemId: {
          userId,
          checklistItemId,
        },
      },
      update: {},
      create: {
        userId,
        checklistItemId,
      },
    });

    return this.getStudyDayChecklist(userId, item.studyDayId);
  }

  async uncompleteItem(userId: string, checklistItemId: string) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Checklist item with ID "${checklistItemId}" not found`,
      );
    }

    if (item.type === ChecklistItemType.EXERCISE && item.exerciseId) {
      const approvedSubmission = await this.prisma.submission.findFirst({
        where: {
          userId,
          exerciseId: item.exerciseId,
          status: SubmissionStatus.APPROVED,
        },
      });

      if (approvedSubmission) {
        throw new BadRequestException(
          'Cannot uncomplete an exercise task that has been approved by admin',
        );
      }
    }

    await this.prisma.checklistCompletion
      .delete({
        where: {
          userId_checklistItemId: {
            userId,
            checklistItemId,
          },
        },
      })
      .catch(() => {
        // Ignore if completion record did not exist
      });

    return this.getStudyDayChecklist(userId, item.studyDayId);
  }

  async autoCompleteLinkedExerciseItem(userId: string, exerciseId: string) {
    const linkedItems = await this.prisma.checklistItem.findMany({
      where: {
        exerciseId,
      },
    });

    for (const item of linkedItems) {
      await this.prisma.checklistCompletion.upsert({
        where: {
          userId_checklistItemId: {
            userId,
            checklistItemId: item.id,
          },
        },
        update: {},
        create: {
          userId,
          checklistItemId: item.id,
        },
      });
    }
  }

  // Admin Methods
  async createItem(dto: CreateChecklistItemDto) {
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id: dto.studyDayId },
    });

    if (!studyDay) {
      throw new NotFoundException(
        `Study Day with ID "${dto.studyDayId}" not found`,
      );
    }

    if (dto.exerciseId) {
      const exercise = await this.prisma.exercise.findUnique({
        where: { id: dto.exerciseId },
      });

      if (!exercise) {
        throw new NotFoundException(
          `Exercise with ID "${dto.exerciseId}" not found`,
        );
      }

      if (exercise.studyDayId !== dto.studyDayId) {
        throw new BadRequestException(
          `Exercise "${dto.exerciseId}" does not belong to Study Day "${dto.studyDayId}"`,
        );
      }
    }

    return this.prisma.checklistItem.create({
      data: {
        studyDayId: dto.studyDayId,
        title: dto.title.trim(),
        description: dto.description ? dto.description.trim() : null,
        type: dto.type || ChecklistItemType.LESSON,
        order: dto.order ?? 0,
        isRequired: dto.isRequired ?? true,
        exerciseId: dto.exerciseId || null,
      },
    });
  }

  async updateItem(id: string, dto: UpdateChecklistItemDto) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Checklist item with ID "${id}" not found`);
    }

    const targetStudyDayId = dto.studyDayId || item.studyDayId;

    if (dto.exerciseId) {
      const exercise = await this.prisma.exercise.findUnique({
        where: { id: dto.exerciseId },
      });

      if (!exercise) {
        throw new NotFoundException(
          `Exercise with ID "${dto.exerciseId}" not found`,
        );
      }

      if (exercise.studyDayId !== targetStudyDayId) {
        throw new BadRequestException(
          `Exercise "${dto.exerciseId}" does not belong to Study Day "${targetStudyDayId}"`,
        );
      }
    }

    return this.prisma.checklistItem.update({
      where: { id },
      data: {
        ...(dto.studyDayId && { studyDayId: dto.studyDayId }),
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.description !== undefined && {
          description: dto.description ? dto.description.trim() : null,
        }),
        ...(dto.type && { type: dto.type }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.isRequired !== undefined && { isRequired: dto.isRequired }),
        ...(dto.exerciseId !== undefined && { exerciseId: dto.exerciseId }),
      },
    });
  }

  async deleteItem(id: string) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Checklist item with ID "${id}" not found`);
    }

    return this.prisma.checklistItem.delete({
      where: { id },
    });
  }

  async reorderItems(dto: ReorderChecklistItemsDto) {
    const updates = dto.items.map((item) =>
      this.prisma.checklistItem.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'Checklist items reordered successfully' };
  }
}
