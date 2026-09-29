import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    const studyDays = await this.prisma.studyDay.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { exercises: true },
        },
        progress: {
          where: { userId },
        },
      },
    });

    const totalDays = studyDays.length;
    let completedDaysCount = 0;
    let inProgressDaysCount = 0;

    const daysProgress = studyDays.map((day) => {
      const dayData = day;
      const userProgress =
        dayData.progress && dayData.progress.length > 0
          ? dayData.progress[0]
          : null;

      const status = userProgress ? userProgress.status : ProgressStatus.LOCKED;
      if (status === ProgressStatus.COMPLETED) {
        completedDaysCount++;
      } else if (status === ProgressStatus.IN_PROGRESS) {
        inProgressDaysCount++;
      }

      return {
        studyDayId: day.id,
        dayNumber: day.dayNumber,
        title: day.title,
        status,
        exerciseCount: day._count.exercises,
        completedAt: userProgress ? userProgress.completedAt : null,
      };
    });

    const percentage =
      totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;
    const currentDayNumber =
      completedDaysCount < totalDays ? completedDaysCount + 1 : totalDays;
    const currentDay =
      studyDays.find((d) => d.dayNumber === currentDayNumber) || null;

    return {
      totalDays,
      completedDays: completedDaysCount,
      inProgressDays: inProgressDaysCount,
      percentage,
      currentDay: currentDay
        ? {
            id: currentDay.id,
            dayNumber: currentDay.dayNumber,
            title: currentDay.title,
            description: currentDay.description,
          }
        : null,
      daysProgress,
    };
  }

  async getDayProgress(userId: string, studyDayId: string) {
    const studyDay = await this.prisma.studyDay.findUnique({
      where: { id: studyDayId },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            submissions: {
              where: { userId },
              orderBy: { submittedAt: 'desc' },
              take: 1,
            },
          },
        },
        progress: {
          where: { userId },
        },
      },
    });

    if (!studyDay) {
      throw new NotFoundException(`Study Day with ID ${studyDayId} not found`);
    }

    const dayData = studyDay;
    const userProgress =
      dayData.progress && dayData.progress.length > 0
        ? dayData.progress[0]
        : null;

    const exercisesProgress = studyDay.exercises.map((ex) => {
      const exData = ex;
      const latestSub =
        exData.submissions && exData.submissions.length > 0
          ? exData.submissions[0]
          : null;

      return {
        exerciseId: ex.id,
        title: ex.title,
        difficulty: ex.difficulty,
        order: ex.order,
        status: latestSub ? latestSub.status : 'UNSUBMITTED',
        submissionId: latestSub ? latestSub.id : null,
      };
    });

    return {
      studyDayId: studyDay.id,
      dayNumber: studyDay.dayNumber,
      title: studyDay.title,
      status: userProgress ? userProgress.status : ProgressStatus.LOCKED,
      exercisesProgress,
    };
  }
}
