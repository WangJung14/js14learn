import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';

export class ReviewSubmissionDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(SubmissionStatus, { message: 'Status must be APPROVED or REJECTED' })
  status!: SubmissionStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
