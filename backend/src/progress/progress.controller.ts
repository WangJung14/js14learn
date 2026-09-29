import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getUserProgress(@CurrentUser('sub') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get(':studyDayId')
  async getDayProgress(
    @CurrentUser('sub') userId: string,
    @Param('studyDayId') studyDayId: string,
  ) {
    return this.progressService.getDayProgress(userId, studyDayId);
  }
}
