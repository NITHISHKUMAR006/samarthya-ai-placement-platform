import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Assessment } from '../../types';
import { CategoryBadge } from '../../components/common/Badge';
import { Clock, HelpCircle, CheckCircle, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

export const AssessmentCenter: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const catParam = category === 'all' ? undefined : category;
        const data = await api.getAssessments(catParam);
        setAssessments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [category]);

  const handleStart = async (assessmentId: string) => {
    setStartingId(assessmentId);
    setError(null);
    try {
      const resp = await api.startAssessment(assessmentId);
      navigate(`/student/assessment/${assessmentId}/attempt/${resp.attempt_id}`);
    } catch (err: any) {
      setError(err.message || 'Could not start assessment attempt.');
      setStartingId(null);
    }
  };

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'aptitude', label: 'Aptitude & Logic' },
    { id: 'programming', label: 'Data Structures & Coding' },
    { id: 'technical', label: 'Technical Systems' },
    { id: 'communication', label: 'Communication & Soft Skills' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Placement Assessment Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Standardized evaluations aligned with Google, Microsoft, and Deloitte placement thresholds.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              category === c.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Assessment List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((ass) => (
            <div
              key={ass.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <CategoryBadge category={ass.category} />
                  <span className="text-[11px] font-semibold text-slate-400 capitalize">
                    {ass.difficulty} Difficulty
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {ass.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {ass.description || 'Comprehensive readiness assessment module with verified question sets.'}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center mt-0.5">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {ass.duration_minutes}m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Questions</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center mt-0.5">
                      <HelpCircle className="w-3 h-3 mr-1 text-slate-400" />
                      {ass.question_count || 4}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pass Mark</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-3 h-3 mr-1 text-slate-400" />
                      {ass.pass_marks} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {ass.user_completed ? (
                    <span className="text-emerald-600 font-semibold">Completed ({ass.best_score} pts)</span>
                  ) : (
                    <span>Attempts: {ass.attempts_count || 0}/{ass.max_attempts}</span>
                  )}
                </div>

                <button
                  onClick={() => handleStart(ass.id)}
                  disabled={startingId === ass.id}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  <span>{startingId === ass.id ? 'Starting...' : 'Start Assessment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
