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
  Activity,
  DashboardData,
  SubmissionStatus,
  Role,
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
  async getMyGroup(): Promise<Group> {
    return apiClient<Group>('/groups/me');
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
};

export const activityApi = {
  async getGroupActivity(): Promise<Activity[]> {
    return apiClient<Activity[]>('/activity');
  },

  async getMyActivity(): Promise<Activity[]> {
    return apiClient<Activity[]>('/activity/me');
  },
};

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    return apiClient<DashboardData>('/dashboard');
  },
};
