import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Institutional Workspace Setup',
      desc: 'Placement officers configure company recruitment requirements, eligible branches, and required skill bars for upcoming hiring drives.',
    },
    {
      step: '02',
      title: 'Curriculum & Slide Ingestion',
      desc: 'Faculty upload study notes and slides (PDF/PPT/PPTX). Documents are automatically parsed, chunked, and stored in Supabase with vector embeddings.',
    },
    {
      step: '03',
      title: 'Diagnostic Student Evaluation',
      desc: 'Students complete standardized assessments in aptitude, coding, core CS, and communication with real-time countdown timers and server-side verification.',
    },
    {
      step: '04',
      title: 'Automated Skill-Gap Analysis',
      desc: 'The engine compares demonstrated abilities against target recruiting company criteria, pinpointing precise competency gaps.',
    },
    {
      step: '05',
      title: 'Personalized AI Placement Readiness',
      desc: 'Students practice AI-synthesized quizzes and company mock interviews to systematically qualify for Tier-1 recruitment.',
    },
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          How SAMARTHYA AI Works
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          A seamless 5-stage workflow connecting college administration, faculty curriculum, and student placement success.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((st) => (
          <div
            key={st.step}
            className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20 flex-shrink-0">
              {st.step}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{st.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
