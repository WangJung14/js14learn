import { Module } from '@nestjs/common';
import { RoadmapValidationService } from './roadmap-validation.service';
import { RoadmapValidationController } from './roadmap-validation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoadmapValidationService],
  controllers: [RoadmapValidationController],
  exports: [RoadmapValidationService],
})
export class RoadmapValidationModule {}
