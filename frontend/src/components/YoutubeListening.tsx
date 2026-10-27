import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Plus, Trash2, Youtube, X, Headphones, ExternalLink, PlayCircle, PenLine, RotateCcw, Check, BookOpen, ChevronDown, ChevronUp, Award, AlertCircle, ListOrdered } from 'lucide-react';
import { DictationMode } from './DictationMode';

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  hsk_level: number;
  description?: string;
  custom?: boolean;
}

// Tất cả video từ kênh Chinese Daily Podcast (@ChineseDailyPodcast)
const CURATED: VideoItem[] = [
  // ── HSK 1 ──────────────────────────────────────────────────────────────
  {
    id: 'MYQrQvbR8Vk',
    title: 'HSK 1–2 | 我的一天 My Daily Routine | Learn Everyday Chinese',
    channel: 'Chinese Daily Podcast',
    hsk_level: 1,
    description: 'Hội thoại sinh hoạt hàng ngày, từ vựng cơ bản, tốc độ chậm',
  },
  {
    id: '47fGvpEV_Go',
    title: 'HSK 1–2 | A Natural Chinese Conversation About Food | 中国美食对话',
    channel: 'Chinese Daily Podcast',
    hsk_level: 1,
    description: 'Hội thoại tự nhiên về ẩm thực Trung Quốc, từ vựng HSK 1-2',
  },
  // ── HSK 2 ──────────────────────────────────────────────────────────────
  {
    id: 'eD3sKIMFuK8',
    title: 'HSK 2+ | Modern Survival Skills: Don\'t Buy, Don\'t Do | 现代生存技能',
    channel: 'Chinese Daily Podcast',
    hsk_level: 2,
    description: 'Kỹ năng sống hiện đại, từ vựng HSK 2+ thực dụng',
  },
  {
    id: 'GFPOvOvFgQI',
    title: 'HSK 1–3 | 像泡茶一样学中文 | Learn Chinese Like Making Tea',
    channel: 'Chinese Daily Podcast',
    hsk_level: 2,
    description: 'Học tiếng Trung qua câu chuyện pha trà — nhẹ nhàng, dễ theo',
  },
  {
    id: 'ARQHZCOH10A',
    title: 'Daily Chinese Podcast for Beginner and Intermediate Learners',
    channel: 'Chinese Daily Podcast',
    hsk_level: 2,
    description: 'Podcast hàng ngày dành cho người học sơ & trung cấp',
  },
  // ── HSK 3 ──────────────────────────────────────────────────────────────
  {
    id: 'MJTAYI52T3w',
    title: 'HSK 3 | What Is the Lantern Festival? | 什么是元宵节？',
    channel: 'Chinese Daily Podcast',
    hsk_level: 3,
    description: 'Tìm hiểu lễ Nguyên Tiêu — văn hóa & từ vựng HSK 3',
  },
  {
    id: 'DvSaq8UPv_w',
    title: 'HSK 3–4 | The Legend of the 12 Zodiac Animals | 十二生肖的传说',
    channel: 'Chinese Daily Podcast',
    hsk_level: 3,
    description: 'Truyền thuyết 12 con giáp — kể chuyện sinh động cấp 3-4',
  },
  {
    id: 'kVsxl4gbPrw',
    title: 'HSK 3–4 | Why Lunar New Year Matters in Chinese Culture | 春节为什么这么重要？',
    channel: 'Chinese Daily Podcast',
    hsk_level: 3,
    description: 'Tết Âm lịch trong văn hóa Trung Hoa — HSK 3-4',
  },
  {
    id: '0WsXRQFkY4s',
    title: 'HSK 3+ | Learn Chinese with Stories about Happiness | 听故事学中文',
    channel: 'Chinese Daily Podcast',
    hsk_level: 3,
    description: 'Học tiếng Trung qua câu chuyện về hạnh phúc — HSK 3+',
  },
  // ── HSK 4 ──────────────────────────────────────────────────────────────
  {
    id: 'cF6ur3rkhM8',
    title: 'HSK 1–4 | Chinese Listening Practice | Why You Must Listen First',
    channel: 'Chinese Daily Podcast',
    hsk_level: 4,
    description: 'Vì sao phải luyện nghe trước? Podcast đa cấp HSK 1-4',
  },
  {
    id: '3mHlegzXELA',
    title: 'HSK 3–5 | Ancient Wisdom | 3 Chinese Fables | 成语故事',
    channel: 'Chinese Daily Podcast',
    hsk_level: 4,
    description: '3 câu chuyện ngụ ngôn thành ngữ Trung Hoa — tư duy phản biện',
  },
  {
    id: 'AI6Y37T772k',
    title: '学会倾听与消除误会 | How to Listen & Avoid Misunderstandings | Chinese Bedtime Story',
    channel: 'Chinese Daily Podcast',
    hsk_level: 4,
    description: 'Câu chuyện ngủ bằng tiếng Trung — kỹ năng lắng nghe & tránh hiểu lầm',
  },
  // ── HSK 5 ──────────────────────────────────────────────────────────────
  {
    id: 'V1xjCi-1EKU',
    title: 'HSK 4–5 | Conversations on Habits | Chinese Listening Practice',
    channel: 'Chinese Daily Podcast',
    hsk_level: 5,
    description: 'Hội thoại về thói quen hàng ngày — tốc độ tự nhiên HSK 4-5',
  },
  {
    id: 'KtbmTlU9d3M',
    title: 'HSK 4–5 | 酒逢知己千杯少 | Drinking with a True Friend',
    channel: 'Chinese Daily Podcast',
    hsk_level: 5,
    description: 'Thành ngữ "rượu gặp tri kỷ ngàn chén vẫn ít" — HSK 4-5',
  },
  // ── HSK 6 ──────────────────────────────────────────────────────────────
  {
    id: 'MZbnUUWtZv4',
    title: '你真的变了吗？成年人的成长瞬间 | Subtle Signs of Growing Up',
    channel: 'Chinese Daily Podcast',
    hsk_level: 6,
    description: 'Những khoảnh khắc trưởng thành tinh tế — tốc độ bản ngữ',
  },
  {
    id: '468fViDwrlE',
    title: '孝顺还是盲从？ | Filial Piety vs Obedience in China',
    channel: 'Chinese Daily Podcast',
    hsk_level: 6,
    description: 'Hiếu thuận hay tuân lệnh mù quáng? — chủ đề xã hội học thuật',
  },
];

import { ScoreResult, computeDiff } from '../utils/dictation';

const STORAGE_KEY = 'hsk_custom_videos';
const DICTATION_KEY = (videoId: string) => `hsk_dictation_${videoId}`;
const ANSWER_KEY    = (videoId: string) => `hsk_answer_${videoId}`;

function extractYoutubeId(input: string): string | null {
  const s = input.trim();
  // Already just an ID (11 chars, no slash)
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  // youtu.be/ID
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  // youtube.com/watch?v=ID
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  // youtube.com/embed/ID
  const embed = s.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return null;
}

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

export const YoutubeListening: React.FC<Props> = ({ selectedLevel }) => {
  const [customVideos, setCustomVideos] = useState<VideoItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<number>(0);
  const [showAdd, setShowAdd] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [channelInput, setChannelInput] = useState('');
  const [addError, setAddError] = useState('');

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

  // Sync level filter with selectedLevel when tab loads
  useEffect(() => {
    setLevelFilter(selectedLevel === 0 ? 0 : selectedLevel);
  }, [selectedLevel]);

  // Persist custom videos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customVideos));
  }, [customVideos]);

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

  const allVideos = useMemo(() => [...CURATED, ...customVideos], [customVideos]);
  const filtered = useMemo(
    () => levelFilter === 0 ? allVideos : allVideos.filter(v => v.hsk_level === levelFilter),
    [allVideos, levelFilter]
  );
  const activeVideo = useMemo(
    () => activeVideoId ? allVideos.find(v => v.id === activeVideoId) ?? null : null,
    [allVideos, activeVideoId]
  );

  const handleAdd = () => {
    setAddError('');
    const videoId = extractYoutubeId(urlInput);
    if (!videoId) {
      setAddError('URL YouTube không hợp lệ. Hãy dán link từ youtube.com hoặc youtu.be');
      return;
    }
    if (allVideos.some((v) => v.id === videoId)) {
      setAddError('Video này đã có trong danh sách');
      return;
    }
    const newVideo: VideoItem = {
      id: videoId,
      title: titleInput.trim() || `Video ${videoId}`,
      channel: channelInput.trim() || 'Kênh tùy chỉnh',
      hsk_level: levelFilter === 0 ? 1 : levelFilter,
      custom: true,
    };
    setCustomVideos((prev) => [...prev, newVideo]);
    setActiveVideoId(videoId);
    setUrlInput('');
    setTitleInput('');
    setChannelInput('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setCustomVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideoId === id) setActiveVideoId(null);
  };

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
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Video</span>
        </button>
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
            16 video tuyển chọn • Podcast tiếng Trung HSK 1–6 • Nhấn để xem toàn bộ kênh
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-red-400 flex-shrink-0" />
      </a>

      {/* Level filter tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[0, 1, 2, 3, 4, 5, 6].map((lvl) => {
          const count = lvl === 0 ? allVideos.length : allVideos.filter((v) => v.hsk_level === lvl).length;
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
                  Nhấp vào video bên phải hoặc thêm link YouTube của bạn
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video List Column */}
        <div className="lg:col-span-2 space-y-2 max-h-[760px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Chưa có video cho cấp độ này. Nhấn "+ Thêm Video" để thêm!
            </div>
          ) : (
            filtered.map((video) => {
              const isActive = video.id === activeVideoId;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
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
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
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

                  {/* Delete button for custom videos */}
                  {video.custom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video.id);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-lg text-slate-300 dark:text-slate-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa video này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
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

      {/* Add Video Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                  <Youtube className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Thêm Video YouTube</h3>
              </div>
              <button
                onClick={() => { setShowAdd(false); setAddError(''); setUrlInput(''); setTitleInput(''); setChannelInput(''); }}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Link YouTube <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setAddError(''); }}
                  placeholder="https://www.youtube.com/watch?v=... hoặc youtu.be/..."
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  autoFocus
                />
                {addError && (
                  <p className="mt-1.5 text-xs text-rose-500">{addError}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Tiêu đề (tùy chọn)
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Tên video hiển thị trong danh sách..."
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Tên kênh (tùy chọn)
                </label>
                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="Ví dụ: Comprehensible Chinese, CCTV..."
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>

              <div className="pt-1 flex space-x-2">
                <button
                  onClick={() => { setShowAdd(false); setAddError(''); setUrlInput(''); setTitleInput(''); setChannelInput(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Thêm vào danh sách
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
