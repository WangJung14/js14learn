import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAllGroups(@CurrentUser('sub') userId: string) {
    return this.groupsService.getAllGroups(userId);
  }

  @Get('me')
  async getMyGroup(@CurrentUser('sub') userId: string) {
    return this.groupsService.getMyGroup(userId);
  }

  @Get(':id')
  async getGroupById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.groupsService.getGroupById(id, userId);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.groupsService.getMembers(id);
  }

  @Get(':id/activity')
  async getGroupActivity(@Param('id') id: string) {
    return this.groupsService.getGroupActivity(id);
  }

  @Post()
  async createGroup(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.groupsService.createGroup(userId, dto);
  }

  @Post('join')
  async joinGroup(
    @CurrentUser('sub') userId: string,
    @Body() dto: JoinGroupDto,
  ) {
    return this.groupsService.joinGroup(userId, dto);
  }

  @Post(':id/join')
  async joinGroupById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.groupsService.joinGroupById(id, userId);
  }

  @Post(':id/leave')
  async leaveGroup(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.groupsService.leaveGroup(id, userId);
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupsService.updateGroup(id, userId, dto);
  }

  @Delete(':id')
  async deleteGroup(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.groupsService.deleteGroup(id, userId);
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.groupsService.removeMember(
      groupId,
      currentUserId,
      targetUserId,
    );
  }
}
