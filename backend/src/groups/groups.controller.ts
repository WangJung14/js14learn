import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('me')
  async getMyGroup(@CurrentUser('sub') userId: string) {
    return this.groupsService.getMyGroup(userId);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.groupsService.getMembers(id);
  }

  @Get(':id/activity')
  async getGroupActivity(@Param('id') id: string) {
    return this.groupsService.getGroupActivity(id);
  }

  @Post('join')
  async joinGroup(
    @CurrentUser('sub') userId: string,
    @Body() dto: JoinGroupDto,
  ) {
    return this.groupsService.joinGroup(userId, dto);
  }

  @Post()
  @Roles(Role.ADMIN)
  async createGroup(@Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(dto);
  }
}
