import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudyDaysModule } from './study-days/study-days.module';
import { ExercisesModule } from './exercises/exercises.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ProgressModule } from './progress/progress.module';
import { GroupsModule } from './groups/groups.module';
import { ChatModule } from './chat/chat.module';
import { ActivityModule } from './activity/activity.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StorageModule } from './storage/storage.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RoadmapValidationModule } from './roadmap-validation/roadmap-validation.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    StudyDaysModule,
    ExercisesModule,
    SubmissionsModule,
    ProgressModule,
    GroupsModule,
    ChatModule,
    ActivityModule,
    ChecklistsModule,
    AttendanceModule,
    DashboardModule,
    RoadmapValidationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
