-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('NONE', 'CODE_OUTPUT', 'ESSAY', 'MULTIPLE_CHOICE');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('SUBMITTED', 'GRADED', 'PENDING_REVIEW', 'PASSED', 'FAILED');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "assessmentType" "AssessmentType" NOT NULL DEFAULT 'NONE',
ADD COLUMN "assessmentConfig" JSONB;

-- CreateTable
CREATE TABLE "AssessmentAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'SUBMITTED',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPoints" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "studentAnswer" TEXT,
    "feedback" TEXT,
    "adminFeedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssessmentAttempt_userId_idx" ON "AssessmentAttempt"("userId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_exerciseId_idx" ON "AssessmentAttempt"("exerciseId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_userId_exerciseId_idx" ON "AssessmentAttempt"("userId", "exerciseId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_createdAt_idx" ON "AssessmentAttempt"("createdAt");

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
