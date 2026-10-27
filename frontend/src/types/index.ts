export interface VocabExample {
  id: string;
  chinese: string;
  pinyin: string;
  meaning_vi: string;
  meaning_en?: string;
}

export interface Vocabulary {
  id: string;
  hsk_level: number;
  simplified: string;
  traditional?: string;
  pinyin: string;
  pinyin_clean: string;
  han_viet?: string;
  meaning_vi: string;
  meaning_en?: string;
  part_of_speech?: string;
  stroke_count?: number;
  frequency_rank: number;
  examples: VocabExample[];
}

export interface VocabularyListResponse {
  total: number;
  page: number;
  page_size: number;
  items: Vocabulary[];
}

export interface GrammarExample {
  chinese: string;
  pinyin: string;
  meaning_vi: string;
}

export interface GrammarPoint {
  id: string;
  hsk_level: number;
  title: string;
  structure: string;
  explanation_vi: string;
  examples: GrammarExample[];
}

export interface ExamSummary {
  id: string;
  hsk_level: number;
  title: string;
  description?: string;
  duration_minutes: number;
  total_score: number;
  question_count: number;
}

export interface ExamQuestion {
  id: string;
  section: string;
  question_number: number;
  question_type: string;
  audio_text?: string;
  stimulus?: string;
  question_text: string;
  options?: string[];
}

export interface ExamDetail {
  id: string;
  hsk_level: number;
  title: string;
  description?: string;
  duration_minutes: number;
  total_score: number;
  questions: ExamQuestion[];
}

export interface ExamResultQuestionDetail {
  question_id: string;
  question_number: number;
  section: string;
  user_answer?: string;
  correct_answer: string;
  is_correct: boolean;
  explanation_vi?: string;
}

export interface ExamResult {
  total_questions: number;
  correct_count: number;
  score: number;
  passed: boolean;
  details: ExamResultQuestionDetail[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'admin' | 'user';
}

export interface AdminUserRow extends AuthUser {
  created_at: string | null;
  last_login: string | null;
}

export interface AdminUsersResponse {
  total: number;
  page: number;
  page_size: number;
  items: AdminUserRow[];
}

export interface VideoItem {
  id: string;       // UUID (DB primary key)
  video_id: string; // YouTube video ID (11 chars)
  title: string;
  channel: string;
  hsk_level: number;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
}
