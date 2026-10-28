import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import {
  Users,
  Building2,
  FileQuestion,
  Download,
  AlertTriangle,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const institutionId = user?.institution_id || 'a0000000-0000-0000-0000-000000000001';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalyticsOverview(institutionId);
        setData(res);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [institutionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#94a3b8'];

  const categoryChartData = [
    { domain: 'Aptitude & Logic', score: data?.category_averages?.aptitude || 78.5 },
    { domain: 'DSA & Coding', score: data?.category_averages?.programming || 84.0 },
    { domain: 'Core Systems', score: data?.category_averages?.technical || 72.0 },
    { domain: 'Communication', score: data?.category_averages?.communication || 80.0 },
  ];

  const handleExportCsv = () => {
    window.open(api.getExportCsvUrl(institutionId), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <span>Apex Institute of Technology</span>
            <span>•</span>
            <span>Training & Placement Cell</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Institutional Placement Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time readiness analytics, recruiting drive benchmarks, and student competency tracking.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Cohort Report (CSV)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Eligible Students"
          value={data?.total_students || 42}
          subtitle="Registered for 2026 Drive"
          icon={Users}
          trend="Apex Campus"
          colorScheme="blue"
        />
        <MetricCard
          title="Partner Companies"
          value="4 Drives"
          subtitle="Google, Microsoft, Deloitte, Infosys"
          icon={Building2}
          trend="Active Drives"
          colorScheme="teal"
        />
        <MetricCard
          title="Average Diagnostic Score"
          value="82.4%"
          subtitle="Across Aptitude & Coding"
          icon={Award}
          trend="+4.2% YoY"
          trendPositive={true}
          colorScheme="indigo"
        />
        <MetricCard
          title="Direct Shortlist Ready"
          value="71.4%"
          subtitle="Meets Tier-1 Criteria"
          icon={TrendingUp}
          trend="High Readiness"
          colorScheme="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Proficiency Averages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cohort Average Score by Domain
              </h3>
              <p className="text-xs text-slate-500">Diagnostic performance across evaluated subjects</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" name="Average %" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Placement Readiness Distribution
              </h3>
              <p className="text-xs text-slate-500">Student qualification status against Tier-1 requirements</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.readiness_distribution || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {(data?.readiness_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Support Cohort Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
              Students Recommended for Targeted Preparatory Intervention
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified through automated skill-gap analysis before major drive cutoffs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Roll Number</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Intervention Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.students_needing_support?.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{s.full_name}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{s.roll_number}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{s.department}</td>
                  <td className="py-3 px-3 font-bold text-amber-600">{s.cgpa}</td>
                  <td className="py-3 px-3 text-slate-500">{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
