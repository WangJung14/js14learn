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
import { StudyDaysService } from './study-days.service';
import { CreateStudyDayDto } from './dto/create-study-day.dto';
import { UpdateStudyDayDto } from './dto/update-study-day.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('study-days')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudyDaysController {
  constructor(private readonly studyDaysService: StudyDaysService) {}

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    return this.studyDaysService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.studyDaysService.findOne(id, userId);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateStudyDayDto) {
    return this.studyDaysService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateStudyDayDto) {
    return this.studyDaysService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.studyDaysService.remove(id);
  }
}
