import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateStudyDayDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  order!: number;
}
