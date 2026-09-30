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
import { ChecklistsService } from './checklists.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ReorderChecklistItemsDto } from './dto/reorder-checklist-items.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Get('checklists/today')
  async getTodayChecklist(@CurrentUser('sub') userId: string) {
    return this.checklistsService.getTodayChecklist(userId);
  }

  @Get('checklists/study-day/:studyDayId')
  async getStudyDayChecklist(
    @CurrentUser('sub') userId: string,
    @Param('studyDayId') studyDayId: string,
  ) {
    return this.checklistsService.getStudyDayChecklist(userId, studyDayId);
  }

  @Post('checklists/:id/complete')
  async completeItem(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.checklistsService.completeItem(userId, id);
  }

  @Delete('checklists/:id/complete')
  async uncompleteItem(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.checklistsService.uncompleteItem(userId, id);
  }

  // Admin Checklist Management Endpoints
  @Post('admin/checklists')
  @Roles(Role.ADMIN)
  async createItem(@Body() dto: CreateChecklistItemDto) {
    return this.checklistsService.createItem(dto);
  }

  @Patch('admin/checklists/reorder')
  @Roles(Role.ADMIN)
  async reorderItems(@Body() dto: ReorderChecklistItemsDto) {
    return this.checklistsService.reorderItems(dto);
  }

  @Patch('admin/checklists/:id')
  @Roles(Role.ADMIN)
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.checklistsService.updateItem(id, dto);
  }

  @Delete('admin/checklists/:id')
  @Roles(Role.ADMIN)
  async deleteItem(@Param('id') id: string) {
    return this.checklistsService.deleteItem(id);
  }
}
