import {
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  Min,
} from 'class-validator';

export class ReviewAnswerItemDto {
  @IsString()
  answerId!: string;

  @IsNumber()
  @Min(0)
  score!: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class ReviewAssessmentAttemptDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  adminFeedback?: string;

  @IsOptional()
  @IsArray()
  answers?: ReviewAnswerItemDto[];
}
