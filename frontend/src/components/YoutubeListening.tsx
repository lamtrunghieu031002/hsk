import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Youtube, Headphones, ExternalLink, PlayCircle, PenLine, RotateCcw, Check, BookOpen, ChevronDown, ChevronUp, Award, AlertCircle, ListOrdered } from 'lucide-react';
import { DictationMode } from './DictationMode';
import { videoApi } from '../services/api';
import { VideoItem } from '../types';

const DICTATION_KEY = (videoId: string) => `hsk_dictation_${videoId}`;
const ANSWER_KEY    = (videoId: string) => `hsk_answer_${videoId}`;

const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  1: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400',
  2: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
  3: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
  4: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400',
  5: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400',
  6: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400',
};

interface Props {
  selectedLevel: number;
}

import { ScoreResult, computeDiff } from '../utils/dictation';

export const YoutubeListening: React.FC<Props> = ({ selectedLevel }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null); // YouTube video_id
  const [levelFilter, setLevelFilter] = useState<number>(0);

  // Dictation state
  const [dictationText, setDictationText] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scoring state
  const [answerText, setAnswerText] = useState('');
  const [showScoring, setShowScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  // Dictation lesson mode
  const [lessonMode, setLessonMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch videos from API
  useEffect(() => {
    videoApi.list().then(data => {
      setVideos(data);
      setVideosLoading(false);
    }).catch(() => setVideosLoading(false));
  }, []);

  // Sync level filter with selectedLevel when tab loads
  useEffect(() => {
    setLevelFilter(selectedLevel === 0 ? 0 : selectedLevel);
  }, [selectedLevel]);

  // Load saved dictation + answer when active video changes
  useEffect(() => {
    if (activeVideoId) {
      setDictationText(localStorage.getItem(DICTATION_KEY(activeVideoId)) || '');
      setAnswerText(localStorage.getItem(ANSWER_KEY(activeVideoId)) || '');
      setSaveStatus('idle');
      setShowClearConfirm(false);
      setScoreResult(null);
    } else {
      setDictationText('');
      setAnswerText('');
      setScoreResult(null);
    }
  }, [activeVideoId]);

  // Auto-save dictation with 1s debounce
  const handleDictationChange = useCallback((value: string) => {
    setDictationText(value);
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (activeVideoId) {
        localStorage.setItem(DICTATION_KEY(activeVideoId), value);
        setSaveStatus('saved');
        savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 1000);
  }, [activeVideoId]);

  const handleClearDictation = () => {
    if (!activeVideoId) return;
    setDictationText('');
    localStorage.removeItem(DICTATION_KEY(activeVideoId));
    setSaveStatus('idle');
    setShowClearConfirm(false);
  };

  const handleAnswerChange = (value: string) => {
    setAnswerText(value);
    setScoreResult(null);
    if (activeVideoId) localStorage.setItem(ANSWER_KEY(activeVideoId), value);
  };

  const handleScore = () => {
    if (!answerText.trim() || !dictationText.trim()) return;
    setScoreResult(computeDiff(dictationText, answerText));
  };

  const handleResetScore = () => {
    setScoreResult(null);
    setDictationText('');
    if (activeVideoId) localStorage.removeItem(DICTATION_KEY(activeVideoId));
    setSaveStatus('idle');
  };

  const chineseCharCount = useMemo(
    () => (dictationText.match(/[一-鿿]/g) || []).length,
    [dictationText]
  );

  const filtered = useMemo(
    () => levelFilter === 0 ? videos : videos.filter(v => v.hsk_level === levelFilter),
    [videos, levelFilter]
  );
  const activeVideo = useMemo(
    () => activeVideoId ? videos.find(v => v.video_id === activeVideoId) ?? null : null,
    [videos, activeVideoId]
  );

  return (
    <div className="max-w-7xl mx-auto my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Headphones className="w-6 h-6 text-red-500" />
            <span>Luyện Nghe Qua YouTube</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nhúng video YouTube luyện nghe trực tiếp — phân loại theo cấp độ HSK
          </p>
        </div>
      </div>

      {/* Channel banner */}
      <a
        href="https://www.youtube.com/@ChineseDailyPodcast/playlists"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 hover:border-red-400 transition-colors group"
      >
        <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-700 dark:text-red-300 group-hover:underline">
            Chinese Daily Podcast
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {videos.length} video tuyển chọn • Podcast tiếng Trung HSK 1–6 • Nhấn để xem toàn bộ kênh
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-red-400 flex-shrink-0" />
      </a>

      {/* Level filter tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[0, 1, 2, 3, 4, 5, 6].map((lvl) => {
          const count = lvl === 0 ? videos.length : videos.filter((v) => v.hsk_level === lvl).length;
          return (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                levelFilter === lvl
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-300'
              }`}
            >
              {lvl === 0 ? `Tất Cả (${count})` : `HSK ${lvl} (${count})`}
            </button>
          );
        })}
      </div>

      {/* Main layout: Player + list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Player Column */}
        <div className="lg:col-span-3">
          {activeVideoId ? (
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-2xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  ref={iframeRef}
                  key={activeVideoId}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&enablejsapi=1`}
                  title={activeVideo?.title || 'YouTube Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activeVideo && (
                <div className="bg-white dark:bg-slate-900">
                  {/* Video info */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2">
                          {activeVideo.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
                          <Youtube className="w-3.5 h-3.5 text-red-500" />
                          <span>{activeVideo.channel}</span>
                        </p>
                        {activeVideo.description && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 italic">
                            {activeVideo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${LEVEL_COLORS[activeVideo.hsk_level]}`}>
                          HSK {activeVideo.hsk_level}
                        </span>
                        <button
                          onClick={() => setLessonMode(lm => !lm)}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                            lessonMode
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-900 hover:bg-violet-100'
                          }`}
                          title="Luyện dictation từng đoạn kiểu DailyDictation"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Từng Đoạn</span>
                        </button>
                        <a
                          href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Mở trên YouTube"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ── Dictation panel ── */}
                  <div className="p-4 space-y-4">

                    {/* ── Free-type mode ── */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <PenLine className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Nghe &amp; Gõ Lại
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {saveStatus === 'saved' && (
                          <span className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Check className="w-3.5 h-3.5" /><span>Đã lưu</span>
                          </span>
                        )}
                        {saveStatus === 'saving' && (
                          <span className="text-xs text-slate-400 italic">Đang lưu...</span>
                        )}
                        {dictationText.length > 0 && !showClearConfirm && !scoreResult && (
                          <button onClick={() => setShowClearConfirm(true)}
                            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-500 transition-colors">
                            <RotateCcw className="w-3.5 h-3.5" /><span>Xóa</span>
                          </button>
                        )}
                        {showClearConfirm && (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs text-rose-500 font-medium">Xóa hết?</span>
                            <button onClick={handleClearDictation}
                              className="text-xs px-2 py-0.5 rounded-lg bg-rose-600 text-white font-bold">Xóa</button>
                            <button onClick={() => setShowClearConfirm(false)}
                              className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">Hủy</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Typing area — hidden after grading, shown again via "Thử lại" */}
                    {!scoreResult && (
                      <>
                        <textarea
                          value={dictationText}
                          onChange={(e) => handleDictationChange(e.target.value)}
                          placeholder={'Nghe video → tạm dừng → gõ lại bằng tiếng Trung...\n例：我每天早上六点起床，然后去跑步。'}
                          rows={5}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none leading-relaxed chinese-font transition-colors"
                          style={{ fontSize: '1.05rem' }}
                          lang="zh"
                        />
                        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span><span className="font-bold text-violet-600 dark:text-violet-400">{chineseCharCount}</span> chữ Hán</span>
                            </span>
                            <span><span className="font-semibold text-slate-500">{dictationText.length}</span> ký tự</span>
                          </div>
                          <span className="italic">Tự lưu</span>
                        </div>
                      </>
                    )}

                    {/* ── Scoring section ── */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      {/* Toggle header */}
                      <button
                        onClick={() => { setShowScoring(s => !s); setScoreResult(null); }}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Chấm Điểm</span>
                          <span className="text-xs text-slate-400">(nhập đáp án đúng để so sánh)</span>
                        </div>
                        {showScoring
                          ? <ChevronUp className="w-4 h-4 text-slate-400" />
                          : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {showScoring && (
                        <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                          {!scoreResult ? (
                            <>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Dán đoạn văn / câu đúng từ phụ đề hoặc transcript vào đây rồi nhấn <strong>Chấm điểm</strong>:
                              </p>
                              <textarea
                                value={answerText}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                placeholder="Dán đáp án đúng vào đây... 例：我每天早上六点起床，然后去跑步。"
                                rows={3}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-none leading-relaxed chinese-font"
                                lang="zh"
                              />
                              <button
                                onClick={handleScore}
                                disabled={!answerText.trim() || !dictationText.trim()}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                              >
                                Chấm Điểm →
                              </button>
                            </>
                          ) : (
                            /* ── Score result ── */
                            <div className="space-y-4">
                              {/* Big score */}
                              <div className={`rounded-2xl p-4 flex items-center justify-between ${
                                scoreResult.score >= 80
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900'
                                  : scoreResult.score >= 50
                                  ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900'
                                  : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900'
                              }`}>
                                <div>
                                  <div className="text-4xl font-extrabold tracking-tight" style={{
                                    color: scoreResult.score >= 80 ? '#059669' : scoreResult.score >= 50 ? '#d97706' : '#e11d48'
                                  }}>
                                    {scoreResult.score}%
                                  </div>
                                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                                    {scoreResult.correctCount} / {scoreResult.totalCount} chữ Hán đúng
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-xs font-bold">
                                    {scoreResult.score >= 90 ? '🏆 Xuất sắc!' :
                                     scoreResult.score >= 80 ? '🎉 Tốt lắm!' :
                                     scoreResult.score >= 60 ? '💪 Khá ổn!' :
                                     scoreResult.score >= 40 ? '📖 Cần ôn thêm' : '🔁 Thử lại nào!'}
                                  </div>
                                  <div className="flex items-center space-x-2 text-[11px]">
                                    <span className="flex items-center space-x-0.5">
                                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                                      <span className="text-slate-500">Đúng</span>
                                    </span>
                                    <span className="flex items-center space-x-0.5">
                                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                                      <span className="text-slate-500">Thiếu</span>
                                    </span>
                                    <span className="flex items-center space-x-0.5">
                                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-600 inline-block" />
                                      <span className="text-slate-500">Thừa</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Answer comparison */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                                    Đáp án đúng
                                  </p>
                                  <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-lg leading-loose chinese-font flex flex-wrap">
                                    {scoreResult.answerTokens.map((tk, idx) => (
                                      <span
                                        key={idx}
                                        className={`inline-block font-bold ${
                                          tk.status === 'correct'
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-rose-600 dark:text-rose-400 underline decoration-rose-400 decoration-2 underline-offset-2'
                                        }`}
                                      >
                                        {tk.char}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                                    Bạn đã gõ
                                  </p>
                                  <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-lg leading-loose chinese-font flex flex-wrap">
                                    {scoreResult.typedTokens.length > 0
                                      ? scoreResult.typedTokens.map((tk, idx) => (
                                          <span
                                            key={idx}
                                            className={`inline-block font-bold ${
                                              tk.status === 'correct'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-400 dark:text-slate-500 line-through'
                                            }`}
                                          >
                                            {tk.char}
                                          </span>
                                        ))
                                      : <span className="text-slate-300 dark:text-slate-600 italic text-sm">Chưa gõ chữ Hán nào</span>
                                    }
                                  </div>
                                </div>

                                {scoreResult.score < 100 && (
                                  <div className="flex items-start space-x-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                      Chữ gạch chân đỏ = thiếu hoặc gõ sai vị trí. Chữ gạch ngang xám = gõ thừa không có trong đáp án.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Retry button */}
                              <button
                                onClick={handleResetScore}
                                className="w-full py-2.5 rounded-xl border-2 border-violet-400 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold text-sm hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors flex items-center justify-center space-x-2"
                              >
                                <RotateCcw className="w-4 h-4" />
                                <span>Thử Lại — Gõ Lại Từ Đầu</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center p-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Chọn một video để phát</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Nhấp vào video bên phải để bắt đầu luyện nghe
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video List Column */}
        <div className="lg:col-span-2 space-y-2 max-h-[760px] overflow-y-auto pr-1">
          {videosLoading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Đang tải danh sách video...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Chưa có video cho cấp độ này.
            </div>
          ) : (
            filtered.map((video) => {
              const isActive = video.video_id === activeVideoId;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.video_id)}
                  className={`group relative p-4 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/30 shadow-md shadow-red-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 dark:hover:border-red-900/60 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-red-600/70 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold line-clamp-2 leading-snug ${
                        isActive ? 'text-red-700 dark:text-red-300' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center space-x-1">
                        <Youtube className="w-3 h-3 text-red-400" />
                        <span className="truncate">{video.channel}</span>
                      </p>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${LEVEL_COLORS[video.hsk_level]}`}>
                        HSK {video.hsk_level}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── DictationMode panel (full-width, below grid) ── */}
      {lessonMode && activeVideoId && activeVideo && (
        <div className="rounded-3xl border border-violet-200 dark:border-violet-900/50 bg-white dark:bg-slate-900 p-5 shadow-lg shadow-violet-500/5">
          <DictationMode
            videoId={activeVideoId}
            videoTitle={activeVideo.title}
            iframeRef={iframeRef}
            onClose={() => setLessonMode(false)}
          />
        </div>
      )}
    </div>
  );
};
