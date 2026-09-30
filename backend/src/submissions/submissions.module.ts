import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { StorageModule } from '../storage/storage.module';
import { ChecklistsModule } from '../checklists/checklists.module';

@Module({
  imports: [StorageModule, ChecklistsModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
