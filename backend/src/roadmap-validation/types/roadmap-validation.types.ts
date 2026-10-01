export type ValidationSeverity = 'ERROR' | 'WARNING' | 'INFO';

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  studyDayId?: string;
  studyDayNumber?: number;
  exerciseId?: string;
  checklistItemId?: string;
}

export interface RoadmapValidationSummary {
  errors: number;
  warnings: number;
  infos: number;
  studyDays: number;
  exercises: number;
  checklistItems: number;
  codingExercises: number;
}

export interface RoadmapValidationResult {
  valid: boolean;
  summary: RoadmapValidationSummary;
  issues: ValidationIssue[];
}
