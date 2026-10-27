import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Trash2, RefreshCw, ChevronLeft, ChevronRight, User as UserIcon,
  Youtube, Plus, X, Edit2, Eye, EyeOff, AlertCircle,
  Award, ArrowLeft, ChevronDown, ChevronUp, Headphones, BookOpen,
} from 'lucide-react';
import { adminApi, videoApi, examAdminApi, ExamQuestionCreate, ExamCreatePayload } from '../services/api';
import { AdminUserRow, VideoItem, ExamSummary } from '../types';
import { useAuth } from '../contexts/AuthContext';

// ── helpers ────────────────────────────────────────────────────────────────

function extractYoutubeId(input: string): string | null {
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  const embed = s.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return null;
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400',
  2: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
  3: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
  4: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400',
  5: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400',
  6: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400',
};

// ── VideoForm (add / edit) ─────────────────────────────────────────────────

interface VideoFormData {
  url: string;
  title: string;
  channel: string;
  hsk_level: number;
  description: string;
  sort_order: number;
}

const EMPTY_FORM: VideoFormData = { url: '', title: '', channel: '', hsk_level: 1, description: '', sort_order: 0 };

interface VideoFormProps {
  initial?: VideoItem;
  onSave: (data: VideoFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  error: string;
}

const VideoForm: React.FC<VideoFormProps> = ({ initial, onSave, onCancel, saving, error }) => {
  const [form, setForm] = useState<VideoFormData>(() =>
    initial
      ? { url: initial.video_id, title: initial.title, channel: initial.channel, hsk_level: initial.hsk_level, description: initial.description ?? '', sort_order: initial.sort_order }
      : EMPTY_FORM
  );

  const set = (key: keyof VideoFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            YouTube URL / Video ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.url}
            onChange={e => set('url', e.target.value)}
            placeholder="https://youtube.com/watch?v=... hoặc video ID (11 ký tự)"
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
            disabled={!!initial}
          />
          {initial && <p className="mt-1 text-[11px] text-slate-400">Video ID không thể đổi sau khi tạo</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Tên video hiển thị..."
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên kênh</label>
          <input
            type="text"
            value={form.channel}
            onChange={e => set('channel', e.target.value)}
            placeholder="Chinese Daily Podcast..."
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cấp HSK</label>
          <select
            value={form.hsk_level}
            onChange={e => set('hsk_level', Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
          >
            {[1,2,3,4,5,6].map(l => <option key={l} value={l}>HSK {l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả (tùy chọn)</label>
          <input
            type="text"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Ngắn gọn nội dung video..."
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thứ tự</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={e => set('sort_order', Number(e.target.value))}
            min={0}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex space-x-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Thêm Video'}
        </button>
      </div>
    </div>
  );
};

// ── VideosTab ──────────────────────────────────────────────────────────────

const VideosTab: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await videoApi.adminList();
      setVideos(data);
    } catch {
      setError('Không thể tải danh sách video');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleAdd = async (form: VideoFormData) => {
    setFormError('');
    const videoId = extractYoutubeId(form.url);
    if (!videoId) { setFormError('URL YouTube không hợp lệ'); return; }
    if (!form.title.trim()) { setFormError('Tiêu đề không được để trống'); return; }
    setSaving(true);
    try {
      const created = await videoApi.create({
        video_id: videoId,
        title: form.title.trim(),
        channel: form.channel.trim(),
        hsk_level: form.hsk_level,
        description: form.description.trim() || undefined,
        sort_order: form.sort_order,
      });
      setVideos(prev => [...prev, created]);
      setShowAdd(false);
    } catch (e: any) {
      setFormError(e?.response?.data?.detail || 'Không thể thêm video');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form: VideoFormData) => {
    if (!editId) return;
    setFormError('');
    if (!form.title.trim()) { setFormError('Tiêu đề không được để trống'); return; }
    setSaving(true);
    try {
      const updated = await videoApi.update(editId, {
        title: form.title.trim(),
        channel: form.channel.trim(),
        hsk_level: form.hsk_level,
        description: form.description.trim() || undefined,
        sort_order: form.sort_order,
      });
      setVideos(prev => prev.map(v => v.id === editId ? updated : v));
      setEditId(null);
    } catch (e: any) {
      setFormError(e?.response?.data?.detail || 'Không thể cập nhật video');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (v: VideoItem) => {
    try {
      const updated = await videoApi.update(v.id, { is_active: !v.is_active });
      setVideos(prev => prev.map(x => x.id === v.id ? updated : x));
    } catch {
      setError('Không thể đổi trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDelete(null);
    try {
      await videoApi.delete(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    } catch {
      setError('Không thể xóa video');
    }
  };

  const editingVideo = editId ? videos.find(v => v.id === editId) : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <span>Quản Lý Video YouTube</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {videos.length} video — {videos.filter(v => v.is_active).length} đang hiển thị
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => { setShowAdd(true); setFormError(''); setEditId(null); }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Video</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-red-500" />
              <span>Thêm Video Mới</span>
            </h3>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <VideoForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} error={formError} />
        </div>
      )}

      {/* Edit form */}
      {editId && editingVideo && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Edit2 className="w-4 h-4 text-blue-500" />
              <span>Chỉnh Sửa Video</span>
            </h3>
            <button onClick={() => setEditId(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <VideoForm initial={editingVideo} onSave={handleEdit} onCancel={() => setEditId(null)} saving={saving} error={formError} />
        </div>
      )}

      {/* Video table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th className="text-left px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Video</th>
              <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">Cấp</th>
              <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Hiển thị</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && videos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-400 text-sm">Đang tải...</td>
              </tr>
            ) : videos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-400 text-sm">Chưa có video nào</td>
              </tr>
            ) : videos.map(v => (
              <tr key={v.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!v.is_active ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-16 h-11 rounded-lg object-cover bg-slate-200 dark:bg-slate-700 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs line-clamp-2 leading-snug">{v.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{v.video_id}</div>
                      {v.channel && <div className="text-[11px] text-slate-400">{v.channel}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center hidden sm:table-cell">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${LEVEL_COLORS[v.hsk_level] || ''}`}>
                    HSK {v.hsk_level}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => handleToggleActive(v)}
                    title={v.is_active ? 'Nhấn để ẩn' : 'Nhấn để hiện'}
                    className={`p-1.5 rounded-lg transition-colors ${v.is_active ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {v.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {confirmDelete === v.id ? (
                      <>
                        <button onClick={() => handleDelete(v.id)} className="text-xs font-bold text-red-600 hover:underline">Xác nhận</button>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-500 hover:underline">Hủy</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(v.id); setFormError(''); setShowAdd(false); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(v.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Xóa video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── ExamsTab ───────────────────────────────────────────────────────────────

const TRUE_FALSE_OPTIONS = ['Đúng (正确)', 'Sai (错误)'];
const EMPTY_QUESTION = (): ExamQuestionCreate => ({
  section: 'listening',
  question_number: 1,
  question_type: 'multiple_choice',
  audio_text: '',
  stimulus: '',
  question_text: '',
  options: ['', '', '', ''],
  correct_answer: '',
  explanation_vi: '',
});

interface QuestionCardProps {
  q: ExamQuestionCreate;
  idx: number;
  open: boolean;
  onToggle: () => void;
  onChange: (q: ExamQuestionCreate) => void;
  onRemove: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ q, idx, open, onToggle, onChange, onRemove }) => {
  const isMCQ = q.question_type === 'multiple_choice';
  const options = isMCQ ? (q.options ?? ['', '', '', '']) : TRUE_FALSE_OPTIONS;

  const set = (key: keyof ExamQuestionCreate, value: any) =>
    onChange({ ...q, [key]: value });

  const setOption = (i: number, val: string) => {
    const opts = [...(q.options ?? ['', '', '', ''])];
    opts[i] = val;
    onChange({ ...q, options: opts });
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
            {idx + 1}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
            q.section === 'listening'
              ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
              : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
          }`}>
            {q.section === 'listening' ? 'Nghe' : 'Đọc'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
            {q.question_text || 'Chưa nhập câu hỏi...'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Xóa câu này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {/* Section + Type */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phần thi</label>
              <div className="flex gap-1 mt-1">
                {(['listening', 'reading'] as const).map(s => (
                  <button key={s} onClick={() => set('section', s)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      q.section === s
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}>
                    {s === 'listening' ? 'Nghe' : 'Đọc'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dạng câu hỏi</label>
              <div className="flex gap-1 mt-1">
                {([['multiple_choice', 'Trắc nghiệm'], ['true_false', 'Đúng/Sai']] as const).map(([v, l]) => (
                  <button key={v} onClick={() => {
                    onChange({
                      ...q,
                      question_type: v,
                      options: v === 'multiple_choice' ? ['', '', '', ''] : undefined,
                      correct_answer: '',
                    });
                  }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      q.question_type === v
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio text (listening only) */}
          {q.section === 'listening' && (
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Câu thoại / bài nghe (Chinese)</label>
              <textarea rows={2} value={q.audio_text ?? ''} onChange={e => set('audio_text', e.target.value)}
                placeholder="他在喝茶。" className={`${inputCls} mt-1 resize-none`} />
            </div>
          )}

          {/* Stimulus */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ngữ cảnh / đoạn văn (tùy chọn)</label>
            <textarea rows={2} value={q.stimulus ?? ''} onChange={e => set('stimulus', e.target.value)}
              placeholder="Hình ảnh: ..., Đoạn văn: ..." className={`${inputCls} mt-1 resize-none`} />
          </div>

          {/* Question text */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Câu hỏi <span className="text-red-500">*</span></label>
            <textarea rows={2} value={q.question_text} onChange={e => set('question_text', e.target.value)}
              placeholder="Người nam muốn ăn món gì?" className={`${inputCls} mt-1 resize-none`} />
          </div>

          {/* MCQ options */}
          {isMCQ && (
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4 Đáp án A / B / C / D <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['A', 'B', 'C', 'D'].map((lbl, i) => (
                  <div key={lbl} className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-500 flex items-center justify-center shrink-0">{lbl}</span>
                    <input type="text" value={options[i] ?? ''} onChange={e => setOption(i, e.target.value)}
                      placeholder={`Đáp án ${lbl}...`} className={inputCls} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct answer */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đáp án đúng <span className="text-red-500">*</span></label>
            <select value={q.correct_answer} onChange={e => set('correct_answer', e.target.value)}
              className={`${inputCls} mt-1`}>
              <option value="">— chọn đáp án đúng —</option>
              {options.filter(Boolean).map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Explanation */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giải thích (tiếng Việt)</label>
            <textarea rows={2} value={q.explanation_vi ?? ''} onChange={e => set('explanation_vi', e.target.value)}
              placeholder="Giải thích tại sao đáp án này đúng..." className={`${inputCls} mt-1 resize-none`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ── ExamCreateForm ─────────────────────────────────────────────────────────

interface ExamCreateFormProps {
  onSaved: (exam: ExamSummary) => void;
  onCancel: () => void;
}

const ExamCreateForm: React.FC<ExamCreateFormProps> = ({ onSaved, onCancel }) => {
  const [title, setTitle] = useState('');
  const [hskLevel, setHskLevel] = useState(1);
  const [duration, setDuration] = useState(35);
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<ExamQuestionCreate[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({ ...EMPTY_QUESTION(), question_number: i + 1 }))
  );
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    const q: ExamQuestionCreate = { ...EMPTY_QUESTION(), question_number: questions.length + 1 };
    setQuestions(prev => [...prev, q]);
    setOpenIdx(questions.length);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx).map((q, i) => ({ ...q, question_number: i + 1 })));
    setOpenIdx(null);
  };

  const updateQuestion = (idx: number, q: ExamQuestionCreate) =>
    setQuestions(prev => prev.map((old, i) => i === idx ? q : old));

  const handleSave = async () => {
    setError('');
    if (!title.trim()) { setError('Tiêu đề đề thi không được để trống'); return; }
    if (questions.length === 0) { setError('Phải có ít nhất 1 câu hỏi'); return; }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) { setError(`Câu ${i + 1}: chưa nhập câu hỏi`); setOpenIdx(i); return; }
      if (!q.correct_answer) { setError(`Câu ${i + 1}: chưa chọn đáp án đúng`); setOpenIdx(i); return; }
      if (q.question_type === 'multiple_choice' && !(q.options ?? []).slice(0, 2).every(Boolean)) {
        setError(`Câu ${i + 1}: cần ít nhất 2 đáp án A và B`); setOpenIdx(i); return;
      }
    }
    setSaving(true);
    try {
      const payload: ExamCreatePayload = {
        hsk_level: hskLevel,
        title: title.trim(),
        description: description.trim() || undefined,
        duration_minutes: duration,
        total_score: 100,
        questions: questions.map(q => ({
          ...q,
          options: q.question_type === 'multiple_choice'
            ? (q.options ?? []).filter(Boolean)
            : undefined,
          audio_text: q.audio_text || undefined,
          stimulus: q.stimulus || undefined,
          explanation_vi: q.explanation_vi || undefined,
        })),
      };
      const created = await examAdminApi.create(payload);
      onSaved(created);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Không thể tạo đề thi');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onCancel}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Tạo Đề Thi Mới</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Điền thông tin đề thi và từng câu hỏi</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin đề thi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiêu đề <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Đề Thi Mô Phỏng Chuẩn HSK 1 (Mock Test #03)"
              className={`${inputCls} mt-1`} />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cấp HSK</label>
            <select value={hskLevel} onChange={e => setHskLevel(Number(e.target.value))} className={`${inputCls} mt-1`}>
              {[1,2,3,4,5,6].map(l => <option key={l} value={l}>HSK {l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thời gian (phút)</label>
            <input type="number" min={5} max={180} value={duration} onChange={e => setDuration(Number(e.target.value))}
              className={`${inputCls} mt-1`} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mô tả (tùy chọn)</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Đề thi rèn luyện từ vựng và nghe hiểu..."
              className={`${inputCls} mt-1`} />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Câu hỏi ({questions.length})
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" /> Nghe: {questions.filter(q => q.section === 'listening').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Đọc: {questions.filter(q => q.section === 'reading').length}
            </span>
          </div>
        </div>

        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            q={q}
            idx={i}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            onChange={(updated) => updateQuestion(i, updated)}
            onRemove={() => removeQuestion(i)}
          />
        ))}

        <button onClick={addQuestion}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-400 hover:border-red-300 hover:text-red-500 dark:hover:border-red-800 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm câu hỏi
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl px-3 py-2.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <button onClick={onCancel}
          className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Hủy bỏ
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100">
          {saving ? 'Đang lưu...' : `Tạo đề (${questions.length} câu)`}
        </button>
      </div>
    </div>
  );
};

// ── ExamsTab ───────────────────────────────────────────────────────────────

const ExamsTab: React.FC = () => {
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await examAdminApi.list();
      setExams(data);
    } catch {
      setError('Không thể tải danh sách đề thi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const handleDelete = async (id: string) => {
    setConfirmDelete(null);
    try {
      await examAdminApi.delete(id);
      setExams(prev => prev.filter(e => e.id !== id));
    } catch {
      setError('Không thể xóa đề thi');
    }
  };

  if (view === 'create') {
    return (
      <ExamCreateForm
        onSaved={(exam) => {
          setExams(prev => [...prev, exam]);
          setView('list');
        }}
        onCancel={() => setView('list')}
      />
    );
  }

  const byLevel = [1,2,3,4,5,6].map(l => ({
    level: l,
    items: exams.filter(e => e.hsk_level === l),
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-red-500" />
            Quản Lý Đề Thi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {exams.length} đề thi — {[1,2,3,4,5,6].filter(l => exams.some(e => e.hsk_level === l)).length} cấp độ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchExams} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button onClick={() => setView('create')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5" />
            Tạo đề mới
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      {loading && exams.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">Đang tải...</div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          Chưa có đề thi nào.
        </div>
      ) : (
        <div className="space-y-6">
          {byLevel.map(({ level, items }) => (
            <div key={level}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${LEVEL_COLORS[level]}`}>HSK {level}</span>
                <span className="text-xs text-slate-400">{items.length} đề</span>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <th className="text-left px-4 py-2.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Tiêu đề</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">Câu</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">Phút</th>
                      <th className="px-3 py-2.5 w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map(exam => (
                      <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white leading-snug">{exam.title}</div>
                          {exam.description && (
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{exam.description}</div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center hidden sm:table-cell">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{exam.question_count}</span>
                        </td>
                        <td className="px-3 py-3 text-center hidden sm:table-cell">
                          <span className="text-xs text-slate-500">{exam.duration_minutes}'</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          {confirmDelete === exam.id ? (
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleDelete(exam.id)} className="text-xs font-bold text-red-600 hover:underline">Xóa</button>
                              <span className="text-slate-300 dark:text-slate-700">|</span>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-500 hover:underline">Hủy</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(exam.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Xóa đề thi">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── UsersTab ───────────────────────────────────────────────────────────────

const UsersTab: React.FC = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.listUsers(p, PAGE_SIZE);
      setUsers(res.items);
      setTotal(res.total);
    } catch {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  const handleToggleRole = async (u: AdminUserRow) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setPendingRole(u.id);
    try {
      await adminApi.updateRole(u.id, newRole);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
    } catch {
      setError('Không thể cập nhật quyền');
    } finally {
      setPendingRole(null);
    }
  };

  const handleDelete = async (userId: string) => {
    setConfirmDelete(null);
    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(x => x.id !== userId));
      setTotal(t => t - 1);
    } catch {
      setError('Không thể xóa người dùng');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span>Quản Trị Người Dùng</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tổng {total} tài khoản đã đăng ký
          </p>
        </div>
        <button
          onClick={() => fetchUsers(page)}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th className="text-left px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Người dùng</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">Ngày tham gia</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden md:table-cell">Đăng nhập cuối</th>
              <th className="text-center px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Quyền</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">Đang tải...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">Chưa có người dùng nào</td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${u.id === me?.id ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {u.name}
                        {u.id === me?.id && <span className="ml-1.5 text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">Bạn</span>}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">
                  {u.last_login ? new Date(u.last_login).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleRole(u)}
                    disabled={u.id === me?.id || pendingRole === u.id}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      u.role === 'admin'
                        ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={u.id === me?.id ? 'Không thể đổi quyền của chính mình' : `Đổi thành ${u.role === 'admin' ? 'user' : 'admin'}`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>{u.role === 'admin' ? 'Admin' : 'User'}</span>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id !== me?.id && (
                    confirmDelete === u.id ? (
                      <div className="flex items-center justify-end space-x-1">
                        <button onClick={() => handleDelete(u.id)} className="text-xs font-bold text-red-600 hover:underline">Xác nhận</button>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-500 hover:underline">Hủy</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 text-xs">Trang {page} / {totalPages}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main AdminPanel ────────────────────────────────────────────────────────

export const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'videos' | 'exams'>('users');

  const TABS = [
    { id: 'users',  label: 'Người Dùng', icon: Shield  },
    { id: 'videos', label: 'Video',       icon: Youtube },
    { id: 'exams',  label: 'Đề Thi',      icon: Award   },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {tab === 'users'  && <UsersTab />}
      {tab === 'videos' && <VideosTab />}
      {tab === 'exams'  && <ExamsTab />}
    </div>
  );
};
