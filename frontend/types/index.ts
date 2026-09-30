export type Role = 'STUDENT' | 'ADMIN';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export type ExerciseDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ActivityType =
  | 'COMPLETED_DAY'
  | 'SUBMITTED_EXERCISE'
  | 'JOINED_GROUP'
  | 'UPLOADED_PROJECT';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
  groupMembers?: GroupMember[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
  members?: GroupMemberProgress[];
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  joinedAt: string;
  user?: User;
  group?: Group;
}

export interface GroupMemberProgress {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  joinedAt: string;
  completedDays: number;
  totalDays: number;
  percentage: number;
  currentDayNumber: number;
  completedExercises: number;
}

export interface StudyDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  exerciseCount?: number;
  progressStatus?: ProgressStatus;
  completedAt?: string | null;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  studyDayId: string;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  order: number;
  createdAt: string;
  updatedAt: string;
  studyDay?: {
    id: string;
    dayNumber: number;
    title: string;
  };
  latestSubmission?: Submission | null;
  submissionStatus?: SubmissionStatus | null;
}

export interface Submission {
  id: string;
  exerciseId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  note?: string | null;
  adminNote?: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  exercise?: {
    id: string;
    title: string;
    difficulty?: ExerciseDifficulty;
    studyDayId?: string;
    studyDay?: {
      id: string;
      dayNumber: number;
      title: string;
    };
  };
}

export interface ProgressSummary {
  totalDays: number;
  completedDays: number;
  inProgressDays: number;
  percentage: number;
  currentDay?: {
    id: string;
    dayNumber: number;
    title: string;
    description: string;
  } | null;
  daysProgress?: DayProgressItem[];
}

export interface DayProgressItem {
  studyDayId: string;
  dayNumber: number;
  title: string;
  status: ProgressStatus;
  exerciseCount: number;
  completedAt?: string | null;
}

export interface ExerciseProgressItem {
  exerciseId: string;
  title: string;
  difficulty: ExerciseDifficulty;
  order: number;
  status: SubmissionStatus | 'UNSUBMITTED';
  submissionId?: string | null;
}

export interface DayProgressDetail {
  studyDayId: string;
  dayNumber: number;
  title: string;
  status: ProgressStatus;
  exercisesProgress: ExerciseProgressItem[];
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  message: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface DashboardData {
  user: User;
  progress: {
    percentage: number;
    completedDays: number;
    totalDays: number;
    completedExercises: number;
    totalExercises: number;
  };
  currentDay?: {
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    exerciseCount: number;
  } | null;
  statistics: {
    completedDays: number;
    totalDays: number;
    completedExercises: number;
    totalExercises: number;
    totalSubmissions: number;
    pendingSubmissions: number;
    rejectedSubmissions: number;
    streakDays: number;
  };
  recentActivity: Activity[];
}
