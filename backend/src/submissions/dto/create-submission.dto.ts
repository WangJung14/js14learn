import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsNotEmpty({ message: 'Exercise ID is required' })
  @IsString()
  exerciseId!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
