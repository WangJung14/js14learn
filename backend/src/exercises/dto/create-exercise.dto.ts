import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ExerciseDifficulty, AssessmentType } from '@prisma/client';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  studyDayId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsEnum(ExerciseDifficulty)
  difficulty!: ExerciseDifficulty;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  order!: number;

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
