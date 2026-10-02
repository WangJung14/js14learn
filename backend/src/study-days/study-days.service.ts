import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyDayDto } from './dto/create-study-day.dto';
import { UpdateStudyDayDto } from './dto/update-study-day.dto';
import { ProgressStatus, Role } from '@prisma/client';

@Injectable()
export class StudyDaysService {
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

  async findAll(userId?: string) {
    await this.checkStudentVisibility(userId);
    const studyDays = await this.prisma.studyDay.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { exercises: true },
        },
        ...(userId && {
          progress: {
            where: { userId },
          },
        }),
      },
    });

    return studyDays.map((day) => {
      const dayData = day;
      const userProgress =
        dayData.progress && dayData.progress.length > 0
          ? dayData.progress[0]
          : null;

      return {
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        content: day.content,
        order: day.order,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
        exerciseCount: day._count.exercises,
        progressStatus: userProgress
          ? userProgress.status
          : ProgressStatus.LOCKED,
        completedAt: userProgress ? userProgress.completedAt : null,
      };
    });
  }

  async findOne(id: string, userId?: string) {
    await this.checkStudentVisibility(userId);
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
        ...(userId && {
          progress: {
            where: { userId },
          },
        }),
      },
    });

    if (!studyDay) {
      throw new NotFoundException(`Study Day with ID ${id} not found`);
    }

    const dayData = studyDay;
    const userProgress =
      dayData.progress && dayData.progress.length > 0
        ? dayData.progress[0]
        : null;

    return {
      id: studyDay.id,
      dayNumber: studyDay.dayNumber,
      title: studyDay.title,
      description: studyDay.description,
      content: studyDay.content,
      order: studyDay.order,
      createdAt: studyDay.createdAt,
      updatedAt: studyDay.updatedAt,
      exercises: studyDay.exercises,
      progressStatus: userProgress
        ? userProgress.status
        : ProgressStatus.LOCKED,
      completedAt: userProgress ? userProgress.completedAt : null,
    };
  }

  async create(dto: CreateStudyDayDto) {
    const existingDay = await this.prisma.studyDay.findUnique({
      where: { dayNumber: dto.dayNumber },
    });

    if (existingDay) {
      throw new ConflictException(
        `Study Day with dayNumber ${dto.dayNumber} already exists`,
      );
    }

    return this.prisma.studyDay.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateStudyDayDto) {
    await this.findOne(id);

    if (dto.dayNumber) {
      const existingDay = await this.prisma.studyDay.findFirst({
        where: {
          dayNumber: dto.dayNumber,
          NOT: { id },
        },
      });
      if (existingDay) {
        throw new ConflictException(
          `Study Day with dayNumber ${dto.dayNumber} already exists`,
        );
      }
    }

    return this.prisma.studyDay.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.studyDay.delete({
      where: { id },
    });
  }

  async reorder(dto: { items: Array<{ id: string; order: number }> }) {
    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('items must be a non-empty array');
    }

    const payloadIds = dto.items.map((i) => i.id);
    const uniqueIds = new Set(payloadIds);
    if (uniqueIds.size !== payloadIds.length) {
      throw new BadRequestException('Duplicate Study Day IDs are not allowed');
    }

    const orders = dto.items.map((i) => i.order);
    const uniqueOrders = new Set(orders);
    if (uniqueOrders.size !== orders.length) {
      throw new BadRequestException('Duplicate order values are not allowed');
    }

    const existingDays = await this.prisma.studyDay.findMany({
      select: { id: true },
    });

    if (existingDays.length !== dto.items.length) {
      throw new BadRequestException(
        `Reorder payload must contain all ${existingDays.length} existing Study Days`,
      );
    }

    const existingIdSet = new Set(existingDays.map((d) => d.id));
    for (const id of payloadIds) {
      if (!existingIdSet.has(id)) {
        throw new NotFoundException(`Study Day with ID "${id}" not found`);
      }
    }

    const updates = dto.items.map((item) =>
      this.prisma.studyDay.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'Study Days reordered successfully' };
  }
}
