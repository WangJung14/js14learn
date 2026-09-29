import { ExerciseDifficulty } from '@prisma/client';
export declare class CreateExerciseDto {
    studyDayId: string;
    title: string;
    description: string;
    difficulty: ExerciseDifficulty;
    order: number;
}
