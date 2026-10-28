import React, { useState, useEffect, useCallback } from 'react';
import { Flame, BookOpen, BarChart3, Sparkles, PenTool, Award, Headphones, RefreshCw, TrendingUp, Mic, NotebookPen, Trophy } from 'lucide-react';
import { progressApi, ProgressData, LeaderboardEntry } from '../services/api';

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  flashcard:       { label: 'Flashcard SRS',    icon: <Sparkles className="w-3.5 h-3.5" />,    color: 'text-amber-500' },
  meaning_drill:   { label: 'Viết Theo Nghĩa',  icon: <PenTool className="w-3.5 h-3.5" />,    color: 'text-violet-500' },
  exam:            { label: 'Đề Thi',           icon: <Award className="w-3.5 h-3.5" />,       color: 'text-blue-500' },
  listening:       { label: 'Luyện Nghe',       icon: <Headphones className="w-3.5 h-3.5" />,  color: 'text-emerald-500' },
  speaking:        { label: 'Luyện Nói',        icon: <Mic className="w-3.5 h-3.5" />,         color: 'text-rose-500' },
  sentence_writing:{ label: 'Tập Viết Câu',     icon: <NotebookPen className="w-3.5 h-3.5" />, color: 'text-teal-500' },
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function AccuracyBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] font-semibold mb-1">
        <span className="text-slate-500">Độ chính xác</span>
        <span className={pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export const ProgressDashboard: React.FC = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, lb] = await Promise.all([progressApi.get(), progressApi.getLeaderboard()]);
      setData(d);
      setLeaderboard(lb);
    } catch {
      setError('Không thể tải dữ liệu tiến trình');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">Đang tải tiến trình...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-slate-500 text-sm">{error || 'Lỗi không xác định'}</p>
        <button onClick={load} className="text-xs text-red-600 hover:underline">Thử lại</button>
      </div>
    );
  }

  const hskLevels = [1, 2, 3, 4, 5, 6];
  const hasActivity = data.total_sessions > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span>Tiến Trình Học Tập</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Thống kê cá nhân — cập nhật theo thời gian thực
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200/60 dark:border-orange-900/40 p-4 text-center">
          <Flame className="w-7 h-7 text-orange-500 mx-auto mb-1" />
          <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">{data.streak_days}</div>
          <div className="text-xs font-semibold text-orange-700 dark:text-orange-500 mt-0.5">Ngày liên tiếp</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-900/40 p-4 text-center">
          <BarChart3 className="w-7 h-7 text-blue-500 mx-auto mb-1" />
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{data.total_sessions}</div>
          <div className="text-xs font-semibold text-blue-700 dark:text-blue-500 mt-0.5">Buổi học</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-900/40 p-4 text-center">
          <BookOpen className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{data.total_words}</div>
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-500 mt-0.5">Lượt ôn từ</div>
        </div>
      </div>

      {/* Per-HSK-level breakdown */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Theo cấp độ HSK</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {hskLevels.map(level => {
            const stat = data.by_level[String(level)];
            return (
              <div
                key={level}
                className={`rounded-2xl p-3.5 border transition-all ${
                  stat
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                    stat ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    HSK {level}
                  </span>
                </div>
                {stat ? (
                  <>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{stat.sessions}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">buổi · {stat.words} từ</div>
                    <AccuracyBar value={stat.accuracy} />
                  </>
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-600 mt-2">Chưa học</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Hoạt động gần đây</h3>
        {!hasActivity ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Chưa có buổi học nào</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
              Hãy học Flashcard, Viết Theo Nghĩa hoặc làm Đề Thi để bắt đầu ghi nhận tiến trình!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recent.map(s => {
              const cfg = TYPE_CONFIG[s.session_type] ?? { label: s.session_type, icon: <BookOpen className="w-3.5 h-3.5" />, color: 'text-slate-500' };
              const scorePct = Math.round(s.score * 100);
              return (
                <div key={s.id} className="flex items-center space-x-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 shrink-0 ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cfg.label}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                        HSK {s.hsk_level}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {s.correct_count}/{s.items_count} đúng · {timeAgo(s.created_at)}
                    </div>
                  </div>
                  <div className={`text-sm font-extrabold shrink-0 ${
                    scorePct >= 80 ? 'text-emerald-600 dark:text-emerald-400'
                    : scorePct >= 50 ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {scorePct}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Bảng Xếp Hạng Streak</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaderboard.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                  i === 0 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400' :
                  i === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' :
                  i === 2 ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400' :
                            'bg-slate-50 dark:bg-slate-800/40 text-slate-400'
                }`}>{i + 1}</span>
                {entry.avatar_url
                  ? <img src={entry.avatar_url} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
                  : <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                }
                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{entry.display_name}</span>
                <div className="flex items-center gap-3 text-xs flex-shrink-0">
                  <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
                    <Flame className="w-3.5 h-3.5" />{entry.streak_days} ngày
                  </span>
                  <span className="text-slate-400 hidden sm:block">{entry.total_words.toLocaleString()} từ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
