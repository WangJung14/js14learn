import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoadmapValidationService } from './roadmap-validation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoadmapValidationController {
  constructor(
    private readonly roadmapValidationService: RoadmapValidationService,
  ) {}

  @Get('admin/roadmap/status')
  @Roles(Role.ADMIN)
  async getStatus() {
    return this.roadmapValidationService.getStatus();
  }

  @Post('admin/roadmap/validate')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async validateRoadmap() {
    return this.roadmapValidationService.validateRoadmap();
  }

  @Post('admin/roadmap/publish')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async publishRoadmap() {
    return this.roadmapValidationService.publishRoadmap();
  }

  @Post('admin/roadmap/unpublish')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async unpublishRoadmap() {
    return this.roadmapValidationService.unpublishRoadmap();
  }
}
