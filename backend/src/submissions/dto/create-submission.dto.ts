import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateSubmissionDto {
  @IsNotEmpty({ message: 'Exercise ID is required' })
  @IsString()
  exerciseId!: string;

  @IsNotEmpty({ message: 'File name is required' })
  @IsString()
  @Matches(/\.(js|ts|zip|pdf|png)$/i, {
    message: 'File extension must be one of: .js, .ts, .zip, .pdf, .png',
  })
  fileName!: string;

  @IsNotEmpty({ message: 'File URL is required' })
  @IsUrl({}, { message: 'File URL must be a valid URL string' })
  fileUrl!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
