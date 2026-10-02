import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class StudyDayOrderDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order!: number;
}

export class ReorderStudyDaysDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudyDayOrderDto)
  items!: StudyDayOrderDto[];
}
