import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ExerciseDifficulty, AssessmentType } from '@prisma/client';

export class UpdateExerciseDto {
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
  @IsInt()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isCoding?: boolean;

  @IsOptional()
  @IsString()
  starterCode?: string;

  @IsOptional()
  codingConfig?: any;

  @IsOptional()
  @IsEnum(AssessmentType)
  assessmentType?: AssessmentType;

  @IsOptional()
  assessmentConfig?: any;

  @IsOptional()
  @IsNumber()
  @Min(0)
  passingScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;

  @IsOptional()
  @IsArray()
  questionIds?: string[];

  @IsOptional()
  @IsArray()
  questions?: Array<{
    questionId: string;
    points?: number;
    order?: number;
    isRequired?: boolean;
  }>;
}
