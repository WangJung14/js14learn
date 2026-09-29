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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
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
            throw new common_1.NotFoundException('User profile not found');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, dto) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.sanitizeUser(user);
    }
    async updateRole(id, dto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                role: dto.role,
            },
        });
        return this.sanitizeUser(user);
    }
    sanitizeUser(user) {
        const userCopy = { ...user };
        delete userCopy.passwordHash;
        delete userCopy.refreshTokenHash;
        return userCopy;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map