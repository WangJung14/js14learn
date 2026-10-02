import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;
  let prisma: any;

  const mockPrismaService = {
    group: {
      findUnique: jest.fn(),
    },
    groupMember: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    groupMessage: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getMessages', () => {
    it('12. Member can load messages', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({ id: 'group-1' });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        userId: 'user-1',
        groupId: 'group-1',
      });
      prisma.groupMessage.findMany.mockResolvedValueOnce([
        {
          id: 'msg-2',
          content: 'Hello 2',
          createdAt: new Date('2026-01-01T10:01:00Z'),
          user: { id: 'user-2', name: 'Bob' },
        },
        {
          id: 'msg-1',
          content: 'Hello 1',
          createdAt: new Date('2026-01-01T10:00:00Z'),
          user: { id: 'user-1', name: 'Alice' },
        },
      ]);

      const result = await service.getMessages('group-1', 'user-1', 50);

      expect(result.messages.length).toBe(2);
      // Chronological order: msg-1 then msg-2
      expect(result.messages[0].id).toBe('msg-1');
      expect(result.messages[1].id).toBe('msg-2');
    });

    it('13. Non-member cannot load messages', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({ id: 'group-1' });
      prisma.groupMember.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.getMessages('group-1', 'user-stranger', 50),
      ).rejects.toThrow(ForbiddenException);
    });

    it('20 & 21. Pagination works with before cursor and limit', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({ id: 'group-1' });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        userId: 'user-1',
        groupId: 'group-1',
      });
      prisma.groupMessage.findUnique.mockResolvedValueOnce({
        id: 'msg-10',
        createdAt: new Date('2026-01-01T12:00:00Z'),
      });
      prisma.groupMessage.findMany.mockResolvedValueOnce([
        {
          id: 'msg-9',
          content: 'Older message',
          createdAt: new Date('2026-01-01T11:59:00Z'),
          user: { id: 'user-1' },
        },
      ]);

      const result = await service.getMessages(
        'group-1',
        'user-1',
        10,
        'msg-10',
      );

      expect(result.messages.length).toBe(1);
      expect(result.messages[0].id).toBe('msg-9');
    });
  });

  describe('sendMessage', () => {
    it('14, 18, 19. Member can send message, server sets sender and persists', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({ id: 'group-1' });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        userId: 'user-1',
        groupId: 'group-1',
      });
      prisma.groupMessage.create.mockResolvedValueOnce({
        id: 'msg-new',
        groupId: 'group-1',
        userId: 'user-1',
        content: 'Hi all!',
        createdAt: new Date(),
        user: { id: 'user-1', name: 'Alice' },
      });
      prisma.groupMember.update.mockResolvedValueOnce({});

      const result = await service.sendMessage(
        'group-1',
        'user-1',
        '  Hi all!  ',
      );

      expect(result.id).toBe('msg-new');
      expect(prisma.groupMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          groupId: 'group-1',
          userId: 'user-1',
          content: 'Hi all!',
        }),
        include: expect.any(Object),
      });
    });

    it('15. Non-member cannot send message', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({ id: 'group-1' });
      prisma.groupMember.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.sendMessage('group-1', 'user-outsider', 'Hello'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('16. Empty message rejected', async () => {
      await expect(
        service.sendMessage('group-1', 'user-1', '   '),
      ).rejects.toThrow(BadRequestException);
    });

    it('17. Oversized message rejected (> 5000 chars)', async () => {
      const longMessage = 'a'.repeat(5001);
      await expect(
        service.sendMessage('group-1', 'user-1', longMessage),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unread and mark-as-read', () => {
    it('22. Unread count calculates messages since lastReadAt', async () => {
      const lastRead = new Date('2026-01-01T10:00:00Z');
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        userId: 'user-1',
        groupId: 'group-1',
        lastReadAt: lastRead,
      });
      prisma.groupMessage.count.mockResolvedValueOnce(5);

      const result = await service.getUnreadCount('group-1', 'user-1');

      expect(result.unreadCount).toBe(5);
      expect(prisma.groupMessage.count).toHaveBeenCalledWith({
        where: {
          groupId: 'group-1',
          userId: { not: 'user-1' },
          createdAt: { gt: lastRead },
        },
      });
    });

    it('23. Mark as read updates lastReadAt', async () => {
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        userId: 'user-1',
        groupId: 'group-1',
      });
      prisma.groupMember.update.mockResolvedValueOnce({});

      const result = await service.markAsRead('group-1', 'user-1');

      expect(result.success).toBe(true);
      expect(result.groupId).toBe('group-1');
      expect(prisma.groupMember.update).toHaveBeenCalled();
    });
  });
});
