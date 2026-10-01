-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "RoadmapSetting" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "status" "RoadmapStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapSetting_pkey" PRIMARY KEY ("id")
);
