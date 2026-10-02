import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ActivityType, ProgressStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  private generateInviteCode(): string {
    return 'GRP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async getAllGroups(currentUserId?: string) {
    const groups = await this.prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      inviteCode: g.inviteCode,
      creatorId: g.creatorId,
      creator: g.creator,
      memberCount: g._count.members,
      messageCount: g._count.messages,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      isMember: currentUserId
        ? g.members.some((m) => m.userId === currentUserId)
        : false,
      isOwner: currentUserId ? g.creatorId === currentUserId : false,
    }));
  }

  async getGroupById(groupId: string, currentUserId?: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
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
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const isMember = currentUserId
      ? group.members.some((m) => m.userId === currentUserId)
      : false;
    const isOwner = currentUserId ? group.creatorId === currentUserId : false;

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      inviteCode: group.inviteCode,
      creatorId: group.creatorId,
      creator: group.creator,
      memberCount: group._count.members,
      messageCount: group._count.messages,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      isMember,
      isOwner,
      members: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        joinedAt: m.joinedAt,
        isOwner: m.userId === group.creatorId,
      })),
    };
  }

  async getMyGroup(userId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId },
      include: {
        group: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
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
          isOwner: member.userId === membership.group.creatorId,
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
      description: membership.group.description,
      inviteCode: membership.group.inviteCode,
      creatorId: membership.group.creatorId,
      creator: membership.group.creator,
      isOwner: membership.group.creatorId === userId,
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
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return group.members.map((m) => ({
      ...m.user,
      joinedAt: m.joinedAt,
      isOwner: m.userId === group.creatorId,
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

  async createGroup(userId: string, dto: CreateGroupDto) {
    const trimmedName = dto.name?.trim();
    if (!trimmedName) {
      throw new BadRequestException('Group name cannot be empty');
    }

    let inviteCode = dto.inviteCode?.trim();
    if (inviteCode) {
      const existing = await this.prisma.group.findUnique({
        where: { inviteCode },
      });
      if (existing) {
        throw new ConflictException(
          'A group with this invite code already exists',
        );
      }
    } else {
      // Auto generate a unique invite code
      let unique = false;
      while (!unique) {
        inviteCode = this.generateInviteCode();
        const existing = await this.prisma.group.findUnique({
          where: { inviteCode },
        });
        if (!existing) unique = true;
      }
    }

    const group = await this.prisma.$transaction(async (tx) => {
      const createdGroup = await tx.group.create({
        data: {
          name: trimmedName,
          description: dto.description?.trim() || null,
          inviteCode: inviteCode!,
          creatorId: userId,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Creator automatically becomes a member
      await tx.groupMember.create({
        data: {
          userId,
          groupId: createdGroup.id,
        },
      });

      return createdGroup;
    });

    return {
      ...group,
      memberCount: 1,
      isMember: true,
      isOwner: true,
    };
  }

  async updateGroup(groupId: string, userId: string, dto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    if (group.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the group owner can update this group',
      );
    }

    const dataToUpdate: { name?: string; description?: string | null } = {};

    if (dto.name !== undefined) {
      const trimmedName = dto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException('Group name cannot be empty');
      }
      dataToUpdate.name = trimmedName;
    }

    if (dto.description !== undefined) {
      dataToUpdate.description = dto.description.trim() || null;
    }

    return this.prisma.group.update({
      where: { id: groupId },
      data: dataToUpdate,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async deleteGroup(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    if (group.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the group owner can delete this group',
      );
    }

    await this.prisma.group.delete({
      where: { id: groupId },
    });

    return { message: 'Group deleted successfully', id: groupId };
  }

  async joinGroup(userId: string, dto: JoinGroupDto) {
    const inviteCode = dto.inviteCode?.trim();
    if (!inviteCode) {
      throw new BadRequestException('Invite code is required');
    }

    const group = await this.prisma.group.findUnique({
      where: { inviteCode },
    });

    if (!group) {
      throw new NotFoundException('Invalid invite code');
    }

    const existingMembership = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: group.id,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException(
        'You are already a member of this study group',
      );
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

  async joinGroupById(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const existingMembership = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: group.id,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException(
        'You are already a member of this study group',
      );
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

  async leaveGroup(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const membership = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this group');
    }

    if (group.creatorId === userId) {
      throw new BadRequestException(
        'Group owner cannot leave the group. Transfer ownership or delete the group.',
      );
    }

    await this.prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    return { message: 'Left group successfully', groupId };
  }

  async removeMember(
    groupId: string,
    currentUserId: string,
    targetUserId: string,
  ) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    if (group.creatorId !== currentUserId) {
      throw new ForbiddenException('Only the group owner can remove members');
    }

    if (targetUserId === currentUserId) {
      throw new BadRequestException(
        'Owner cannot remove themselves from the group',
      );
    }

    const member = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: targetUserId,
          groupId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this group');
    }

    await this.prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: targetUserId,
          groupId,
        },
      },
    });

    return { message: 'Member removed successfully', userId: targetUserId };
  }
}
