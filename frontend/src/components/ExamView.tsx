import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock, CheckCircle2, XCircle, ArrowLeft, Volume2, Award,
  ChevronDown, ChevronUp, RotateCcw, Grid3X3, X,
  BookOpen, Headphones, AlertTriangle, Trophy,
} from 'lucide-react';
import { ExamSummary, ExamDetail, ExamResult, ExamQuestion } from '../types';
import { examApi, progressApi } from '../services/api';
import { speech } from '../utils/speech';
import { useAuth } from '../contexts/AuthContext';

interface ExamViewProps {
  selectedLevel: number;
}

// ── Score ring ────────────────────────────────────────────────────────────────

const ScoreRing: React.FC<{ score: number; passed: boolean }> = ({ score, passed }) => {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - score / 100);
  const color = passed ? '#10b981' : '#f43f5e';
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      <circle cx="70" cy="70" r={R} fill="none" stroke="currentColor" strokeWidth="10"
        className="text-slate-200 dark:text-slate-800" />
      <circle cx="70" cy="70" r={R} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// ── Question navigator ────────────────────────────────────────────────────────

interface NavProps {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  currentIdx: number;
  onJump: (idx: number) => void;
  onClose: () => void;
}

const QuestionNavigator: React.FC<NavProps> = ({ questions, answers, currentIdx, onJump, onClose }) => {
  const listening = questions.filter(q => q.section === 'listening');
  const reading   = questions.filter(q => q.section === 'reading');

  const btn = (q: ExamQuestion, idx: number) => {
    const answered = !!answers[q.id];
    const active   = idx === currentIdx;
    return (
      <button
        key={q.id}
        onClick={() => { onJump(idx); onClose(); }}
        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
          active   ? 'bg-red-600 text-white shadow-md shadow-red-500/30 scale-110' :
          answered ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-400/40' :
                     'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {q.question_number}
      </button>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Điều hướng câu hỏi</span>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-400/30 border border-emerald-400/40 inline-block" />
          Đã trả lời
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block" />
          Chưa làm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-600 inline-block" />
          Đang xem
        </span>
      </div>

      {listening.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" /> Phần Nghe
          </div>
          <div className="flex flex-wrap gap-2">
            {listening.map((q) => btn(q, questions.indexOf(q)))}
          </div>
        </div>
      )}

      {reading.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Phần Đọc
          </div>
          <div className="flex flex-wrap gap-2">
            {reading.map((q) => btn(q, questions.indexOf(q)))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Submit confirmation modal ─────────────────────────────────────────────────

const SubmitModal: React.FC<{
  unanswered: number;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ unanswered, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onCancel}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    <div
      className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Xác nhận nộp bài?</h3>
          {unanswered > 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bạn còn <span className="font-bold text-rose-500">{unanswered} câu</span> chưa trả lời.
              Sau khi nộp sẽ không thể sửa.
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bạn đã trả lời tất cả câu hỏi. Xác nhận nộp bài?
            </p>
          )}
        </div>
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-2xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Làm tiếp
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Nộp bài ngay
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Result page ───────────────────────────────────────────────────────────────

const ResultPage: React.FC<{
  result: ExamResult;
  exam: ExamDetail;
  answers: Record<string, string>;
  onRetake: () => void;
  onBack: () => void;
}> = ({ result, exam, answers, onRetake, onBack }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const listeningDetails = result.details.filter(d => d.section === 'listening');
  const readingDetails   = result.details.filter(d => d.section === 'reading');
  const listeningScore   = listeningDetails.filter(d => d.is_correct).length;
  const readingScore     = readingDetails.filter(d => d.is_correct).length;

  return (
    <div className="max-w-2xl mx-auto my-6 px-4 space-y-6">
      {/* Score card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Score ring */}
          <div className="relative shrink-0 flex items-center justify-center w-[140px] h-[140px]">
            <ScoreRing score={result.score} passed={result.passed} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold leading-none">{result.score}</span>
              <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>

          {/* Text info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Kết quả kỳ thi</span>
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">{exam.title}</h3>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-sm border ${
              result.passed
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              {result.passed
                ? <><CheckCircle2 className="w-4 h-4" /> ĐẠT — 通过</>
                : <><XCircle className="w-4 h-4" /> CHƯA ĐẠT — 未通过</>}
            </span>

            <p className="text-sm text-slate-400">
              Đúng <span className="font-bold text-white">{result.correct_count}</span> / {result.total_questions} câu
            </p>
          </div>
        </div>

        {/* Section breakdown */}
        <div className="border-t border-slate-800 grid grid-cols-2 divide-x divide-slate-800">
          {[
            { label: 'Phần Nghe', icon: Headphones, correct: listeningScore, total: listeningDetails.length },
            { label: 'Phần Đọc',  icon: BookOpen,   correct: readingScore,   total: readingDetails.length   },
          ].map(({ label, icon: Icon, correct, total }) => (
            <div key={label} className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{correct}<span className="text-sm font-normal text-slate-500">/{total}</span></div>
              <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: total > 0 ? `${(correct / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Danh sách đề
        </button>
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-sm shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Làm lại đề này
        </button>
      </div>

      {/* Per-question review */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Xem lại đáp án chi tiết</h3>
        <div className="space-y-2">
          {result.details.map((detail, idx) => {
            const q = exam.questions.find(q => q.id === detail.question_id)!;
            if (!q) return null;
            const open = openIdx === idx;
            return (
              <div
                key={detail.question_id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  detail.is_correct
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {detail.is_correct
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      : <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                    <div className="min-w-0">
                      <span className={`text-[11px] font-bold uppercase tracking-wider mr-2 ${
                        detail.section === 'listening' ? 'text-violet-500' : 'text-sky-500'
                      }`}>
                        {detail.section === 'listening' ? 'Nghe' : 'Đọc'}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Câu {detail.question_number}
                      </span>
                      <span className="ml-2 text-xs text-slate-500 truncate hidden sm:inline">
                        {q.question_text}
                      </span>
                    </div>
                  </div>
                  {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {open && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                    {q.stimulus && (
                      <div className="text-xs bg-white/70 dark:bg-slate-900/60 rounded-xl p-3 chinese-font text-slate-700 dark:text-slate-300 whitespace-pre-line border border-slate-100 dark:border-slate-800">
                        {q.stimulus}
                      </div>
                    )}
                    {q.audio_text && (
                      <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 rounded-xl p-2.5 chinese-font">
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{q.audio_text}</span>
                        <button
                          onClick={() => speech.speak(q.audio_text!)}
                          className="ml-auto px-2 py-0.5 rounded-lg bg-violet-100 dark:bg-violet-900/40 font-semibold hover:bg-violet-200 transition-colors"
                        >
                          Phát
                        </button>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{q.question_text}</p>

                    <div className="space-y-1.5">
                      {q.options?.map((opt) => {
                        const isUserAnswer   = detail.user_answer === opt;
                        const isCorrectAns   = detail.correct_answer === opt;
                        return (
                          <div
                            key={opt}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border ${
                              isCorrectAns
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                : isUserAnswer
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                                  : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span className="chinese-font">{opt}</span>
                            {isCorrectAns && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            {isUserAnswer && !isCorrectAns && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {detail.explanation_vi && (
                      <div className="text-xs bg-white/70 dark:bg-slate-900/60 rounded-xl p-3 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-800 dark:text-slate-100">Giải thích: </span>
                        {detail.explanation_vi}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Main ExamView ─────────────────────────────────────────────────────────────

export const ExamView: React.FC<ExamViewProps> = ({ selectedLevel }) => {
  const { user } = useAuth();

  const [exams, setExams]           = useState<ExamSummary[]>([]);
  const [currentExam, setCurrentExam] = useState<ExamDetail | null>(null);
  const [answers, setAnswers]       = useState<Record<string, string>>({});
  const [result, setResult]         = useState<ExamResult | null>(null);
  const [timeLeft, setTimeLeft]     = useState<number>(0);
  const [loading, setLoading]       = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavigator, setShowNavigator]     = useState(false);
  const [scrollToIdx, setScrollToIdx]         = useState<number | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setLoading(true);
    examApi.list(selectedLevel)
      .then(setExams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedLevel]);

  const startExam = async (examId: string) => {
    setLoading(true);
    try {
      const detail = await examApi.getDetail(examId);
      setCurrentExam(detail);
      setAnswers({});
      setResult(null);
      setTimeLeft(detail.duration_minutes * 60);
      questionRefs.current = new Array(detail.questions.length).fill(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (!currentExam || result || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(id); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [currentExam, result, timeLeft]);

  // Scroll to question when navigator jumps
  useEffect(() => {
    if (scrollToIdx === null) return;
    questionRefs.current[scrollToIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setScrollToIdx(null);
  }, [scrollToIdx]);

  const handleSubmit = useCallback(async () => {
    if (!currentExam) return;
    setShowSubmitModal(false);
    setLoading(true);
    try {
      const res = await examApi.submit(currentExam.id, answers);
      setResult(res);
      if (user) {
        progressApi.logSession({
          session_type: 'exam',
          hsk_level: currentExam.hsk_level,
          items_count: res.total_questions,
          correct_count: res.correct_count,
          score: res.total_questions > 0 ? res.correct_count / res.total_questions : 0,
        }).catch(() => {});
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentExam, answers, user]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  const timerClass = timeLeft > 300
    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40'
    : timeLeft > 60
      ? 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40'
      : 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 animate-pulse';

  // ── Exam list ───────────────────────────────────────────────────────────────
  if (!currentExam) {
    return (
      <div className="max-w-4xl mx-auto my-6 px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Đề Thi Mô Phỏng HSK {selectedLevel}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chuẩn cấu trúc đề thi năng lực Hán ngữ mới nhất 2026 — có Phần Nghe &amp; Phần Đọc
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Đang tải danh sách đề thi...</div>
        ) : exams.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-500">
            Chưa có đề thi mô phỏng cho cấp độ này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam, i) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900 shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs border border-red-100 dark:border-red-900/40">
                    HSK {exam.hsk_level} — Đề #{i + 1}
                  </span>
                  <span className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {exam.duration_minutes} phút
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight mb-1.5">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
                  {exam.description || 'Đề thi chuẩn hóa giúp rèn luyện phản xạ và chiến thuật làm bài thi thật.'}
                </p>

                {/* Stats row */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5 text-violet-400" />
                      Nghe
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      Đọc
                    </span>
                    <span className="font-semibold text-slate-500">{exam.question_count} câu</span>
                  </div>
                  <button
                    onClick={() => startExam(exam.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Bắt đầu →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Result page ─────────────────────────────────────────────────────────────
  if (result) {
    return (
      <>
        <ResultPage
          result={result}
          exam={currentExam}
          answers={answers}
          onRetake={() => startExam(currentExam.id)}
          onBack={() => { setCurrentExam(null); setResult(null); }}
        />
        {showSubmitModal && (
          <SubmitModal
            unanswered={0}
            onConfirm={handleSubmit}
            onCancel={() => setShowSubmitModal(false)}
          />
        )}
      </>
    );
  }

  // ── Exam in progress ────────────────────────────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const totalCount    = currentExam.questions.length;
  const unanswered    = totalCount - answeredCount;

  // Group questions by section for section dividers
  const sections: { key: string; label: string; icon: typeof Headphones; questions: ExamQuestion[] }[] = [];
  const listeningQs = currentExam.questions.filter(q => q.section === 'listening');
  const readingQs   = currentExam.questions.filter(q => q.section === 'reading');
  if (listeningQs.length) sections.push({ key: 'listening', label: 'Phần Nghe',  icon: Headphones, questions: listeningQs });
  if (readingQs.length)   sections.push({ key: 'reading',   label: 'Phần Đọc',   icon: BookOpen,   questions: readingQs   });

  return (
    <>
      {/* Sticky top bar */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* Back */}
          <button
            onClick={() => setCurrentExam(null)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Thoát đề thi"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Title */}
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex-1 truncate hidden sm:block">
            {currentExam.title}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 shrink-0">
            <span className="text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
            <span>/</span>
            <span>{totalCount}</span>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-extrabold shrink-0 tabular-nums ${timerClass}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Navigator toggle */}
          <button
            onClick={() => setShowNavigator(v => !v)}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              showNavigator
                ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Điều hướng câu hỏi"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>

          {/* Submit */}
          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
          >
            Nộp bài
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(answeredCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Navigator panel (below bar) */}
        {showNavigator && (
          <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="max-w-3xl mx-auto">
              <QuestionNavigator
                questions={currentExam.questions}
                answers={answers}
                currentIdx={-1}
                onJump={(idx) => setScrollToIdx(idx)}
                onClose={() => setShowNavigator(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-10">
        {sections.map(({ key, label, icon: Icon, questions }) => (
          <div key={key}>
            {/* Section header */}
            <div className={`flex items-center gap-2.5 mb-5 pb-3 border-b-2 ${
              key === 'listening'
                ? 'border-violet-200 dark:border-violet-900/60'
                : 'border-sky-200 dark:border-sky-900/60'
            }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                key === 'listening'
                  ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
                  : 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-extrabold text-base ${
                  key === 'listening' ? 'text-violet-700 dark:text-violet-300' : 'text-sky-700 dark:text-sky-300'
                }`}>{label}</h3>
                <p className="text-xs text-slate-400">{questions.length} câu hỏi</p>
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((q) => {
                const globalIdx = currentExam.questions.indexOf(q);
                const isAnswered = !!answers[q.id];
                return (
                  <div
                    key={q.id}
                    ref={el => { questionRefs.current[globalIdx] = el; }}
                    className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                      isAnswered
                        ? 'border-emerald-200 dark:border-emerald-900/60 shadow-sm shadow-emerald-500/5'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Question header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                          isAnswered
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {q.question_number}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {key === 'listening' ? 'Nghe hiểu' : 'Đọc hiểu'}
                        </span>
                      </div>

                      {q.audio_text && (
                        <button
                          onClick={() => speech.speak(q.audio_text!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 text-xs font-bold hover:bg-violet-200 dark:hover:bg-violet-900/60 hover:scale-105 active:scale-95 transition-all border border-violet-200/60 dark:border-violet-800/40"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Phát câu thoại
                        </button>
                      )}
                    </div>

                    {/* Stimulus */}
                    {q.stimulus && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 whitespace-pre-line chinese-font border border-slate-100 dark:border-slate-800/60">
                        {q.stimulus}
                      </div>
                    )}

                    {/* Audio text preview */}
                    {q.audio_text && (
                      <div className="flex items-start gap-2 mb-3 text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 rounded-xl p-2.5 border border-violet-100 dark:border-violet-900/30 chinese-font">
                        <Volume2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{q.audio_text}</span>
                      </div>
                    )}

                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      {q.question_text}
                    </h4>

                    {/* Options */}
                    <div className="space-y-2">
                      {q.options?.map((opt, oi) => {
                        const selected = answers[q.id] === opt;
                        const labels   = ['A', 'B', 'C', 'D'];
                        return (
                          <button
                            key={oi}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all border ${
                              selected
                                ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-200 font-bold shadow-sm shadow-red-500/10'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                              selected
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {labels[oi] ?? oi + 1}
                            </span>
                            <span className="chinese-font">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom submit */}
        <div className="pt-4 pb-8 text-center">
          <p className="text-xs text-slate-400 mb-3">
            Đã trả lời <span className="font-bold text-slate-600 dark:text-slate-300">{answeredCount}/{totalCount}</span> câu
            {unanswered > 0 && <span className="text-rose-500"> · còn {unanswered} câu chưa làm</span>}
          </p>
          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-sm"
          >
            Nộp bài &amp; xem kết quả
          </button>
        </div>
      </div>

      {/* Submit modal */}
      {showSubmitModal && (
        <SubmitModal
          unanswered={unanswered}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </>
  );
};
