import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardData(userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
        progress: {
            percentage: number;
            completedDays: number;
            totalDays: number;
            completedExercises: number;
            totalExercises: number;
        };
        currentDay: {
            id: string;
            dayNumber: number;
            title: string;
            description: string;
            exerciseCount: number;
        } | null;
        statistics: {
            completedDays: number;
            totalDays: number;
            completedExercises: number;
            totalExercises: number;
            totalSubmissions: number;
            pendingSubmissions: number;
            rejectedSubmissions: number;
            streakDays: number;
        };
        recentActivity: {
            id: string;
            userId: string;
            type: string;
            message: string;
            createdAt: Date;
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        }[];
    }>;
}
