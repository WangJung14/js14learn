import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('groups/:groupId')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(
    @Param('groupId') groupId: string,
    @CurrentUser('sub') userId: string,
    @Query() query: GetMessagesDto,
  ) {
    return this.chatService.getMessages(
      groupId,
      userId,
      query.limit,
      query.before,
    );
  }

  @Post('messages')
  async sendMessage(
    @Param('groupId') groupId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(groupId, userId, dto.content);
  }

  @Post('messages/read')
  async markAsRead(
    @Param('groupId') groupId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.chatService.markAsRead(groupId, userId);
  }

  @Get('unread')
  async getUnreadCount(
    @Param('groupId') groupId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.chatService.getUnreadCount(groupId, userId);
  }
}
