import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be STUDENT or ADMIN' })
  role!: Role;
}
