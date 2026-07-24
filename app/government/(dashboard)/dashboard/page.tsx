'use client';
import { useGovernmentAuthStore } from '@/store/government/governmentAuthStore';

export default function GovernmentDashboard() {
  const profile = useGovernmentAuthStore(state => state.profile);

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">EXECUTIVE OVERVIEW</h1>
        <p className="text-slate-500 text-sm mt-1">Common Operational Picture - {profile?.department || 'Government'} Workspace</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Active Incidents</h3>
          <p className="text-3xl text-white font-light">12</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Deployed Resources</h3>
          <p className="text-3xl text-white font-light">348</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Critical Zones</h3>
          <p className="text-3xl text-red-400 font-light">2</p>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500">Dashboard visualisations and KPIs will be dynamically populated here.</p>
      </div>
    </div>
  );
}
