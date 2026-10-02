import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('questions')
  async findAll(@Query() query: QueryQuestionsDto) {
    return this.questionsService.findAll(query);
  }

  @Get('question-bank')
  async findAllAlias(@Query() query: QueryQuestionsDto) {
    return this.questionsService.findAll(query);
  }

  @Post('questions')
  async create(
    @Body() dto: CreateQuestionDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.questionsService.create(dto, userId);
  }

  @Post('question-bank')
  async createAlias(
    @Body() dto: CreateQuestionDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.questionsService.create(dto, userId);
  }

  @Get('questions/:id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Get('question-bank/:id')
  async findOneAlias(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch('questions/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  @Patch('question-bank/:id')
  async updateAlias(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  @Post('questions/:id/duplicate')
  async duplicate(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.questionsService.duplicate(id, userId);
  }

  @Post('question-bank/:id/duplicate')
  async duplicateAlias(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.questionsService.duplicate(id, userId);
  }

  @Post('questions/:id/archive')
  async archive(@Param('id') id: string) {
    return this.questionsService.archive(id);
  }

  @Post('question-bank/:id/archive')
  async archiveAlias(@Param('id') id: string) {
    return this.questionsService.archive(id);
  }

  @Post('questions/:id/publish')
  async publish(@Param('id') id: string) {
    return this.questionsService.publish(id);
  }

  @Delete('questions/:id')
  async remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  @Delete('question-bank/:id')
  async removeAlias(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
