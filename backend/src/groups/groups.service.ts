import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { ActivityType, ProgressStatus } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getMyGroup(userId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(
        'You are not currently a member of any study group',
      );
    }

    const totalDays = await this.prisma.studyDay.count();
    const membersWithProgress = await Promise.all(
      membership.group.members.map(async (member) => {
        const completedDays = await this.prisma.progress.count({
          where: {
            userId: member.user.id,
            status: ProgressStatus.COMPLETED,
          },
        });

        const completedExercises = await this.prisma.submission.count({
          where: {
            userId: member.user.id,
            status: 'APPROVED',
          },
        });

        const percentage =
          totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
        const currentDayNumber =
          completedDays < totalDays ? completedDays + 1 : totalDays;

        return {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          avatarUrl: member.user.avatarUrl,
          joinedAt: member.joinedAt,
          completedDays,
          totalDays,
          percentage,
          currentDayNumber,
          completedExercises,
        };
      }),
    );

    return {
      id: membership.group.id,
      name: membership.group.name,
      inviteCode: membership.group.inviteCode,
      createdAt: membership.group.createdAt,
      members: membersWithProgress,
    };
  }

  async getMembers(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return group.members.map((m) => ({
      ...m.user,
      joinedAt: m.joinedAt,
    }));
  }

  async getGroupActivity(groupId: string) {
    const members = await this.prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    });

    const userIds = members.map((m) => m.userId);

    return this.prisma.activity.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  }

  async joinGroup(userId: string, dto: JoinGroupDto) {
    const existingMembership = await this.prisma.groupMember.findFirst({
      where: { userId },
    });

    if (existingMembership) {
      throw new BadRequestException(
        'You are already a member of a study group',
      );
    }

    const group = await this.prisma.group.findUnique({
      where: { inviteCode: dto.inviteCode.trim() },
    });

    if (!group) {
      throw new NotFoundException('Invalid invite code');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const newMember = await this.prisma.$transaction(async (tx) => {
      const member = await tx.groupMember.create({
        data: {
          userId,
          groupId: group.id,
        },
        include: {
          group: true,
        },
      });

      await tx.activity.create({
        data: {
          userId,
          type: ActivityType.JOINED_GROUP,
          message: `${user?.name || 'Student'} joined group "${group.name}"`,
        },
      });

      return member;
    });

    return newMember;
  }

  async createGroup(dto: CreateGroupDto) {
    const existingGroup = await this.prisma.group.findUnique({
      where: { inviteCode: dto.inviteCode.trim() },
    });

    if (existingGroup) {
      throw new ConflictException(
        'A group with this invite code already exists',
      );
    }

    return this.prisma.group.create({
      data: {
        name: dto.name.trim(),
        inviteCode: dto.inviteCode.trim(),
      },
    });
  }
}
