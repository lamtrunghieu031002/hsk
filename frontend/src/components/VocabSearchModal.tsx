import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Volume2, ArrowRight } from 'lucide-react';
import { Vocabulary } from '../types';
import { vocabApi } from '../services/api';
import { speech } from '../utils/speech';

interface VocabSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord: (word: Vocabulary) => void;
}

export const VocabSearchModal: React.FC<VocabSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectWord
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Stable reference — never causes the debounce effect to re-register
  const performSearch = useCallback(async (text: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res = await vocabApi.list(undefined, text, 1, 15);
      setResults(res.items);
    } catch (e: any) {
      if (e?.code !== 'ERR_CANCELED' && e?.name !== 'AbortError') console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query.trim());
      } else {
        setResults([]);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-red-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo Chữ Hán, Pinyin (ni hao) hoặc Nghĩa tiếng Việt..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {loading && (
            <div className="text-center py-6 text-xs text-slate-400">
              Đang tìm kiếm trong cơ sở dữ liệu PostgreSQL...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              Không tìm thấy từ vựng nào khớp với "{query}".
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-8 text-xs text-slate-400">
              Nhập từ khóa để tra cứu siêu tốc toàn bộ từ vựng HSK 1 - 6
            </div>
          )}

          {results.map((word) => (
            <div
              key={word.id}
              onClick={() => {
                onSelectWord(word);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-red-50/60 dark:hover:bg-red-950/30 border border-slate-100 dark:border-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-slate-900 dark:text-white chinese-font">
                  {word.simplified}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {word.pinyin}
                    </span>
                    {word.han_viet && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-medium">
                        [{word.han_viet}]
                      </span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                      HSK {word.hsk_level}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {word.meaning_vi}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speech.speak(word.simplified);
                  }}
                  className="p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
