import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  @IsString({ message: 'Message content must be a string' })
  @MaxLength(5000, { message: 'Message cannot exceed 5000 characters' })
  content!: string;

  @IsOptional()
  @IsString()
  clientMessageId?: string;
}
