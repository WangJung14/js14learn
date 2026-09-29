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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('exercises/:id')
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.exercisesService.findOne(id, userId);
  }

  @Get('study-days/:studyDayId/exercises')
  async findByStudyDay(
    @Param('studyDayId') studyDayId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.exercisesService.findByStudyDay(studyDayId, userId);
  }

  @Post('exercises')
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateExerciseDto) {
    return this.exercisesService.create(dto);
  }

  @Patch('exercises/:id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exercisesService.update(id, dto);
  }

  @Delete('exercises/:id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
