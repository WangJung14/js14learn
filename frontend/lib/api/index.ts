import { apiClient, setStoredTokens, clearStoredTokens } from './client';
import {
  User,
  AuthResponse,
  StudyDay,
  Exercise,
  Submission,
  ProgressSummary,
  DayProgressDetail,
  Group,
  GroupMessage,
  GroupMessagesResponse,
  Activity,
  DashboardData,
  SubmissionStatus,
  Role,
  StudyDayChecklistData,
  ChecklistItem,
  ChecklistItemType,
  TodayAttendanceData,
  Attendance,
  AttendanceStatsData,
} from '../../types';

export * from './client';

export const authApi = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredTokens(res.tokens.accessToken, res.tokens.refreshToken);
    return res;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredTokens(res.tokens.accessToken, res.tokens.refreshToken);
    return res;
  },

  async me(): Promise<User> {
    return apiClient<User>('/auth/me');
  },

  async logout(): Promise<{ message: string }> {
    try {
      const res = await apiClient<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
      return res;
    } finally {
      clearStoredTokens();
    }
  },
};

export const usersApi = {
  async getProfile(): Promise<User> {
    return apiClient<User>('/users/me');
  },

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<User> {
    return apiClient<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getAllUsers(): Promise<User[]> {
    return apiClient<User[]>('/users');
  },

  async getUserById(id: string): Promise<User> {
    return apiClient<User>(`/users/${id}`);
  },

  async updateUserRole(id: string, role: Role): Promise<User> {
    return apiClient<User>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};

export const studyDaysApi = {
  async getAll(): Promise<StudyDay[]> {
    return apiClient<StudyDay[]>('/study-days');
  },

  async getById(id: string): Promise<StudyDay> {
    return apiClient<StudyDay>(`/study-days/${id}`);
  },

  async create(data: {
    dayNumber: number;
    title: string;
    description: string;
    content: string;
    order: number;
  }): Promise<StudyDay> {
    return apiClient<StudyDay>('/study-days', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<{
      dayNumber: number;
      title: string;
      description: string;
      content: string;
      order: number;
    }>,
  ): Promise<StudyDay> {
    return apiClient<StudyDay>(`/study-days/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<StudyDay> {
    return apiClient<StudyDay>(`/study-days/${id}`, {
      method: 'DELETE',
    });
  },

  async reorder(
    items: Array<{ id: string; order: number }>,
  ): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/admin/study-days/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ items }),
    });
  },
};

export const exercisesApi = {
  async getById(id: string): Promise<Exercise> {
    return apiClient<Exercise>(`/exercises/${id}`);
  },

  async getByStudyDay(studyDayId: string): Promise<Exercise[]> {
    return apiClient<Exercise[]>(`/study-days/${studyDayId}/exercises`);
  },

  async create(data: {
    studyDayId: string;
    title: string;
    description: string;
    difficulty: string;
    order: number;
    isCoding?: boolean;
    starterCode?: string;
    codingConfig?: unknown;
  }): Promise<Exercise> {
    return apiClient<Exercise>('/exercises', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      difficulty: string;
      order: number;
      isCoding?: boolean;
      starterCode?: string;
      codingConfig?: unknown;
    }>,
  ): Promise<Exercise> {
    return apiClient<Exercise>(`/exercises/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<Exercise> {
    return apiClient<Exercise>(`/exercises/${id}`, {
      method: 'DELETE',
    });
  },

  async reorder(
    studyDayId: string,
    items: Array<{ id: string; order: number }>,
  ): Promise<Exercise[]> {
    return apiClient<Exercise[]>('/admin/exercises/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ studyDayId, items }),
    });
  },
};

export const roadmapApi = {
  async getStatus(): Promise<{
    status: 'DRAFT' | 'PUBLISHED';
    publishedAt?: string;
    updatedAt?: string;
  }> {
    return apiClient('/admin/roadmap/status');
  },

  async validate(): Promise<{
    valid: boolean;
    summary: {
      errors: number;
      warnings: number;
      infos: number;
      studyDays: number;
      exercises: number;
      checklistItems: number;
      codingExercises: number;
    };
    issues: Array<{
      severity: 'ERROR' | 'WARNING' | 'INFO';
      code: string;
      message: string;
      studyDayId?: string;
      studyDayNumber?: number;
      exerciseId?: string;
      checklistItemId?: string;
    }>;
  }> {
    return apiClient('/admin/roadmap/validate', {
      method: 'POST',
    });
  },

  async publish(): Promise<{
    status: 'PUBLISHED';
    publishedAt: string;
    validationResult: unknown;
  }> {
    return apiClient('/admin/roadmap/publish', {
      method: 'POST',
    });
  },

  async unpublish(): Promise<{
    status: 'DRAFT';
  }> {
    return apiClient('/admin/roadmap/unpublish', {
      method: 'POST',
    });
  },
};

export const submissionsApi = {
  async submit(data: {
    exerciseId: string;
    file: File;
    note?: string;
  }): Promise<Submission> {
    const formData = new FormData();
    formData.append('exerciseId', data.exerciseId);
    formData.append('file', data.file);
    if (data.note) {
      formData.append('note', data.note);
    }
    return apiClient<Submission>('/submissions', {
      method: 'POST',
      body: formData,
    });
  },

  async submitCode(data: {
    exerciseId: string;
    code: string;
    executionSummary: {
      passed: number;
      total: number;
      durationMs: number;
    };
    note?: string;
  }): Promise<Submission> {
    return apiClient<Submission>('/submissions/code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMySubmissions(): Promise<Submission[]> {
    return apiClient<Submission[]>('/submissions/me');
  },

  async getById(id: string): Promise<Submission> {
    return apiClient<Submission>(`/submissions/${id}`);
  },

  async getAllForAdmin(status?: SubmissionStatus): Promise<Submission[]> {
    const query = status ? `?status=${status}` : '';
    return apiClient<Submission[]>(`/admin/submissions${query}`);
  },

  async review(
    id: string,
    data: { status: SubmissionStatus; adminNote?: string },
  ): Promise<Submission> {
    return apiClient<Submission>(`/admin/submissions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export const progressApi = {
  async getProgress(): Promise<ProgressSummary> {
    return apiClient<ProgressSummary>('/progress');
  },

  async getDayProgress(studyDayId: string): Promise<DayProgressDetail> {
    return apiClient<DayProgressDetail>(`/progress/${studyDayId}`);
  },
};

export const groupsApi = {
  async getAll(): Promise<Group[]> {
    return apiClient<Group[]>('/groups');
  },

  async getById(id: string): Promise<Group> {
    return apiClient<Group>(`/groups/${id}`);
  },

  async getMyGroup(): Promise<Group> {
    return apiClient<Group>('/groups/me');
  },

  async create(data: {
    name: string;
    description?: string;
    inviteCode?: string;
  }): Promise<Group> {
    return apiClient<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<Group> {
    return apiClient<Group>(`/groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string; id: string }> {
    return apiClient<{ message: string; id: string }>(`/groups/${id}`, {
      method: 'DELETE',
    });
  },

  async getMembers(groupId: string): Promise<User[]> {
    return apiClient<User[]>(`/groups/${groupId}/members`);
  },

  async getActivity(groupId: string): Promise<Activity[]> {
    return apiClient<Activity[]>(`/groups/${groupId}/activity`);
  },

  async join(inviteCode: string): Promise<{ message: string; group: Group }> {
    return apiClient<{ message: string; group: Group }>('/groups/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  },

  async joinById(id: string): Promise<{ message: string; group: Group }> {
    return apiClient<{ message: string; group: Group }>(`/groups/${id}/join`, {
      method: 'POST',
    });
  },

  async leave(id: string): Promise<{ message: string; groupId: string }> {
    return apiClient<{ message: string; groupId: string }>(`/groups/${id}/leave`, {
      method: 'POST',
    });
  },

  async removeMember(
    groupId: string,
    userId: string,
  ): Promise<{ message: string; userId: string }> {
    return apiClient<{ message: string; userId: string }>(
      `/groups/${groupId}/members/${userId}`,
      {
        method: 'DELETE',
      },
    );
  },
};

export const chatApi = {
  async getMessages(
    groupId: string,
    limit = 50,
    before?: string,
  ): Promise<GroupMessagesResponse> {
    const params = new URLSearchParams();
    if (limit) params.set('limit', limit.toString());
    if (before) params.set('before', before);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient<GroupMessagesResponse>(`/groups/${groupId}/messages${query}`);
  },

  async sendMessage(
    groupId: string,
    content: string,
    clientMessageId?: string,
  ): Promise<GroupMessage> {
    return apiClient<GroupMessage>(`/groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, clientMessageId }),
    });
  },

  async markAsRead(
    groupId: string,
  ): Promise<{ success: boolean; lastReadAt: string; groupId: string }> {
    return apiClient<{ success: boolean; lastReadAt: string; groupId: string }>(
      `/groups/${groupId}/messages/read`,
      {
        method: 'POST',
      },
    );
  },

  async getUnreadCount(
    groupId: string,
  ): Promise<{ groupId: string; unreadCount: number; lastReadAt?: string }> {
    return apiClient<{ groupId: string; unreadCount: number; lastReadAt?: string }>(
      `/groups/${groupId}/unread`,
    );
  },
};

export const activityApi = {
  async getGroupActivity(): Promise<Activity[]> {
    return apiClient<Activity[]>('/activity');
  },

  async getMyActivity(): Promise<Activity[]> {
    return apiClient<Activity[]>('/activity/me');
  },
};

export const checklistsApi = {
  async getTodayChecklist(): Promise<StudyDayChecklistData> {
    return apiClient<StudyDayChecklistData>('/checklists/today');
  },

  async getStudyDayChecklist(studyDayId: string): Promise<StudyDayChecklistData> {
    return apiClient<StudyDayChecklistData>(`/checklists/study-day/${studyDayId}`);
  },

  async completeItem(id: string): Promise<StudyDayChecklistData> {
    return apiClient<StudyDayChecklistData>(`/checklists/${id}/complete`, {
      method: 'POST',
    });
  },

  async uncompleteItem(id: string): Promise<StudyDayChecklistData> {
    return apiClient<StudyDayChecklistData>(`/checklists/${id}/complete`, {
      method: 'DELETE',
    });
  },

  // Admin Checklist endpoints
  async adminCreate(data: {
    studyDayId: string;
    title: string;
    description?: string;
    type?: ChecklistItemType;
    order?: number;
    isRequired?: boolean;
    exerciseId?: string;
  }): Promise<ChecklistItem> {
    return apiClient<ChecklistItem>('/admin/checklists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminUpdate(
    id: string,
    data: Partial<{
      studyDayId: string;
      title: string;
      description?: string;
      type: ChecklistItemType;
      order: number;
      isRequired: boolean;
      exerciseId?: string | null;
    }>,
  ): Promise<ChecklistItem> {
    return apiClient<ChecklistItem>(`/admin/checklists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async adminDelete(id: string): Promise<{ id: string }> {
    return apiClient<{ id: string }>(`/admin/checklists/${id}`, {
      method: 'DELETE',
    });
  },

  async adminReorder(
    items: Array<{ id: string; order: number }>,
  ): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/admin/checklists/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ items }),
    });
  },
};

export const attendanceApi = {
  async getTodayAttendance(): Promise<TodayAttendanceData> {
    return apiClient<TodayAttendanceData>('/attendance/today');
  },

  async checkIn(): Promise<Attendance> {
    return apiClient<Attendance>('/attendance/check-in', {
      method: 'POST',
    });
  },

  async checkOut(): Promise<Attendance> {
    return apiClient<Attendance>('/attendance/check-out', {
      method: 'POST',
    });
  },

  async getStats(): Promise<AttendanceStatsData> {
    return apiClient<AttendanceStatsData>('/attendance/stats');
  },
};

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    return apiClient<DashboardData>('/dashboard');
  },
};
