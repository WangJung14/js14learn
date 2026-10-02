import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

interface SocketUser {
  id: string;
  email: string;
  role: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  pingTimeout: 30000,
  pingInterval: 10000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private extractToken(client: Socket): string | null {
    const authHeader =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization ||
      client.handshake.query?.token;

    if (!authHeader) return null;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return typeof authHeader === 'string' ? authHeader : null;
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`Client ${client.id} disconnected: No JWT provided`);
        client.emit('chat:error', {
          message: 'Authentication token required',
          code: 'UNAUTHORIZED',
        });
        client.disconnect(true);
        return;
      }

      const secret =
        this.configService.get<string>('JWT_SECRET') ||
        'js-study-hub-secret-key-change-in-production';

      const payload = await this.jwtService.verifyAsync(token, { secret });

      if (!payload || !payload.sub) {
        this.logger.warn(
          `Client ${client.id} disconnected: Invalid JWT payload`,
        );
        client.emit('chat:error', {
          message: 'Invalid authentication token',
          code: 'UNAUTHORIZED',
        });
        client.disconnect(true);
        return;
      }

      const user: SocketUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      client.data.user = user;
      this.logger.log(`Socket connected: ${client.id} for user ${user.id}`);
    } catch (err: any) {
      this.logger.warn(`Client ${client.id} auth failed: ${err.message}`);
      client.emit('chat:error', {
        message: 'Authentication failed',
        code: 'UNAUTHORIZED',
      });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('group:join')
  async handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    const user: SocketUser | undefined = client.data.user;
    if (!user) {
      client.emit('chat:error', {
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const { groupId } = data || {};
    if (!groupId) {
      client.emit('chat:error', {
        message: 'Group ID is required',
        code: 'BAD_REQUEST',
      });
      return;
    }

    try {
      const isMember = await this.chatService.verifyGroupMembership(
        user.id,
        groupId,
      );

      if (!isMember) {
        client.emit('chat:error', {
          message: 'You are not a member of this group',
          code: 'FORBIDDEN',
        });
        return;
      }

      const roomName = `group:${groupId}`;
      await client.join(roomName);
      this.logger.log(`User ${user.id} joined room ${roomName}`);

      client.emit('group:joined', { groupId });
    } catch (err: any) {
      client.emit('chat:error', {
        message: err.message || 'Failed to join group room',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  @SubscribeMessage('group:leave')
  async handleLeaveGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    const user: SocketUser | undefined = client.data.user;
    const { groupId } = data || {};
    if (!groupId) return;

    const roomName = `group:${groupId}`;
    await client.leave(roomName);
    this.logger.log(`User ${user?.id || client.id} left room ${roomName}`);
    client.emit('group:left', { groupId });
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      groupId: string;
      content: string;
      clientMessageId?: string;
    },
  ) {
    const user: SocketUser | undefined = client.data.user;
    if (!user) {
      client.emit('chat:error', {
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const { groupId, content, clientMessageId } = data || {};
    if (!groupId || !content) {
      client.emit('chat:error', {
        message: 'Group ID and message content are required',
        code: 'BAD_REQUEST',
      });
      return;
    }

    try {
      // 1. Persist to PostgreSQL first (ensures database first, sender verified by JWT)
      const savedMessage = await this.chatService.sendMessage(
        groupId,
        user.id,
        content,
      );

      // 2. Broadcast to all connected members in the group room
      const roomName = `group:${groupId}`;
      this.server.to(roomName).emit('message:new', {
        ...savedMessage,
        clientMessageId,
      });

      this.logger.log(
        `Message ${savedMessage.id} broadcast to ${roomName} from user ${user.id}`,
      );
    } catch (err: any) {
      client.emit('chat:error', {
        message: err.message || 'Failed to send message',
        code: err.status === 403 ? 'FORBIDDEN' : 'BAD_REQUEST',
      });
    }
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    const user: SocketUser | undefined = client.data.user;
    if (!user) return;

    const { groupId } = data || {};
    if (!groupId) return;

    try {
      const result = await this.chatService.markAsRead(groupId, user.id);
      const roomName = `group:${groupId}`;
      this.server.to(roomName).emit('message:read', result);
    } catch (err: any) {
      client.emit('chat:error', {
        message: err.message || 'Failed to mark messages as read',
      });
    }
  }
}
