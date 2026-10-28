import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StudentProfile, SkillItem } from '../../types';
import { User, Award, BookOpen, FileText, CheckCircle2, Building, Mail, Phone } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const studentId = user?.id || 'b0000000-0000-0000-0000-000000000004';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [pData, sData] = await Promise.all([
          api.getStudent(studentId).catch(() => null),
          api.getStudentSkills(studentId).catch(() => []),
        ]);
        if (pData) setProfile(pData);
        setSkills(sData);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <img
          src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || 'Aarav'}`}
          alt={user?.full_name || 'Student'}
          className="w-24 h-24 rounded-2xl border-2 border-blue-600 shadow-md object-cover"
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {profile?.full_name || user?.full_name || 'Aarav Sharma'}
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                Roll No: <span className="text-blue-600 dark:text-blue-400 font-mono">{profile?.roll_number || 'AIT2023CS042'}</span> • Batch {profile?.batch_year || 2026}
              </p>
            </div>
            <span className="inline-flex self-center sm:self-start items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Verified Student
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Apex Institute of Technology
            </span>
            <span className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {profile?.email || user?.email || 'student.aarav@apex.edu'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
            "{profile?.career_aspirations || 'Full-Stack Software Engineer & AI System Architect'}"
          </p>
        </div>
      </div>

      {/* Academic Credentials Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
          <Award className="w-4 h-4 mr-2 text-blue-600" />
          Academic Information & Placement Thresholds
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current CGPA</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
              {profile?.cgpa ? profile.cgpa.toFixed(2) : '8.75'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Tier-1 Eligible</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Semester</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1 block">
              {profile?.current_semester || 7}th
            </span>
            <span className="text-[10px] text-slate-500 font-medium">B.Tech CSE</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">12th Grade %</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1 block">
              {profile?.twelfth_percentage || 91.5}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">CBSE Board</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">10th Grade %</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1 block">
              {profile?.tenth_percentage || 94.0}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">CBSE Board</span>
          </div>
        </div>
      </div>

      {/* Verified Skills Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600" />
          Verified Competencies & Demonstrated Proficiencies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((sk) => (
            <div
              key={sk.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{sk.name}</span>
                <span className="text-[10px] text-slate-400 capitalize block mt-0.5">{sk.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-2 h-4 rounded-sm ${
                      lvl <= sk.proficiency_level
                        ? 'bg-blue-600'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
                <span className="text-[10px] font-bold text-slate-500 ml-1.5">L{sk.proficiency_level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
