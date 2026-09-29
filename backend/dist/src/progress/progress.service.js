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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserProgress(userId) {
        const studyDays = await this.prisma.studyDay.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { exercises: true },
                },
                progress: {
                    where: { userId },
                },
            },
        });
        const totalDays = studyDays.length;
        let completedDaysCount = 0;
        let inProgressDaysCount = 0;
        const daysProgress = studyDays.map((day) => {
            const dayData = day;
            const userProgress = dayData.progress && dayData.progress.length > 0
                ? dayData.progress[0]
                : null;
            const status = userProgress ? userProgress.status : client_1.ProgressStatus.LOCKED;
            if (status === client_1.ProgressStatus.COMPLETED) {
                completedDaysCount++;
            }
            else if (status === client_1.ProgressStatus.IN_PROGRESS) {
                inProgressDaysCount++;
            }
            return {
                studyDayId: day.id,
                dayNumber: day.dayNumber,
                title: day.title,
                status,
                exerciseCount: day._count.exercises,
                completedAt: userProgress ? userProgress.completedAt : null,
            };
        });
        const percentage = totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;
        const currentDayNumber = completedDaysCount < totalDays ? completedDaysCount + 1 : totalDays;
        const currentDay = studyDays.find((d) => d.dayNumber === currentDayNumber) || null;
        return {
            totalDays,
            completedDays: completedDaysCount,
            inProgressDays: inProgressDaysCount,
            percentage,
            currentDay: currentDay
                ? {
                    id: currentDay.id,
                    dayNumber: currentDay.dayNumber,
                    title: currentDay.title,
                    description: currentDay.description,
                }
                : null,
            daysProgress,
        };
    }
    async getDayProgress(userId, studyDayId) {
        const studyDay = await this.prisma.studyDay.findUnique({
            where: { id: studyDayId },
            include: {
                exercises: {
                    orderBy: { order: 'asc' },
                    include: {
                        submissions: {
                            where: { userId },
                            orderBy: { submittedAt: 'desc' },
                            take: 1,
                        },
                    },
                },
                progress: {
                    where: { userId },
                },
            },
        });
        if (!studyDay) {
            throw new common_1.NotFoundException(`Study Day with ID ${studyDayId} not found`);
        }
        const dayData = studyDay;
        const userProgress = dayData.progress && dayData.progress.length > 0
            ? dayData.progress[0]
            : null;
        const exercisesProgress = studyDay.exercises.map((ex) => {
            const exData = ex;
            const latestSub = exData.submissions && exData.submissions.length > 0
                ? exData.submissions[0]
                : null;
            return {
                exerciseId: ex.id,
                title: ex.title,
                difficulty: ex.difficulty,
                order: ex.order,
                status: latestSub ? latestSub.status : 'UNSUBMITTED',
                submissionId: latestSub ? latestSub.id : null,
            };
        });
        return {
            studyDayId: studyDay.id,
            dayNumber: studyDay.dayNumber,
            title: studyDay.title,
            status: userProgress ? userProgress.status : client_1.ProgressStatus.LOCKED,
            exercisesProgress,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map