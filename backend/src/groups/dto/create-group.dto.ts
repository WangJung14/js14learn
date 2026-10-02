import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Group name is required' })
  @IsString()
  @MaxLength(100, { message: 'Group name cannot exceed 100 characters' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Invite code cannot exceed 50 characters' })
  inviteCode?: string;
}
