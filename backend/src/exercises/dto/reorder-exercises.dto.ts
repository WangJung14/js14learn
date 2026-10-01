import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ExerciseOrderDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order!: number;
}

export class ReorderExercisesDto {
  @IsNotEmpty()
  @IsString()
  studyDayId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseOrderDto)
  items!: ExerciseOrderDto[];
}
