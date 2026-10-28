import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Role } from '../../types';
import {
  Sun,
  Moon,
  GraduationCap,
  Bell,
  Menu,
  X,
  UserCheck,
  Building,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = async (newRole: Role) => {
    setRoleMenuOpen(false);
    await switchDemoRole(newRole);
    if (newRole === 'super_admin') {
      navigate('/super-admin');
    } else if (newRole === 'institution_admin' || newRole === 'faculty') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent">
                SAMARTHYA AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                SDG 4 & 8
              </span>
            </div>
          </Link>

          {/* Active Workspace Tag */}
          <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Building className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
            <span>Apex Institute of Technology</span>
          </div>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Role Switcher for seamless testing */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Switch demo user role for evaluation"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="capitalize">{role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                  Switch Active Role
                </div>
                <button
                  onClick={() => handleRoleSwitch('student')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700/60 ${
                    role === 'student' ? 'text-blue-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Student (Aarav Sharma)</span>
                  {role === 'student' && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <button
                  onClick={() => handleRoleSwitch('institution_admin')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700/60 ${
                    role === 'institution_admin' ? 'text-blue-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Placement Officer (Sunita Rao)</span>
                  {role === 'institution_admin' && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <button
                  onClick={() => handleRoleSwitch('faculty')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700/60 ${
                    role === 'faculty' ? 'text-blue-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Faculty (Dr. Rajesh Khanna)</span>
                  {role === 'faculty' && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <button
                  onClick={() => handleRoleSwitch('super_admin')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700/60 ${
                    role === 'super_admin' ? 'text-blue-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Super Admin (Dr. Alok Verma)</span>
                  {role === 'super_admin' && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle light and dark theme"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                alt={user.full_name}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{user.full_name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
