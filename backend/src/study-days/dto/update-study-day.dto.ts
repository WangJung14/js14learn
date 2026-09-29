import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStudyDayDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  dayNumber?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
