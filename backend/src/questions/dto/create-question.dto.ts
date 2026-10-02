import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import {
  AssessmentType,
  ExerciseDifficulty,
  QuestionStatus,
} from '@prisma/client';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsEnum(AssessmentType)
  type!: AssessmentType;

  @IsNotEmpty()
  @IsString()
  title!: string;

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

  @IsNotEmpty()
  config!: Record<string, any>;
}
