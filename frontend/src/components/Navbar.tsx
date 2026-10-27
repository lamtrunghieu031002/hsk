import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BookOpen, Sparkles, PenTool, Award, Search, BookMarked, Sun, Moon, Headphones, Shield, LogOut, User as UserIcon, ChevronDown, Trash2, AlertTriangle, TrendingUp, Mic, MoreHorizontal, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSearch,
  isDark,
  setIsDark,
}) => {
  const { user, loading, login, logout, isAdmin } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const PRIMARY_MOBILE = ['vocab', 'flashcards', 'listening', 'speaking'];

  const allTabs = [
    { id: 'vocab',      label: 'Từ Vựng HSK',      icon: BookOpen },
    { id: 'flashcards', label: 'Flashcard SRS',     icon: Sparkles },
    { id: 'writing',    label: 'Tập Viết Chữ',      icon: PenTool },
    { id: 'exams',      label: 'Đề Thi Mô Phỏng',   icon: Award },
    { id: 'grammar',    label: 'Ngữ Pháp',           icon: BookMarked },
    { id: 'listening',  label: 'Luyện Nghe',         icon: Headphones },
    { id: 'speaking',   label: 'Luyện Nói',          icon: Mic },
    ...(user ? [{ id: 'progress', label: 'Tiến Trình', icon: TrendingUp }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'Quản Trị', icon: Shield }] : []),
  ];

  // Desktop: all tabs. Mobile: split primary / secondary
  const tabs = allTabs;
  const mobilePrimary   = allTabs.filter(t => PRIMARY_MOBILE.includes(t.id));
  const mobileSecondary = allTabs.filter(t => !PRIMARY_MOBILE.includes(t.id));

  // Initialize Google Identity Services when script loads
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const init = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await login(response.credential);
          } catch (e) {
            console.error('Login failed:', e);
          }
        },
        auto_select: false,
        context: 'signin',
      });
      setShowLoginButton(true);
    };

    if (window.google) {
      init();
    } else {
      // Script loads async — poll briefly
      const id = setInterval(() => {
        if (window.google) { clearInterval(id); init(); }
      }, 200);
      return () => clearInterval(id);
    }
  }, [login]);

  // Render Google button when dropdown opens
  useEffect(() => {
    if (showUserMenu && !user && googleBtnRef.current && window.google) {
      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        text: 'signin_with',
        locale: 'vi',
        shape: 'pill',
        width: 220,
      });
    }
  }, [showUserMenu, showLoginButton, user, isDark]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  const handleLogout = useCallback(() => {
    setShowUserMenu(false);
    setShowDeleteConfirm(false);
    logout();
  }, [logout]);

  const handleDeleteAccount = useCallback(async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await authApi.deleteMe();
      setShowUserMenu(false);
      setShowDeleteConfirm(false);
      logout();
    } catch {
      setDeleteError('Xóa tài khoản thất bại. Thử lại sau.');
    } finally {
      setDeleting(false);
    }
  }, [logout]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('vocab')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 text-white font-bold text-xl chinese-font">
            漢
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                HSK Mastery
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">HSK 1 → 6 • Python + PostgreSQL</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? tab.id === 'admin'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? (tab.id === 'admin' ? 'text-rose-600 dark:text-rose-400' : 'text-red-600 dark:text-red-400') : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 text-xs transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tra từ tức thì...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
              /
            </kbd>
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Đổi giao diện sáng/tối"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Auth area */}
          {!loading && (
            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-none">{user.name.split(' ').slice(-1)[0]}</div>
                    {user.role === 'admin' && (
                      <div className="text-[10px] font-bold text-red-500 leading-none mt-0.5">Admin</div>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
              )}

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 z-50 overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => { setShowUserMenu(false); setCurrentTab('admin'); }}
                          className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-red-500" />
                          <span>Quản Trị Viên</span>
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-slate-400" />
                        <span>Đăng xuất</span>
                      </button>

                      {/* Delete account section */}
                      <div className="border-t border-slate-100 dark:border-slate-800">
                        {!showDeleteConfirm ? (
                          <button
                            onClick={() => { setShowDeleteConfirm(true); setDeleteError(null); }}
                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa tài khoản</span>
                          </button>
                        ) : (
                          <div className="px-4 py-3 space-y-2.5">
                            <div className="flex items-start space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-2.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu. Không thể hoàn tác.</span>
                            </div>
                            {deleteError && (
                              <p className="text-xs text-rose-600 text-center">{deleteError}</p>
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                                className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors"
                              >
                                {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Đăng nhập để lưu tiến trình học tập
                      </p>
                      {GOOGLE_CLIENT_ID && showLoginButton ? (
                        <div className="flex justify-center">
                          <div ref={googleBtnRef} />
                        </div>
                      ) : (
                        <div className="text-xs text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                          Chưa cấu hình Google OAuth.<br />
                          <span className="font-mono">VITE_GOOGLE_CLIENT_ID</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar — primary tabs + "Thêm" button */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 py-2 px-1">
        {mobilePrimary.map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] font-medium whitespace-nowrap min-w-[56px] ${
                active ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setShowMore(true)}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] font-medium min-w-[56px] ${
            mobileSecondary.some(t => t.id === currentTab)
              ? 'text-red-600 dark:text-red-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>Thêm</span>
        </button>
      </div>

      {/* Mobile "More" bottom sheet */}
      {showMore && (
        <div
          className="md:hidden fixed inset-0 z-50 flex items-end"
          onClick={() => setShowMore(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          {/* Sheet */}
          <div
            className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl pb-safe animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Tính năng khác</span>
              <button
                onClick={() => setShowMore(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {mobileSecondary.map((tab) => {
                const Icon = tab.icon;
                const active = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setCurrentTab(tab.id); setShowMore(false); }}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${
                      active
                        ? tab.id === 'admin'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                          : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-semibold text-center leading-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            {/* iOS home indicator spacer */}
            <div className="h-4" />
          </div>
        </div>
      )}
    </header>
  );
};
