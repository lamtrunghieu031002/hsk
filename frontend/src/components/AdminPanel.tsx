import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Trash2, RefreshCw, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { adminApi } from '../services/api';
import { AdminUserRow } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const AdminPanel: React.FC = () => {
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
