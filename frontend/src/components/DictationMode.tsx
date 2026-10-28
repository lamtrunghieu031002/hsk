import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pinyin } from 'pinyin-pro';
import {
  X, Play, Square, RotateCcw, CheckCircle2, ChevronLeft, ChevronRight,
  Turtle, Award, Download, AlertCircle, SkipForward, Volume2,
  Eye, EyeOff, Repeat, Headphones, BookOpen, Sparkles,
} from 'lucide-react';
import {
  Segment, ScoreResult, computeDiff, parseTranscript,
  formatTime, speakSegment, cjkCount, isCJK,
} from '../utils/dictation';
import { transcriptApi, progressApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'full' | 'blank' | 'listen';
type Filter = 'all' | 'wrong' | 'todo';

interface RowState {
  input: string;
  checked: boolean;
  result?: ScoreResult;
  playCount: number;
  skipped: boolean;
}

interface Props {
  videoId: string;
  videoTitle: string;
  hskLevel?: number;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onClose: () => void;
  autoFetch?: boolean;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5] as const;

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function ytSeekPlay(iframe: HTMLIFrameElement | null, seconds: number) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }), '*');
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
}
function ytPause(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
}

// ─── Blank generation ─────────────────────────────────────────────────────────

function makeBlanks(text: string, rate = 0.4): string {
  return [...text].map(c => (isCJK(c) && Math.random() < rate ? '□' : c)).join('');
}

// ─── Pinyin-per-char display ──────────────────────────────────────────────────

const PinyinText: React.FC<{ text: string; showPinyin: boolean; className?: string }> = ({
  text, showPinyin, className = '',
}) => {
  if (!showPinyin) {
    return <span className={`chinese-font ${className}`}>{text}</span>;
  }
  const chars = [...text].map(c => ({
    c,
    py: isCJK(c) ? pinyin(c, { toneType: 'symbol' }) : '',
  }));
  return (
    <span className={`inline-flex flex-wrap items-end leading-none gap-px ${className}`}>
      {chars.map((item, i) => (
        <span key={i} className="inline-flex flex-col items-center">
          <span className="text-[9px] text-red-400 dark:text-red-400 leading-none h-3 flex items-end">
            {item.py}
          </span>
          <span className="chinese-font text-sm leading-tight">{item.c}</span>
        </span>
      ))}
    </span>
  );
};

// ─── Status dot ───────────────────────────────────────────────────────────────

function rowStatus(row: RowState): 'done' | 'close' | 'wrong' | 'skip' | 'todo' {
  if (!row.checked && !row.skipped) return 'todo';
  if (row.skipped) return 'skip';
  const s = row.result?.score ?? 0;
  if (s >= 90) return 'done';
  if (s >= 60) return 'close';
  return 'wrong';
}

const DOT_CLS: Record<string, string> = {
  done:  'bg-emerald-500',
  close: 'bg-amber-400',
  wrong: 'bg-rose-500',
  skip:  'bg-slate-400',
  todo:  'bg-slate-200 dark:bg-slate-700',
};

// ─── Main component ───────────────────────────────────────────────────────────

export const DictationMode: React.FC<Props> = ({ videoId, hskLevel = 3, iframeRef, onClose, autoFetch }) => {
  const { user } = useAuth();
  // Setup
  const [transcript, setTranscript] = useState('');
  const [showSetup, setShowSetup] = useState(true);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [rows, setRows] = useState<RowState[]>([]);
  const [blanksMap, setBlanksMap] = useState<Record<number, string>>({});
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Navigation & mode
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<Mode>('full');
  const [speed, setSpeed] = useState<number>(1);
  const [loop, setLoop] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [showAnswer, setShowAnswer] = useState(false);

  // Playback
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const cancelTTSRef = useRef<(() => void) | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const sentenceListRef = useRef<HTMLDivElement>(null);
  const didAutoFetch = useRef(false);

  const parsed = React.useMemo(() => parseTranscript(transcript), [transcript]);

  useEffect(() => () => {
    cancelTTSRef.current?.();
    clearTimeout(pauseTimerRef.current!);
    clearTimeout(listenTimerRef.current!);
  }, []);

  // Auto-fetch + start immediately when autoFetch=true
  useEffect(() => {
    if (!autoFetch || didAutoFetch.current) return;
    didAutoFetch.current = true;
    (async () => {
      setFetching(true);
      setFetchError(null);
      try {
        const data = await transcriptApi.fetch(videoId);
        const segs = parseTranscript(data.transcript_text);
        setTranscript(data.transcript_text);
        if (segs.length === 0) {
          setFetchError('Không có câu tiếng Trung — hãy dán transcript thủ công bên dưới');
          return;
        }
        setSegments(segs);
        setRows(segs.map(() => ({ input: '', checked: false, playCount: 0, skipped: false })));
        setBlanksMap(segs.reduce((acc, seg, i) => { acc[i] = makeBlanks(seg.text); return acc; }, {} as Record<number, string>));
        setCurrentIdx(0);
        setShowSetup(false);
      } catch (err: any) {
        setFetchError(err?.response?.data?.detail ?? err?.message ?? 'Không tìm thấy transcript — hãy dán thủ công bên dưới');
      } finally {
        setFetching(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus input when idx changes
  useEffect(() => {
    if (!showSetup && mode !== 'listen') setTimeout(() => inputRef.current?.focus(), 80);
  }, [currentIdx, showSetup, mode]);

  // Scroll sentence list to active item
  useEffect(() => {
    if (!showSetup && sentenceListRef.current) {
      const el = sentenceListRef.current.querySelector(`[data-idx="${currentIdx}"]`);
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentIdx, showSetup]);

  // ── Fetch transcript ───────────────────────────────────────────────────────

  const handleFetch = async () => {
    setFetching(true); setFetchError(null);
    try {
      const data = await transcriptApi.fetch(videoId);
      setTranscript(data.transcript_text);
    } catch (err: any) {
      setFetchError(err?.response?.data?.detail ?? err?.message ?? 'Lỗi không xác định');
    } finally { setFetching(false); }
  };

  // ── Start ──────────────────────────────────────────────────────────────────

  const handleStart = () => {
    const segs = parsed;
    setSegments(segs);
    setRows(segs.map(() => ({ input: '', checked: false, playCount: 0, skipped: false })));
    setBlanksMap(segs.reduce((acc, seg, i) => { acc[i] = makeBlanks(seg.text); return acc; }, {} as Record<number, string>));
    setCurrentIdx(0); setShowSetup(false); setPlayingIdx(null); setShowAnswer(false);
  };

  // ── Playback ───────────────────────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    cancelTTSRef.current?.();
    clearTimeout(pauseTimerRef.current!);
    window.speechSynthesis.cancel();
    setPlayingIdx(null);
  }, []);

  const playSegment = useCallback((idx: number, spd?: number) => {
    const seg = segments[idx];
    if (!seg) return;
    stopAudio();
    setPlayingIdx(idx);
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, playCount: r.playCount + 1 } : r));

    const rate = spd ?? speed;

    if (seg.startTime !== undefined && iframeRef.current) {
      ytSeekPlay(iframeRef.current, seg.startTime);
      const ms = Math.max(2500, (cjkCount(seg.text) / (3.5 * rate)) * 1000 + 1000);
      pauseTimerRef.current = setTimeout(() => {
        ytPause(iframeRef.current);
        setPlayingIdx(null);
      }, ms);
    } else {
      cancelTTSRef.current = speakSegment(seg.text, rate, () => setPlayingIdx(null));
    }
  }, [segments, iframeRef, stopAudio, speed]);

  // Listen-only mode: auto-play → reveal answer → auto-advance
  useEffect(() => {
    if (showSetup || mode !== 'listen') return;
    playSegment(currentIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, mode, showSetup]);

  useEffect(() => {
    if (mode !== 'listen' || playingIdx !== null) return;
    if (showSetup) return;
    // Audio finished → show answer for 2s then advance
    listenTimerRef.current = setTimeout(() => {
      const nextUnchecked = rows.findIndex((r, i) => i > currentIdx && !r.checked && !r.skipped);
      if (nextUnchecked >= 0) {
        setRows(prev => prev.map((r, i) => i === currentIdx
          ? { ...r, checked: true, result: { score: 100, correctCount: cjkCount(segments[currentIdx]?.text ?? ''), totalCount: cjkCount(segments[currentIdx]?.text ?? ''), answerTokens: [], typedTokens: [] } }
          : r));
        goTo(nextUnchecked);
      }
    }, 2500);
    return () => clearTimeout(listenTimerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingIdx, mode, showSetup]);

  // ── Checking ───────────────────────────────────────────────────────────────

  const checkCurrent = useCallback(() => {
    const seg = segments[currentIdx];
    const input = rows[currentIdx]?.input ?? '';
    if (!seg || !input.trim()) return;
    const result = computeDiff(input, seg.text);
    setRows(prev => prev.map((r, i) => i === currentIdx ? { ...r, checked: true, result } : r));
    setShowAnswer(false);

    if (loop) {
      // Re-play after check
      setTimeout(() => playSegment(currentIdx), 300);
    }
  }, [segments, rows, currentIdx, loop, playSegment]);

  const skipCurrent = useCallback(() => {
    setRows(prev => prev.map((r, i) => i === currentIdx ? { ...r, skipped: true } : r));
    goToNext();
  }, [currentIdx]); // eslint-disable-line

  const resetRow = useCallback((idx: number) => {
    setRows(prev => prev.map((r, i) => i === idx
      ? { input: '', checked: false, result: undefined, playCount: 0, skipped: false } : r));
    if (idx === currentIdx) { setShowAnswer(false); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [currentIdx]);

  const goTo = useCallback((idx: number) => {
    stopAudio();
    setCurrentIdx(idx);
    setShowAnswer(false);
  }, [stopAudio]);

  const goToNext = useCallback(() => {
    if (currentIdx < segments.length - 1) goTo(currentIdx + 1);
  }, [currentIdx, segments.length, goTo]);

  const goToPrev = useCallback(() => {
    if (currentIdx > 0) goTo(currentIdx - 1);
  }, [currentIdx, goTo]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const doneCount  = rows.filter(r => r.checked || r.skipped).length;
  const wrongCount = rows.filter(r => r.checked && (r.result?.score ?? 0) < 60).length;
  const todoCount  = rows.filter(r => !r.checked && !r.skipped).length;
  const avgScore   = (() => {
    const checked = rows.filter(r => r.checked);
    return checked.length ? Math.round(checked.reduce((s, r) => s + (r.result?.score ?? 0), 0) / checked.length) : null;
  })();
  const allDone = rows.length > 0 && rows.every(r => r.checked || r.skipped);

  // Save session when completed
  const savedRef = useRef(false);
  useEffect(() => {
    if (!allDone || !user || savedRef.current) return;
    savedRef.current = true;
    const checked = rows.filter(r => r.checked);
    const correctCount = checked.filter(r => (r.result?.score ?? 0) >= 60).length;
    progressApi.logSession({
      session_type: 'listening',
      hsk_level: hskLevel,
      items_count: rows.length,
      correct_count: correctCount,
      score: avgScore !== null ? avgScore / 100 : 0,
    }).catch(() => {});
  }, [allDone, user]);

  // Filtered list
  const filteredIdxs = segments.map((_, i) => i).filter(i => {
    const r = rows[i];
    if (!r) return false;
    if (filter === 'wrong') return r.checked && (r.result?.score ?? 0) < 60;
    if (filter === 'todo') return !r.checked && !r.skipped;
    return true;
  });

  // Current segment
  const seg = segments[currentIdx];
  const row = rows[currentIdx];
  const isPlaying = playingIdx === currentIdx;
  const anyPlaying = playingIdx !== null; // any segment audio running
  const blankDisplay = blanksMap[currentIdx] ?? '';

  // ─── Setup screen ──────────────────────────────────────────────────────────

  if (showSetup) {
    if (autoFetch && fetching) return (
      <div className="py-10 flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Đang tải transcript tự động...</p>
      </div>
    );
    return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Luyện Nghe Chép Chính Tả</span>
        </div>
        {!autoFetch && (
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Dán transcript hoặc phụ đề vào. Hỗ trợ dấu thời gian{' '}
          <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-violet-600 dark:text-violet-400">[0:15]</code>{' '}
          hoặc văn bản thuần — hệ thống tự chia câu.
        </p>
        <button onClick={handleFetch} disabled={fetching}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {fetching
            ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg><span>Đang tải...</span></>
            : <><Download className="w-3.5 h-3.5" /><span>Tự động lấy transcript</span></>}
        </button>
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span>{fetchError}</span>
        </div>
      )}

      <textarea
        value={transcript}
        onChange={e => setTranscript(e.target.value)}
        placeholder={'Dán phụ đề vào đây...\n\n例：\n[0:05] 大家好，我叫李明。\n[0:09] 我每天早上六点起床。\n[0:13] 然后我去跑步锻炼身体。'}
        rows={8} autoFocus
        className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none leading-relaxed chinese-font"
      />

      {parsed.length > 0 && (
        <div className="rounded-2xl border border-violet-200 dark:border-violet-900/50 bg-violet-50 dark:bg-violet-950/20 p-3 space-y-2">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Phát hiện {parsed.length} câu — xem trước:</p>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {parsed.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 text-xs">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                {s.startTime !== undefined && <span className="flex-shrink-0 text-slate-400 font-mono">{formatTime(s.startTime)}</span>}
                <span className="text-slate-600 dark:text-slate-300 chinese-font truncate">{s.text.slice(0, 40)}{s.text.length > 40 ? '…' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleStart} disabled={parsed.length === 0}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>Bắt đầu luyện {parsed.length > 0 ? `${parsed.length} câu` : ''} →</span>
      </button>
    </div>
  );
  }

  if (!seg || !row) return null;

  // ─── Practice screen ────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button onClick={() => { setShowSetup(true); stopAudio(); }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /><span>Đổi transcript</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200">Câu {currentIdx + 1}/{segments.length}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{doneCount}/{segments.length} đã xong</span>
          {avgScore !== null && (
            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />TB {avgScore}%
            </span>
          )}
        </div>

        <button onClick={() => { onClose(); stopAudio(); }}
          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Speed control ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-0.5">Tốc độ:</span>
        {SPEEDS.map(s => (
          <button key={s} onClick={() => setSpeed(s)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              speed === s
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-400'
            }`}>{s}×</button>
        ))}
      </div>

      {/* ── Mode + options bar ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 text-xs font-bold">
          {([
            ['full',   'Gõ hết',         BookOpen],
            ['blank',  'Điền chỗ trống', Eye],
            ['listen', 'Chỉ nghe',       Headphones],
          ] as const).map(([m, label, Icon]) => (
            <button key={m} onClick={() => setMode(m as Mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                mode === m
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setLoop(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              loop
                ? 'bg-teal-600 text-white border-teal-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-teal-400 hover:text-teal-600'
            }`} title="Lặp câu sau khi kiểm tra">
            <Repeat className="w-3.5 h-3.5" /><span className="hidden sm:inline">Lặp câu</span>
          </button>
          <button onClick={() => setShowPinyin(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showPinyin
                ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-400 text-amber-700 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-amber-400 hover:text-amber-600'
            }`}>
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Pinyin</span>
          </button>
        </div>
      </div>

      {/* ── Sentence card ── */}
      <div className={`rounded-2xl border transition-all overflow-hidden ${
        isPlaying ? 'border-violet-400 dark:border-violet-600 shadow-md shadow-violet-500/10' :
        row.checked
          ? (row.result?.score ?? 0) >= 90 ? 'border-emerald-300 dark:border-emerald-800' :
            (row.result?.score ?? 0) >= 60 ? 'border-amber-300 dark:border-amber-700' :
                                             'border-rose-300 dark:border-rose-700'
          : 'border-slate-200 dark:border-slate-800'
      } bg-white dark:bg-slate-900`}>

        {/* Card header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
              {currentIdx + 1}
            </span>
            {seg.startTime !== undefined && (
              <span className="text-[11px] text-slate-400 font-mono">{formatTime(seg.startTime)}</span>
            )}
            {row.playCount > 0 && !row.checked && (
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">{row.playCount}× nghe</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {row.checked && row.result && (
              <span className={`text-sm font-extrabold px-2 py-0.5 rounded-lg border ${
                row.result.score >= 90 ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' :
                row.result.score >= 60 ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' :
                                        'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
              }`}>{row.result.score}%</span>
            )}
            {!row.checked && (
              <button onClick={() => setShowAnswer(v => !v)}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
                {showAnswer ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showAnswer ? 'Ẩn' : 'Xem đáp án'}
              </button>
            )}
          </div>
        </div>

        {/* Blank hint (Điền chỗ trống mode) */}
        {mode === 'blank' && !row.checked && (
          <div className="px-4 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gợi ý</p>
            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 chinese-font text-base leading-relaxed text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {blankDisplay}
            </div>
          </div>
        )}

        {/* Reveal spoiler */}
        {showAnswer && !row.checked && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 chinese-font text-sm font-semibold text-amber-800 dark:text-amber-300">
            {seg.text}
          </div>
        )}

        {/* Input area */}
        <div className="px-4 py-3 space-y-2">
          {mode === 'listen' ? (
            /* Listen only — show result or "Đang phát..." */
            <div className="py-2 text-center">
              {isPlaying ? (
                <div className="flex items-center justify-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium">
                  <Volume2 className="w-4 h-4 animate-pulse" /><span>Đang phát...</span>
                </div>
              ) : row.checked ? (
                <PinyinText text={seg.text} showPinyin className="text-lg" />
              ) : (
                <span className="text-sm text-slate-400 italic">Nghe xong sẽ hiện đáp án...</span>
              )}
            </div>
          ) : !row.checked ? (
            /* Input */
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text" value={row.input} lang="zh"
                onChange={e => setRows(prev => prev.map((r, i) => i === currentIdx ? { ...r, input: e.target.value } : r))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); checkCurrent(); } }}
                placeholder={isPlaying ? '🔊 đang phát — gõ lại câu vừa nghe...' : 'Gõ câu bạn nghe được rồi nhấn Enter...'}
                className={`flex-1 min-w-0 px-4 py-2.5 rounded-xl border text-base text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 transition-colors chinese-font ${
                  isPlaying
                    ? 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/20 focus:ring-violet-500/30'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-violet-500/30 focus:border-violet-400'
                }`}
              />
              <button onClick={checkCurrent} disabled={!row.input.trim()}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm disabled:opacity-30 transition-colors">
                <CheckCircle2 className="w-4 h-4" /><span>Kiểm tra</span>
              </button>
            </div>
          ) : (
            /* Result diff */
            <div className="space-y-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Đáp án đúng</p>
                <div className="flex flex-wrap gap-0.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {row.result?.answerTokens.map((tk, i) => (
                    <span key={i} className={`chinese-font text-lg font-bold ${
                      tk.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 underline decoration-2 underline-offset-2'
                    }`}>{tk.char}</span>
                  ))}
                </div>
              </div>
              {row.result && row.result.typedTokens.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Bạn đã gõ</p>
                  <div className="flex flex-wrap gap-0.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {row.result.typedTokens.map((tk, i) => (
                      <span key={i} className={`chinese-font text-lg font-bold ${
                        tk.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 line-through'
                      }`}>{tk.char}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Pinyin row */}
              <div className="px-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pinyin</p>
                <PinyinText text={seg.text} showPinyin className="text-sm" />
              </div>
              {/* Missed chars */}
              {row.result?.answerTokens.some(tk => tk.status === 'missing') && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {row.result.answerTokens.filter(tk => tk.status === 'missing').map((tk, i) => (
                    <div key={i} className="flex flex-col items-center bg-rose-50 dark:bg-rose-950/30 rounded-xl px-2.5 py-1.5 border border-rose-200 dark:border-rose-900/60">
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-400 chinese-font">{tk.char}</span>
                      <span className="text-[10px] text-rose-500">{pinyin(tk.char, { toneType: 'symbol' })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-3 flex items-center gap-2 flex-wrap border-t border-slate-100 dark:border-slate-800 pt-2">
          {/* Play / Stop — shows Dừng whenever ANY audio is running */}
          <button onClick={() => anyPlaying ? stopAudio() : playSegment(currentIdx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              anyPlaying
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/60'
            }`}>
            {anyPlaying ? <><Square className="w-3.5 h-3.5" />Dừng</> : <><Play className="w-3.5 h-3.5" />Nghe lại</>}
          </button>
          <button onClick={() => playSegment(currentIdx, speed * 0.6)} disabled={anyPlaying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 disabled:opacity-30 transition-colors border border-teal-200/60 dark:border-teal-800/40">
            <Turtle className="w-3.5 h-3.5" />Chậm
          </button>

          <div className="flex-1" />

          {/* Retry / skip */}
          {row.checked ? (
            <button onClick={() => resetRow(currentIdx)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition-colors border border-rose-200/60 dark:border-rose-800/40">
              <RotateCcw className="w-3.5 h-3.5" />Làm lại
            </button>
          ) : (
            <button onClick={skipCurrent}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <SkipForward className="w-3.5 h-3.5" />Bỏ qua
            </button>
          )}

          {/* Prev / Next */}
          <button onClick={goToPrev} disabled={currentIdx === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />Câu trước
          </button>
          <button onClick={goToNext} disabled={currentIdx >= segments.length - 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/60 disabled:opacity-30 transition-colors">
            Câu sau<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Sentence list ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* List header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Danh sách câu</span>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            {[
              { label: '● Đúng',      cls: 'text-emerald-500' },
              { label: '● Gần đúng',  cls: 'text-amber-400' },
              { label: '● Sai',       cls: 'text-rose-500' },
              { label: '● Bỏ qua',    cls: 'text-slate-400' },
            ].map(({ label, cls }) => (
              <span key={label} className={`font-medium ${cls}`}>{label}</span>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
          {([
            ['all',   `Tất cả ${segments.length}`,   null],
            ['wrong', `Câu sai ${wrongCount}`,        wrongCount > 0 ? 'text-rose-500' : null],
            ['todo',  `Chưa làm ${todoCount}`,        null],
          ] as const).map(([f, label, cls]) => (
            <button key={f} onClick={() => setFilter(f as Filter)}
              className={`px-4 py-2 transition-colors ${
                filter === f
                  ? 'border-b-2 border-violet-500 text-violet-700 dark:text-violet-400 -mb-px'
                  : `text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 ${cls ?? ''}`
              }`}>
              {label}
            </button>
          ))}
          <div className="flex-1 text-right pr-3 text-[10px] font-normal text-slate-400">
            {doneCount}/{segments.length} đã xong
          </div>
        </div>

        {/* Sentence rows */}
        <div ref={sentenceListRef} className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filteredIdxs.length === 0 ? (
            <p className="text-xs text-center text-slate-400 py-6">Không có câu nào.</p>
          ) : filteredIdxs.map(i => {
            const s = segments[i];
            const r = rows[i];
            const status = rowStatus(r);
            const isActive = i === currentIdx;
            return (
              <div key={i} data-idx={i}
                onClick={() => goTo(i)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isActive ? 'bg-violet-50 dark:bg-violet-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}>
                {/* Status dot */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT_CLS[status]}`} />
                </div>
                {/* Number + content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
                      {i + 1}
                    </span>
                    {s.startTime !== undefined && (
                      <span className="text-[10px] text-slate-400 font-mono">{formatTime(s.startTime)}</span>
                    )}
                    {r.checked && r.result && (
                      <span className={`text-[10px] font-extrabold ml-auto ${
                        r.result.score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                        r.result.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>{r.result.score}%</span>
                    )}
                  </div>
                  {/* Chinese text with optional pinyin */}
                  <PinyinText text={s.text} showPinyin={showPinyin} className={isActive ? 'text-violet-800 dark:text-violet-200' : ''} />
                </div>
                {/* Replay mini button — stops current audio first */}
                <button
                  onClick={e => { e.stopPropagation(); stopAudio(); setTimeout(() => playSegment(i), 100); }}
                  className={`flex-shrink-0 p-1 rounded-lg transition-colors mt-0.5 ${
                    playingIdx === i
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40'
                      : 'text-slate-300 dark:text-slate-600 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40'
                  }`}
                  title={playingIdx === i ? 'Đang phát...' : 'Phát câu này'}>
                  {playingIdx === i ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── All done summary ── */}
      {allDone && avgScore !== null && (
        <div className={`rounded-2xl p-4 border text-center space-y-3 ${
          avgScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' :
          avgScore >= 50 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' :
                          'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
        }`}>
          <div className={`text-3xl font-extrabold ${
            avgScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
            avgScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
          }`}>{avgScore}%</div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {avgScore >= 90 ? 'Xuất sắc!' : avgScore >= 80 ? 'Tốt lắm!' : avgScore >= 60 ? 'Khá ổn!' : 'Luyện thêm nhé!'}
          </p>
          <button onClick={() => {
            setRows(segments.map(() => ({ input: '', checked: false, playCount: 0, skipped: false })));
            setBlanksMap(segments.reduce((acc, seg, i) => { acc[i] = makeBlanks(seg.text); return acc; }, {} as Record<number, string>));
            goTo(0);
          }} className="mx-auto flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-violet-400 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold text-sm hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
            <RotateCcw className="w-4 h-4" />Luyện lại từ đầu
          </button>
        </div>
      )}
    </div>
  );
};
