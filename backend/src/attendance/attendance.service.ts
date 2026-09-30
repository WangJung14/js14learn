import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private getTodayDateString(): string {
    // Standardized learning date string YYYY-MM-DD
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  async ensureCheckedIn(userId: string) {
    const date = this.getTodayDateString();

    const existing = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    if (existing) {
      return existing;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.create({
        data: {
          userId,
          date,
          checkedInAt: new Date(),
        },
      });

      await tx.activity.create({
        data: {
          userId,
          type: ActivityType.JOINED_GROUP,
          message: `${user.name} checked in for study today`,
        },
      });

      return attendance;
    });
  }

  async getTodayAttendance(userId: string) {
    const date = this.getTodayDateString();

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    return {
      isCheckedIn: Boolean(attendance),
      date,
      attendance: attendance || null,
    };
  }

  async checkIn(userId: string) {
    return this.ensureCheckedIn(userId);
  }

  async checkOut(userId: string) {
    const date = this.getTodayDateString();

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException(
        'No active attendance record found for today. Please check in first.',
      );
    }

    if (attendance.checkedOutAt) {
      throw new BadRequestException('You have already checked out for today');
    }

    const now = new Date();
    const elapsedMs = now.getTime() - attendance.checkedInAt.getTime();
    const durationMinutes = Math.max(1, Math.floor(elapsedMs / (1000 * 60)));

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkedOutAt: now,
        durationMinutes,
      },
    });
  }

  async getStats(userId: string) {
    const records = await this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const totalAttendanceDays = records.length;
    const totalStudyMinutes = records.reduce(
      (sum, r) => sum + (r.durationMinutes || 0),
      0,
    );
    const averageStudyMinutes =
      totalAttendanceDays > 0
        ? Math.round(totalStudyMinutes / totalAttendanceDays)
        : 0;

    // Calculate Streaks
    const dateSet = new Set(records.map((r) => r.date));
    let currentStreak = 0;
    let longestStreak = 0;

    const todayDate = new Date();
    const tempDate = new Date(todayDate);

    // If today is not checked in, check from yesterday
    const todayStr = todayDate.toISOString().split('T')[0];
    if (!dateSet.has(todayStr)) {
      tempDate.setDate(tempDate.getDate() - 1);
    }

    while (true) {
      const dateStr = tempDate.toISOString().split('T')[0];
      if (dateSet.has(dateStr)) {
        currentStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Longest Streak
    const sortedDates = Array.from(dateSet).sort();
    let streakCounter = 0;
    let previousTime: number | null = null;

    for (const dStr of sortedDates) {
      const currentTime = new Date(dStr).getTime();
      if (previousTime !== null) {
        const diffDays = Math.round(
          (currentTime - previousTime) / (1000 * 3600 * 24),
        );
        if (diffDays === 1) {
          streakCounter++;
        } else {
          streakCounter = 1;
        }
      } else {
        streakCounter = 1;
      }
      if (streakCounter > longestStreak) {
        longestStreak = streakCounter;
      }
      previousTime = currentTime;
    }

    const todayInfo = await this.getTodayAttendance(userId);

    return {
      today: todayInfo,
      statistics: {
        currentStreak,
        longestStreak,
        totalAttendanceDays,
        totalStudyMinutes,
        averageStudyMinutes,
      },
      recentRecords: records.slice(0, 30),
    };
  }
}
