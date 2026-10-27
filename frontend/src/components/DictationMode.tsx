import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pinyin } from 'pinyin-pro';
import {
  X, Play, Square, RotateCcw, CheckCircle2,
  ChevronDown, ChevronUp, Turtle, Clock, ListOrdered,
  Award, BookOpen, Sparkles, Download, AlertCircle,
} from 'lucide-react';
import {
  Segment, ScoreResult, computeDiff,
  parseTranscript, formatTime, speakSegment, cjkCount,
} from '../utils/dictation';
import { transcriptApi } from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RowState {
  input: string;
  checked: boolean;
  result?: ScoreResult;
}

interface Props {
  videoId: string;
  videoTitle: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onClose: () => void;
}

// ─── YouTube control helpers ──────────────────────────────────────────────────

function ytSeekPlay(iframe: HTMLIFrameElement | null, seconds: number) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }), '*');
  iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
}
function ytPause(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
}

// ─── Score badge ──────────────────────────────────────────────────────────────

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const cls =
    score >= 80 ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' :
    score >= 50 ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800' :
                  'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800';
  return (
    <span className={`flex-shrink-0 text-xs font-extrabold px-2 py-0.5 rounded-lg border ${cls}`}>
      {score}%
    </span>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

export const DictationMode: React.FC<Props> = ({ videoId, videoTitle, iframeRef, onClose }) => {
  // Setup phase
  const [transcriptInput, setTranscriptInput] = useState('');
  const [showSetup, setShowSetup] = useState(true);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Row states (one per segment)
  const [rows, setRows] = useState<RowState[]>([]);

  // Playback
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const cancelTTSRef = useRef<(() => void) | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Expanded details (pinyin + missed chars per row)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Input refs for keyboard nav
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const parsed = React.useMemo(() => parseTranscript(transcriptInput), [transcriptInput]);

  useEffect(() => () => {
    cancelTTSRef.current?.();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  }, []);

  // ── Auto-fetch transcript ─────────────────────────────────────────────────

  const handleFetch = async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const data = await transcriptApi.fetch(videoId);
      setTranscriptInput(data.transcript_text);
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? err?.message ?? 'Lỗi không xác định';
      setFetchError(msg);
    } finally {
      setFetching(false);
    }
  };

  // ── Start lesson ──────────────────────────────────────────────────────────

  const handleStart = () => {
    setSegments(parsed);
    setRows(parsed.map(() => ({ input: '', checked: false })));
    setShowSetup(false);
    setPlayingIdx(null);
    setExpandedIdx(null);
  };

  // ── Playback ──────────────────────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    cancelTTSRef.current?.();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    window.speechSynthesis.cancel();
    setPlayingIdx(null);
  }, []);

  const playSegment = useCallback((idx: number, slow = false) => {
    const seg = segments[idx];
    if (!seg) return;
    stopAudio();
    setPlayingIdx(idx);

    if (seg.startTime !== undefined && iframeRef.current) {
      // YouTube segment playback
      ytSeekPlay(iframeRef.current, seg.startTime);
      const ms = Math.max(3000, (cjkCount(seg.text) / (slow ? 1.8 : 3.5)) * 1000 + 1200);
      pauseTimerRef.current = setTimeout(() => {
        ytPause(iframeRef.current);
        setPlayingIdx(null);
      }, ms);
    } else {
      // TTS fallback
      cancelTTSRef.current = speakSegment(seg.text, slow ? 0.5 : 0.85, () => setPlayingIdx(null));
    }
  }, [segments, iframeRef, stopAudio]);

  // ── Check a row ───────────────────────────────────────────────────────────

  const checkRow = useCallback((idx: number) => {
    const seg = segments[idx];
    const input = rows[idx]?.input ?? '';
    if (!seg || !input.trim()) return;
    const result = computeDiff(input, seg.text);
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, checked: true, result } : r));
    setExpandedIdx(idx); // auto-expand the result
    // Auto-focus next unchecked row
    const nextUnchecked = rows.findIndex((r, i) => i > idx && !r.checked);
    if (nextUnchecked >= 0) {
      setTimeout(() => inputRefs.current[nextUnchecked]?.focus(), 100);
    }
  }, [segments, rows]);

  const resetRow = useCallback((idx: number) => {
    setRows(prev => prev.map((r, i) => i === idx ? { input: '', checked: false, result: undefined } : r));
    setExpandedIdx(null);
    setTimeout(() => inputRefs.current[idx]?.focus(), 50);
  }, []);

  const updateInput = useCallback((idx: number, value: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, input: value } : r));
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const checkedRows = rows.filter(r => r.checked);
  const avgScore = checkedRows.length > 0
    ? Math.round(checkedRows.reduce((s, r) => s + (r.result?.score ?? 0), 0) / checkedRows.length)
    : null;
  const allDone = rows.length > 0 && rows.every(r => r.checked);

  // ─── Setup screen ─────────────────────────────────────────────────────────

  if (showSetup) {
    return (
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ListOrdered className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Luyện Dictation — Dán Transcript
            </span>
          </div>
          <button onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Dán phụ đề hoặc transcript của video. Hỗ trợ dấu thời gian dạng{' '}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-violet-600 dark:text-violet-400">
              [0:15] 你好。
            </code>
          </p>
          <button
            onClick={handleFetch}
            disabled={fetching}
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Tự động lấy phụ đề tiếng Trung từ YouTube"
          >
            {fetching ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Lấy transcript tự động</span>
              </>
            )}
          </button>
        </div>

        {fetchError && (
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}

        <textarea
          value={transcriptInput}
          onChange={e => setTranscriptInput(e.target.value)}
          placeholder={'Dán phụ đề vào đây...\n\n例：\n[0:05] 大家好，我叫李明。\n[0:09] 我每天早上六点起床。\n[0:13] 然后我去跑步锻炼身体。\n[0:18] 吃完早饭以后，我骑车去上班。'}
          rows={8}
          autoFocus
          className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none leading-relaxed chinese-font"
        />

        {parsed.length > 0 && (
          <div className="rounded-2xl border border-violet-200 dark:border-violet-900/50 bg-violet-50 dark:bg-violet-950/20 p-3 space-y-2">
            <p className="text-xs font-bold text-violet-700 dark:text-violet-400">
              ✓ Phát hiện {parsed.length} đoạn
            </p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {parsed.map((seg, i) => (
                <div key={seg.id} className="flex items-center space-x-2 text-xs">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-[10px]">
                    {i + 1}
                  </span>
                  {seg.startTime !== undefined && (
                    <span className="flex-shrink-0 flex items-center space-x-0.5 text-slate-400">
                      <Clock className="w-3 h-3" /><span>{formatTime(seg.startTime)}</span>
                    </span>
                  )}
                  <span className="text-slate-600 dark:text-slate-300 chinese-font truncate">
                    {seg.text.slice(0, 40)}{seg.text.length > 40 ? '…' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={parsed.length === 0}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Bắt đầu luyện {parsed.length > 0 ? `${parsed.length} đoạn` : ''} →</span>
        </button>
      </div>
    );
  }

  // ─── Lesson screen (DailyDictation style) ────────────────────────────────

  return (
    <div className="space-y-3">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <ListOrdered className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {checkedRows.length} / {rows.length} đoạn
            </span>
          </div>
          {avgScore !== null && (
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                TB {avgScore}%
              </span>
            </div>
          )}
          {allDone && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
              🏆 Hoàn thành!
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setShowSetup(true); stopAudio(); }}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /><span>Transcript mới</span>
          </button>
          <button onClick={() => { onClose(); stopAudio(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
          style={{ width: `${rows.length ? (checkedRows.length / rows.length) * 100 : 0}%` }}
        />
      </div>

      {/* ── Segment rows ── */}
      <div className="space-y-2">
        {segments.map((seg, idx) => {
          const row = rows[idx];
          if (!row) return null;
          const isPlaying = playingIdx === idx;
          const isExpanded = expandedIdx === idx;
          const py = row.checked
            ? pinyin(seg.text, { toneType: 'symbol', separator: ' ' })
            : '';

          return (
            <div
              key={seg.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isPlaying
                  ? 'border-violet-400 dark:border-violet-700 shadow-md shadow-violet-500/10'
                  : row.checked
                  ? row.result && row.result.score >= 80
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : row.result && row.result.score >= 50
                    ? 'border-amber-200 dark:border-amber-900/60'
                    : 'border-rose-200 dark:border-rose-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              } bg-white dark:bg-slate-900`}
            >
              {/* ── Main row ── */}
              <div className="flex items-center space-x-2 p-3">

                {/* Segment number */}
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>

                {/* Play / Stop button */}
                <div className="flex-shrink-0 flex items-center space-x-1">
                  <button
                    onClick={() => isPlaying ? stopAudio() : playSegment(idx)}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isPlaying
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-400'
                    }`}
                    title={isPlaying ? 'Dừng' : 'Phát đoạn này'}
                  >
                    {isPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {seg.startTime !== undefined && (
                      <span className="text-[10px]">{formatTime(seg.startTime)}</span>
                    )}
                  </button>

                  {/* Slow button */}
                  <button
                    onClick={() => playSegment(idx, true)}
                    disabled={isPlaying}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors disabled:opacity-30"
                    title="Nghe chậm (0.5×)"
                  >
                    <Turtle className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Input or result */}
                {!row.checked ? (
                  /* ── Unchecked: show input ── */
                  <input
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    value={row.input}
                    onChange={e => updateInput(idx, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); checkRow(idx); }
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const next = rows.findIndex((r, i) => i > idx && !r.checked);
                        if (next >= 0) inputRefs.current[next]?.focus();
                      }
                    }}
                    placeholder={isPlaying ? '🔊 đang phát — gõ lại...' : 'Nghe rồi gõ tiếng Trung... (Enter ✓)'}
                    lang="zh"
                    className={`flex-1 min-w-0 px-3 py-1.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 transition-colors chinese-font ${
                      isPlaying
                        ? 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/20 focus:ring-violet-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-violet-500/30 focus:border-violet-400'
                    }`}
                  />
                ) : (
                  /* ── Checked: show answer comparison ── */
                  <div className="flex-1 min-w-0 flex items-center space-x-2">
                    {row.result && <ScoreBadge score={row.result.score} />}
                    <div className="flex flex-wrap chinese-font text-base leading-snug">
                      {row.result?.answerTokens.map((tk, ti) => (
                        <span key={ti} className={
                          tk.status === 'correct'
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'text-rose-600 dark:text-rose-400 font-bold underline decoration-2 underline-offset-2'
                        }>{tk.char}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Right-side actions */}
                <div className="flex-shrink-0 flex items-center space-x-1">
                  {!row.checked ? (
                    <button
                      onClick={() => checkRow(idx)}
                      disabled={!row.input.trim()}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 disabled:opacity-30 transition-colors"
                      title="Kiểm tra (Enter)"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      {/* Expand/collapse detail */}
                      <button
                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={isExpanded ? 'Thu gọn' : 'Xem pinyin & chi tiết'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {/* Reset row */}
                      <button
                        onClick={() => resetRow(idx)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Làm lại đoạn này"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ── Expanded detail (pinyin + missed chars) ── */}
              {row.checked && isExpanded && row.result && (
                <div className="px-4 pb-4 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800">

                  {/* Typed comparison */}
                  {row.result.typedTokens.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Bạn đã gõ
                      </p>
                      <div className="flex flex-wrap chinese-font text-base leading-loose">
                        {row.result.typedTokens.map((tk, ti) => (
                          <span key={ti} className={
                            tk.status === 'correct'
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-slate-400 dark:text-slate-500 font-bold line-through'
                          }>{tk.char}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pinyin */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Pinyin
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium tracking-wide">{py}</p>
                  </div>

                  {/* Missed chars */}
                  {row.result.answerTokens.some(tk => tk.status === 'missing') && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Chữ bỏ sót / sai</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {row.result.answerTokens
                          .filter(tk => tk.status === 'missing')
                          .map((tk, ti) => (
                            <div key={ti} className="flex flex-col items-center bg-rose-50 dark:bg-rose-950/30 rounded-xl px-2.5 py-1.5 border border-rose-200 dark:border-rose-900/60">
                              <span className="text-lg font-bold text-rose-600 dark:text-rose-400 chinese-font">{tk.char}</span>
                              <span className="text-[10px] text-rose-500 font-medium">
                                {pinyin(tk.char, { toneType: 'symbol' })}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── All done summary ── */}
      {allDone && avgScore !== null && (
        <div className={`rounded-2xl p-4 border text-center space-y-2 ${
          avgScore >= 80
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
            : avgScore >= 50
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
        }`}>
          <div className={`text-3xl font-extrabold ${
            avgScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
            avgScore >= 50 ? 'text-amber-600 dark:text-amber-400' :
                             'text-rose-600 dark:text-rose-400'
          }`}>
            {avgScore}%
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {avgScore >= 90 ? '🏆 Xuất sắc!' : avgScore >= 80 ? '🎉 Tốt lắm!' : avgScore >= 60 ? '💪 Khá ổn!' : '📖 Luyện thêm nhé!'}
          </p>
          <button
            onClick={() => {
              setRows(segments.map(() => ({ input: '', checked: false })));
              setExpandedIdx(null);
              setPlayingIdx(null);
            }}
            className="mx-auto flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-violet-400 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold text-sm hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /><span>Luyện lại từ đầu</span>
          </button>
        </div>
      )}
    </div>
  );
};
