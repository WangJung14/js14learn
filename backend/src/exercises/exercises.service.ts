import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, userId?: string) {
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

  async create(dto: CreateExerciseDto) {
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id: dto.studyDayId },
    });

    if (!studyDay) {
      throw new NotFoundException(
        `Study Day with ID ${dto.studyDayId} not found`,
      );
    }

    return this.prisma.exercise.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);
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
}
