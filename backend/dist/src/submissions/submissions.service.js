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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SubmissionsService = class SubmissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(userId, dto) {
        const exercise = await this.prisma.exercise.findUnique({
            where: { id: dto.exerciseId },
            include: { studyDay: true },
        });
        if (!exercise) {
            throw new common_1.NotFoundException(`Exercise with ID ${dto.exerciseId} not found`);
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const submission = await this.prisma.$transaction(async (tx) => {
            const sub = await tx.submission.create({
                data: {
                    exerciseId: dto.exerciseId,
                    userId,
                    fileName: dto.fileName.trim(),
                    fileUrl: dto.fileUrl.trim(),
                    note: dto.note ? dto.note.trim() : null,
                    status: client_1.SubmissionStatus.PENDING,
                },
                include: {
                    exercise: {
                        select: { id: true, title: true, studyDayId: true },
                    },
                },
            });
            await tx.progress.upsert({
                where: {
                    userId_studyDayId: {
                        userId,
                        studyDayId: exercise.studyDayId,
                    },
                },
                update: {
                    status: client_1.ProgressStatus.COMPLETED
                        ? undefined
                        : client_1.ProgressStatus.IN_PROGRESS,
                },
                create: {
                    userId,
                    studyDayId: exercise.studyDayId,
                    status: client_1.ProgressStatus.IN_PROGRESS,
                },
            });
            await tx.activity.create({
                data: {
                    userId,
                    type: client_1.ActivityType.SUBMITTED_EXERCISE,
                    message: `${user?.name || 'Student'} submitted solution for "${exercise.title}"`,
                },
            });
            return sub;
        });
        return submission;
    }
    async findMySubmissions(userId) {
        return this.prisma.submission.findMany({
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            include: {
                exercise: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        studyDay: {
                            select: { id: true, dayNumber: true, title: true },
                        },
                    },
                },
            },
        });
    }
    async findOne(id, userId, role) {
        const submission = await this.prisma.submission.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
                exercise: {
                    include: {
                        studyDay: true,
                    },
                },
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException(`Submission with ID ${id} not found`);
        }
        if (role !== client_1.Role.ADMIN && submission.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this submission');
        }
        return submission;
    }
    async findAllForAdmin(status) {
        return this.prisma.submission.findMany({
            where: {
                ...(status && { status }),
            },
            orderBy: { submittedAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
                exercise: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        studyDay: {
                            select: { id: true, dayNumber: true, title: true },
                        },
                    },
                },
            },
        });
    }
    async reviewSubmission(id, dto) {
        const submission = await this.prisma.submission.findUnique({
            where: { id },
            include: {
                exercise: true,
                user: true,
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException(`Submission with ID ${id} not found`);
        }
        if (dto.status !== client_1.SubmissionStatus.APPROVED &&
            dto.status !== client_1.SubmissionStatus.REJECTED) {
            throw new common_1.BadRequestException('Review status must be APPROVED or REJECTED');
        }
        const updatedSubmission = await this.prisma.$transaction(async (tx) => {
            const reviewed = await tx.submission.update({
                where: { id },
                data: {
                    status: dto.status,
                    adminNote: dto.adminNote ? dto.adminNote.trim() : null,
                    reviewedAt: new Date(),
                },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    exercise: { select: { id: true, title: true, studyDayId: true } },
                },
            });
            if (dto.status === client_1.SubmissionStatus.APPROVED) {
                const allExercisesInDay = await tx.exercise.findMany({
                    where: { studyDayId: submission.exercise.studyDayId },
                    select: { id: true },
                });
                const exerciseIdsInDay = allExercisesInDay.map((e) => e.id);
                const approvedSubmissions = await tx.submission.findMany({
                    where: {
                        userId: submission.userId,
                        exerciseId: { in: exerciseIdsInDay },
                        status: client_1.SubmissionStatus.APPROVED,
                    },
                    select: { exerciseId: true },
                });
                const approvedExerciseIds = new Set(approvedSubmissions.map((s) => s.exerciseId));
                const isDayFullyCompleted = exerciseIdsInDay.every((exId) => approvedExerciseIds.has(exId));
                if (isDayFullyCompleted) {
                    const studyDay = await tx.studyDay.findUnique({
                        where: { id: submission.exercise.studyDayId },
                    });
                    await tx.progress.upsert({
                        where: {
                            userId_studyDayId: {
                                userId: submission.userId,
                                studyDayId: submission.exercise.studyDayId,
                            },
                        },
                        update: {
                            status: client_1.ProgressStatus.COMPLETED,
                            completedAt: new Date(),
                        },
                        create: {
                            userId: submission.userId,
                            studyDayId: submission.exercise.studyDayId,
                            status: client_1.ProgressStatus.COMPLETED,
                            completedAt: new Date(),
                        },
                    });
                    await tx.activity.create({
                        data: {
                            userId: submission.userId,
                            type: client_1.ActivityType.COMPLETED_DAY,
                            message: `${submission.user.name} completed Day ${studyDay?.dayNumber}: ${studyDay?.title}`,
                        },
                    });
                }
            }
            return reviewed;
        });
        return updatedSubmission;
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map