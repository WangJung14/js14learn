import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User } from '@prisma/client';
export type SafeUser = Omit<User, 'passwordHash' | 'refreshTokenHash'>;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<Record<string, unknown>>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<Record<string, unknown>>;
    findAll(): Promise<Record<string, unknown>[]>;
    findOne(id: string): Promise<Record<string, unknown>>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<Record<string, unknown>>;
    private sanitizeUser;
}
