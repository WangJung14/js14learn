import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role, SubmissionStatus } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('submissions')
  async submit(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionsService.submit(userId, dto);
  }

  @Get('submissions/me')
  async findMySubmissions(@CurrentUser('sub') userId: string) {
    return this.submissionsService.findMySubmissions(userId);
  }

  @Get('submissions/:id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.submissionsService.findOne(id, userId, role);
  }

  @Get('admin/submissions')
  @Roles(Role.ADMIN)
  async findAllForAdmin(@Query('status') status?: SubmissionStatus) {
    return this.submissionsService.findAllForAdmin(status);
  }

  @Patch('admin/submissions/:id/review')
  @Roles(Role.ADMIN)
  async reviewSubmission(
    @Param('id') id: string,
    @Body() dto: ReviewSubmissionDto,
  ) {
    return this.submissionsService.reviewSubmission(id, dto);
  }
}
