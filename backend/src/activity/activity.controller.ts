import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getGroupActivity(@CurrentUser('sub') userId: string) {
    return this.activityService.getGroupActivity(userId);
  }

  @Get('me')
  async getMyActivity(@CurrentUser('sub') userId: string) {
    return this.activityService.getMyActivity(userId);
  }
}
