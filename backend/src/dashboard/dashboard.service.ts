import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const studyDays = await this.prisma.studyDay.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        dayNumber: true,
        title: true,
        description: true,
        _count: { select: { exercises: true } },
      },
    });

    const totalDays = studyDays.length;
    const completedDaysCount = await this.prisma.progress.count({
      where: { userId, status: ProgressStatus.COMPLETED },
    });

    const totalExercisesCount = await this.prisma.exercise.count();
    const completedExercisesCount = await this.prisma.submission.count({
      where: { userId, status: 'APPROVED' },
    });

    const totalSubmissionsCount = await this.prisma.submission.count({
      where: { userId },
    });

    const pendingSubmissionsCount = await this.prisma.submission.count({
      where: { userId, status: 'PENDING' },
    });

    const rejectedSubmissionsCount = await this.prisma.submission.count({
      where: { userId, status: 'REJECTED' },
    });

    const percentage =
      totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;
    const currentDayNumber =
      completedDaysCount < totalDays ? completedDaysCount + 1 : totalDays;
    const currentDay =
      studyDays.find((d) => d.dayNumber === currentDayNumber) || null;

    // Recent group activity
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId },
      select: { groupId: true },
    });

    let recentActivity: {
      id: string;
      userId: string;
      type: string;
      message: string;
      createdAt: Date;
      user: { id: string; name: string; avatarUrl: string | null };
    }[] = [];

    if (membership) {
      const groupMembers = await this.prisma.groupMember.findMany({
        where: { groupId: membership.groupId },
        select: { userId: true },
      });
      const userIds = groupMembers.map((m) => m.userId);

      recentActivity = await this.prisma.activity.findMany({
        where: { userId: { in: userIds } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });
    } else {
      recentActivity = await this.prisma.activity.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });
    }

    return {
      user,
      progress: {
        percentage,
        completedDays: completedDaysCount,
        totalDays,
        completedExercises: completedExercisesCount,
        totalExercises: totalExercisesCount,
      },
      currentDay: currentDay
        ? {
            id: currentDay.id,
            dayNumber: currentDay.dayNumber,
            title: currentDay.title,
            description: currentDay.description,
            exerciseCount: currentDay._count.exercises,
          }
        : null,
      statistics: {
        completedDays: completedDaysCount,
        totalDays,
        completedExercises: completedExercisesCount,
        totalExercises: totalExercisesCount,
        totalSubmissions: totalSubmissionsCount,
        pendingSubmissions: pendingSubmissionsCount,
        rejectedSubmissions: rejectedSubmissionsCount,
        streakDays: Math.min(completedDaysCount, 5),
      },
      recentActivity,
    };
  }
}
