import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const ReadinessBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'meets_criteria':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Meets Placement Criteria
        </span>
      );
    case 'preparation_in_progress':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full"></span>
          Preparation in Progress
        </span>
      );
    case 'skills_requiring_improvement':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full"></span>
          Skills Need Improvement
        </span>
      );
    case 'insufficient_information':
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 bg-slate-400 rounded-full"></span>
          Diagnostic Required
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const map: Record<string, { label: string; color: string }> = {
    aptitude: { label: 'Aptitude', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
    programming: { label: 'Coding / DSA', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    technical: { label: 'Technical Core', color: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
    communication: { label: 'Communication', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    mock_company: { label: 'Mock Company', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  };

  const item = map[category.toLowerCase()] || { label: category, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${item.color}`}>
      {item.label}
    </span>
  );
};
