import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyDayDto } from './dto/create-study-day.dto';
import { UpdateStudyDayDto } from './dto/update-study-day.dto';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class StudyDaysService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string) {
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
}
