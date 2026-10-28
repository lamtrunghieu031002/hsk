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
  WritingSentence,
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
  list: async (hskLevel?: number, search?: string, page: number = 1, pageSize: number = 20, partOfSpeech?: string) => {
    const params: Record<string, any> = { page, page_size: pageSize };
    if (hskLevel) params.hsk_level = hskLevel;
    if (search) params.search = search;
    if (partOfSpeech) params.part_of_speech = partOfSpeech;
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
  },

  getPartsOfSpeech: async (hskLevel?: number): Promise<string[]> => {
    const params: Record<string, any> = {};
    if (hskLevel) params.hsk_level = hskLevel;
    const res = await api.get<string[]>('/vocabulary/parts-of-speech', { params });
    return res.data;
  },
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
  session_type: 'flashcard' | 'meaning_drill' | 'exam' | 'listening' | 'speaking';
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

export interface LeaderboardEntry {
  name: string;
  avatar_url: string | null;
  streak_days: number;
  total_words: number;
  total_sessions: number;
}

export const progressApi = {
  logSession: async (payload: SessionPayload): Promise<void> => {
    await api.post('/progress/session', payload);
  },
  get: async (): Promise<ProgressData> => {
    const res = await api.get<ProgressData>('/progress');
    return res.data;
  },
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const res = await api.get<LeaderboardEntry[]>('/progress/leaderboard');
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

export interface ExamQuestionCreate {
  section: 'listening' | 'reading';
  question_number: number;
  question_type: 'multiple_choice' | 'true_false';
  audio_text?: string;
  stimulus?: string;
  question_text: string;
  options?: string[];
  correct_answer: string;
  explanation_vi?: string;
}

export interface ExamCreatePayload {
  hsk_level: number;
  title: string;
  description?: string;
  duration_minutes: number;
  total_score: number;
  questions: ExamQuestionCreate[];
}

export const examAdminApi = {
  list: async (): Promise<import('../types').ExamSummary[]> => {
    const res = await api.get('/admin/exams/');
    return res.data;
  },
  create: async (data: ExamCreatePayload): Promise<import('../types').ExamSummary> => {
    const res = await api.post('/admin/exams/', data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/exams/${id}`);
  },
};

export const sentenceApi = {
  list: async (hskLevel?: number): Promise<WritingSentence[]> => {
    const params: Record<string, any> = {};
    if (hskLevel) params.hsk_level = hskLevel;
    const res = await api.get<WritingSentence[]>('/sentences/', { params });
    return res.data;
  },
};

export const adminVocabApi = {
  create: async (data: {
    hsk_level: number; simplified: string; pinyin: string; pinyin_clean?: string;
    meaning_vi: string; part_of_speech?: string; han_viet?: string; meaning_en?: string;
  }): Promise<Vocabulary> => {
    const res = await api.post<Vocabulary>('/admin/vocab/', data);
    return res.data;
  },
  update: async (id: string, data: Partial<{
    hsk_level: number; simplified: string; pinyin: string;
    meaning_vi: string; part_of_speech: string; han_viet: string; meaning_en: string;
  }>): Promise<Vocabulary> => {
    const res = await api.patch<Vocabulary>(`/admin/vocab/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/vocab/${id}`);
  },
};

export const adminGrammarApi = {
  create: async (data: {
    hsk_level: number; title: string; structure: string; explanation_vi: string;
    examples: { chinese: string; pinyin: string; meaning_vi: string }[];
  }): Promise<GrammarPoint> => {
    const res = await api.post<GrammarPoint>('/admin/grammar/', data);
    return res.data;
  },
  update: async (id: string, data: Partial<{
    hsk_level: number; title: string; structure: string; explanation_vi: string;
    examples: { chinese: string; pinyin: string; meaning_vi: string }[];
  }>): Promise<GrammarPoint> => {
    const res = await api.patch<GrammarPoint>(`/admin/grammar/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/grammar/${id}`);
  },
};

export const adminSentenceApi = {
  list: async (hskLevel?: number): Promise<WritingSentence[]> => {
    const params: Record<string, any> = {};
    if (hskLevel) params.hsk_level = hskLevel;
    const res = await api.get<WritingSentence[]>('/admin/sentences/', { params });
    return res.data;
  },
  create: async (data: {
    hsk_level: number; chinese: string; pinyin: string; meaning_vi: string; sort_order?: number;
  }): Promise<WritingSentence> => {
    const res = await api.post<WritingSentence>('/admin/sentences/', data);
    return res.data;
  },
  update: async (id: string, data: Partial<{
    hsk_level: number; chinese: string; pinyin: string; meaning_vi: string; sort_order: number;
  }>): Promise<WritingSentence> => {
    const res = await api.patch<WritingSentence>(`/admin/sentences/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/sentences/${id}`);
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
