import React, { useState } from 'react';
import { api } from '../../services/api';
import { MessageSquare, Sparkles, Building, UserCheck, Shield, RefreshCw } from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('Google Cloud');
  const [jobRole, setJobRole] = useState<string>('Software Development Engineer I');
  const [focusArea, setFocusArea] = useState<string>('System Architecture & Coding');
  const [generating, setGenerating] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const data = await api.getMockInterviewQuestions({
        company_name: companyName,
        job_role: jobRole,
        focus_area: focusArea,
      });
      setQuestions(data.questions || []);
    } catch (err: any) {
      alert(`Interview Generator Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Placement Round Simulation</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Company-Specific Mock Interview Intelligence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Prepare for targeted technical and behavioral rounds configured for premier hiring partners.
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Company
              </label>
              <select
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Google Cloud">Google Cloud</option>
                <option value="Microsoft India">Microsoft India</option>
                <option value="Deloitte USI">Deloitte USI</option>
                <option value="Infosys Ltd">Infosys Ltd</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Job Role
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Focus Area
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="System Architecture & Coding">System Architecture & Coding</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Behavioral & Leadership (STAR)">Behavioral & Leadership (STAR)</option>
                <option value="Comprehensive Mock Panel">Comprehensive Mock Panel</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Interview Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Interview Questions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Mock Interview Prompts for {companyName}
            </h2>
            <span className="text-xs text-slate-400">{questions.length} Round Scenarios</span>
          </div>

          {questions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                  {item.round || `Round ${idx + 1}`}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Scenario {idx + 1}</span>
              </div>

              <div className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                "{item.question}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center">
                    <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    What the Interviewer Evaluates:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.what_interviewer_looks_for}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60 space-y-1">
                  <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                    Recommended Candidate Strategy:
                  </span>
                  <p className="text-teal-800 dark:text-teal-300 leading-relaxed">
                    {item.recommended_approach}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
