import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
    findOne(id: string, userId: string): Promise<{
        id: string;
        studyDayId: string;
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        studyDay: {
            id: string;
            dayNumber: number;
            title: string;
        };
        latestSubmission: {
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
        } | null;
        submissionStatus: import("@prisma/client").$Enums.SubmissionStatus | null;
    }>;
    findByStudyDay(studyDayId: string, userId: string): Promise<{
        id: string;
        studyDayId: string;
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        latestSubmission: {
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
        } | null;
        submissionStatus: import("@prisma/client").$Enums.SubmissionStatus | null;
    }[]>;
    create(dto: CreateExerciseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        studyDayId: string;
    }>;
    update(id: string, dto: UpdateExerciseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        studyDayId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        description: string;
        difficulty: import("@prisma/client").$Enums.ExerciseDifficulty;
        studyDayId: string;
    }>;
}
