import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateCodeSubmissionDto {
  @IsString()
  @IsNotEmpty()
  exerciseId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20480, {
    message: 'Code size exceeds maximum allowed limit of 20 KB',
  })
  code!: string;

  @IsObject()
  @IsNotEmpty()
  executionSummary!: {
    passed: number;
    total: number;
    durationMs: number;
  };

  @IsString()
  @IsOptional()
  note?: string;
}
