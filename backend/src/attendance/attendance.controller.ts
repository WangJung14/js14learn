import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  async getTodayAttendance(@CurrentUser('sub') userId: string) {
    return this.attendanceService.getTodayAttendance(userId);
  }

  @Post('check-in')
  @HttpCode(HttpStatus.OK)
  async checkIn(@CurrentUser('sub') userId: string) {
    return this.attendanceService.checkIn(userId);
  }

  @Post('check-out')
  @HttpCode(HttpStatus.OK)
  async checkOut(@CurrentUser('sub') userId: string) {
    return this.attendanceService.checkOut(userId);
  }

  @Get('stats')
  async getStats(@CurrentUser('sub') userId: string) {
    return this.attendanceService.getStats(userId);
  }
}
