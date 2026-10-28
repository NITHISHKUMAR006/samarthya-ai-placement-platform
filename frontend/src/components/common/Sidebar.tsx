import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CheckCircle,
  History,
  Target,
  Sparkles,
  MessageSquare,
  BookOpen,
  User,
  Users,
  Building2,
  FileQuestion,
  UploadCloud,
  ShieldCheck,
  Building,
  CreditCard,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const studentLinks = [
    { to: '/student', label: 'Overview', icon: LayoutDashboard },
    { to: '/student/assessments', label: 'Assessment Center', icon: CheckCircle },
    { to: '/student/history', label: 'Attempt History', icon: History },
    { to: '/student/skill-gap', label: 'Skill-Gap Intelligence', icon: Target },
    { to: '/student/quizzes', label: 'AI Practice Quizzes', icon: Sparkles },
    { to: '/student/mock-interview', label: 'Mock Interview Prep', icon: MessageSquare },
    { to: '/student/learning', label: 'Learning Library', icon: BookOpen },
    { to: '/student/profile', label: 'Student Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Institutional Overview', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Student Directory', icon: Users },
    { to: '/admin/companies', label: 'Company Recruitment', icon: Building2 },
    { to: '/admin/assessments', label: 'Manage Assessments', icon: FileQuestion },
    { to: '/admin/materials', label: 'Study Docs & Upload', icon: UploadCloud },
  ];

  const superAdminLinks = [
    { to: '/super-admin', label: 'Platform & Health', icon: ShieldCheck },
    { to: '/super-admin/institutions', label: 'Institutions', icon: Building },
    { to: '/super-admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  ];

  let links = studentLinks;
  if (role === 'institution_admin' || role === 'faculty') {
    links = adminLinks;
  } else if (role === 'super_admin') {
    links = superAdminLinks;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Header on mobile */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
            <button onClick={onClose} className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/student' || link.to === '/admin' || link.to === '/super-admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Institutional Info Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-xs">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-[11px]">System Online (Port 5190)</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 truncate">
            Apex Institute of Technology
          </p>
        </div>
      </aside>
    </>
  );
};
