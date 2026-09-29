import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';
export declare class ActivityService {
    private prisma;
    constructor(prisma: PrismaService);
    getGroupActivity(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        message: string;
    })[]>;
    getMyActivity(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        message: string;
    })[]>;
    logActivity(userId: string, type: ActivityType, message: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        message: string;
    }>;
}
