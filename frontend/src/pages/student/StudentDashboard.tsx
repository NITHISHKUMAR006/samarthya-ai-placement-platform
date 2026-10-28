import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ReadinessSnapshot, AssessmentAttempt, StudentProfile } from '../../types';
import { MetricCard } from '../../components/common/MetricCard';
import { ReadinessBadge } from '../../components/common/Badge';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  Building,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [readiness, setReadiness] = useState<ReadinessSnapshot | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const studentId = user?.id || 'b0000000-0000-0000-0000-000000000004';

  const loadData = async () => {
    try {
      const [pData, rData, aData] = await Promise.all([
        api.getStudent(studentId).catch(() => null),
        api.getReadiness(studentId).catch(() => null),
        api.getAttemptsHistory().catch(() => []),
      ]);
      if (pData) setProfile(pData);
      if (rData) setReadiness(rData);
      setAttempts(aData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const handleRecalculate = async () => {
    setRefreshing(true);
    try {
      const updated = await api.recalculateReadiness(studentId);
      setReadiness(updated);
    } finally {
      setRefreshing(false);
    }
  };

  // Skill comparison chart data
  const chartData = [
    { skill: 'Aptitude', studentLevel: 4, requiredLevel: 3 },
    { skill: 'DSA & Coding', studentLevel: 5, requiredLevel: 4 },
    { skill: 'Python', studentLevel: 5, requiredLevel: 4 },
    { skill: 'OS & Systems', studentLevel: 3, requiredLevel: 4 },
    { skill: 'SQL / DB', studentLevel: 4, requiredLevel: 3 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Apex Institute of Technology</span>
            <span>•</span>
            <span>Placement Session 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Aarav'}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Your personalized path to <strong className="text-white">Google Cloud</strong> (Software Development Engineer I) is active. Your readiness score is currently at <strong className="text-teal-300">{readiness?.overall_readiness_score || 88.5}%</strong>.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/student/assessments"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/30"
            >
              <span>Take Diagnostic Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/student/quizzes"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>AI Practice Quiz</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Placement Readiness"
          value={`${readiness?.overall_readiness_score || 88.5}%`}
          subtitle="Targeting Google Cloud SDE I"
          icon={TrendingUp}
          trend="+5.5% this month"
          trendPositive={true}
          colorScheme="teal"
        />
        <MetricCard
          title="Academic CGPA"
          value={profile?.cgpa ? profile.cgpa.toFixed(2) : '8.75'}
          subtitle="Eligibility: Min 8.0 Required"
          icon={Award}
          trend="Eligible"
          trendPositive={true}
          colorScheme="blue"
        />
        <MetricCard
          title="Assessments Completed"
          value={attempts.length || 2}
          subtitle="Diagnostic & Coding tests"
          icon={CheckCircle2}
          trend="100% Pass Rate"
          trendPositive={true}
          colorScheme="indigo"
        />
        <MetricCard
          title="Identified Skill Gaps"
          value={readiness?.skill_gaps.length || 1}
          subtitle="Operating Systems (1 gap)"
          icon={AlertTriangle}
          trend="Action Needed"
          trendPositive={false}
          colorScheme="amber"
        />
      </div>

      {/* Main Grid: Target Company & Skill Gap Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Company Status Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                  <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Target Company</h3>
                  <p className="text-xs text-slate-500">Google Cloud India</p>
                </div>
              </div>
              <ReadinessBadge status={readiness?.status || 'meets_criteria'} />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Software Development Engineer I</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">CTC Package:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹ 32,00,000 CTC</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Min CGPA Required:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">8.0 (Your CGPA: 8.75 ✓)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Eligible Branch:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Computer Science ✓</span>
              </div>
            </div>

            {/* Identified gap alert */}
            {readiness?.skill_gaps && readiness.skill_gaps.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                <div className="font-bold flex items-center mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Primary Action Needed
                </div>
                <p className="text-[11px] leading-relaxed">
                  {readiness.skill_gaps[0].recommendation}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleRecalculate}
              disabled={refreshing}
              className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1.5 font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Recalculate Readiness</span>
            </button>
            <Link
              to="/student/skill-gap"
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center"
            >
              <span>Full Gap Analysis</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Skill Proficiency Comparison Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Demonstrated vs Target Skill Level</h3>
              <p className="text-xs text-slate-500">Benchmark against Google SDE I Hiring Bar (Level 1–5)</p>
            </div>
            <Link to="/student/skill-gap" className="text-xs text-blue-600 font-semibold hover:underline">
              View Matrix
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="studentLevel" name="Your Demonstrated Level" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="requiredLevel" name="Required Hiring Level" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Attempts & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Attempts History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Assessment Attempts</h3>
            <Link to="/student/history" className="text-xs text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {attempts.slice(0, 3).map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {att.assessment_title || 'Diagnostic Assessment'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Completed • Score: <strong className="text-blue-600 dark:text-blue-400">{att.score} pts ({att.percentage}%)</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    PASSED
                  </span>
                  <Link
                    to={`/student/result/${att.id}`}
                    className="p-1 rounded text-slate-400 hover:text-blue-600"
                    title="Review Explanations"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized AI Preparation Plan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personalized Recommendations</h3>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
              AI Tailored
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {readiness?.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
