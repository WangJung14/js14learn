import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash' | 'refreshTokenHash'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        groupMembers: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl.trim() }),
      },
    });

    return this.sanitizeUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        groupMembers: {
          include: {
            group: true,
          },
        },
      },
    });

    return users.map((u) => this.sanitizeUser(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        groupMembers: {
          include: {
            group: true,
          },
        },
        progress: {
          include: {
            studyDay: true,
          },
        },
        submissions: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.sanitizeUser(user);
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        role: dto.role,
      },
    });

    return this.sanitizeUser(user);
  }

  private sanitizeUser<
    T extends { passwordHash: string; refreshTokenHash?: string | null },
  >(user: T) {
    const userCopy: Record<string, unknown> = { ...user };
    delete userCopy.passwordHash;
    delete userCopy.refreshTokenHash;
    return userCopy;
  }
}
