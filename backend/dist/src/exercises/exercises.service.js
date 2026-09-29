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
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExercisesService = class ExercisesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id, userId) {
        const exercise = await this.prisma.exercise.findUnique({
            where: { id },
            include: {
                studyDay: {
                    select: { id: true, dayNumber: true, title: true },
                },
                ...(userId && {
                    submissions: {
                        where: { userId },
                        orderBy: { submittedAt: 'desc' },
                    },
                }),
            },
        });
        if (!exercise) {
            throw new common_1.NotFoundException(`Exercise with ID ${id} not found`);
        }
        const exData = exercise;
        const latestSubmission = exData.submissions && exData.submissions.length > 0
            ? exData.submissions[0]
            : null;
        return {
            id: exercise.id,
            studyDayId: exercise.studyDayId,
            title: exercise.title,
            description: exercise.description,
            difficulty: exercise.difficulty,
            order: exercise.order,
            createdAt: exercise.createdAt,
            updatedAt: exercise.updatedAt,
            studyDay: exercise.studyDay,
            latestSubmission,
            submissionStatus: latestSubmission ? latestSubmission.status : null,
        };
    }
    async findByStudyDay(studyDayId, userId) {
        const exercises = await this.prisma.exercise.findMany({
            where: { studyDayId },
            orderBy: { order: 'asc' },
            include: {
                ...(userId && {
                    submissions: {
                        where: { userId },
                        orderBy: { submittedAt: 'desc' },
                        take: 1,
                    },
                }),
            },
        });
        return exercises.map((ex) => {
            const exData = ex;
            const latestSubmission = exData.submissions && exData.submissions.length > 0
                ? exData.submissions[0]
                : null;
            return {
                id: ex.id,
                studyDayId: ex.studyDayId,
                title: ex.title,
                description: ex.description,
                difficulty: ex.difficulty,
                order: ex.order,
                createdAt: ex.createdAt,
                updatedAt: ex.updatedAt,
                latestSubmission,
                submissionStatus: latestSubmission ? latestSubmission.status : null,
            };
        });
    }
    async create(dto) {
        const studyDay = await this.prisma.studyDay.findUnique({
            where: { id: dto.studyDayId },
        });
        if (!studyDay) {
            throw new common_1.NotFoundException(`Study Day with ID ${dto.studyDayId} not found`);
        }
        return this.prisma.exercise.create({
            data: dto,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.exercise.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.exercise.delete({
            where: { id },
        });
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map