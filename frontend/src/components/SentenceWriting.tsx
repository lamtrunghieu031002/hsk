import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { pinyin } from 'pinyin-pro';
import {
  NotebookPen, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight,
  Eye, EyeOff, Sparkles, Award, SkipForward, AlertCircle, Printer,
} from 'lucide-react';
import { WritingSentence } from '../types';
import { sentenceApi } from '../services/api';
import { computeDiff, isCJK } from '../utils/dictation';

// ── helpers ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400',
  2: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
  3: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
  4: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400',
  5: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400',
  6: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400',
};

interface RowState {
  input: string;
  checked: boolean;
  score: number;
  skipped: boolean;
}

interface Props {
  selectedLevel: number;
}

export const SentenceWriting: React.FC<Props> = ({ selectedLevel }) => {
  const [sentences, setSentences] = useState<WritingSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState(selectedLevel || 1);

  const [started, setStarted] = useState(false);
  const [queue, setQueue] = useState<WritingSentence[]>([]);
  const [rows, setRows] = useState<RowState[]>([]);
  const [idx, setIdx] = useState(0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [exportPinyin, setExportPinyin] = useState(true);
  const [exportAnswer, setExportAnswer] = useState(false);
  const [exportLines, setExportLines] = useState(3);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load sentences for selected level
  useEffect(() => {
    setLoading(true);
    setError(null);
    setStarted(false);
    sentenceApi.list(levelFilter)
      .then(data => { setSentences(data); setLoading(false); })
      .catch(() => { setError('Không thể tải câu luyện tập'); setLoading(false); });
  }, [levelFilter]);

  // Auto-focus input when idx changes
  useEffect(() => {
    if (started) setTimeout(() => inputRef.current?.focus(), 80);
  }, [idx, started]);

  const handleExport = (opts: { showPinyin: boolean; showAnswer: boolean; linesPerSentence: number }) => {
    const today = new Date().toLocaleDateString('vi-VN');
    const rows = sentences.map((s, i) => {
      const pinyinLine = opts.showPinyin
        ? `<div class="pinyin">${s.pinyin}</div>` : '';
      const answerLine = opts.showAnswer
        ? `<div class="answer">${s.chinese}</div>` : '';
      const blankLines = Array.from({ length: opts.linesPerSentence })
        .map(() => `<div class="blank-line"></div>`).join('');
      return `
        <div class="sentence-block">
          <div class="sentence-header">
            <span class="num">${i + 1}</span>
            <span class="meaning">${s.meaning_vi}</span>
          </div>
          ${pinyinLine}
          ${answerLine}
          ${blankLines}
        </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<title>Phiếu Luyện Viết Câu HSK ${levelFilter}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', serif; font-size: 13pt; color: #111; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 18mm 18mm 14mm; }
  .page-header { text-align: center; margin-bottom: 10mm; border-bottom: 2px solid #333; padding-bottom: 5mm; }
  .page-header h1 { font-size: 17pt; font-weight: bold; letter-spacing: 0.03em; }
  .page-header p  { font-size: 10pt; color: #555; margin-top: 2mm; }
  .sentence-block { margin-bottom: 8mm; break-inside: avoid; }
  .sentence-header { display: flex; align-items: baseline; gap: 6px; margin-bottom: 2mm; }
  .num { display: inline-block; min-width: 22px; font-weight: bold; font-size: 11pt; color: #555; flex-shrink: 0; }
  .meaning { font-size: 13pt; font-weight: 600; }
  .pinyin { padding-left: 28px; font-size: 11pt; color: #c0392b; margin-bottom: 1.5mm; font-style: italic; }
  .answer {
    padding-left: 28px;
    font-family: 'Noto Serif SC', 'Noto Sans SC', 'SimSun', serif;
    font-size: 16pt;
    font-weight: 700;
    color: #1a5276;
    margin-bottom: 2mm;
    letter-spacing: 0.08em;
  }
  .blank-line {
    margin-left: 28px;
    margin-bottom: 3.5mm;
    height: 0;
    border-bottom: 1px solid #aaa;
  }
  .footer { margin-top: 10mm; text-align: center; font-size: 9pt; color: #999; border-top: 1px solid #ddd; padding-top: 3mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 10mm 14mm; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="page-header">
    <h1>Phiếu Luyện Viết Câu — HSK ${levelFilter}</h1>
    <p>Ngày: ${today} &nbsp;|&nbsp; ${sentences.length} câu &nbsp;|&nbsp; ${opts.showAnswer ? 'Có đáp án' : 'Không đáp án'} &nbsp;|&nbsp; ${opts.showPinyin ? 'Có pinyin' : 'Không pinyin'}</p>
  </div>
  ${rows}
  <div class="footer">Phiếu được tạo từ HSK Mastery 2026 — hskmastery.app</div>
</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) { alert('Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép popup.'); return; }
    win.document.write(html);
    win.document.close();
  };

  const handleStart = () => {
    const q = shuffle(sentences);
    setQueue(q);
    setRows(q.map(() => ({ input: '', checked: false, score: 0, skipped: false })));
    setIdx(0);
    setShowAnswer(false);
    setStarted(true);
  };

  const handleCheck = useCallback(() => {
    const sent = queue[idx];
    const input = rows[idx]?.input ?? '';
    if (!sent || !input.trim()) return;
    const result = computeDiff(input, sent.chinese);
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, checked: true, score: result.score } : r));
    setShowAnswer(false);
  }, [queue, rows, idx]);

  const handleSkip = useCallback(() => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, skipped: true } : r));
    if (idx < queue.length - 1) { setIdx(i => i + 1); setShowAnswer(false); }
  }, [idx, queue.length]);

  const handleReset = useCallback((i: number) => {
    setRows(prev => prev.map((r, j) => j === i ? { input: '', checked: false, score: 0, skipped: false } : r));
    if (i === idx) { setShowAnswer(false); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [idx]);

  const goTo = useCallback((i: number) => {
    setIdx(i); setShowAnswer(false);
  }, []);

  // Stats
  const doneCount  = rows.filter(r => r.checked || r.skipped).length;
  const avgScore   = useMemo(() => {
    const checked = rows.filter(r => r.checked);
    return checked.length ? Math.round(checked.reduce((s, r) => s + r.score, 0) / checked.length) : null;
  }, [rows]);
  const allDone = queue.length > 0 && rows.every(r => r.checked || r.skipped);

  const sent = queue[idx];
  const row  = rows[idx];

  const diffResult = row?.checked && sent ? computeDiff(row.input, sent.chinese) : null;

  // ── Loading / empty state ──────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto my-8 text-center py-16 text-slate-400 text-sm">
        Đang tải câu luyện tập...
      </div>
    );
  }

  // ── Start screen ──────────────────────────────────────────────────────────

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto my-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <NotebookPen className="w-6 h-6 text-emerald-500" />
            Tập Viết Câu
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Đọc nghĩa tiếng Việt → gõ câu tiếng Trung tương ứng
          </p>
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map(lvl => {
            const count = sentences.filter(s => s.hsk_level === lvl).length;
            const isActive = levelFilter === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                HSK {lvl}
                {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-sm text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sentences.length === 0 && !error ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
              <NotebookPen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Chưa có câu luyện tập cho HSK {levelFilter}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Admin có thể thêm câu trong phần Quản Trị → Tập Viết Câu</p>
          </div>
        ) : (
          <>
            {/* Preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {sentences.length} câu HSK {levelFilter} — xem trước
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${LEVEL_COLORS[levelFilter]}`}>
                  HSK {levelFilter}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {sentences.slice(0, 10).map((s, i) => (
                  <div key={s.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{s.meaning_vi}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{s.pinyin}</p>
                    </div>
                  </div>
                ))}
                {sentences.length > 10 && (
                  <div className="px-4 py-2 text-xs text-center text-slate-400">
                    ... và {sentences.length - 10} câu nữa
                  </div>
                )}
              </div>
            </div>

            {/* Export / Print section */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Printer className="w-4 h-4 text-slate-500" />
                Xuất phiếu luyện tập để in / chép tay
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {/* Pinyin toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setExportPinyin(v => !v)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${exportPinyin ? 'bg-red-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${exportPinyin ? 'left-[18px]' : 'left-[2px]'}`} />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300">In kèm Pinyin</span>
                </label>
                {/* Answer toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setExportAnswer(v => !v)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${exportAnswer ? 'bg-blue-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${exportAnswer ? 'left-[18px]' : 'left-[2px]'}`} />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300">In kèm đáp án</span>
                </label>
                {/* Lines per sentence */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Số dòng chép:</span>
                  {[2, 3, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setExportLines(n)}
                      className={`w-7 h-7 rounded-lg font-bold transition-colors ${
                        exportLines === n
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-emerald-400'
                      }`}
                    >{n}</button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleExport({ showPinyin: exportPinyin, showAnswer: exportAnswer, linesPerSentence: exportLines })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Tạo phiếu in ({sentences.length} câu)
              </button>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Bắt đầu luyện {sentences.length} câu →
            </button>
          </>
        )}
      </div>
    );
  }

  // ── All done ──────────────────────────────────────────────────────────────

  if (allDone && avgScore !== null) {
    return (
      <div className="max-w-3xl mx-auto my-8 space-y-6">
        <div className={`rounded-3xl p-8 border text-center space-y-4 ${
          avgScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' :
          avgScore >= 50 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' :
                          'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
        }`}>
          <Award className={`w-12 h-12 mx-auto ${
            avgScore >= 80 ? 'text-emerald-500' : avgScore >= 50 ? 'text-amber-500' : 'text-rose-500'
          }`} />
          <div className={`text-5xl font-extrabold ${
            avgScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
            avgScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
          }`}>{avgScore}%</div>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
            {avgScore >= 90 ? 'Xuất sắc!' : avgScore >= 80 ? 'Tốt lắm!' : avgScore >= 60 ? 'Khá ổn!' : 'Luyện thêm nhé!'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {rows.filter(r => r.checked && r.score >= 90).length} câu xuất sắc •
            {' '}{rows.filter(r => r.checked && r.score >= 60 && r.score < 90).length} câu khá •
            {' '}{rows.filter(r => r.skipped).length} câu bỏ qua
          </p>
          <button
            onClick={handleStart}
            className="mx-auto flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />Luyện lại từ đầu
          </button>
        </div>
      </div>
    );
  }

  if (!sent || !row) return null;

  // ── Practice screen ───────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-slate-700 dark:text-slate-200">Câu {idx + 1}/{queue.length}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{doneCount}/{queue.length} đã xong</span>
          {avgScore !== null && (
            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-xs">
              <Award className="w-3.5 h-3.5" />TB {avgScore}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPinyin(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showPinyin
                ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-400 text-amber-700 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-amber-400'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Pinyin gợi ý
          </button>
          <button
            onClick={() => { setStarted(false); setSentences([]); setLoading(true); sentenceApi.list(levelFilter).then(d => { setSentences(d); setLoading(false); }).catch(() => setLoading(false)); }}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            ← Đổi cấp độ
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${(doneCount / queue.length) * 100}%` }}
        />
      </div>

      {/* Sentence card */}
      <div className={`rounded-3xl border overflow-hidden bg-white dark:bg-slate-900 transition-all ${
        row.checked
          ? row.score >= 90 ? 'border-emerald-300 dark:border-emerald-800' :
            row.score >= 60 ? 'border-amber-300 dark:border-amber-700' : 'border-rose-300 dark:border-rose-700'
          : 'border-slate-200 dark:border-slate-800'
      }`}>
        {/* Card header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {idx + 1}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${LEVEL_COLORS[sent.hsk_level] || ''}`}>
              HSK {sent.hsk_level}
            </span>
          </div>
          {row.checked && (
            <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-xl border ${
              row.score >= 90 ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' :
              row.score >= 60 ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' :
                                'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
            }`}>{row.score}%</span>
          )}
        </div>

        {/* Prompt */}
        <div className="px-5 py-4">
          {/* Vietnamese meaning — the main cue */}
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            {sent.meaning_vi}
          </div>

          {/* Pinyin hint (optional) */}
          {showPinyin && !row.checked && (
            <div className="text-sm text-red-500 dark:text-red-400 font-medium mt-2">
              {sent.pinyin}
            </div>
          )}

          {/* Show answer spoiler */}
          {showAnswer && !row.checked && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 chinese-font text-base font-semibold text-amber-800 dark:text-amber-300">
              {sent.chinese}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="px-5 pb-4 space-y-3">
          {!row.checked ? (
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={row.input}
                lang="zh"
                onChange={e => setRows(prev => prev.map((r, i) => i === idx ? { ...r, input: e.target.value } : r))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCheck(); } }}
                placeholder="Gõ câu tiếng Trung rồi nhấn Enter..."
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 chinese-font transition-colors"
              />
              <button
                onClick={handleCheck}
                disabled={!row.input.trim()}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-30 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />Kiểm tra
              </button>
            </div>
          ) : (
            /* Result diff */
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Đáp án đúng</p>
                <div className="flex flex-wrap gap-0.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {diffResult?.answerTokens.map((tk, i) => (
                    <span key={i} className={`chinese-font text-xl font-bold ${
                      tk.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400 underline decoration-2 underline-offset-2'
                    }`}>{tk.char}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bạn đã gõ</p>
                <div className="flex flex-wrap gap-0.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {diffResult && diffResult.typedTokens.length > 0
                    ? diffResult.typedTokens.map((tk, i) => (
                        <span key={i} className={`chinese-font text-xl font-bold ${
                          tk.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 line-through'
                        }`}>{tk.char}</span>
                      ))
                    : <span className="text-slate-300 dark:text-slate-600 text-sm italic">Chưa gõ chữ Hán nào</span>
                  }
                </div>
              </div>
              {/* Pinyin of answer */}
              <div className="text-sm text-red-500 dark:text-red-400 font-medium px-1">{sent.pinyin}</div>
              {/* Missed chars */}
              {diffResult?.answerTokens.some(tk => tk.status === 'missing') && (
                <div className="flex flex-wrap gap-1.5">
                  {diffResult.answerTokens.filter(tk => tk.status === 'missing').map((tk, i) => (
                    <div key={i} className="flex flex-col items-center bg-rose-50 dark:bg-rose-950/30 rounded-xl px-2.5 py-1.5 border border-rose-200 dark:border-rose-900/60">
                      <span className="text-xl font-bold text-rose-600 dark:text-rose-400 chinese-font">{tk.char}</span>
                      <span className="text-[10px] text-rose-500">{pinyin(tk.char, { toneType: 'symbol' })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-4 pt-2 flex items-center gap-2 flex-wrap border-t border-slate-100 dark:border-slate-800">
          {!row.checked && !showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />Xem đáp án
            </button>
          )}
          {row.checked ? (
            <button
              onClick={() => handleReset(idx)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition-colors border border-rose-200/60 dark:border-rose-800/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />Làm lại
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />Bỏ qua
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={() => { if (idx > 0) goTo(idx - 1); }}
            disabled={idx === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />Câu trước
          </button>
          <button
            onClick={() => { if (idx < queue.length - 1) goTo(idx + 1); }}
            disabled={idx >= queue.length - 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 disabled:opacity-30 transition-colors"
          >
            Câu sau<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sentence list (mini-map) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Danh sách câu</span>
          <span className="text-[10px] text-slate-400">{doneCount}/{queue.length} đã xong</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
          {queue.map((s, i) => {
            const r = rows[i];
            const isActive = i === idx;
            const status = !r ? 'todo' : r.skipped ? 'skip' : !r.checked ? 'todo' : r.score >= 90 ? 'done' : r.score >= 60 ? 'close' : 'wrong';
            const dotCls = { done: 'bg-emerald-500', close: 'bg-amber-400', wrong: 'bg-rose-500', skip: 'bg-slate-400', todo: 'bg-slate-200 dark:bg-slate-700' }[status];
            return (
              <div
                key={s.id}
                onClick={() => goTo(i)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                  isActive ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotCls}`} />
                <span className={`text-[10px] font-bold flex-shrink-0 w-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{i + 1}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate flex-1">{s.meaning_vi}</span>
                {r?.checked && (
                  <span className={`text-[10px] font-extrabold flex-shrink-0 ${
                    r.score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                    r.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>{r.score}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
