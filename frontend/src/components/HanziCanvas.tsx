import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { Play, RotateCcw, Eye, Volume2, CheckCircle2 } from 'lucide-react';
import { speech } from '../utils/speech';

interface HanziCanvasProps {
  char: string;
  pinyin?: string;
  meaning?: string;
  hanViet?: string;
}

export const HanziCanvas: React.FC<HanziCanvasProps> = ({
  char,
  pinyin,
  meaning,
  hanViet
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const [mode, setMode] = useState<'view' | 'quiz'>('view');
  const [quizScore, setQuizScore] = useState<string | null>(null);

  // Take the first character if string is multiple hanzi
  const activeChar = char ? char.charAt(0) : '好';

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    writerRef.current = HanziWriter.create(containerRef.current, activeChar, {
      width: 260,
      height: 260,
      padding: 15,
      showOutline: true,
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 150,
      strokeColor: '#de2910', // Red stroke
      outlineColor: '#cbd5e1', // Light slate
      drawingColor: '#1e293b', // Drawing color
    });

    if (mode === 'quiz') {
      startQuiz();
    }
  }, [activeChar, mode]);

  const animateStrokes = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  const startQuiz = () => {
    setQuizScore(null);
    if (writerRef.current) {
      writerRef.current.quiz({
        onComplete: (summary: any) => {
          setQuizScore(`Xuất sắc! Hoàn thành với ${summary.totalMistakes} lỗi sai.`);
        }
      });
    }
  };

  const resetCanvas = () => {
    if (writerRef.current) {
      writerRef.current.hideCharacter();
      writerRef.current.showOutline();
      if (mode === 'quiz') {
        startQuiz();
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg max-w-sm mx-auto">
      {/* Header Info */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{pinyin || ''}</span>
          <button
            onClick={() => speech.speak(activeChar)}
            className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        {hanViet && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
            Hán-Việt: {hanViet}
          </span>
        )}
        {meaning && (
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
            {meaning}
          </p>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 mb-4 w-full">
        <button
          onClick={() => setMode('view')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            mode === 'view'
              ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Xem thứ tự nét
        </button>
        <button
          onClick={() => setMode('quiz')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            mode === 'quiz'
              ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Tập viết tay (Quiz)
        </button>
      </div>

      {/* Grid Canvas Frame with Chinese rice-grid (米字格) styling */}
      <div className="relative p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-red-200 dark:border-red-900/50 shadow-inner">
        <div ref={containerRef} className="cursor-crosshair flex items-center justify-center" />
      </div>

      {/* Feedback Alert */}
      {quizScore && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4" />
          <span>{quizScore}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-2 mt-5">
        {mode === 'view' ? (
          <button
            onClick={animateStrokes}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Phát nét vẽ</span>
          </button>
        ) : (
          <button
            onClick={startQuiz}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Viết lại</span>
          </button>
        )}

        <button
          onClick={resetCanvas}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Xóa trắng"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
