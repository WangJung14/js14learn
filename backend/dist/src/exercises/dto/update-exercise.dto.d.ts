import { ExerciseDifficulty } from '@prisma/client';
export declare class UpdateExerciseDto {
    title?: string;
    description?: string;
    difficulty?: ExerciseDifficulty;
    order?: number;
}
