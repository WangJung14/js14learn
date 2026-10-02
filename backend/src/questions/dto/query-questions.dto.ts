import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  AssessmentType,
  ExerciseDifficulty,
  QuestionStatus,
} from '@prisma/client';

export class QueryQuestionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @IsOptional()
  @IsEnum(ExerciseDifficulty)
  difficulty?: ExerciseDifficulty;

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;
}
