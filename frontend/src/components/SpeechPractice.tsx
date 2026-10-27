import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Volume2, ChevronRight, RotateCcw, Trophy,
  AlertCircle, Eye, EyeOff, X, Mic2,
} from 'lucide-react';
import { Vocabulary } from '../types';
import { speech } from '../utils/speech';
import { progressApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ── helpers ────────────────────────────────────────────────────────────────

const SR: any = (typeof window !== 'undefined')
  ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  : null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function compareTokens(target: string, spoken: string) {
  const tChars = [...target].filter(c => /[一-鿿]/.test(c));
  const sChars = [...spoken].filter(c => /[一-鿿]/.test(c));
  if (tChars.length === 0) return [];
  return tChars.map((char, i) => ({ char, correct: sChars[i] === char }));
}

function calcScore(tokens: { correct: boolean }[]) {
  if (tokens.length === 0) return 0;
  return Math.round(tokens.filter(t => t.correct).length / tokens.length * 100);
}

const BATCH = 20;

type Mode  = 'read' | 'speak';
type Phase = 'idle' | 'listening' | 'result' | 'done';

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400',
  2: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
  3: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
  4: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400',
  5: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400',
  6: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400',
};

// ── component ──────────────────────────────────────────────────────────────

interface Props {
  cards: Vocabulary[];
  onClose: () => void;
}

export const SpeechPractice: React.FC<Props> = ({ cards, onClose }) => {
  const { user } = useAuth();
  const [started, setStarted]     = useState(false);
  const [mode, setMode]           = useState<Mode>('read');
  const [showPinyin, setShowPinyin] = useState(true);
  const [showChinese, setShowChinese] = useState(false); // for 'speak' mode

  const [queue]        = useState<Vocabulary[]>(() => shuffle(cards).slice(0, BATCH));
  const [idx, setIdx]  = useState(0);
  const [phase, setPhase]       = useState<Phase>('idle');
  const [transcript, setTranscript] = useState('');
  const [tokens, setTokens]     = useState<{ char: string; correct: boolean }[]>([]);
  const [scores, setScores]     = useState<number[]>([]);

  const recRef     = useRef<any>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = queue[idx];

  // cleanup on unmount
  useEffect(() => () => {
    if (recRef.current) try { recRef.current.stop(); } catch {}
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // auto-speak word when card appears in 'read' mode
  useEffect(() => {
    if (started && phase === 'idle' && mode === 'read' && current) {
      speech.speak(current.simplified, 0.75);
    }
  }, [idx, started, phase]); // eslint-disable-line

  const startListening = () => {
    if (!SR || phase === 'listening') return;
    const word = current;
    const rec  = new SR();
    recRef.current = rec;
    rec.lang             = 'zh-CN';
    rec.continuous       = false;
    rec.interimResults   = true;
    rec.maxAlternatives  = 5;

    let finalText = '';

    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setTranscript(finalText || interim);
    };

    rec.onend = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const toks  = compareTokens(word.simplified, finalText);
      const score = calcScore(toks);
      setTokens(toks);
      setScores(prev => [...prev, score]);
      setTranscript(finalText);
      setPhase('result');
    };

    rec.onerror = (e: any) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // 'no-speech' is benign — treat as blank result
      const toks = compareTokens(word.simplified, '');
      setTokens(toks);
      setScores(prev => [...prev, 0]);
      setTranscript('');
      setPhase('result');
    };

    setPhase('listening');
    setTranscript('');
    setTokens([]);
    rec.start();

    timerRef.current = setTimeout(() => {
      try { rec.stop(); } catch {}
    }, 9000);
  };

  const stopListening = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try { recRef.current?.stop(); } catch {}
  };

  const handleNext = () => {
    if (idx >= queue.length - 1) {
      setPhase('done');
      if (user && scores.length > 0) {
        const total   = scores.length + 1; // +1 for current card
        const perfect = scores.filter(s => s === 100).length + (tokens.length > 0 && calcScore(tokens) === 100 ? 1 : 0);
        const avg     = scores.reduce((a, b) => a + b, 0) / scores.length;
        progressApi.logSession({
          session_type: 'speaking',
          hsk_level: queue[0]?.hsk_level ?? 1,
          items_count: total,
          correct_count: perfect,
          score: avg / 100,
        }).catch(() => {});
      }
    } else {
      setIdx(i => i + 1);
      setPhase('idle');
      setTranscript('');
      setTokens([]);
      setShowChinese(false);
    }
  };

  const handleRestart = () => {
    // full session restart
    setIdx(0);
    setPhase('idle');
    setTranscript('');
    setTokens([]);
    setScores([]);
    setShowChinese(false);
  };

  const avgScore  = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const cardScore = scores[idx] ?? null;

  // ── Unsupported browser ────────────────────────────────────────────────
  if (!SR) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trình duyệt không hỗ trợ</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tính năng Luyện Nói dùng <strong>Web Speech API</strong> — chỉ hoạt động trên
          <strong> Chrome</strong> hoặc <strong>Edge</strong>.<br />
          Firefox và Safari chưa hỗ trợ nhận dạng tiếng Trung.
        </p>
        <button onClick={onClose} className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          Quay lại
        </button>
      </div>
    );
  }

  // ── No vocab ───────────────────────────────────────────────────────────
  if (cards.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-4 px-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Chưa có từ vựng để luyện tập.</p>
        <button onClick={onClose} className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm">Quay lại</button>
      </div>
    );
  }

  // ── Start screen ───────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-md mx-auto mt-8 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Luyện Nói Tiếng Trung</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {Math.min(cards.length, BATCH)} từ ngẫu nhiên · Web Speech API · Miễn phí
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn chế độ luyện tập</p>

          <button
            onClick={() => setMode('read')}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              mode === 'read'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="font-bold text-slate-900 dark:text-white text-sm">Đọc Theo (Đọc to)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Thấy chữ Hán + pinyin → đọc to → chấm điểm từng chữ
            </div>
          </button>

          <button
            onClick={() => setMode('speak')}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              mode === 'speak'
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-violet-300'
            }`}
          >
            <div className="font-bold text-slate-900 dark:text-white text-sm">Dịch Nhanh (Khó hơn)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Thấy nghĩa tiếng Việt → nhớ và nói từ tiếng Trung
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>Cần <strong>Chrome / Edge</strong> và cho phép truy cập microphone</span>
        </div>

        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Hủy
          </button>
          <button
            onClick={() => setStarted(true)}
            className={`flex-2 flex-grow py-3 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 ${
              mode === 'read'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/20'
            }`}
          >
            Bắt đầu luyện tập →
          </button>
        </div>
      </div>
    );
  }

  // ── Done screen ────────────────────────────────────────────────────────
  if (phase === 'done') {
    const perfect = scores.filter(s => s === 100).length;
    return (
      <div className="max-w-sm mx-auto mt-8 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hoàn thành!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {scores.length} từ đã luyện
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Điểm TB', value: `${avgScore}%`, color: avgScore >= 80 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-rose-600' },
            { label: 'Phát âm đúng hoàn toàn', value: perfect, color: 'text-violet-600' },
            { label: 'Tổng từ', value: scores.length, color: 'text-slate-700 dark:text-slate-300' },
          ].map(item => (
            <div key={item.label} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
              <div className={`text-2xl font-extrabold ${item.color}`}>{item.value}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button onClick={handleRestart} className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại</span>
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">
            Xong
          </button>
        </div>
      </div>
    );
  }

  // ── Practice card ──────────────────────────────────────────────────────
  const progress = (idx / queue.length) * 100;

  return (
    <div className="max-w-lg mx-auto mt-4 px-4 pb-8 space-y-5">

      {/* Progress bar */}
      <div className="flex items-center space-x-3">
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 tabular-nums flex-shrink-0">
          {idx + 1}/{queue.length}
        </span>
      </div>

      {/* Score strip (shown after result) */}
      {phase === 'result' && cardScore !== null && (
        <div className={`rounded-2xl px-4 py-3 flex items-center justify-between text-sm font-bold ${
          cardScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
          : cardScore >= 50 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
        }`}>
          <span>
            {cardScore >= 90 ? '🏆 Xuất sắc!' : cardScore >= 75 ? '🎉 Tốt lắm!' : cardScore >= 50 ? '💪 Khá ổn' : '🔁 Cần luyện thêm'}
          </span>
          <span className="text-2xl font-extrabold">{cardScore}%</span>
        </div>
      )}

      {/* Vocab card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-7 space-y-4">

        {/* Top row: HSK badge + options */}
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${LEVEL_COLORS[current.hsk_level] || ''}`}>
            HSK {current.hsk_level}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => speech.speak(current.simplified, 0.75)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              title="Nghe phát âm mẫu"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowPinyin(v => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={showPinyin ? 'Ẩn pinyin' : 'Hiện pinyin'}
            >
              {showPinyin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Word display — depends on mode */}
        {mode === 'read' ? (
          /* Read mode: show everything */
          <div className="text-center space-y-2">
            <div className="text-6xl font-extrabold text-slate-900 dark:text-white chinese-font tracking-wider leading-none">
              {current.simplified}
            </div>
            {showPinyin && (
              <div className="text-xl font-semibold text-red-500 dark:text-red-400">{current.pinyin}</div>
            )}
            {current.han_viet && (
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400">{current.han_viet}</div>
            )}
            <div className="text-base font-bold text-slate-700 dark:text-slate-300 pt-1">{current.meaning_vi}</div>
          </div>
        ) : (
          /* Speak mode: show meaning only, reveal Chinese on demand / after result */
          <div className="text-center space-y-3">
            {current.part_of_speech && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                {current.part_of_speech}
              </span>
            )}
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{current.meaning_vi}</div>
            {current.meaning_en && (
              <div className="text-sm text-slate-400 italic">{current.meaning_en}</div>
            )}
            {current.han_viet && (
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400">{current.han_viet}</div>
            )}

            {/* Reveal button or Chinese word */}
            {(phase === 'result' || showChinese) ? (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white chinese-font">{current.simplified}</div>
                {showPinyin && <div className="text-base font-semibold text-red-500 dark:text-red-400">{current.pinyin}</div>}
              </div>
            ) : phase === 'idle' && (
              <button
                onClick={() => setShowChinese(true)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline transition-colors"
              >
                Xem gợi ý
              </button>
            )}
          </div>
        )}

        {/* Result: character-by-character comparison */}
        {phase === 'result' && tokens.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kết quả từng chữ</div>
            <div className="flex items-center justify-center space-x-1 flex-wrap">
              {tokens.map((tk, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className={`text-3xl font-extrabold chinese-font ${tk.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                    {tk.char}
                  </span>
                  <span className="text-[10px]">{tk.correct ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
            {transcript && (
              <div className="text-center text-xs text-slate-400">
                Hệ thống nghe: <span className="font-semibold text-slate-600 dark:text-slate-300 chinese-font">{transcript || '(không nhận ra)'}</span>
              </div>
            )}
          </div>
        )}

        {/* Result: blank result */}
        {phase === 'result' && tokens.length === 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-400">
            Không nhận ra giọng nói — nhấn mic để thử lại
          </div>
        )}
      </div>

      {/* Mic button area */}
      <div className="flex flex-col items-center space-y-4">
        {phase === 'listening' && (
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            <span>Đang lắng nghe... nói to và rõ ràng</span>
          </div>
        )}
        {transcript && phase === 'listening' && (
          <div className="text-sm text-slate-500 dark:text-slate-400 chinese-font font-semibold">
            Nghe được: <span className="text-slate-800 dark:text-white">{transcript}</span>
          </div>
        )}

        {phase !== 'result' ? (
          <button
            onClick={phase === 'listening' ? stopListening : startListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              phase === 'listening'
                ? 'bg-rose-500 shadow-rose-500/40 scale-110'
                : 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30 hover:scale-110 active:scale-95'
            }`}
          >
            {phase === 'listening' && (
              <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30" />
            )}
            {phase === 'listening'
              ? <MicOff className="w-10 h-10 text-white" />
              : <Mic className="w-10 h-10 text-white" />
            }
          </button>
        ) : (
          <div className="flex items-center space-x-3 w-full max-w-xs">
            <button
              onClick={startListening}
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl border-2 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{idx >= queue.length - 1 ? 'Kết quả' : 'Tiếp theo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === 'idle' && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            {mode === 'read'
              ? 'Nhấn mic → đọc to từ tiếng Trung bên trên'
              : 'Nhấn mic → nói từ tiếng Trung tương ứng với nghĩa'}
          </p>
        )}
      </div>

      {/* Mini scoreboard */}
      {scores.length > 0 && (
        <div className="flex items-center justify-center space-x-1 flex-wrap gap-1">
          {scores.map((s, i) => (
            <div
              key={i}
              title={`Từ ${i + 1}: ${s}%`}
              className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                s >= 80 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
