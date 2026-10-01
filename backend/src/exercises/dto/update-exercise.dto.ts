import { IsEnum, IsInt, IsOptional, IsString, IsBoolean, Min } from 'class-validator';
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

  @IsOptional()
  @IsBoolean()
  isCoding?: boolean;

  @IsOptional()
  @IsString()
  starterCode?: string;

  @IsOptional()
  codingConfig?: any;
}
