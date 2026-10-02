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
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentAttemptDto } from './dto/create-assessment-attempt.dto';
import { ReviewAssessmentAttemptDto } from './dto/review-assessment-attempt.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get('assessments/:exerciseId')
  async getAssessment(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.assessmentsService.getAssessment(exerciseId, userId, role);
  }

  @Get('assessments/:exerciseId/attempts')
  async getAttempts(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.assessmentsService.getAttempts(exerciseId, userId);
  }

  @Get('assessments/:exerciseId/summary')
  async getSummary(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.assessmentsService.getSummary(exerciseId, userId);
  }

  @Post('assessments/:exerciseId/attempts')
  async submitAttempt(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAssessmentAttemptDto,
  ) {
    return this.assessmentsService.submitAttempt(userId, exerciseId, dto);
  }

  @Get('admin/assessments/pending-reviews')
  @Roles(Role.ADMIN)
  async getPendingReviews() {
    return this.assessmentsService.getPendingReviews();
  }

  @Patch('admin/assessments/attempts/:attemptId/review')
  @Roles(Role.ADMIN)
  async reviewAttempt(
    @Param('attemptId') attemptId: string,
    @Body() dto: ReviewAssessmentAttemptDto,
  ) {
    return this.assessmentsService.reviewAttempt(attemptId, dto);
  }

  // Admin exercise question management
  @Post('admin/exercises/:exerciseId/questions')
  @Roles(Role.ADMIN)
  async addQuestions(
    @Param('exerciseId') exerciseId: string,
    @Body()
    body: {
      questionId?: string;
      points?: number;
      order?: number;
      isRequired?: boolean;
      questions?: Array<{
        questionId: string;
        points?: number;
        order?: number;
        isRequired?: boolean;
      }>;
    },
  ) {
    const list = Array.isArray(body.questions)
      ? body.questions
      : body.questionId
        ? [
            {
              questionId: body.questionId,
              points: body.points,
              order: body.order,
              isRequired: body.isRequired,
            },
          ]
        : [];
    return this.assessmentsService.addQuestionsToExercise(exerciseId, list);
  }

  @Delete('admin/exercises/:exerciseId/questions/:questionId')
  @Roles(Role.ADMIN)
  async removeQuestion(
    @Param('exerciseId') exerciseId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.assessmentsService.removeQuestionFromExercise(
      exerciseId,
      questionId,
    );
  }

  @Patch('admin/exercises/:exerciseId/questions/reorder')
  @Roles(Role.ADMIN)
  async reorderQuestions(
    @Param('exerciseId') exerciseId: string,
    @Body() body: { orders: Array<{ questionId: string; order: number }> },
  ) {
    return this.assessmentsService.reorderExerciseQuestions(
      exerciseId,
      body.orders,
    );
  }

  @Patch('admin/exercises/:exerciseId/questions/:questionId')
  @Roles(Role.ADMIN)
  async updateQuestion(
    @Param('exerciseId') exerciseId: string,
    @Param('questionId') questionId: string,
    @Body() body: { points?: number; order?: number; isRequired?: boolean },
  ) {
    return this.assessmentsService.updateExerciseQuestion(
      exerciseId,
      questionId,
      body,
    );
  }
}
