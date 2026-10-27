import React from 'react';

interface LevelSelectorProps {
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  stats?: Record<string, number>;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
  stats
}) => {
  const levels = [
    { level: 1, label: 'HSK 1', desc: 'Nhập môn (150 từ)', color: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500' },
    { level: 2, label: 'HSK 2', desc: 'Sơ cấp (300 từ)', color: 'from-teal-500 to-cyan-600', ring: 'ring-teal-500' },
    { level: 3, label: 'HSK 3', desc: 'Trung cấp 1 (600 từ)', color: 'from-blue-500 to-indigo-600', ring: 'ring-blue-500' },
    { level: 4, label: 'HSK 4', desc: 'Trung cấp 2 (1200 từ)', color: 'from-indigo-500 to-purple-600', ring: 'ring-indigo-500' },
    { level: 5, label: 'HSK 5', desc: 'Cao cấp (2500 từ)', color: 'from-purple-500 to-pink-600', ring: 'ring-purple-500' },
    { level: 6, label: 'HSK 6', desc: 'Tinh hoa (5000+ từ)', color: 'from-rose-500 to-amber-600', ring: 'ring-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-6">
      {levels.map((item) => {
        const isSelected = selectedLevel === item.level;
        const count = stats ? stats[`hsk${item.level}`] || 0 : null;

        return (
          <button
            key={item.level}
            onClick={() => onSelectLevel(item.level)}
            className={`group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-300 transform active:scale-95 ${
              isSelected
                ? 'bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 ring-2 ' + item.ring
                : 'bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            {/* Top accent badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg text-white bg-gradient-to-r ${item.color} shadow-xs`}
              >
                {item.label}
              </span>
              {count !== null && (
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {count} mục
                </span>
              )}
            </div>

            <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {item.desc}
            </div>

            {/* Bottom active indicator */}
            {isSelected && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
