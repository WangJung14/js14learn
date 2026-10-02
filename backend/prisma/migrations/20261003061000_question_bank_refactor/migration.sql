-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN IF NOT EXISTS "passingScore" DOUBLE PRECISION DEFAULT 70,
ADD COLUMN IF NOT EXISTS "maxAttempts" INTEGER;

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "ExerciseDifficulty" NOT NULL DEFAULT 'EASY',
    "status" "QuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "explanation" TEXT,
    "defaultPoints" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "config" JSONB NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseQuestion" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "points" DOUBLE PRECISION,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "studentAnswer" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "status" "AttemptStatus" NOT NULL DEFAULT 'SUBMITTED',
    "feedback" TEXT,
    "adminFeedback" TEXT,
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_type_idx" ON "Question"("type");
CREATE INDEX "Question_status_idx" ON "Question"("status");
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");
CREATE INDEX "Question_createdById_idx" ON "Question"("createdById");

-- CreateIndex
CREATE INDEX "ExerciseQuestion_exerciseId_idx" ON "ExerciseQuestion"("exerciseId");
CREATE INDEX "ExerciseQuestion_questionId_idx" ON "ExerciseQuestion"("questionId");
CREATE INDEX "ExerciseQuestion_exerciseId_order_idx" ON "ExerciseQuestion"("exerciseId", "order");
CREATE UNIQUE INDEX "ExerciseQuestion_exerciseId_questionId_key" ON "ExerciseQuestion"("exerciseId", "questionId");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_attemptId_idx" ON "AssessmentAnswer"("attemptId");
CREATE INDEX "AssessmentAnswer_questionId_idx" ON "AssessmentAnswer"("questionId");
CREATE UNIQUE INDEX "AssessmentAnswer_attemptId_questionId_key" ON "AssessmentAnswer"("attemptId", "questionId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseQuestion" ADD CONSTRAINT "ExerciseQuestion_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseQuestion" ADD CONSTRAINT "ExerciseQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Data Migration: Migrate existing assessment exercises into Questions and ExerciseQuestions
DO $$
DECLARE
    r RECORD;
    new_q_id TEXT;
    q_points DOUBLE PRECISION;
    q_explanation TEXT;
BEGIN
    FOR r IN SELECT * FROM "Exercise" WHERE "assessmentType" != 'NONE' AND "assessmentConfig" IS NOT NULL LOOP
        new_q_id := 'q_' || md5(r."id" || '_' || r."createdAt");
        
        -- Extract points and explanation safely if available in JSON
        BEGIN
            q_points := COALESCE((r."assessmentConfig"->>'points')::double precision, 10);
        EXCEPTION WHEN OTHERS THEN
            q_points := 10;
        END;
        
        q_explanation := r."assessmentConfig"->>'explanation';

        -- Insert canonical question if not exists
        IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "id" = new_q_id) THEN
            INSERT INTO "Question" (
                "id",
                "type",
                "title",
                "description",
                "difficulty",
                "status",
                "explanation",
                "defaultPoints",
                "config",
                "createdAt",
                "updatedAt"
            ) VALUES (
                new_q_id,
                r."assessmentType",
                r."title",
                r."description",
                r."difficulty",
                'PUBLISHED',
                q_explanation,
                q_points,
                r."assessmentConfig",
                r."createdAt",
                r."updatedAt"
            );
        END IF;

        -- Insert ExerciseQuestion link if not exists
        IF NOT EXISTS (SELECT 1 FROM "ExerciseQuestion" WHERE "exerciseId" = r."id" AND "questionId" = new_q_id) THEN
            INSERT INTO "ExerciseQuestion" (
                "id",
                "exerciseId",
                "questionId",
                "order",
                "points",
                "isRequired",
                "createdAt",
                "updatedAt"
            ) VALUES (
                'eq_' || md5(r."id" || '_' || new_q_id),
                r."id",
                new_q_id,
                1,
                q_points,
                true,
                r."createdAt",
                r."updatedAt"
            );
        END IF;

        -- Migrate existing AssessmentAttempts for this exercise into AssessmentAnswers
        INSERT INTO "AssessmentAnswer" (
            "id",
            "attemptId",
            "questionId",
            "studentAnswer",
            "score",
            "maxScore",
            "percentage",
            "isCorrect",
            "status",
            "feedback",
            "adminFeedback",
            "gradedAt",
            "createdAt",
            "updatedAt"
        )
        SELECT
            'ans_' || md5(a."id" || '_' || new_q_id),
            a."id",
            new_q_id,
            a."studentAnswer",
            a."score",
            a."totalPoints",
            a."percentage",
            a."isPassed",
            a."status",
            a."feedback",
            a."adminFeedback",
            a."gradedAt",
            a."createdAt",
            a."updatedAt"
        FROM "AssessmentAttempt" a
        WHERE a."exerciseId" = r."id"
        ON CONFLICT ("attemptId", "questionId") DO NOTHING;

    END LOOP;
END $$;
