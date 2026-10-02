import { IsOptional, IsArray, IsString } from 'class-validator';

export class AssessmentAnswerItemDto {
  @IsString()
  questionId!: string;

  @IsOptional()
  answer?: any;
}

export class CreateAssessmentAttemptDto {
  @IsOptional()
  @IsArray()
  answers?: AssessmentAnswerItemDto[];

  @IsOptional()
  answer?: any;

  @IsOptional()
  studentAnswer?: string;
}
