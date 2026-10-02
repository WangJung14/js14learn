import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ExerciseDifficulty } from '@prisma/client';

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
}
