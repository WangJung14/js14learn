import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateCodeSubmissionDto } from './dto/create-code-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import {
  SubmissionStatus,
  ProgressStatus,
  ActivityType,
  Role,
} from '@prisma/client';
import { ChecklistsService } from '../checklists/checklists.service';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  '.js': [
    'application/javascript',
    'text/javascript',
    'application/x-javascript',
    'text/plain',
  ],
  '.ts': [
    'video/mp2t',
    'text/typescript',
    'application/typescript',
    'text/plain',
    'application/octet-stream',
  ],
  '.zip': [
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
  ],
  '.pdf': ['application/pdf'],
  '.png': ['image/png'],
};

export class MulterFile {
  fieldname!: string;
  originalname!: string;
  encoding!: string;
  mimetype!: string;
  size!: number;
  buffer!: Buffer;
}

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private checklistsService: ChecklistsService,
  ) {}

  private validateUploadedFile(file: MulterFile): void {
    if (!file || !file.buffer) {
      throw new BadRequestException('A valid solution file must be uploaded');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 10 MB`,
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const validMimes = ALLOWED_MIME_TYPES[ext];

    if (!ext || !validMimes) {
      throw new BadRequestException(
        `Invalid file extension "${ext}". Allowed extensions: .js, .ts, .zip, .pdf, .png`,
      );
    }

    // Check MIME type against allowed list for this extension
    const isMimeValid = validMimes.includes(file.mimetype);
    if (!isMimeValid) {
      this.logger.warn(
        `MIME type mismatch for file ${file.originalname}: received "${file.mimetype}" for ext "${ext}"`,
      );
      // Allow octet-stream/text-plain fallbacks if extension is explicitly valid
      if (!['application/octet-stream', 'text/plain'].includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file MIME type "${file.mimetype}" for extension "${ext}"`,
        );
      }
    }
  }

  private sanitizeFilename(originalname: string): string {
    const parsed = path.parse(originalname);
    const safeName = parsed.name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const safeExt = parsed.ext.toLowerCase();
    return `${safeName}${safeExt}`;
  }

  private async attachSignedUrl<
    T extends { fileUrl?: string | null; signedUrl?: string },
  >(submission: T): Promise<T & { signedUrl: string }> {
    if (!submission.fileUrl) {
      return { ...submission, signedUrl: '' };
    }

    // Backward compatibility: If fileUrl is an existing external URL (e.g. seed data or legacy link), return as-is
    if (
      submission.fileUrl.startsWith('http://') ||
      submission.fileUrl.startsWith('https://')
    ) {
      return { ...submission, signedUrl: submission.fileUrl };
    }

    try {
      const signedUrl = await this.storageService.createSignedUrl(
        submission.fileUrl,
        3600,
      );
      return { ...submission, signedUrl };
    } catch (err: unknown) {
      this.logger.error(
        `Failed to generate signed URL for object path "${submission.fileUrl}": ${(err as Error).message}`,
      );
      return { ...submission, signedUrl: submission.fileUrl };
    }
  }

  async submit(userId: string, file: MulterFile, dto: CreateSubmissionDto) {
    this.validateUploadedFile(file);

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

    const submissionId = crypto.randomUUID();
    const safeFileName = this.sanitizeFilename(file.originalname);
    const objectPath = `${userId}/${submissionId}/${safeFileName}`;

    // Step 1: Upload file buffer to Supabase Storage
    await this.storageService.uploadFile(
      objectPath,
      file.buffer,
      file.mimetype,
    );

    // Step 2: Database transaction with cleanup on failure
    try {
      const submission = await this.prisma.$transaction(async (tx) => {
        const sub = await tx.submission.create({
          data: {
            id: submissionId,
            exerciseId: dto.exerciseId,
            userId,
            fileName: file.originalname.trim(),
            fileUrl: objectPath, // Store Supabase object path
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

      return this.attachSignedUrl(submission);
    } catch (err) {
      this.logger.error(
        `Database transaction failed after storage upload. Cleaning up object "${objectPath}"...`,
      );
      // Cleanup orphan storage object if DB record creation failed
      await this.storageService
        .deleteFile(objectPath)
        .catch((delErr: unknown) => {
          this.logger.error(
            `Failed to cleanup orphan object "${objectPath}": ${(delErr as Error).message}`,
          );
        });
      throw err;
    }
  }

  async findMySubmissions(userId: string) {
    const submissions = await this.prisma.submission.findMany({
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

    return Promise.all(submissions.map((sub) => this.attachSignedUrl(sub)));
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

    return this.attachSignedUrl(submission);
  }

  async findAllForAdmin(status?: SubmissionStatus) {
    const submissions = await this.prisma.submission.findMany({
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

    return Promise.all(submissions.map((sub) => this.attachSignedUrl(sub)));
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

    if (dto.status === SubmissionStatus.APPROVED) {
      await this.checklistsService.autoCompleteLinkedExerciseItem(
        submission.userId,
        submission.exerciseId,
      );
    }

    return this.attachSignedUrl(updatedSubmission);
  }

  async submitCode(userId: string, dto: CreateCodeSubmissionDto) {
    if (!dto.code || dto.code.length > 20480) {
      throw new BadRequestException(
        'Code size exceeds maximum allowed limit of 20 KB',
      );
    }

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

    const isAllPassed =
      Boolean(dto.executionSummary) &&
      dto.executionSummary.total > 0 &&
      dto.executionSummary.passed === dto.executionSummary.total;

    const submissionStatus = isAllPassed
      ? SubmissionStatus.APPROVED
      : SubmissionStatus.REJECTED;

    const submission = await this.prisma.$transaction(async (tx) => {
      const sub = await tx.submission.create({
        data: {
          exerciseId: dto.exerciseId,
          userId,
          submissionType: 'CODE',
          code: dto.code,
          executionResult: JSON.parse(JSON.stringify(dto.executionSummary)),
          fileName: 'solution.js',
          fileUrl: null,
          note: dto.note ? dto.note.trim() : null,
          status: submissionStatus,
          reviewedAt: isAllPassed ? new Date() : null,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          exercise: {
            select: { id: true, title: true, studyDayId: true },
          },
        },
      });

      if (isAllPassed) {
        // Check if all exercises in this StudyDay have at least one APPROVED submission by this user
        const allExercisesInDay = await tx.exercise.findMany({
          where: { studyDayId: exercise.studyDayId },
          select: { id: true },
        });

        const exerciseIdsInDay = allExercisesInDay.map((e) => e.id);

        const approvedSubmissions = await tx.submission.findMany({
          where: {
            userId,
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
          await tx.progress.upsert({
            where: {
              userId_studyDayId: {
                userId,
                studyDayId: exercise.studyDayId,
              },
            },
            update: {
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
            create: {
              userId,
              studyDayId: exercise.studyDayId,
              status: ProgressStatus.COMPLETED,
              completedAt: new Date(),
            },
          });

          await tx.activity.create({
            data: {
              userId,
              type: ActivityType.COMPLETED_DAY,
              message: `${user?.name || 'Student'} completed Day ${exercise.studyDay.dayNumber}: ${exercise.studyDay.title}`,
            },
          });
        } else {
          await tx.progress.upsert({
            where: {
              userId_studyDayId: {
                userId,
                studyDayId: exercise.studyDayId,
              },
            },
            update: {},
            create: {
              userId,
              studyDayId: exercise.studyDayId,
              status: ProgressStatus.IN_PROGRESS,
            },
          });
        }

        await tx.activity.create({
          data: {
            userId,
            type: ActivityType.SUBMITTED_EXERCISE,
            message: `${user?.name || 'Student'} completed coding exercise "${exercise.title}"`,
          },
        });
      }

      return sub;
    });

    if (isAllPassed) {
      await this.checklistsService.autoCompleteLinkedExerciseItem(
        userId,
        dto.exerciseId,
      );
    }

    return this.attachSignedUrl(submission);
  }
}
