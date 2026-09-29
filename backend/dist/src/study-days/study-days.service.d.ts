import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyDayDto } from './dto/create-study-day.dto';
import { UpdateStudyDayDto } from './dto/update-study-day.dto';
export declare class StudyDaysService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId?: string): Promise<{
        id: string;
        dayNumber: number;
        title: string;
        description: string;
        content: string;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        exerciseCount: number;
        progressStatus: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
    }[]>;
    findOne(id: string, userId?: string): Promise<{
        id: string;
        dayNumber: number;
        title: string;
        description: string;
        content: string;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        exercises: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            title: string;
            description: string;
            difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
            studyDayId: string;
        }[];
        progressStatus: import("@prisma/client").$Enums.ProgressStatus;
        completedAt: Date | null;
    }>;
    create(dto: CreateStudyDayDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dayNumber: number;
        order: number;
        title: string;
        description: string;
        content: string;
    }>;
    update(id: string, dto: UpdateStudyDayDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dayNumber: number;
        order: number;
        title: string;
        description: string;
        content: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dayNumber: number;
        order: number;
        title: string;
        description: string;
        content: string;
    }>;
}
