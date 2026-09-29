"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GroupsService = class GroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyGroup(userId) {
        const membership = await this.prisma.groupMember.findFirst({
            where: { userId },
            include: {
                group: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatarUrl: true,
                                        createdAt: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException('You are not currently a member of any study group');
        }
        const totalDays = await this.prisma.studyDay.count();
        const membersWithProgress = await Promise.all(membership.group.members.map(async (member) => {
            const completedDays = await this.prisma.progress.count({
                where: {
                    userId: member.user.id,
                    status: client_1.ProgressStatus.COMPLETED,
                },
            });
            const completedExercises = await this.prisma.submission.count({
                where: {
                    userId: member.user.id,
                    status: 'APPROVED',
                },
            });
            const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
            const currentDayNumber = completedDays < totalDays ? completedDays + 1 : totalDays;
            return {
                id: member.user.id,
                name: member.user.name,
                email: member.user.email,
                avatarUrl: member.user.avatarUrl,
                joinedAt: member.joinedAt,
                completedDays,
                totalDays,
                percentage,
                currentDayNumber,
                completedExercises,
            };
        }));
        return {
            id: membership.group.id,
            name: membership.group.name,
            inviteCode: membership.group.inviteCode,
            createdAt: membership.group.createdAt,
            members: membersWithProgress,
        };
    }
    async getMembers(groupId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        return group.members.map((m) => ({
            ...m.user,
            joinedAt: m.joinedAt,
        }));
    }
    async getGroupActivity(groupId) {
        const members = await this.prisma.groupMember.findMany({
            where: { groupId },
            select: { userId: true },
        });
        const userIds = members.map((m) => m.userId);
        return this.prisma.activity.findMany({
            where: { userId: { in: userIds } },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
                user: {
                    select: { id: true, name: true, avatarUrl: true },
                },
            },
        });
    }
    async joinGroup(userId, dto) {
        const existingMembership = await this.prisma.groupMember.findFirst({
            where: { userId },
        });
        if (existingMembership) {
            throw new common_1.BadRequestException('You are already a member of a study group');
        }
        const group = await this.prisma.group.findUnique({
            where: { inviteCode: dto.inviteCode.trim() },
        });
        if (!group) {
            throw new common_1.NotFoundException('Invalid invite code');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const newMember = await this.prisma.$transaction(async (tx) => {
            const member = await tx.groupMember.create({
                data: {
                    userId,
                    groupId: group.id,
                },
                include: {
                    group: true,
                },
            });
            await tx.activity.create({
                data: {
                    userId,
                    type: client_1.ActivityType.JOINED_GROUP,
                    message: `${user?.name || 'Student'} joined group "${group.name}"`,
                },
            });
            return member;
        });
        return newMember;
    }
    async createGroup(dto) {
        const existingGroup = await this.prisma.group.findUnique({
            where: { inviteCode: dto.inviteCode.trim() },
        });
        if (existingGroup) {
            throw new common_1.ConflictException('A group with this invite code already exists');
        }
        return this.prisma.group.create({
            data: {
                name: dto.name.trim(),
                inviteCode: dto.inviteCode.trim(),
            },
        });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map