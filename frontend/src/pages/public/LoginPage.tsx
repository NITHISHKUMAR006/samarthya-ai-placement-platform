import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { GraduationCap, LogIn, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState<string>('student.aarav@apex.edu');
  const [password, setPassword] = useState<string>('Student@123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      if (email.includes('admin') || email.includes('placement')) {
        navigate('/admin');
      } else if (email.includes('superadmin')) {
        navigate('/super-admin');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      if (role === 'super_admin') navigate('/super-admin');
      else if (role === 'institution_admin' || role === 'faculty') navigate('/admin');
      else navigate('/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-8 pb-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Sign In to SAMARTHYA AI
        </h1>
        <p className="text-xs text-slate-500">
          Apex Institute of Technology Workspace Portal
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Manual Login Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In with Supabase'}</span>
          </button>
        </form>
      </div>

      {/* 1-Click Fast Demo Login Switcher */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
          Or Instant Demo Sign-In (Zero Setup)
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickLogin('student')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 text-left transition-all shadow-sm"
          >
            <span className="text-[10px] font-bold text-blue-600 uppercase block">Student</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Aarav Sharma</span>
            <span className="text-[10px] text-slate-400">Targeting Google SDE</span>
          </button>

          <button
            onClick={() => handleQuickLogin('institution_admin')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 text-left transition-all shadow-sm"
          >
            <span className="text-[10px] font-bold text-teal-600 uppercase block">Placement Officer</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Prof. Sunita Rao</span>
            <span className="text-[10px] text-slate-400">Apex Placement Cell</span>
          </button>

          <button
            onClick={() => handleQuickLogin('faculty')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 text-left transition-all shadow-sm"
          >
            <span className="text-[10px] font-bold text-indigo-600 uppercase block">Faculty</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Dr. Rajesh Khanna</span>
            <span className="text-[10px] text-slate-400">CSE Department</span>
          </button>

          <button
            onClick={() => handleQuickLogin('super_admin')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500 text-left transition-all shadow-sm"
          >
            <span className="text-[10px] font-bold text-purple-600 uppercase block">Super Admin</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Dr. Alok Verma</span>
            <span className="text-[10px] text-slate-400">Platform Health</span>
          </button>
        </div>
      </div>
    </div>
  );
};
