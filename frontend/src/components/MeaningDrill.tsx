import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pinyin } from 'pinyin-pro';
import {
  X, Eye, EyeOff, CheckCircle2, ArrowRight,
  RotateCcw, Trophy, Volume2, XCircle, BookOpen,
} from 'lucide-react';
import { Vocabulary } from '../types';
import { speech } from '../utils/speech';
import { progressApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type Phase = 'type' | 'result' | 'done';

interface DrillResult {
  word: Vocabulary;
  typed: string;
  correct: boolean;
}

interface Props {
  cards: Vocabulary[];
  onClose: () => void;
}

export const MeaningDrill: React.FC<Props> = ({ cards, onClose }) => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<Vocabulary[]>([]);
  const [idx, setIdx]     = useState(0);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('type');
  const [showHint, setShowHint] = useState(false);
  const [results, setResults]   = useState<DrillResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionLoggedRef = useRef(false);

  const initQueue = useCallback((source: Vocabulary[]) => {
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, Math.min(20, source.length));
    setQueue(shuffled);
    setIdx(0);
    setInput('');
    setPhase('type');
    setShowHint(false);
    setResults([]);
    sessionLoggedRef.current = false;
  }, []);

  useEffect(() => { initQueue(cards); }, [cards, initQueue]);

  // Log session once when drill completes
  useEffect(() => {
    if (phase !== 'done' || sessionLoggedRef.current || !user || queue.length === 0) return;
    sessionLoggedRef.current = true;
    const correctCount = results.filter(r => r.correct).length;
    progressApi.logSession({
      session_type: 'meaning_drill',
      hsk_level: queue[0].hsk_level,
      items_count: queue.length,
      correct_count: correctCount,
      score: queue.length > 0 ? correctCount / queue.length : 0,
    }).catch(() => {});
  }, [phase, user, queue, results]);

  // Auto-focus input on each new question
  useEffect(() => {
    if (phase === 'type') setTimeout(() => inputRef.current?.focus(), 60);
  }, [phase, idx]);

  const current = queue[idx];
  const total   = queue.length;

  const handleCheck = useCallback(() => {
    if (!current || !input.trim()) return;
    const typed   = input.trim();
    const correct = typed === current.simplified;
    setResults(prev => [...prev, { word: current, typed, correct }]);
    setPhase('result');
    speech.speak(current.simplified);
  }, [current, input]);

  const handleNext = useCallback(() => {
    if (idx >= total - 1) {
      setPhase('done');
    } else {
      setIdx(i => i + 1);
      setInput('');
      setPhase('type');
      setShowHint(false);
    }
  }, [idx, total]);

  // Enter key: check or advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (phase === 'type' && input.trim()) handleCheck();
      else if (phase === 'result') handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, input, handleCheck, handleNext]);

  // ── Summary ────────────────────────────────────────────────────────────────

  if (phase === 'done') {
    const correctCount = results.filter(r => r.correct).length;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const wrongs = results.filter(r => !r.correct);

    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className={`rounded-3xl p-8 text-center space-y-3 border ${
          score >= 80
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
            : score >= 50
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
        }`}>
          <Trophy className={`w-12 h-12 mx-auto ${
            score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'
          }`} />
          <div className={`text-5xl font-extrabold ${
            score >= 80 ? 'text-emerald-600 dark:text-emerald-400'
            : score >= 50 ? 'text-amber-600 dark:text-amber-400'
            : 'text-rose-600 dark:text-rose-400'
          }`}>{score}%</div>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
            {correctCount} / {total} từ đúng
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {score >= 90 ? '🏆 Xuất sắc! Bạn nhớ rất tốt!'
              : score >= 80 ? '🎉 Tốt lắm! Tiếp tục phát huy!'
              : score >= 60 ? '💪 Khá ổn! Luyện thêm sẽ tốt hơn.'
              : '📖 Hãy ôn lại những từ hay quên nhé!'}
          </p>
        </div>

        {wrongs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cần ôn lại — {wrongs.length} từ</span>
            </h3>
            <div className="space-y-2">
              {wrongs.map((r, i) => {
                const py = pinyin(r.word.simplified, { toneType: 'symbol', separator: ' ' });
                return (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {r.word.meaning_vi}
                      </p>
                      {r.typed && (
                        <p className="text-xs text-rose-400 line-through chinese-font mt-0.5">
                          {r.typed}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => speech.speak(r.word.simplified)}
                      className="ml-4 flex-shrink-0 text-right group"
                    >
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white chinese-font group-hover:text-red-600 transition-colors">
                          {r.word.simplified}
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-500 transition-colors" />
                      </div>
                      <p className="text-xs text-red-500 font-medium">{py}</p>
                      {r.word.han_viet && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{r.word.han_viet}</p>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => initQueue(cards)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl border-2 border-violet-400 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold text-sm hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Luyện lại (bộ mới)</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Về danh sách từ</span>
          </button>
        </div>
      </div>
    );
  }

  if (!current || total === 0) return null;

  const py = pinyin(current.simplified, { toneType: 'symbol', separator: ' ' });
  const lastResult  = results[results.length - 1];
  const correctCount = results.filter(r => r.correct).length;

  // ── Quiz card ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Câu {idx + 1} / {total}
          </span>
          {results.length > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
              correctCount === results.length
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}>
              {correctCount}/{results.length} đúng
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(idx / total) * 100}%` }}
        />
      </div>

      {/* Main card */}
      <div className={`rounded-3xl border shadow-lg p-8 space-y-6 transition-all duration-300 ${
        phase === 'result'
          ? lastResult?.correct
            ? 'bg-emerald-50/60 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/60'
            : 'bg-rose-50/60 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>

        {/* Question */}
        <div className="text-center space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Chữ Hán của từ này là gì?
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {current.meaning_vi}
          </p>
          {current.meaning_en && (
            <p className="text-sm text-slate-400 italic">"{current.meaning_en}"</p>
          )}
          <div className="flex items-center justify-center space-x-2 pt-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
              {current.part_of_speech || 'Từ vựng'}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              HSK {current.hsk_level}
            </span>
          </div>
        </div>

        {/* Pinyin hint (togglable) */}
        {showHint && phase === 'type' && (
          <p className="text-center text-xl font-semibold text-red-500 dark:text-red-400 tracking-wider">
            {py}
          </p>
        )}

        {/* Input */}
        {phase === 'type' ? (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Gõ chữ Hán vào đây..."
            lang="zh"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full text-center text-3xl py-4 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 chinese-font transition-colors"
          />
        ) : (
          /* Result */
          <div className="space-y-3">
            {lastResult?.correct ? (
              <div className="flex items-center justify-center space-x-3 py-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 chinese-font">
                    {current.simplified}
                  </div>
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 mt-0.5">{py}</div>
                  {current.han_viet && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">{current.han_viet}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center py-3 rounded-2xl bg-rose-100/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
                  <XCircle className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
                  <span className="text-xl font-bold text-rose-500 dark:text-rose-400 line-through chinese-font">
                    {lastResult?.typed || '(chưa nhập)'}
                  </span>
                </div>
                <div className="flex items-center justify-center py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đáp án đúng</p>
                    <button
                      onClick={() => speech.speak(current.simplified)}
                      className="flex items-center space-x-2 group mx-auto"
                    >
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white chinese-font group-hover:text-red-600 transition-colors">
                        {current.simplified}
                      </span>
                      <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
                    </button>
                    <p className="text-sm font-semibold text-red-500 dark:text-red-400 mt-0.5">{py}</p>
                    {current.han_viet && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">{current.han_viet}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Example sentence */}
            {current.examples.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 chinese-font">
                  {current.examples[0].chinese}
                </div>
                <div className="text-xs text-red-500 font-medium mt-0.5">{current.examples[0].pinyin}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{current.examples[0].meaning_vi}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between">
        {phase === 'type' ? (
          <>
            <button
              onClick={() => setShowHint(h => !h)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showHint ? 'Ẩn pinyin' : 'Gợi ý pinyin'}</span>
            </button>
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-violet-500/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kiểm tra (Enter)</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="ml-auto flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-violet-500/20 hover:scale-[1.03] active:scale-95 transition-all"
          >
            <span>{idx >= total - 1 ? 'Xem kết quả' : 'Tiếp theo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
