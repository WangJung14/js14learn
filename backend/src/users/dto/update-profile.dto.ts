import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL string' })
  avatarUrl?: string;
}
