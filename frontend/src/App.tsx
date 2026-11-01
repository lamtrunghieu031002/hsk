import React, { useState, useEffect, useCallback, useRef, lazy, Suspense, memo } from 'react';
import { Volume2, Sparkles, PenTool, NotebookPen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LevelSelector } from './components/LevelSelector';
import { VocabSearchModal } from './components/VocabSearchModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { Vocabulary } from './types';
import { vocabApi } from './services/api';
import { speech } from './utils/speech';

// Lazy-load heavy tab components — each loads only when the tab is first opened
const FlashcardDeck    = lazy(() => import('./components/FlashcardDeck').then(m => ({ default: m.FlashcardDeck })));
const HanziCanvas      = lazy(() => import('./components/HanziCanvas').then(m => ({ default: m.HanziCanvas })));
const ExamView         = lazy(() => import('./components/ExamView').then(m => ({ default: m.ExamView })));
const GrammarList      = lazy(() => import('./components/GrammarList').then(m => ({ default: m.GrammarList })));
const YoutubeListening = lazy(() => import('./components/YoutubeListening').then(m => ({ default: m.YoutubeListening })));
const MeaningDrill     = lazy(() => import('./components/MeaningDrill').then(m => ({ default: m.MeaningDrill })));
const AdminPanel       = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const ProgressDashboard = lazy(() => import('./components/ProgressDashboard').then(m => ({ default: m.ProgressDashboard })));
const SpeechPractice   = lazy(() => import('./components/SpeechPractice').then(m => ({ default: m.SpeechPractice })));
const SentenceWriting  = lazy(() => import('./components/SentenceWriting').then(m => ({ default: m.SentenceWriting })));

const TabFallback = () => (
  <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
    Đang tải...
  </div>
);

// ── Memoized vocab card ───────────────────────────────────────────────────────

interface VocabCardProps {
  word: Vocabulary;
  onSpeak: (simplified: string) => void;
  onWrite: (word: Vocabulary) => void;
}

const VocabCard = memo<VocabCardProps>(({ word, onSpeak, onWrite }) => (
  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-red-300 dark:hover:border-red-900/60 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
          {word.part_of_speech || 'Từ loại'}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onSpeak(word.simplified)}
            className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Nghe phát âm"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onWrite(word)}
            className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            title="Tập viết chữ này"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline space-x-3 mb-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white chinese-font">
          {word.simplified}
        </span>
        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
          {word.pinyin}
        </span>
        {word.han_viet && (
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
            {word.han_viet}
          </span>
        )}
      </div>

      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {word.meaning_vi}
      </div>
      {word.meaning_en && (
        <div className="text-xs text-slate-400 italic mt-0.5">
          {word.meaning_en}
        </div>
      )}
    </div>

    {word.examples.length > 0 && (
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
        <div className="font-semibold text-slate-700 dark:text-slate-300 chinese-font">
          {word.examples[0].chinese}
        </div>
        <div className="text-red-500 text-[11px] mt-0.5 font-medium">
          {word.examples[0].pinyin}
        </div>
        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
          {word.examples[0].meaning_vi}
        </div>
      </div>
    )}
  </div>
));

// ── App ───────────────────────────────────────────────────────────────────────

const VOCAB_PAGE = 60; // cards rendered per batch

export const App: React.FC = () => {
  const [currentTab, setCurrentTab]           = useState<string>('vocab');
  const [selectedLevel, setSelectedLevel]     = useState<number>(1);
  const [vocabList, setVocabList]             = useState<Vocabulary[]>([]);
  const [totalVocab, setTotalVocab]           = useState<number>(0);
  const [stats, setStats]                     = useState<Record<string, number>>({});
  const [isSearchOpen, setIsSearchOpen]       = useState<boolean>(false);
  const [activeWritingWord, setActiveWritingWord] = useState<Vocabulary | null>(null);
  const [loading, setLoading]                 = useState<boolean>(false);
  const [drillMode, setDrillMode]             = useState<boolean>(false);
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState<string>('');
  const [partsOfSpeech, setPartsOfSpeech]     = useState<string[]>([]);

  // Dark mode — init from localStorage, fallback to system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('hsk_dark_mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  // Progressive vocab render — only mount VOCAB_PAGE cards at a time
  const [visibleCount, setVisibleCount] = useState(VOCAB_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // In-memory vocab cache per level
  const vocabCacheRef = useRef<Map<number, Vocabulary[]>>(new Map());

  // Stable ref for isSearchOpen keyboard handler
  const isSearchOpenRef = useRef(isSearchOpen);
  useEffect(() => { isSearchOpenRef.current = isSearchOpen; }, [isSearchOpen]);

  // Apply dark mode + persist to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('hsk_dark_mode', String(isDark));
  }, [isDark]);

  // Load vocab stats on mount
  useEffect(() => {
    vocabApi.getStats()
      .then(data => setStats(data.by_level))
      .catch(e => console.warn('stats:', e));
  }, []);

  // Load parts of speech when level changes
  useEffect(() => {
    setPartOfSpeechFilter('');
    vocabApi.getPartsOfSpeech(selectedLevel).then(setPartsOfSpeech).catch(() => {});
  }, [selectedLevel]);

  // Fetch vocab when level or part_of_speech filter changes
  useEffect(() => {
    setVisibleCount(VOCAB_PAGE);
    if (!partOfSpeechFilter) {
      const cached = vocabCacheRef.current.get(selectedLevel);
      if (cached) { setVocabList(cached); setTotalVocab(cached.length); return; }
    }
    let cancelled = false;
    setLoading(true);
    vocabApi.list(selectedLevel, undefined, 1, 500, partOfSpeechFilter || undefined)
      .then(res => {
        if (cancelled) return;
        if (!partOfSpeechFilter) vocabCacheRef.current.set(selectedLevel, res.items);
        setVocabList(res.items);
        setTotalVocab(res.total);
        setActiveWritingWord(prev => prev ?? res.items[0] ?? null);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedLevel, partOfSpeechFilter]);

  // IntersectionObserver — load more vocab cards when sentinel enters viewport
  useEffect(() => {
    if (!sentinelRef.current || visibleCount >= vocabList.length) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(c => Math.min(c + VOCAB_PAGE, vocabList.length));
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [vocabList.length, visibleCount]);

  // Keyboard shortcut: '/' opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpenRef.current) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectLevel = useCallback((level: number) => {
    setSelectedLevel(level);
  }, []);

  const handleOpenWriting = useCallback((word: Vocabulary) => {
    setActiveWritingWord(word);
    setCurrentTab('writing');
  }, []);

  const handleSpeak = useCallback((simplified: string) => {
    speech.speak(simplified);
  }, []);

  return (
    <AuthProvider>
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <LevelSelector
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          stats={stats}
        />

        {/* key=currentTab resets ErrorBoundary when switching tabs */}
        <ErrorBoundary key={currentTab}>
          <Suspense fallback={<TabFallback />}>

            {/* Tab 1: Từ Vựng HSK */}
            {currentTab === 'vocab' && (
              drillMode ? (
                <MeaningDrill
                  cards={vocabList}
                  onClose={() => setDrillMode(false)}
                />
              ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Từ Vựng Chuẩn HSK {selectedLevel}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {loading ? 'Đang tải...' : `${Math.min(visibleCount, totalVocab)} / ${totalVocab} từ · Hỗ trợ phát âm chuẩn & phân tích Hán Việt`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {partsOfSpeech.length > 0 && (
                      <select
                        value={partOfSpeechFilter}
                        onChange={e => setPartOfSpeechFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-colors"
                      >
                        <option value="">Tất cả từ loại</option>
                        {partsOfSpeech.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    )}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setDrillMode(true)}
                      disabled={vocabList.length === 0}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <NotebookPen className="w-4 h-4" />
                      <span>Viết Theo Nghĩa</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('flashcards')}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Flashcard ({vocabList.length} từ)</span>
                    </button>
                  </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-16 text-slate-400 text-sm">
                    Đang nạp từ vựng từ cơ sở dữ liệu PostgreSQL...
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vocabList.slice(0, visibleCount).map(word => (
                        <VocabCard
                          key={word.id}
                          word={word}
                          onSpeak={handleSpeak}
                          onWrite={handleOpenWriting}
                        />
                      ))}
                    </div>

                    {/* Sentinel — triggers loading more cards */}
                    {visibleCount < vocabList.length && (
                      <div ref={sentinelRef} className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
                        Đang tải thêm...
                      </div>
                    )}

                    {visibleCount >= vocabList.length && vocabList.length > VOCAB_PAGE && (
                      <p className="text-center text-xs text-slate-400 dark:text-slate-600 py-2">
                        ✓ Đã hiển thị tất cả {vocabList.length} từ HSK {selectedLevel}
                      </p>
                    )}
                  </>
                )}
              </div>
              )
            )}

            {/* Tab 2: Flashcards 3D & SRS */}
            {currentTab === 'flashcards' && (
              <FlashcardDeck
                cards={vocabList}
                onFinish={() => setCurrentTab('vocab')}
              />
            )}

            {/* Tab 3: Tập Viết Chữ Hán */}
            {currentTab === 'writing' && (() => {
              const writingIdx = vocabList.findIndex(w => w.id === activeWritingWord?.id);
              return (
              <div className="my-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Luyện Viết Chữ Hán Từng Nét
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mô phỏng vector SVG và kiểm tra đúng thứ tự nét bút (Stroke Order)
                  </p>
                </div>

                {/* Prev / Next navigation */}
                {vocabList.length > 0 && (
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={() => writingIdx > 0 && setActiveWritingWord(vocabList[writingIdx - 1])}
                      disabled={writingIdx <= 0}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Trước
                    </button>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                      {writingIdx + 1} / {vocabList.length}
                    </span>
                    <button
                      onClick={() => writingIdx < vocabList.length - 1 && setActiveWritingWord(vocabList[writingIdx + 1])}
                      disabled={writingIdx >= vocabList.length - 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
                    >
                      Sau <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <HanziCanvas
                  char={activeWritingWord?.simplified || '学'}
                  pinyin={activeWritingWord?.pinyin || 'xué'}
                  meaning={activeWritingWord?.meaning_vi || 'Học, học tập'}
                  hanViet={activeWritingWord?.han_viet || 'học'}
                />
                <div className="max-w-xl mx-auto mt-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Chọn từ trong HSK {selectedLevel} để tập viết:
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {vocabList.map(w => (
                      <button
                        key={w.id}
                        onClick={() => setActiveWritingWord(w)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-bold chinese-font transition-all ${
                          activeWritingWord?.id === w.id
                            ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400'
                        }`}
                      >
                        {w.simplified}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              );
            })()}

            {/* Tab 4: Đề Thi Mô Phỏng */}
            {currentTab === 'exams' && <ExamView selectedLevel={selectedLevel} />}

            {/* Tab 5: Ngữ Pháp */}
            {currentTab === 'grammar' && <GrammarList selectedLevel={selectedLevel} />}

            {/* Tab 6: Luyện Nghe YouTube */}
            {currentTab === 'listening' && <YoutubeListening selectedLevel={selectedLevel} />}

            {/* Tab 7: Luyện Nói */}
            {currentTab === 'speaking' && (
              <SpeechPractice
                cards={vocabList}
                onClose={() => setCurrentTab('vocab')}
              />
            )}

            {/* Tab 8: Tập Viết Câu */}
            {currentTab === 'sentence-writing' && (
              <SentenceWriting selectedLevel={selectedLevel} />
            )}

            {/* Tab 9: Tiến Trình */}
            {currentTab === 'progress' && <ProgressDashboard />}

            {/* Tab 10: Admin Panel */}
            {currentTab === 'admin' && <AdminPanel />}

          </Suspense>
        </ErrorBoundary>
      </main>

      <VocabSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectWord={word => {
          setSelectedLevel(word.hsk_level);
          setActiveWritingWord(word);
        }}
      />
    </div>
    </AuthProvider>
  );
};
