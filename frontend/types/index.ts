export type Role = 'STUDENT' | 'ADMIN';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export type ExerciseDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ActivityType =
  | 'COMPLETED_DAY'
  | 'SUBMITTED_EXERCISE'
  | 'JOINED_GROUP'
  | 'UPLOADED_PROJECT';

export type ChecklistItemType =
  | 'LESSON'
  | 'EXERCISE'
  | 'CHECKPOINT'
  | 'PROJECT'
  | 'CUSTOM';

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
  description?: string | null;
  inviteCode: string;
  creatorId?: string | null;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
  memberCount?: number;
  messageCount?: number;
  isMember?: boolean;
  isOwner?: boolean;
  createdAt: string;
  updatedAt?: string;
  members?: GroupMemberProgress[];
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  joinedAt: string;
  lastReadAt?: string | null;
  user?: User;
  group?: Group;
}

export interface GroupMemberProgress {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  joinedAt: string;
  isOwner?: boolean;
  completedDays?: number;
  totalDays?: number;
  percentage?: number;
  currentDayNumber?: number;
  completedExercises?: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  clientMessageId?: string;
}

export interface GroupMessagesResponse {
  messages: GroupMessage[];
  hasMore: boolean;
  nextCursor?: string | null;
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

export interface CodingTestCase {
  id: string;
  name: string;
  args?: unknown[];
  expected?: unknown;
  expectedOutput?: string;
  hidden?: boolean;
}

export interface CodingExerciseConfig {
  language: 'javascript';
  mode?: 'console' | 'function';
  functionName?: string;
  starterCode?: string;
  tests: CodingTestCase[];
}

export interface Exercise {
  id: string;
  studyDayId: string;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  order: number;
  isCoding?: boolean;
  starterCode?: string | null;
  codingConfig?: CodingExerciseConfig | unknown;
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
  submissionType?: 'FILE' | 'CODE';
  code?: string | null;
  executionResult?: unknown;
  fileName?: string | null;
  fileUrl?: string | null;
  signedUrl?: string;
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

export interface ChecklistItem {
  id: string;
  studyDayId: string;
  title: string;
  description?: string | null;
  type: ChecklistItemType;
  order: number;
  isRequired: boolean;
  exerciseId?: string | null;
  exercise?: {
    id: string;
    title: string;
    difficulty: ExerciseDifficulty;
  } | null;
  isCompleted: boolean;
  completedAt?: string | null;
  isAutoManaged?: boolean;
}

export interface ChecklistSummary {
  totalItems: number;
  completedItems: number;
  requiredItems: number;
  completedRequiredItems: number;
  percentage: number;
}

export interface StudyDayChecklistData {
  studyDay?: {
    id: string;
    dayNumber: number;
    title: string;
    description?: string;
  };
  summary: ChecklistSummary;
  items: ChecklistItem[];
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkedInAt: string;
  checkedOutAt?: string | null;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodayAttendanceData {
  isCheckedIn: boolean;
  date: string;
  attendance: Attendance | null;
}

export interface AttendanceStatsData {
  today: TodayAttendanceData;
  statistics: {
    currentStreak: number;
    longestStreak: number;
    totalAttendanceDays: number;
    totalStudyMinutes: number;
    averageStudyMinutes: number;
  };
  recentRecords: Attendance[];
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
  todayChecklist?: StudyDayChecklistData;
  todayAttendance?: TodayAttendanceData;
  attendanceStats?: {
    currentStreak: number;
    longestStreak: number;
    totalAttendanceDays: number;
    totalStudyMinutes: number;
    averageStudyMinutes: number;
  };
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
