import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowLeft, Volume2, Award, AlertCircle } from 'lucide-react';
import { ExamSummary, ExamDetail, ExamResult } from '../types';
import { examApi, progressApi } from '../services/api';
import { speech } from '../utils/speech';
import { useAuth } from '../contexts/AuthContext';

interface ExamViewProps {
  selectedLevel: number;
}

export const ExamView: React.FC<ExamViewProps> = ({ selectedLevel }) => {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [currentExam, setCurrentExam] = useState<ExamDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadExams();
  }, [selectedLevel]);

  const loadExams = async () => {
    setLoading(true);
    try {
      const data = await examApi.list(selectedLevel);
      setExams(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async (examId: string) => {
    setLoading(true);
    try {
      const detail = await examApi.getDetail(examId);
      setCurrentExam(detail);
      setAnswers({});
      setResult(null);
      setTimeLeft(detail.duration_minutes * 60);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!currentExam || result || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentExam, result, timeLeft]);

  const handleSubmit = async () => {
    if (!currentExam) return;
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentExam) {
    return (
      <div className="max-w-4xl mx-auto my-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Đề Thi Mô Phỏng HSK {selectedLevel}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Chuẩn cấu trúc đề thi năng lực Hán ngữ mới nhất năm 2026
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Đang tải danh sách đề thi...</div>
        ) : exams.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
            Chưa có đề thi mô phỏng cho cấp độ này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900 shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs">
                      HSK {exam.hsk_level}
                    </span>
                    <span className="flex items-center text-xs font-semibold text-slate-500">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {exam.duration_minutes} phút
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {exam.description || 'Đề thi chuẩn hóa giúp rèn luyện phản xạ và chiến thuật làm bài.'}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">
                    {exam.question_count} câu hỏi
                  </span>
                  <button
                    onClick={() => startExam(exam.id)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 active:scale-95 transition-all"
                  >
                    Bắt đầu làm bài
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 px-4">
      {/* Top Bar with Timer */}
      <div className="sticky top-20 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentExam(null)}
          className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Thoát đề</span>
        </button>

        <div className="flex items-center space-x-2 text-sm font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900">
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {!result ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Nộp bài
          </button>
        ) : (
          <button
            onClick={() => setCurrentExam(null)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
          >
            Đóng kết quả
          </button>
        )}
      </div>

      {/* Result Card if submitted */}
      {result && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center">
                <Award className="w-4 h-4 mr-1.5" />
                Kết quả kỳ thi
              </div>
              <h3 className="text-3xl font-extrabold mt-1">
                {result.score} <span className="text-base font-normal text-slate-400">/ 100 điểm</span>
              </h3>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
                  result.passed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {result.passed ? 'ĐẠT (通过)' : 'CHƯA ĐẠT (未通过)'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Đúng {result.correct_count} / {result.total_questions} câu
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {currentExam.questions.map((q) => {
          const detail = result?.details.find((d) => d.question_id === q.id);
          const isSelected = (opt: string) => answers[q.id] === opt;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                detail
                  ? detail.is_correct
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20'
                    : 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Câu {q.question_number} • {q.section === 'listening' ? 'Kỹ năng Nghe' : 'Kỹ năng Đọc'}
                </span>

                {/* Audio button for listening section */}
                {q.audio_text && (
                  <button
                    onClick={() => speech.speak(q.audio_text || '')}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Phát âm câu thoại</span>
                  </button>
                )}
              </div>

              {/* Stimulus context */}
              {q.stimulus && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-line chinese-font border border-slate-100 dark:border-slate-800">
                  {q.stimulus}
                </div>
              )}

              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                {q.question_text}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {q.options?.map((opt, idx) => {
                  const checked = isSelected(opt);
                  const isCorrectAnswer = detail && detail.correct_answer === opt;

                  return (
                    <button
                      key={idx}
                      disabled={!!result}
                      onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      className={`w-full text-left p-3.5 rounded-2xl text-sm font-medium transition-all flex items-center justify-between border ${
                        checked
                          ? 'border-red-500 bg-red-50/60 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                          : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      } ${isCorrectAnswer ? 'ring-2 ring-emerald-500' : ''}`}
                    >
                      <span className="chinese-font">{opt}</span>
                      {detail && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      {detail && checked && !detail.is_correct && (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {detail && (
                <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                    Đáp án đúng: <span className="text-emerald-600 dark:text-emerald-400">{detail.correct_answer}</span>
                  </div>
                  <div>{detail.explanation_vi}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
