-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "codingConfig" JSONB,
ADD COLUMN     "isCoding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "starterCode" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "code" TEXT,
ADD COLUMN     "executionResult" JSONB,
ADD COLUMN     "submissionType" TEXT NOT NULL DEFAULT 'FILE',
ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;
