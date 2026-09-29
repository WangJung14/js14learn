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
exports.StudyDaysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StudyDaysService = class StudyDaysService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const studyDays = await this.prisma.studyDay.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { exercises: true },
                },
                ...(userId && {
                    progress: {
                        where: { userId },
                    },
                }),
            },
        });
        return studyDays.map((day) => {
            const dayData = day;
            const userProgress = dayData.progress && dayData.progress.length > 0
                ? dayData.progress[0]
                : null;
            return {
                id: day.id,
                dayNumber: day.dayNumber,
                title: day.title,
                description: day.description,
                content: day.content,
                order: day.order,
                createdAt: day.createdAt,
                updatedAt: day.updatedAt,
                exerciseCount: day._count.exercises,
                progressStatus: userProgress
                    ? userProgress.status
                    : client_1.ProgressStatus.LOCKED,
                completedAt: userProgress ? userProgress.completedAt : null,
            };
        });
    }
    async findOne(id, userId) {
        const studyDay = await this.prisma.studyDay.findUnique({
            where: { id },
            include: {
                exercises: {
                    orderBy: { order: 'asc' },
                },
                ...(userId && {
                    progress: {
                        where: { userId },
                    },
                }),
            },
        });
        if (!studyDay) {
            throw new common_1.NotFoundException(`Study Day with ID ${id} not found`);
        }
        const dayData = studyDay;
        const userProgress = dayData.progress && dayData.progress.length > 0
            ? dayData.progress[0]
            : null;
        return {
            id: studyDay.id,
            dayNumber: studyDay.dayNumber,
            title: studyDay.title,
            description: studyDay.description,
            content: studyDay.content,
            order: studyDay.order,
            createdAt: studyDay.createdAt,
            updatedAt: studyDay.updatedAt,
            exercises: studyDay.exercises,
            progressStatus: userProgress
                ? userProgress.status
                : client_1.ProgressStatus.LOCKED,
            completedAt: userProgress ? userProgress.completedAt : null,
        };
    }
    async create(dto) {
        const existingDay = await this.prisma.studyDay.findUnique({
            where: { dayNumber: dto.dayNumber },
        });
        if (existingDay) {
            throw new common_1.ConflictException(`Study Day with dayNumber ${dto.dayNumber} already exists`);
        }
        return this.prisma.studyDay.create({
            data: dto,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.dayNumber) {
            const existingDay = await this.prisma.studyDay.findFirst({
                where: {
                    dayNumber: dto.dayNumber,
                    NOT: { id },
                },
            });
            if (existingDay) {
                throw new common_1.ConflictException(`Study Day with dayNumber ${dto.dayNumber} already exists`);
            }
        }
        return this.prisma.studyDay.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.studyDay.delete({
            where: { id },
        });
    }
};
exports.StudyDaysService = StudyDaysService;
exports.StudyDaysService = StudyDaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudyDaysService);
//# sourceMappingURL=study-days.service.js.map