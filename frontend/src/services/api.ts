import axios from 'axios';
import {
  VocabularyListResponse,
  Vocabulary,
  GrammarPoint,
  ExamSummary,
  ExamDetail,
  ExamResult,
  AuthUser,
  AdminUsersResponse,
  VideoItem,
} from '../types';

const TOKEN_KEY = 'hsk_access_token';
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const vocabApi = {
  list: async (hskLevel?: number, search?: string, page: number = 1, pageSize: number = 20) => {
    const params: Record<string, any> = { page, page_size: pageSize };
    if (hskLevel) params.hsk_level = hskLevel;
    if (search) params.search = search;
    const res = await api.get<VocabularyListResponse>('/vocabulary/', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get<{ total: number; by_level: Record<string, number> }>('/vocabulary/stats');
    return res.data;
  },

  getDetail: async (id: string) => {
    const res = await api.get<Vocabulary>(`/vocabulary/${id}`);
    return res.data;
  }
};

export const grammarApi = {
  list: async (hskLevel?: number) => {
    const params: Record<string, any> = {};
    if (hskLevel) params.hsk_level = hskLevel;
    const res = await api.get<GrammarPoint[]>('/grammar/', { params });
    return res.data;
  }
};

export const examApi = {
  list: async (hskLevel?: number) => {
    const params: Record<string, any> = {};
    if (hskLevel) params.hsk_level = hskLevel;
    const res = await api.get<ExamSummary[]>('/exams/', { params });
    return res.data;
  },

  getDetail: async (examId: string) => {
    const res = await api.get<ExamDetail>(`/exams/${examId}`);
    return res.data;
  },

  submit: async (examId: string, answers: Record<string, string>) => {
    const res = await api.post<ExamResult>(`/exams/${examId}/submit`, { answers });
    return res.data;
  }
};

export const transcriptApi = {
  fetch: async (videoId: string): Promise<{ transcript_text: string; count: number }> => {
    const res = await api.get(`/transcript/${videoId}`);
    return res.data;
  }
};

export const srsApi = {
  getDueCards: async (userId: string = "guest_user") => {
    const res = await api.get('/srs/due', { params: { user_id: userId } });
    return res.data;
  },

  reviewCard: async (vocabId: string, quality: number, userId: string = "guest_user") => {
    const res = await api.post('/srs/review', {
      user_id: userId,
      vocab_id: vocabId,
      quality
    });
    return res.data;
  }
};

export const authApi = {
  googleLogin: async (credential: string): Promise<{ access_token: string; user: AuthUser }> => {
    const res = await api.post('/auth/google', { token: credential });
    return res.data;
  },
  getMe: async (): Promise<AuthUser> => {
    const res = await api.get<AuthUser>('/auth/me');
    return res.data;
  },
  deleteMe: async (): Promise<void> => {
    await api.delete('/auth/me');
  },
};

export interface SessionPayload {
  session_type: 'flashcard' | 'meaning_drill' | 'exam' | 'listening';
  hsk_level: number;
  items_count: number;
  correct_count: number;
  score: number;
}

export interface LevelStat {
  sessions: number;
  words: number;
  accuracy: number;
}

export interface RecentSession {
  id: string;
  session_type: string;
  hsk_level: number;
  items_count: number;
  correct_count: number;
  score: number;
  created_at: string;
}

export interface ProgressData {
  total_sessions: number;
  total_words: number;
  streak_days: number;
  by_level: Record<string, LevelStat>;
  recent: RecentSession[];
}

export const progressApi = {
  logSession: async (payload: SessionPayload): Promise<void> => {
    await api.post('/progress/session', payload);
  },
  get: async (): Promise<ProgressData> => {
    const res = await api.get<ProgressData>('/progress');
    return res.data;
  },
};

export const adminApi = {
  listUsers: async (page = 1, pageSize = 20): Promise<AdminUsersResponse> => {
    const res = await api.get('/admin/users', { params: { page, page_size: pageSize } });
    return res.data;
  },
  updateRole: async (userId: string, role: 'admin' | 'user') => {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },
  deleteUser: async (userId: string) => {
    await api.delete(`/admin/users/${userId}`);
  },
};

export const videoApi = {
  list: async (hskLevel?: number): Promise<VideoItem[]> => {
    const params: Record<string, any> = {};
    if (hskLevel) params.hsk_level = hskLevel;
    const res = await api.get<VideoItem[]>('/videos/', { params });
    return res.data;
  },
  adminList: async (): Promise<VideoItem[]> => {
    const res = await api.get<VideoItem[]>('/admin/videos/');
    return res.data;
  },
  create: async (data: {
    video_id: string;
    title: string;
    channel: string;
    hsk_level: number;
    description?: string;
    sort_order?: number;
  }): Promise<VideoItem> => {
    const res = await api.post<VideoItem>('/admin/videos/', data);
    return res.data;
  },
  update: async (id: string, data: Partial<{
    title: string;
    channel: string;
    hsk_level: number;
    description: string;
    is_active: boolean;
    sort_order: number;
  }>): Promise<VideoItem> => {
    const res = await api.patch<VideoItem>(`/admin/videos/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/videos/${id}`);
  },
};
