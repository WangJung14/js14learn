import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

describe('GroupsService', () => {
  let service: GroupsService;
  let prisma: any;

  const mockPrismaService = {
    group: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    groupMember: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    activity: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    studyDay: {
      count: jest.fn(),
    },
    progress: {
      count: jest.fn(),
    },
    submission: {
      count: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('createGroup', () => {
    it('1. Create group successfully', async () => {
      prisma.group.findUnique.mockResolvedValueOnce(null); // inviteCode uniqueness
      prisma.group.create.mockResolvedValueOnce({
        id: 'group-1',
        name: 'JS Explorers',
        description: 'Learning JS',
        inviteCode: 'GRP-1234',
        creatorId: 'user-1',
        creator: { id: 'user-1', name: 'User 1', email: 'u1@test.com' },
      });
      prisma.groupMember.create.mockResolvedValueOnce({
        id: 'gm-1',
        userId: 'user-1',
        groupId: 'group-1',
      });

      const result = await service.createGroup('user-1', {
        name: 'JS Explorers',
        description: 'Learning JS',
      });

      expect(result.id).toBe('group-1');
      expect(result.name).toBe('JS Explorers');
      expect(result.isOwner).toBe(true);
      expect(result.isMember).toBe(true);
    });

    it('2. Creator becomes owner and member', async () => {
      prisma.group.findUnique.mockResolvedValueOnce(null);
      prisma.group.create.mockResolvedValueOnce({
        id: 'group-2',
        name: 'Alpha Team',
        creatorId: 'user-owner',
      });

      await service.createGroup('user-owner', { name: 'Alpha Team' });

      expect(prisma.groupMember.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-owner',
          groupId: 'group-2',
        },
      });
    });

    it('rejects empty group name', async () => {
      await expect(
        service.createGroup('user-1', { name: '   ' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('joinGroup', () => {
    it('4. Join group with valid invite code', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        name: 'JS Explorers',
        inviteCode: 'INVITE1',
      });
      prisma.groupMember.findUnique.mockResolvedValueOnce(null); // not already member
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-2',
        name: 'Bob',
      });
      prisma.groupMember.create.mockResolvedValueOnce({
        id: 'gm-2',
        userId: 'user-2',
        groupId: 'group-1',
      });

      const result = await service.joinGroup('user-2', {
        inviteCode: 'INVITE1',
      });
      expect(result).toBeDefined();
      expect(prisma.activity.create).toHaveBeenCalled();
    });

    it('3 & 5. Duplicate group join is rejected', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        inviteCode: 'INVITE1',
      });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        id: 'gm-existing',
        userId: 'user-2',
        groupId: 'group-1',
      });

      await expect(
        service.joinGroup('user-2', { inviteCode: 'INVITE1' }),
      ).rejects.toThrow(ConflictException);
    });

    it('rejects nonexistent invite code', async () => {
      prisma.group.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.joinGroup('user-2', { inviteCode: 'INVALID' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('leaveGroup', () => {
    it('6. Member can leave group', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        id: 'gm-1',
        userId: 'user-member',
        groupId: 'group-1',
      });
      prisma.groupMember.delete.mockResolvedValueOnce({});

      const result = await service.leaveGroup('group-1', 'user-member');
      expect(result.message).toContain('Left group successfully');
    });

    it('7. Owner cannot leave without transfer or deletion', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        id: 'gm-owner',
        userId: 'user-owner',
        groupId: 'group-1',
      });

      await expect(service.leaveGroup('group-1', 'user-owner')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateGroup', () => {
    it('8. Owner can update group', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });
      prisma.group.update.mockResolvedValueOnce({
        id: 'group-1',
        name: 'Updated Name',
        description: 'New Desc',
      });

      const result = await service.updateGroup('group-1', 'user-owner', {
        name: 'Updated Name',
        description: 'New Desc',
      });

      expect(result.name).toBe('Updated Name');
    });

    it('9. Non-owner cannot update group', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });

      await expect(
        service.updateGroup('group-1', 'user-stranger', {
          name: 'Hacked Name',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removeMember', () => {
    it('10. Owner can remove member', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });
      prisma.groupMember.findUnique.mockResolvedValueOnce({
        id: 'gm-target',
        userId: 'user-target',
        groupId: 'group-1',
      });
      prisma.groupMember.delete.mockResolvedValueOnce({});

      const result = await service.removeMember(
        'group-1',
        'user-owner',
        'user-target',
      );

      expect(result.message).toContain('Member removed successfully');
    });

    it('11. Non-owner cannot remove member', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });

      await expect(
        service.removeMember('group-1', 'user-regular', 'user-target'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('Owner cannot remove self', async () => {
      prisma.group.findUnique.mockResolvedValueOnce({
        id: 'group-1',
        creatorId: 'user-owner',
      });

      await expect(
        service.removeMember('group-1', 'user-owner', 'user-owner'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
