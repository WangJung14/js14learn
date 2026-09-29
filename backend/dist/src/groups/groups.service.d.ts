import { PrismaService } from '../prisma/prisma.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyGroup(userId: string): Promise<{
        id: string;
        name: string;
        inviteCode: string;
        createdAt: Date;
        members: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
            joinedAt: Date;
            completedDays: number;
            totalDays: number;
            percentage: number;
            currentDayNumber: number;
            completedExercises: number;
        }[];
    }>;
    getMembers(groupId: string): Promise<{
        joinedAt: Date;
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    }[]>;
    getGroupActivity(groupId: string): Promise<({
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
    joinGroup(userId: string, dto: JoinGroupDto): Promise<{
        group: {
            id: string;
            name: string;
            createdAt: Date;
            inviteCode: string;
        };
    } & {
        id: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    }>;
    createGroup(dto: CreateGroupDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        inviteCode: string;
    }>;
}
