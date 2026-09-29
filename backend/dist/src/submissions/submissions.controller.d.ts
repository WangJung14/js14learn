import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { Role, SubmissionStatus } from '@prisma/client';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    submit(userId: string, dto: CreateSubmissionDto): Promise<{
        exercise: {
            id: string;
            title: string;
            studyDayId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        userId: string;
        submittedAt: Date;
        exerciseId: string;
        fileName: string;
        fileUrl: string;
        note: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
    findMySubmissions(userId: string): Promise<({
        exercise: {
            id: string;
            title: string;
            studyDay: {
                id: string;
                dayNumber: number;
                title: string;
            };
            difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        userId: string;
        submittedAt: Date;
        exerciseId: string;
        fileName: string;
        fileUrl: string;
        note: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    })[]>;
    findOne(id: string, userId: string, role: Role): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
        exercise: {
            studyDay: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                dayNumber: number;
                order: number;
                title: string;
                description: string;
                content: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            title: string;
            description: string;
            difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
            studyDayId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        userId: string;
        submittedAt: Date;
        exerciseId: string;
        fileName: string;
        fileUrl: string;
        note: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
    findAllForAdmin(status?: SubmissionStatus): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
        exercise: {
            id: string;
            title: string;
            studyDay: {
                id: string;
                dayNumber: number;
                title: string;
            };
            difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        userId: string;
        submittedAt: Date;
        exerciseId: string;
        fileName: string;
        fileUrl: string;
        note: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    })[]>;
    reviewSubmission(id: string, dto: ReviewSubmissionDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        exercise: {
            id: string;
            title: string;
            studyDayId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubmissionStatus;
        userId: string;
        submittedAt: Date;
        exerciseId: string;
        fileName: string;
        fileUrl: string;
        note: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
}
