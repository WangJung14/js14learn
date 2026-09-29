import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import {
  SubmissionStatus,
  ProgressStatus,
  ActivityType,
  Role,
} from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: string, dto: CreateSubmissionDto) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: dto.exerciseId },
      include: { studyDay: true },
    });

    if (!exercise) {
      throw new NotFoundException(
        `Exercise with ID ${dto.exerciseId} not found`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const submission = await this.prisma.$transaction(async (tx) => {
      const sub = await tx.submission.create({
        data: {
          exerciseId: dto.exerciseId,
          userId,
          fileName: dto.fileName.trim(),
          fileUrl: dto.fileUrl.trim(),
          note: dto.note ? dto.note.trim() : null,
          status: SubmissionStatus.PENDING,
        },
        include: {
          exercise: {
            select: { id: true, title: true, studyDayId: true },
          },
        },
      });

      // Ensure student progress for this study day is at least IN_PROGRESS
      await tx.progress.upsert({
        where: {
          userId_studyDayId: {
            userId,
            studyDayId: exercise.studyDayId,
          },
        },
        update: {
          status: ProgressStatus.COMPLETED
            ? undefined
            : ProgressStatus.IN_PROGRESS,
        },
        create: {
          userId,
          studyDayId: exercise.studyDayId,
          status: ProgressStatus.IN_PROGRESS,
        },
      });

      // Log activity
      await tx.activity.create({
        data: {
          userId,
          type: ActivityType.SUBMITTED_EXERCISE,
          message: `${user?.name || 'Student'} submitted solution for "${exercise.title}"`,
        },
      });

      return sub;
    });

    return submission;
  }

  async findMySubmissions(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
      include: {
        exercise: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            studyDay: {
              select: { id: true, dayNumber: true, title: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string, role: Role) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        exercise: {
          include: {
            studyDay: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    if (role !== Role.ADMIN && submission.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this submission',
      );
    }

    return submission;
  }

  async findAllForAdmin(status?: SubmissionStatus) {
    return this.prisma.submission.findMany({
      where: {
        ...(status && { status }),
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        exercise: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            studyDay: {
              select: { id: true, dayNumber: true, title: true },
            },
          },
        },
      },
    });
  }

  async reviewSubmission(id: string, dto: ReviewSubmissionDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        exercise: true,
        user: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    if (
      dto.status !== SubmissionStatus.APPROVED &&
      dto.status !== SubmissionStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Review status must be APPROVED or REJECTED',
      );
    }

    const updatedSubmission = await this.prisma.$transaction(async (tx) => {
      const reviewed = await tx.submission.update({
        where: { id },
        data: {
          status: dto.status,
          adminNote: dto.adminNote ? dto.adminNote.trim() : null,
          reviewedAt: new Date(),
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          exercise: { select: { id: true, title: true, studyDayId: true } },
        },
      });

      if (dto.status === SubmissionStatus.APPROVED) {
        // Check if all exercises in this StudyDay have at least one APPROVED submission by this user
        const allExercisesInDay = await tx.exercise.findMany({
          where: { studyDayId: submission.exercise.studyDayId },
          select: { id: true },
        });

        const exerciseIdsInDay = allExercisesInDay.map((e) => e.id);

        const approvedSubmissions = await tx.submission.findMany({
          where: {
            userId: submission.userId,
            exerciseId: { in: exerciseIdsInDay },
            status: SubmissionStatus.APPROVED,
          },
          select: { exerciseId: true },
        });

        const approvedExerciseIds = new Set(
          approvedSubmissions.map((s) => s.exerciseId),
        );
        const isDayFullyCompleted = exerciseIdsInDay.every((exId) =>
          approvedExerciseIds.has(exId),
        );

        if (isDayFullyCompleted) {
          const studyDay = await tx.studyDay.findUnique({
            where: { id: submission.exercise.studyDayId },
          });

          await tx.progress.upsert({
            where: {
              userId_studyDayId: {
                userId: submission.userId,
                studyDayId: submission.exercise.studyDayId,
              },
            },
            update: {
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
            create: {
              userId: submission.userId,
              studyDayId: submission.exercise.studyDayId,
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
          });

          await tx.activity.create({
            data: {
              userId: submission.userId,
              type: ActivityType.COMPLETED_DAY,
              message: `${submission.user.name} completed Day ${studyDay?.dayNumber}: ${studyDay?.title}`,
            },
          });
        }
      }

      return reviewed;
    });

    return updatedSubmission;
  }
}
