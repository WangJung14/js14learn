import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  const mockChatService = {
    verifyGroupMembership: jest.fn(),
    sendMessage: jest.fn(),
    markAsRead: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);

    gateway.server = {
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      emit: jest.fn(),
    } as any;

    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('24. Valid JWT accepted and attaches user', async () => {
      const mockClient: any = {
        id: 'socket-1',
        handshake: {
          auth: { token: 'valid.jwt.token' },
          headers: {},
        },
        data: {},
        emit: jest.fn(),
        disconnect: jest.fn(),
      };

      mockJwtService.verifyAsync.mockResolvedValueOnce({
        sub: 'user-1',
        email: 'user1@test.com',
        role: 'STUDENT',
      });

      await gateway.handleConnection(mockClient);

      expect(mockClient.data.user).toEqual({
        id: 'user-1',
        email: 'user1@test.com',
        role: 'STUDENT',
      });
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('25. Invalid JWT rejected and socket disconnected', async () => {
      const mockClient: any = {
        id: 'socket-2',
        handshake: {
          auth: { token: 'invalid.token' },
          headers: {},
        },
        data: {},
        emit: jest.fn(),
        disconnect: jest.fn(),
      };

      mockJwtService.verifyAsync.mockRejectedValueOnce(
        new Error('Invalid token'),
      );

      await gateway.handleConnection(mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith(
        'chat:error',
        expect.objectContaining({ code: 'UNAUTHORIZED' }),
      );
      expect(mockClient.disconnect).toHaveBeenCalledWith(true);
    });
  });

  describe('group:join and group:leave', () => {
    it('26. Member can join group room', async () => {
      const mockClient: any = {
        id: 'socket-1',
        data: { user: { id: 'user-1' } },
        join: jest.fn().mockResolvedValue(undefined),
        emit: jest.fn(),
      };

      mockChatService.verifyGroupMembership.mockResolvedValueOnce(true);

      await gateway.handleJoinGroup(mockClient, { groupId: 'group-1' });

      expect(mockClient.join).toHaveBeenCalledWith('group:group-1');
      expect(mockClient.emit).toHaveBeenCalledWith('group:joined', {
        groupId: 'group-1',
      });
    });

    it('27 & 30. Non-member / removed member cannot join group room', async () => {
      const mockClient: any = {
        id: 'socket-1',
        data: { user: { id: 'user-stranger' } },
        join: jest.fn(),
        emit: jest.fn(),
      };

      mockChatService.verifyGroupMembership.mockResolvedValueOnce(false);

      await gateway.handleJoinGroup(mockClient, { groupId: 'group-1' });

      expect(mockClient.join).not.toHaveBeenCalled();
      expect(mockClient.emit).toHaveBeenCalledWith(
        'chat:error',
        expect.objectContaining({ code: 'FORBIDDEN' }),
      );
    });
  });

  describe('message:send', () => {
    it('28 & 29. Message broadcast reaches group room and not unrelated rooms', async () => {
      const mockClient: any = {
        id: 'socket-1',
        data: { user: { id: 'user-1' } },
        emit: jest.fn(),
      };

      const mockSavedMessage = {
        id: 'msg-100',
        groupId: 'group-1',
        userId: 'user-1',
        content: 'Broadcast test',
        createdAt: new Date(),
        user: { id: 'user-1', name: 'Alice' },
      };

      mockChatService.sendMessage.mockResolvedValueOnce(mockSavedMessage);

      const roomEmitMock = jest.fn();
      gateway.server.to = jest.fn().mockReturnValue({ emit: roomEmitMock });

      await gateway.handleSendMessage(mockClient, {
        groupId: 'group-1',
        content: 'Broadcast test',
        clientMessageId: 'client-temp-1',
      });

      expect(mockChatService.sendMessage).toHaveBeenCalledWith(
        'group-1',
        'user-1',
        'Broadcast test',
      );
      expect(gateway.server.to).toHaveBeenCalledWith('group:group-1');
      expect(roomEmitMock).toHaveBeenCalledWith('message:new', {
        ...mockSavedMessage,
        clientMessageId: 'client-temp-1',
      });
    });
  });
});
