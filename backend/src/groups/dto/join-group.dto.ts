import { IsNotEmpty, IsString } from 'class-validator';

export class JoinGroupDto {
  @IsNotEmpty({ message: 'Invite code is required' })
  @IsString()
  inviteCode!: string;
}
