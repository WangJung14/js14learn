import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getGroupActivity(userId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId },
      select: { groupId: true },
    });

    if (membership) {
      const groupMembers = await this.prisma.groupMember.findMany({
        where: { groupId: membership.groupId },
        select: { userId: true },
      });
      const userIds = groupMembers.map((m) => m.userId);

      return this.prisma.activity.findMany({
        where: { userId: { in: userIds } },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });
    }

    return this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  }

  async getMyActivity(userId: string) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  }

  async logActivity(userId: string, type: ActivityType, message: string) {
    return this.prisma.activity.create({
      data: {
        userId,
        type,
        message,
      },
    });
  }
}
