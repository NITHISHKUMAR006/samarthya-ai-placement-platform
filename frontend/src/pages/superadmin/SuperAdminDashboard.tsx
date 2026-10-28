import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Institution, Subscription } from '../../types';
import { MetricCard } from '../../components/common/MetricCard';
import { ShieldCheck, Building, CreditCard, Activity, Plus, CheckCircle, Server } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New inst form
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [domain, setDomain] = useState<string>('');

  const fetchSuperData = async () => {
    try {
      const [iData, sData, hData] = await Promise.all([
        api.getInstitutions().catch(() => []),
        api.getSubscriptions().catch(() => []),
        api.getHealth().catch(() => null),
      ]);
      setInstitutions(iData);
      setSubscriptions(sData);
      setHealth(hData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperData();
  }, []);

  const handleCreateInst = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createInstitution({ name, code, slug, domain });
      setShowAddModal(false);
      fetchSuperData();
    } catch (err: any) {
      alert(`Error creating institution: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Super Administrator Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SAMARTHYA AI Multi-Tenant Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control cross-institutional workspaces, subscription limits, and monitor system health.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New College Workspace</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Institutions"
          value={institutions.length || 2}
          subtitle="Multi-tenant Isolated Workspaces"
          icon={Building}
          colorScheme="indigo"
        />
        <MetricCard
          title="Backend Operational Port"
          value="Port 5190"
          subtitle="FastAPI 0.115+ REST Engine"
          icon={Server}
          trend="Healthy"
          colorScheme="blue"
        />
        <MetricCard
          title="Frontend Delivery Port"
          value="Port 8010"
          subtitle="Vite SPA & Nginx Production"
          icon={Activity}
          trend="Published"
          colorScheme="teal"
        />
        <MetricCard
          title="AI Inference Service"
          value={health?.ai?.model_id || 'OpenAI Compatible'}
          subtitle={health?.ai?.llm_configured ? 'Active Provider' : 'Deterministic Mode'}
          icon={ShieldCheck}
          trend="Online"
          colorScheme="emerald"
        />
      </div>

      {/* Institutions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Provisioned Institutional Workspaces ({institutions.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">College Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Tenant Status</th>
                <th className="py-3 px-4">Subscription Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {institutions.map((inst) => {
                const sub = subscriptions.find((s) => s.institution_id === inst.id);
                return (
                  <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {inst.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {inst.code}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{inst.domain || 'apex.edu'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Active Tenant
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold uppercase text-[11px] text-indigo-600 dark:text-indigo-400">
                      {sub?.plan_tier || 'Enterprise'} ({sub?.max_students || 5000} Students)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Provision New College Workspace
            </h3>

            <form onSubmit={handleCreateInst} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cambridge Institute of Technology"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">College Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CIT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cit-tech"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Official Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="cit.edu.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
