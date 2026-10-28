import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AttemptResultDetail } from '../../types';
import { CheckCircle2, XCircle, Award, Sparkles, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

export const AssessmentResultView: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [data, setData] = useState<AttemptResultDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [explainingQuestionId, setExplainingQuestionId] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchResult = async () => {
      if (!attemptId) return;
      try {
        const res = await api.getAttemptResult(attemptId);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  const handleRequestAiExplanation = async (qText: string, correctAns: string, qId: string) => {
    setExplainingQuestionId(qId);
    try {
      const resp = await api.explainQuestion({
        question_text: qText,
        correct_answer: correctAns,
      });
      setAiExplanations((prev) => ({ ...prev, [qId]: resp.ai_explanation }));
    } finally {
      setExplainingQuestionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Attempt result could not be found.</p>
        <Link to="/student/assessments" className="mt-4 inline-block text-xs font-bold text-blue-600">
          Back to Assessments
        </Link>
      </div>
    );
  }

  const { attempt, assessment, result, questions } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <div>
        <Link
          to="/student/history"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to History</span>
        </Link>
      </div>

      {/* Score Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assessment Evaluation Report
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {assessment?.title || 'Placement Diagnostic Assessment'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Competency: {assessment?.category?.toUpperCase()} • Passing Mark: {assessment?.pass_marks} pts
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-xl text-center border ${
              attempt.passed
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block">Result</span>
              <span className="text-sm font-extrabold">{attempt.passed ? 'PASSED' : 'NEEDS PRACTICE'}</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Score</span>
              <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                {attempt.score} <span className="text-xs font-normal text-slate-400">/ {assessment?.total_marks || 20}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center mb-1">
            <Award className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
            Performance Feedback
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {attempt.feedback || 'Great diagnostic effort! Verified placement indicators have been updated in your skill matrix.'}
          </p>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Question Review & Solutions
          </h2>
          <span className="text-xs text-slate-400">{questions?.length || 0} Total Items</span>
        </div>

        {questions?.map((q, idx) => {
          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Item {idx + 1}
                </span>
                <span className="text-slate-500 font-medium">
                  {q.marks} Marks • {q.skill || 'Core Knowledge'}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {q.question_text}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {q.options?.map((opt, oIdx) => {
                  const isCorrectAnswer = opt === q.correct_answer;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
                        isCorrectAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                          isCorrectAnswer ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {q.explanation && (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300">
                  <span className="font-bold block mb-1">Official Solution Explanation:</span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}

              {/* AI Deep Explanation */}
              {aiExplanations[q.id] && (
                <div className="mt-3 p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                  <div className="font-bold flex items-center text-teal-700 dark:text-teal-300">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    AI Placement Mentor Deep Analysis:
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">{aiExplanations[q.id]}</p>
                </div>
              )}

              {/* AI Button */}
              {!aiExplanations[q.id] && (
                <button
                  onClick={() => handleRequestAiExplanation(q.question_text, q.correct_answer || '', q.id)}
                  disabled={explainingQuestionId === q.id}
                  className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{explainingQuestionId === q.id ? 'Generating AI Breakdown...' : 'Ask AI Mentor to Explain In-Depth'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
