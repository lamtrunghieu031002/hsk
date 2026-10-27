import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Trash2, RefreshCw, ChevronLeft, ChevronRight, User as UserIcon,
  Youtube, Plus, X, Edit2, Eye, EyeOff, Check, AlertCircle,
} from 'lucide-react';
import { adminApi, videoApi } from '../services/api';
import { AdminUserRow, VideoItem } from '../types';
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
  const [tab, setTab] = useState<'users' | 'videos'>('users');

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setTab('users')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === 'users'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Người Dùng</span>
        </button>
        <button
          onClick={() => setTab('videos')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === 'videos'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Youtube className="w-4 h-4" />
          <span>Video YouTube</span>
        </button>
      </div>

      {tab === 'users' ? <UsersTab /> : <VideosTab />}
    </div>
  );
};
