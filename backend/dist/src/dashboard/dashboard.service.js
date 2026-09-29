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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardData(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User profile not found');
        }
        const studyDays = await this.prisma.studyDay.findMany({
            orderBy: { order: 'asc' },
            select: {
                id: true,
                dayNumber: true,
                title: true,
                description: true,
                _count: { select: { exercises: true } },
            },
        });
        const totalDays = studyDays.length;
        const completedDaysCount = await this.prisma.progress.count({
            where: { userId, status: client_1.ProgressStatus.COMPLETED },
        });
        const totalExercisesCount = await this.prisma.exercise.count();
        const completedExercisesCount = await this.prisma.submission.count({
            where: { userId, status: 'APPROVED' },
        });
        const totalSubmissionsCount = await this.prisma.submission.count({
            where: { userId },
        });
        const pendingSubmissionsCount = await this.prisma.submission.count({
            where: { userId, status: 'PENDING' },
        });
        const rejectedSubmissionsCount = await this.prisma.submission.count({
            where: { userId, status: 'REJECTED' },
        });
        const percentage = totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;
        const currentDayNumber = completedDaysCount < totalDays ? completedDaysCount + 1 : totalDays;
        const currentDay = studyDays.find((d) => d.dayNumber === currentDayNumber) || null;
        const membership = await this.prisma.groupMember.findFirst({
            where: { userId },
            select: { groupId: true },
        });
        let recentActivity = [];
        if (membership) {
            const groupMembers = await this.prisma.groupMember.findMany({
                where: { groupId: membership.groupId },
                select: { userId: true },
            });
            const userIds = groupMembers.map((m) => m.userId);
            recentActivity = await this.prisma.activity.findMany({
                where: { userId: { in: userIds } },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: { id: true, name: true, avatarUrl: true },
                    },
                },
            });
        }
        else {
            recentActivity = await this.prisma.activity.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: { id: true, name: true, avatarUrl: true },
                    },
                },
            });
        }
        return {
            user,
            progress: {
                percentage,
                completedDays: completedDaysCount,
                totalDays,
                completedExercises: completedExercisesCount,
                totalExercises: totalExercisesCount,
            },
            currentDay: currentDay
                ? {
                    id: currentDay.id,
                    dayNumber: currentDay.dayNumber,
                    title: currentDay.title,
                    description: currentDay.description,
                    exerciseCount: currentDay._count.exercises,
                }
                : null,
            statistics: {
                completedDays: completedDaysCount,
                totalDays,
                completedExercises: completedExercisesCount,
                totalExercises: totalExercisesCount,
                totalSubmissions: totalSubmissionsCount,
                pendingSubmissions: pendingSubmissionsCount,
                rejectedSubmissions: rejectedSubmissionsCount,
                streakDays: Math.min(completedDaysCount, 5),
            },
            recentActivity,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map