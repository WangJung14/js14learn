import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ExerciseDifficulty } from '@prisma/client';

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
}
