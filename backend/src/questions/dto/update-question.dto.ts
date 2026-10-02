import { IsEnum, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import {
  AssessmentType,
  ExerciseDifficulty,
  QuestionStatus,
} from '@prisma/client';

export class UpdateQuestionDto {
  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ExerciseDifficulty)
  difficulty?: ExerciseDifficulty;

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultPoints?: number;

  @IsOptional()
  config?: Record<string, any>;
}
