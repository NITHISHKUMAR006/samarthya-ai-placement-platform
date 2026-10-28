import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Target,
  Building,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Brain,
  Code,
  Users,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role: Role) => {
    await switchDemoRole(role);
    if (role === 'super_admin') navigate('/super-admin');
    else if (role === 'institution_admin' || role === 'faculty') navigate('/admin');
    else navigate('/student');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* SDG Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Supporting UN SDG 4: Quality Education & SDG 8: Decent Work</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Every College Is Different.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Every Student Deserves a Personalized Path.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>SAMARTHYA AI</strong> is an enterprise adaptive learning and placement readiness platform designed for colleges, universities, students, faculty, and placement officers. Unify institutional recruitment drives, standardized diagnostics, and AI-powered curriculum learning.
          </p>

          {/* Quick 1-Click Role Demonstrator Bar */}
          <div className="pt-4 max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Click Instant Evaluation — Experience Any Platform Role:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleQuickDemo('student')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Student</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">Aarav Sharma</div>
                <div className="text-[10px] text-slate-400">Targeting Google SDE</div>
              </button>

              <button
                onClick={() => handleQuickDemo('institution_admin')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-600 uppercase">Placement Officer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">Prof. Sunita Rao</div>
                <div className="text-[10px] text-slate-400">Apex Placement Cell</div>
              </button>

              <button
                onClick={() => handleQuickDemo('faculty')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Faculty Trainer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">Dr. Rajesh Khanna</div>
                <div className="text-[10px] text-slate-400">CS & Engineering</div>
              </button>

              <button
                onClick={() => handleQuickDemo('super_admin')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Super Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">Dr. Alok Verma</div>
                <div className="text-[10px] text-slate-400">Multi-College Engine</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Built for Real Institutional Placement Workflows
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Multi-Institution Data Isolation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict multi-tenant partitioning backed by Supabase Row Level Security (RLS) ensures isolated student records, analytics, and college workspaces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Document Extraction (PDF/PPTX)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload institutional lecture notes and syllabi. Background workers chunk texts, index vector embeddings, and synthesize rigorous assessment items.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Transparent Skill-Gap Intelligence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deterministic, testable matching against configured company criteria (Google, Microsoft, Deloitte) with zero hallucinated placement guarantees.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Impact Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Ready to scale placement outcomes across your college?</h3>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Equip students with personalized preparation and give placement officers real-time visibility into hiring readiness.
            </p>
          </div>
          <button
            onClick={() => handleQuickDemo('student')}
            className="px-6 py-3 rounded-xl bg-white text-blue-900 font-extrabold text-xs hover:bg-blue-50 transition-colors shadow-lg flex-shrink-0"
          >
            Launch Student Portal
          </button>
        </div>
      </section>
    </div>
  );
};
