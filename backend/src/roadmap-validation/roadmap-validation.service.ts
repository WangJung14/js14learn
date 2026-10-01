import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoadmapStatus } from '@prisma/client';
import {
  RoadmapValidationResult,
  ValidationIssue,
} from './types/roadmap-validation.types';

@Injectable()
export class RoadmapValidationService {
  constructor(private prisma: PrismaService) {}

  async getStatus() {
    let setting = await this.prisma.roadmapSetting.findUnique({
      where: { id: 'global' },
    });

    if (!setting) {
      setting = await this.prisma.roadmapSetting.create({
        data: {
          id: 'global',
          status: RoadmapStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });
    }

    return {
      status: setting.status,
      publishedAt: setting.publishedAt,
      updatedAt: setting.updatedAt,
    };
  }

  async validateRoadmap(): Promise<RoadmapValidationResult> {
    const studyDays = await this.prisma.studyDay.findMany({
      orderBy: { order: 'asc' },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
        checklistItems: {
          orderBy: { order: 'asc' },
        },
      },
    });

    const issues: ValidationIssue[] = [];

    let totalExercises = 0;
    let totalChecklistItems = 0;
    let totalCodingExercises = 0;

    if (studyDays.length === 0) {
      issues.push({
        severity: 'ERROR',
        code: 'ROADMAP_EMPTY',
        message: 'Roadmap contains no Study Days.',
      });
    }

    const seenDayNumbers = new Map<number, string>();
    const seenDayOrders = new Map<number, string>();

    const allExercises = studyDays.flatMap((d) => d.exercises);
    const exerciseMap = new Map(allExercises.map((ex) => [ex.id, ex]));

    for (const day of studyDays) {
      // 1. Study Day Validation
      if (!day.title || !day.title.trim()) {
        issues.push({
          severity: 'ERROR',
          code: 'STUDY_DAY_TITLE_MISSING',
          message: `Study Day with ID ${day.id} is missing a title.`,
          studyDayId: day.id,
          studyDayNumber: day.dayNumber,
        });
      }

      if (seenDayNumbers.has(day.dayNumber)) {
        issues.push({
          severity: 'ERROR',
          code: 'STUDY_DAY_DUPLICATE_DAY_NUMBER',
          message: `Duplicate dayNumber ${day.dayNumber} found on Study Day "${day.title}".`,
          studyDayId: day.id,
          studyDayNumber: day.dayNumber,
        });
      } else {
        seenDayNumbers.set(day.dayNumber, day.id);
      }

      if (seenDayOrders.has(day.order)) {
        issues.push({
          severity: 'ERROR',
          code: 'STUDY_DAY_DUPLICATE_ORDER',
          message: `Duplicate order #${day.order} found on Study Day "${day.title}".`,
          studyDayId: day.id,
          studyDayNumber: day.dayNumber,
        });
      } else {
        seenDayOrders.set(day.order, day.id);
      }

      if (!day.description || !day.description.trim()) {
        issues.push({
          severity: 'WARNING',
          code: 'STUDY_DAY_NO_DESCRIPTION',
          message: `Study Day ${day.dayNumber} ("${day.title}") has no description.`,
          studyDayId: day.id,
          studyDayNumber: day.dayNumber,
        });
      }

      if (day.exercises.length === 0) {
        issues.push({
          severity: 'WARNING',
          code: 'STUDY_DAY_NO_EXERCISES',
          message: `Study Day ${day.dayNumber} ("${day.title}") has no exercises assigned.`,
          studyDayId: day.id,
          studyDayNumber: day.dayNumber,
        });
      }

      if (day.checklistItems.length === 0) {
        issues.push({
          severity: 'WARNING',
          code: 'STUDY_DAY_NO_CHECKLIST',
          message: `Study Day ${day.dayNumber} ("${day.title}") has no checklist items configured.`,
          studyDayId: day.id,
          studyDayNumber: day.dayNumber,
        });
      }

      issues.push({
        severity: 'INFO',
        code: 'STUDY_DAY_INFO',
        message: `Study Day ${day.dayNumber} ("${day.title}") contains ${day.exercises.length} exercises and ${day.checklistItems.length} checklist items.`,
        studyDayId: day.id,
        studyDayNumber: day.dayNumber,
      });

      // 2. Exercises Validation
      const seenExOrders = new Set<number>();
      totalExercises += day.exercises.length;

      for (const ex of day.exercises) {
        if (ex.isCoding) {
          totalCodingExercises++;
        }

        if (!ex.title || !ex.title.trim()) {
          issues.push({
            severity: 'ERROR',
            code: 'EXERCISE_TITLE_MISSING',
            message: `Exercise ID ${ex.id} in Study Day ${day.dayNumber} is missing a title.`,
            studyDayId: day.id,
            studyDayNumber: day.dayNumber,
            exerciseId: ex.id,
          });
        }

        if (seenExOrders.has(ex.order)) {
          issues.push({
            severity: 'ERROR',
            code: 'EXERCISE_DUPLICATE_ORDER',
            message: `Duplicate exercise order #${ex.order} ("${ex.title}") in Study Day ${day.dayNumber}.`,
            studyDayId: day.id,
            studyDayNumber: day.dayNumber,
            exerciseId: ex.id,
          });
        } else {
          seenExOrders.add(ex.order);
        }

        if (!ex.description || !ex.description.trim()) {
          issues.push({
            severity: 'WARNING',
            code: 'EXERCISE_NO_DESCRIPTION',
            message: `Exercise "${ex.title}" in Study Day ${day.dayNumber} has no description.`,
            studyDayId: day.id,
            studyDayNumber: day.dayNumber,
            exerciseId: ex.id,
          });
        }

        if (ex.isCoding) {
          if (!ex.starterCode || !ex.starterCode.trim()) {
            issues.push({
              severity: 'WARNING',
              code: 'CODING_STARTER_CODE_MISSING',
              message: `Coding exercise "${ex.title}" in Study Day ${day.dayNumber} has no starter code template.`,
              studyDayId: day.id,
              studyDayNumber: day.dayNumber,
              exerciseId: ex.id,
            });
          }

          if (!ex.codingConfig || typeof ex.codingConfig !== 'object') {
            issues.push({
              severity: 'ERROR',
              code: 'CODING_CONFIG_INVALID',
              message: `Coding exercise "${ex.title}" in Study Day ${day.dayNumber} is missing a valid codingConfig object.`,
              studyDayId: day.id,
              studyDayNumber: day.dayNumber,
              exerciseId: ex.id,
            });
          } else {
            const cfg = ex.codingConfig as {
              language?: string;
              mode?: string;
              functionName?: string;
              tests?: Array<{
                id?: string;
                name?: string;
                args?: unknown[];
                expected?: unknown;
                expectedOutput?: string;
              }>;
            };

            if (cfg.language !== 'javascript') {
              issues.push({
                severity: 'ERROR',
                code: 'CODING_LANGUAGE_INVALID',
                message: `Coding exercise "${ex.title}" specifies unsupported language "${cfg.language}". Only "javascript" is supported.`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                exerciseId: ex.id,
              });
            }

            if (cfg.mode && !['function', 'console'].includes(cfg.mode)) {
              issues.push({
                severity: 'ERROR',
                code: 'CODING_MODE_INVALID',
                message: `Coding exercise "${ex.title}" specifies invalid execution mode "${cfg.mode}".`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                exerciseId: ex.id,
              });
            }

            if (
              (cfg.mode === 'function' || !cfg.mode) &&
              (!cfg.functionName ||
                typeof cfg.functionName !== 'string' ||
                !cfg.functionName.trim())
            ) {
              issues.push({
                severity: 'ERROR',
                code: 'CODING_FUNCTION_NAME_MISSING',
                message: `Function-mode coding exercise "${ex.title}" requires functionName.`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                exerciseId: ex.id,
              });
            }

            if (!cfg.tests || !Array.isArray(cfg.tests)) {
              issues.push({
                severity: 'ERROR',
                code: 'CODING_TESTS_INVALID',
                message: `codingConfig.tests must be an array for exercise "${ex.title}".`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                exerciseId: ex.id,
              });
            } else if (cfg.tests.length === 0) {
              issues.push({
                severity: 'ERROR',
                code: 'CODING_NO_TESTS',
                message: `Coding exercise "${ex.title}" must have at least one test case.`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                exerciseId: ex.id,
              });
            } else {
              const seenTestIds = new Set<string>();
              for (const t of cfg.tests) {
                if (!t.id) {
                  issues.push({
                    severity: 'ERROR',
                    code: 'CODING_TEST_INVALID',
                    message: `A test case in coding exercise "${ex.title}" is missing an ID.`,
                    studyDayId: day.id,
                    studyDayNumber: day.dayNumber,
                    exerciseId: ex.id,
                  });
                } else if (seenTestIds.has(t.id)) {
                  issues.push({
                    severity: 'ERROR',
                    code: 'CODING_DUPLICATE_TEST_ID',
                    message: `Duplicate test case ID "${t.id}" in coding exercise "${ex.title}".`,
                    studyDayId: day.id,
                    studyDayNumber: day.dayNumber,
                    exerciseId: ex.id,
                  });
                } else {
                  seenTestIds.add(t.id);
                }

                if (!t.name || !t.name.trim()) {
                  issues.push({
                    severity: 'WARNING',
                    code: 'CODING_TEST_NAME_MISSING',
                    message: `Test case "${t.id || 'unnamed'}" in coding exercise "${ex.title}" has no descriptive name.`,
                    studyDayId: day.id,
                    studyDayNumber: day.dayNumber,
                    exerciseId: ex.id,
                  });
                }

                if (cfg.mode === 'console') {
                  if (
                    t.expectedOutput === undefined ||
                    t.expectedOutput === null
                  ) {
                    issues.push({
                      severity: 'ERROR',
                      code: 'CODING_CONSOLE_TEST_INVALID',
                      message: `Console-mode test "${t.name || t.id}" in "${ex.title}" requires expectedOutput.`,
                      studyDayId: day.id,
                      studyDayNumber: day.dayNumber,
                      exerciseId: ex.id,
                    });
                  }
                } else {
                  if (t.args !== undefined && !Array.isArray(t.args)) {
                    issues.push({
                      severity: 'ERROR',
                      code: 'CODING_FUNCTION_TEST_INVALID',
                      message: `Function-mode test "${t.name || t.id}" in "${ex.title}" args must be an array.`,
                      studyDayId: day.id,
                      studyDayNumber: day.dayNumber,
                      exerciseId: ex.id,
                    });
                  }
                  if (t.expected === undefined) {
                    issues.push({
                      severity: 'ERROR',
                      code: 'CODING_FUNCTION_TEST_INVALID',
                      message: `Function-mode test "${t.name || t.id}" in "${ex.title}" requires expected return value.`,
                      studyDayId: day.id,
                      studyDayNumber: day.dayNumber,
                      exerciseId: ex.id,
                    });
                  }
                }
              }
            }
          }
        } else {
          if (ex.codingConfig) {
            issues.push({
              severity: 'WARNING',
              code: 'STANDARD_EXERCISE_HAS_CODING_CONFIG',
              message: `Standard non-coding exercise "${ex.title}" contains unused codingConfig.`,
              studyDayId: day.id,
              studyDayNumber: day.dayNumber,
              exerciseId: ex.id,
            });
          }
        }
      }

      // 3. Checklist Items Validation
      const seenChkOrders = new Set<number>();
      totalChecklistItems += day.checklistItems.length;

      for (const item of day.checklistItems) {
        if (!item.title || !item.title.trim()) {
          issues.push({
            severity: 'ERROR',
            code: 'CHECKLIST_TITLE_MISSING',
            message: `Checklist item ID ${item.id} in Study Day ${day.dayNumber} is missing a title.`,
            studyDayId: day.id,
            studyDayNumber: day.dayNumber,
            checklistItemId: item.id,
          });
        }

        if (seenChkOrders.has(item.order)) {
          issues.push({
            severity: item.order === 0 ? 'WARNING' : 'ERROR',
            code: item.order === 0 ? 'CHECKLIST_DEFAULT_ORDER' : 'CHECKLIST_DUPLICATE_ORDER',
            message:
              item.order === 0
                ? `Checklist item "${item.title}" in Study Day ${day.dayNumber} uses default order #0.`
                : `Duplicate checklist item order #${item.order} ("${item.title}") in Study Day ${day.dayNumber}.`,
            studyDayId: day.id,
            studyDayNumber: day.dayNumber,
            checklistItemId: item.id,
          });
        } else {
          seenChkOrders.add(item.order);
        }

        if (item.type === 'EXERCISE') {
          if (!item.exerciseId) {
            issues.push({
              severity: 'ERROR',
              code: 'CHECKLIST_EXERCISE_MISSING',
              message: `EXERCISE checklist item "${item.title}" in Study Day ${day.dayNumber} requires exerciseId.`,
              studyDayId: day.id,
              studyDayNumber: day.dayNumber,
              checklistItemId: item.id,
            });
          } else {
            const targetEx = exerciseMap.get(item.exerciseId);
            if (!targetEx) {
              issues.push({
                severity: 'ERROR',
                code: 'CHECKLIST_EXERCISE_NOT_FOUND',
                message: `Checklist item "${item.title}" in Study Day ${day.dayNumber} references non-existent exercise ID "${item.exerciseId}".`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                checklistItemId: item.id,
                exerciseId: item.exerciseId,
              });
            } else if (targetEx.studyDayId !== day.id) {
              issues.push({
                severity: 'ERROR',
                code: 'CHECKLIST_EXERCISE_MISMATCH',
                message: `Checklist item "${item.title}" in Study Day ${day.dayNumber} references exercise "${targetEx.title}" which belongs to a different Study Day.`,
                studyDayId: day.id,
                studyDayNumber: day.dayNumber,
                checklistItemId: item.id,
                exerciseId: item.exerciseId,
              });
            }
          }
        } else {
          if (item.exerciseId) {
            issues.push({
              severity: 'WARNING',
              code: 'CHECKLIST_UNEXPECTED_EXERCISE_LINK',
              message: `Checklist item "${item.title}" of type ${item.type} in Study Day ${day.dayNumber} has unexpected exerciseId reference.`,
              studyDayId: day.id,
              studyDayNumber: day.dayNumber,
              checklistItemId: item.id,
              exerciseId: item.exerciseId,
            });
          }
        }
      }
    }

    const errors = issues.filter((i) => i.severity === 'ERROR').length;
    const warnings = issues.filter((i) => i.severity === 'WARNING').length;
    const infos = issues.filter((i) => i.severity === 'INFO').length;

    return {
      valid: errors === 0,
      summary: {
        errors,
        warnings,
        infos,
        studyDays: studyDays.length,
        exercises: totalExercises,
        checklistItems: totalChecklistItems,
        codingExercises: totalCodingExercises,
      },
      issues,
    };
  }

  async publishRoadmap() {
    const validationResult = await this.validateRoadmap();

    if (!validationResult.valid) {
      throw new BadRequestException({
        message: 'Cannot publish roadmap with blocking validation errors.',
        validationResult,
      });
    }

    const publishedAt = new Date();
    await this.prisma.roadmapSetting.upsert({
      where: { id: 'global' },
      create: {
        id: 'global',
        status: RoadmapStatus.PUBLISHED,
        publishedAt,
      },
      update: {
        status: RoadmapStatus.PUBLISHED,
        publishedAt,
      },
    });

    return {
      status: RoadmapStatus.PUBLISHED,
      publishedAt,
      validationResult,
    };
  }

  async unpublishRoadmap() {
    await this.prisma.roadmapSetting.upsert({
      where: { id: 'global' },
      create: {
        id: 'global',
        status: RoadmapStatus.DRAFT,
      },
      update: {
        status: RoadmapStatus.DRAFT,
      },
    });

    return {
      status: RoadmapStatus.DRAFT,
    };
  }
}
