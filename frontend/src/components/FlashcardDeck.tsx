import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCw, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Vocabulary } from '../types';
import { speech } from '../utils/speech';
import { srsApi, progressApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface FlashcardDeckProps {
  cards: Vocabulary[];
  onFinish?: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, onFinish }) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const correctCountRef = useRef(0);

  // Stable refs so the keyboard handler never needs to be re-registered
  const stateRef = useRef({ currentIndex, isFlipped, cards, onFinish });
  useEffect(() => {
    stateRef.current = { currentIndex, isFlipped, cards, onFinish };
  });

  const currentCard = cards[currentIndex];

  // Speak on card change
  useEffect(() => {
    setIsFlipped(false);
    const card = cards[currentIndex];
    if (card) speech.speak(card.simplified);
  }, [currentIndex, cards]);

  const handleNext = useCallback(() => {
    const { currentIndex: idx, cards: c, onFinish: fin } = stateRef.current;
    if (idx < c.length - 1) {
      setDirection(1);
      setCurrentIndex(idx + 1);
    } else {
      if (user && c.length > 0) {
        const correct = correctCountRef.current;
        progressApi.logSession({
          session_type: 'flashcard',
          hsk_level: c[0].hsk_level,
          items_count: c.length,
          correct_count: correct,
          score: c.length > 0 ? correct / c.length : 0,
        }).catch(() => {});
      }
      correctCountRef.current = 0;
      fin?.();
    }
  }, [user]);

  const handlePrev = useCallback(() => {
    const { currentIndex: idx } = stateRef.current;
    if (idx > 0) {
      setDirection(-1);
      setCurrentIndex(idx - 1);
    }
  }, []);

  const handleRating = useCallback((quality: number) => {
    const { cards: c, currentIndex: idx } = stateRef.current;
    const card = c[idx];
    if (!card) return;
    if (quality >= 3) correctCountRef.current += 1;
    const userId = user?.id ?? 'guest_user';
    srsApi.reviewCard(card.id, quality, userId).catch(e => console.warn('SRS sync:', e));
    handleNext();
  }, [handleNext, user]);

  // Single registration — reads live state via ref
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { currentIndex: idx, isFlipped: flipped, cards: c } = stateRef.current;
    if (e.code === 'Space') {
      e.preventDefault();
      setIsFlipped(prev => !prev);
    } else if (e.key === 'ArrowRight' && idx < c.length - 1) {
      handleNext();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      handlePrev();
    } else if (flipped) {
      if (e.key === '1') handleRating(1);
      else if (e.key === '2') handleRating(2);
      else if (e.key === '3') handleRating(3);
      else if (e.key === '4') handleRating(4);
    }
  }, [handleNext, handlePrev, handleRating]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]); // handleKeyDown is stable — registers exactly once

  if (!cards.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Đã hoàn thành phiên ôn tập!</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Không có thẻ nào cần ôn tập gấp trong cấp độ này.
        </p>
      </div>
    );
  }

  const progressPct = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto my-6 px-4">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
          HSK {currentCard.hsk_level} • Thẻ {currentIndex + 1} / {cards.length}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Phím tắt: [Phím cách] Lật thẻ • [1-4] Đánh giá
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
        <div
          className="bg-gradient-to-r from-red-500 to-amber-500 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3D Flashcard */}
      <div className="perspective-1000 min-h-[380px] w-full flex items-center justify-center cursor-pointer select-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsFlipped(f => !f)}
            className="w-full h-[380px] relative rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/60 flex flex-col items-center justify-between transition-all"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {currentCard.part_of_speech || 'Từ vựng'}
              </span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); speech.speak(currentCard.simplified); }}
                className="p-2.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:scale-110 active:scale-95 transition-all"
                title="Nghe phát âm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {!isFlipped ? (
              <div className="text-center my-auto">
                <div className="text-6xl sm:text-7xl font-extrabold text-slate-900 dark:text-white mb-4 chinese-font tracking-wide">
                  {currentCard.simplified}
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400 tracking-wider">
                  {currentCard.pinyin}
                </div>
                <p className="text-xs text-slate-400 mt-6 flex items-center justify-center space-x-1">
                  <RotateCw className="w-3.5 h-3.5 mr-1" />
                  <span>Bấm để xem nghĩa tiếng Việt &amp; ví dụ</span>
                </p>
              </div>
            ) : (
              <div className="w-full my-auto text-center space-y-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    Âm Hán-Việt: {currentCard.han_viet || '—'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {currentCard.meaning_vi}
                </div>
                {currentCard.meaning_en && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                    "{currentCard.meaning_en}"
                  </div>
                )}
                {currentCard.examples.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 chinese-font">
                      {currentCard.examples[0].chinese}
                    </div>
                    <div className="text-xs text-red-500 font-medium mt-0.5">
                      {currentCard.examples[0].pinyin}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {currentCard.examples[0].meaning_vi}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-[11px] text-slate-400 font-medium">
              {!isFlipped ? 'Chạm để lật thẻ' : 'Chọn độ khó bên dưới để thuật toán ghi nhớ'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SM-2 Rating Buttons */}
      <div className="mt-6">
        {isFlipped ? (
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { q: 1, label: '1. Chưa nhớ', cls: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100' },
              { q: 2, label: '2. Khó',      cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100' },
              { q: 3, label: '3. Tốt',      cls: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-100' },
              { q: 4, label: '4. Rất dễ',   cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100' },
            ].map(({ q, label, cls }) => (
              <button
                key={q}
                onClick={() => handleRating(q)}
                className={`py-3 px-2 rounded-2xl border font-bold text-xs sm:text-sm transition-all ${cls}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Trước</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-semibold transition-all"
            >
              <span>Sau</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
