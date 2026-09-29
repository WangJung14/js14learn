import { PrismaService } from '../prisma/prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserProgress(userId: string): Promise<{
        totalDays: number;
        completedDays: number;
        inProgressDays: number;
        percentage: number;
        currentDay: {
            id: string;
            dayNumber: number;
            title: string;
            description: string;
        } | null;
        daysProgress: {
            studyDayId: string;
            dayNumber: number;
            title: string;
            status: import("@prisma/client").$Enums.ProgressStatus;
            exerciseCount: number;
            completedAt: Date | null;
        }[];
    }>;
    getDayProgress(userId: string, studyDayId: string): Promise<{
        studyDayId: string;
        dayNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.ProgressStatus;
        exercisesProgress: {
            exerciseId: string;
            title: string;
            difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
            order: number;
            status: string;
            submissionId: string | null;
        }[];
    }>;
}
