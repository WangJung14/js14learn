import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessages(
    groupId: string,
    userId: string,
    limit = 50,
    before?: string,
  ) {
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
      throw new ForbiddenException(
        'You must be a member of this group to view messages',
      );
    }

    const takeLimit = Math.min(Math.max(1, limit), 100);
    let beforeDate: Date | undefined;

    if (before) {
      // Check if `before` is a message ID
      const cursorMessage = await this.prisma.groupMessage.findUnique({
        where: { id: before },
        select: { createdAt: true },
      });

      if (cursorMessage) {
        beforeDate = cursorMessage.createdAt;
      } else {
        const parsed = new Date(before);
        if (!isNaN(parsed.getTime())) {
          beforeDate = parsed;
        }
      }
    }

    const messages = await this.prisma.groupMessage.findMany({
      where: {
        groupId,
        ...(beforeDate ? { createdAt: { lt: beforeDate } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: takeLimit + 1,
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
    });

    const hasMore = messages.length > takeLimit;
    const resultMessages = hasMore ? messages.slice(0, takeLimit) : messages;

    // Return in chronological order (oldest -> newest)
    resultMessages.reverse();

    const nextCursor =
      hasMore && resultMessages.length > 0 ? resultMessages[0].id : null;

    return {
      messages: resultMessages,
      hasMore,
      nextCursor,
    };
  }

  async sendMessage(groupId: string, userId: string, content: string) {
    const trimmed = content ? content.trim() : '';
    if (!trimmed) {
      throw new BadRequestException('Message content cannot be empty');
    }

    if (trimmed.length > 5000) {
      throw new BadRequestException(
        'Message exceeds maximum allowed length (5000 characters)',
      );
    }

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
      throw new ForbiddenException(
        'You must be a member of this group to send messages',
      );
    }

    const now = new Date();
    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.groupMessage.create({
        data: {
          groupId,
          userId,
          content: trimmed,
          createdAt: now,
        },
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
      });

      // Update sender's lastReadAt
      await tx.groupMember.update({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
        data: {
          lastReadAt: now,
        },
      });

      return created;
    });

    return message;
  }

  async markAsRead(groupId: string, userId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You must be a member of this group');
    }

    const now = new Date();
    await this.prisma.groupMember.update({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
      data: {
        lastReadAt: now,
      },
    });

    return {
      success: true,
      lastReadAt: now,
      groupId,
      userId,
    };
  }

  async getUnreadCount(groupId: string, userId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You must be a member of this group');
    }

    const unreadCount = await this.prisma.groupMessage.count({
      where: {
        groupId,
        userId: { not: userId },
        ...(membership.lastReadAt
          ? { createdAt: { gt: membership.lastReadAt } }
          : {}),
      },
    });

    return {
      groupId,
      unreadCount,
      lastReadAt: membership.lastReadAt,
    };
  }

  async verifyGroupMembership(
    userId: string,
    groupId: string,
  ): Promise<boolean> {
    const member = await this.prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
    return !!member;
  }
}
