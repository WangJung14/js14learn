import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ChecklistsModule } from '../checklists/checklists.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [ChecklistsModule, AttendanceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
