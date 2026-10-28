import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Company, SkillGapAnalysis } from '../../types';
import { ReadinessBadge } from '../../components/common/Badge';
import {
  Target,
  Building,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const studentId = user?.id || 'b0000000-0000-0000-0000-000000000004';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const comps = await api.getCompanies();
        setCompanies(comps);
        if (comps.length > 0) {
          setSelectedCompanyId(comps[0].id);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!selectedCompanyId) return;
      try {
        const res = await api.getSkillGap(studentId, selectedCompanyId);
        setAnalysis(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalysis();
  }, [selectedCompanyId, studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Skill-Gap & Recruitment Matching Intelligence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Deterministic alignment of your verified capabilities against specific recruiting company criteria.
        </p>
      </div>

      {/* Company Selection Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Target Recruiting Company:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {companies.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedCompanyId(comp.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCompanyId === comp.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {comp.name}
            </button>
          ))}
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Target Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {analysis.company_name} — {analysis.job_role}
                </h2>
                <ReadinessBadge status={analysis.readiness_status} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Benchmark evaluation based on institutional criteria: CGPA requirements, eligible departments, and mandatory skill thresholds.
              </p>

              {/* Eligibility Checkpoints */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>CGPA: {analysis.eligibility.student_cgpa} (Min: {analysis.eligibility.min_cgpa_required})</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Branch: {analysis.eligibility.student_department}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>0 Standing Backlogs</span>
                </div>
              </div>
            </div>

            {/* Overall Match Circle / Stat */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Placement Match Score
              </span>
              <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {analysis.overall_match_percentage}%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 font-medium">
                {analysis.readiness_status === 'meets_criteria'
                  ? 'Eligible for Direct Shortlisting'
                  : 'Bridge Skill Gaps to Qualify'}
              </span>
            </div>
          </div>

          {/* Detailed Skills Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Competency Matrix & Identified Gaps
            </h3>

            <div className="space-y-4">
              {analysis.skills_breakdown.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {sk.skill_name}
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Required Level: <strong className="text-slate-700 dark:text-slate-300">Level {sk.required_level}/5</strong> • Your Level: <strong className="text-blue-600 dark:text-blue-400">Level {sk.current_level}/5</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {sk.gap === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Criterion Satisfied
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          {sk.gap}-Point Gap
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar Representation */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${(sk.current_level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {sk.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
