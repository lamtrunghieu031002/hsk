import React, { useState, useEffect } from 'react';
import { Volume2, BookOpenCheck, ChevronRight } from 'lucide-react';
import { GrammarPoint } from '../types';
import { grammarApi } from '../services/api';
import { speech } from '../utils/speech';

interface GrammarListProps {
  selectedLevel: number;
}

export const GrammarList: React.FC<GrammarListProps> = ({ selectedLevel }) => {
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGrammar();
  }, [selectedLevel]);

  const loadGrammar = async () => {
    setLoading(true);
    try {
      const data = await grammarApi.list(selectedLevel);
      setGrammarPoints(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ngữ Pháp Cốt Lõi HSK {selectedLevel}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tổng hợp công thức, cấu trúc câu mẫu và lưu ý quan trọng khi thi
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Đang tải ngữ pháp...</div>
      ) : grammarPoints.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
          Chưa có bài giảng ngữ pháp cho cấp độ này.
        </div>
      ) : (
        <div className="space-y-4">
          {grammarPoints.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-sm mb-2">
                <BookOpenCheck className="w-4 h-4" />
                <span>{item.title}</span>
              </div>

              {/* Formula Structure Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 font-mono text-xs sm:text-sm font-semibold mb-3">
                {item.structure}
              </div>

              {/* Explanation */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {item.explanation_vi}
              </p>

              {/* Examples */}
              {item.examples.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ví dụ minh họa
                  </span>
                  {item.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-start justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 chinese-font">
                          {ex.chinese}
                        </div>
                        <div className="text-xs text-red-500 font-medium mt-0.5">
                          {ex.pinyin}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {ex.meaning_vi}
                        </div>
                      </div>
                      <button
                        onClick={() => speech.speak(ex.chinese)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-2"
                        title="Nghe phát âm ví dụ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
