import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Company, CompanyRequirement } from '../../types';
import { Building2, Plus, DollarSign, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export const CompanyDrivesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [requirements, setRequirements] = useState<CompanyRequirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form state
  const [name, setName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Software & Cloud');
  const [tier, setTier] = useState<'tier_1' | 'tier_2' | 'dream' | 'super_dream'>('dream');
  const [role, setRole] = useState<string>('Software Engineer');
  const [ctc, setCtc] = useState<string>('₹ 20,00,000 CTC');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);

  const fetchDrives = async () => {
    try {
      const [cData, rData] = await Promise.all([
        api.getCompanies(),
        api.getAllRequirements(),
      ]);
      setCompanies(cData);
      setRequirements(rData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const comp = await api.createCompany({
        name,
        industry,
        tier,
      });

      await api.createCompanyRequirement(comp.id, {
        job_role: role,
        salary_package: ctc,
        min_cgpa: Number(minCgpa),
        eligible_departments: ['Computer Science & Engineering', 'Information Science'],
      });

      setShowModal(false);
      fetchDrives();
    } catch (err: any) {
      alert(`Error creating drive: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Company Recruitment Drives & Criteria
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Define corporate eligibility parameters, hiring rounds, and technical skill bars.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company Drive</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((comp) => {
            const req = requirements.find((r) => r.company_id === comp.id);
            return (
              <div
                key={comp.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={comp.logo_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${comp.name}`}
                      alt={comp.name}
                      className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 p-1.5 object-contain border border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{comp.name}</h3>
                      <p className="text-xs text-slate-400">{comp.industry || 'Information Technology'}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {comp.tier.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Configured Role:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{req?.job_role || 'Software Engineer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Offered Package:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{req?.salary_package || 'Competitive'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min CGPA Required:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{req?.min_cgpa || 7.0}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    {req?.required_skills?.length || 2} Core Competencies Set
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active in Placement Drive
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Configure Corporate Hiring Drive
            </h3>

            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tier</label>
                  <select
                    value={tier}
                    onChange={(e: any) => setTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="super_dream">Super Dream</option>
                    <option value="dream">Dream</option>
                    <option value="tier_1">Tier 1</option>
                    <option value="tier_2">Tier 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Job Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Cloud Solutions Architect"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">CTC Package</label>
                  <input
                    type="text"
                    required
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    placeholder="₹ 28,00,000 CTC"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
