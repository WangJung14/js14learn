import { Module } from '@nestjs/common';
import { StudyDaysService } from './study-days.service';
import { StudyDaysController } from './study-days.controller';

@Module({
  controllers: [StudyDaysController],
  providers: [StudyDaysService],
  exports: [StudyDaysService],
})
export class StudyDaysModule {}
