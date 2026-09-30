import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ChecklistItemOrderDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order!: number;
}

export class ReorderChecklistItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemOrderDto)
  items!: ChecklistItemOrderDto[];
}
