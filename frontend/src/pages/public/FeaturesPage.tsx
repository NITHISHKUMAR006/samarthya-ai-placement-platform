import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  ShieldCheck,
  Target,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
  Building2,
  Users,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Deterministic Skill-Gap Analysis',
      desc: 'Compares students against real hiring criteria (Google, Microsoft, Deloitte) without guesswork. Provides actionable steps to bridge each point gap.',
    },
    {
      icon: FileText,
      title: 'AI Document Extraction (PDF, PPT, PPTX)',
      desc: 'Extract and chunk lecture notes, technical textbooks, and course slides into indexed vector embeddings for instant practice quiz generation.',
    },
    {
      icon: Clock,
      title: 'Standardized Assessment Center',
      desc: 'Time-bounded assessments covering quantitative aptitude, data structures, systems architecture, and business communication with server-side auto-grading.',
    },
    {
      icon: ShieldCheck,
      title: 'Supabase Multi-Tenant Isolation',
      desc: 'Colleges operate in isolated workspaces powered by PostgreSQL Row Level Security (RLS) to safeguard student educational data.',
    },
    {
      icon: Sparkles,
      title: 'Configurable OpenAI-Compatible LLMs',
      desc: 'Integrates with OpenAI, OpenRouter, Groq, or local Ollama and LM Studio inference engines via centralized environment configuration.',
    },
    {
      icon: BarChart3,
      title: 'Institutional Placement Analytics',
      desc: 'Empowers placement officers with cohort distribution charts, student support lists, and one-click CSV report exports.',
    },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          Platform Capabilities & Features
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Every component of SAMARTHYA AI is purpose-built to accelerate student placement readiness and institutional placement outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6">
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20"
        >
          Explore SAMARTHYA AI in Live Session
        </Link>
      </div>
    </div>
  );
};
