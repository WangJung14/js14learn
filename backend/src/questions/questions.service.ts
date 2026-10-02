import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { AssessmentType, QuestionStatus, Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(private prisma: PrismaService) {}

  public validateQuestionConfig(type: AssessmentType, config: any): void {
    if (!config || typeof config !== 'object') {
      throw new BadRequestException(
        'Question configuration object is required',
      );
    }

    if (type === AssessmentType.CODE_OUTPUT) {
      if (!config.codeSnippet || typeof config.codeSnippet !== 'string') {
        throw new BadRequestException(
          'codeSnippet is required for CODE_OUTPUT question',
        );
      }
      if (
        config.expectedOutput === undefined ||
        config.expectedOutput === null
      ) {
        throw new BadRequestException(
          'expectedOutput is required for CODE_OUTPUT question',
        );
      }
      if (
        config.normalizationMode &&
        !['NORMALIZED', 'STRICT'].includes(config.normalizationMode)
      ) {
        throw new BadRequestException(
          'normalizationMode must be NORMALIZED or STRICT',
        );
      }
    } else if (type === AssessmentType.MULTIPLE_CHOICE) {
      const choices = Array.isArray(config.choices)
        ? config.choices
        : Array.isArray(config.options)
          ? config.options
          : [];
      if (choices.length < 2) {
        throw new BadRequestException(
          'MULTIPLE_CHOICE question requires at least 2 choices/options',
        );
      }
      for (const choice of choices) {
        if (!choice.id || !choice.text) {
          throw new BadRequestException('Each choice must have an id and text');
        }
      }
      if (!config.correctOptionId) {
        throw new BadRequestException(
          'correctOptionId is required for MULTIPLE_CHOICE question',
        );
      }
      const hasCorrect = choices.some(
        (c: any) => c.id === config.correctOptionId,
      );
      if (!hasCorrect) {
        throw new BadRequestException(
          'correctOptionId does not match any provided choice id',
        );
      }
    } else if (type === AssessmentType.ESSAY) {
      const gradingMode = config.gradingMode || 'EXACT';
      if (
        !['EXACT', 'KEYWORDS', 'KEYWORD_BASED', 'MANUAL'].includes(gradingMode)
      ) {
        throw new BadRequestException(
          'gradingMode must be EXACT, KEYWORDS (or KEYWORD_BASED), or MANUAL',
        );
      }
      if (gradingMode === 'EXACT' && !config.expectedAnswer) {
        throw new BadRequestException(
          'expectedAnswer is required for EXACT essay grading',
        );
      }
      if (gradingMode === 'KEYWORDS' || gradingMode === 'KEYWORD_BASED') {
        const keywords = Array.isArray(config.requiredKeywords)
          ? config.requiredKeywords
          : Array.isArray(config.keywords)
            ? config.keywords
            : [];
        if (keywords.length === 0) {
          throw new BadRequestException(
            'At least one keyword is required for KEYWORDS essay grading',
          );
        }
      }
    }
  }

  async create(dto: CreateQuestionDto, userId?: string) {
    this.validateQuestionConfig(dto.type, dto.config);

    return this.prisma.question.create({
      data: {
        type: dto.type,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        difficulty: dto.difficulty || 'EASY',
        status: dto.status || QuestionStatus.DRAFT,
        explanation: dto.explanation?.trim() || null,
        defaultPoints: dto.defaultPoints !== undefined ? dto.defaultPoints : 10,
        config: dto.config,
        createdById: userId || null,
      },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryQuestionsDto) {
    const where: Prisma.QuestionWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { explanation: { contains: term, mode: 'insensitive' } },
      ];
    }

    const questions = await this.prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
        exerciseQuestions: {
          include: {
            exercise: {
              select: {
                id: true,
                title: true,
                studyDayId: true,
              },
            },
          },
        },
      },
    });

    return questions;
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
        exerciseQuestions: {
          include: {
            exercise: {
              select: {
                id: true,
                title: true,
                studyDayId: true,
                studyDay: {
                  select: { id: true, dayNumber: true, title: true },
                },
              },
            },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const existing = await this.findOne(id);

    const updatedType = dto.type || existing.type;
    const updatedConfig =
      dto.config !== undefined ? dto.config : existing.config;

    if (dto.config !== undefined || dto.type !== undefined) {
      this.validateQuestionConfig(updatedType, updatedConfig);
    }

    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.description !== undefined && {
          description: dto.description?.trim() || null,
        }),
        ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.explanation !== undefined && {
          explanation: dto.explanation?.trim() || null,
        }),
        ...(dto.defaultPoints !== undefined && {
          defaultPoints: dto.defaultPoints,
        }),
        ...(dto.config !== undefined && { config: dto.config }),
      },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
        exerciseQuestions: {
          include: {
            exercise: {
              select: {
                id: true,
                title: true,
                studyDayId: true,
              },
            },
          },
        },
      },
    });

    return updated;
  }

  async duplicate(id: string, userId?: string) {
    const original = await this.findOne(id);

    const duplicateTitle = `${original.title} (Copy)`;

    return this.prisma.question.create({
      data: {
        type: original.type,
        title: duplicateTitle,
        description: original.description,
        difficulty: original.difficulty,
        status: QuestionStatus.DRAFT,
        explanation: original.explanation,
        defaultPoints: original.defaultPoints,
        config: original.config as any,
        createdById: userId || original.createdById,
      },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
      },
    });
  }

  async archive(id: string) {
    await this.findOne(id);

    return this.prisma.question.update({
      where: { id },
      data: { status: QuestionStatus.ARCHIVED },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
      },
    });
  }

  async publish(id: string) {
    await this.findOne(id);

    return this.prisma.question.update({
      where: { id },
      data: { status: QuestionStatus.PUBLISHED },
      include: {
        _count: {
          select: {
            exerciseQuestions: true,
            assessmentAnswers: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const question = await this.findOne(id);

    if (
      question._count.exerciseQuestions > 0 ||
      question._count.assessmentAnswers > 0
    ) {
      throw new BadRequestException(
        `Cannot delete question because it is used in ${question._count.exerciseQuestions} exercise(s) and has ${question._count.assessmentAnswers} attempt answer(s). Archive the question instead.`,
      );
    }

    return this.prisma.question.delete({
      where: { id },
    });
  }
}
