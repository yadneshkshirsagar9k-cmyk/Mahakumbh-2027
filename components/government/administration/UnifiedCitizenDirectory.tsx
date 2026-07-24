'use client';
import { useCitizenCaseStore } from '@/store/government/administration/citizenCaseStore';

export default function UnifiedCitizenDirectory() {
  const cases = useCitizenCaseStore(state => state.cases);

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Citizen Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Unified Administrative Search & Case Management</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search by ID, Name, Phone..." 
            className="bg-slate-900 border border-slate-700 text-sm text-white px-4 py-2 rounded w-64 outline-none focus:border-blue-500 shadow-inner"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-semibold shadow shadow-blue-900/20">
            Advanced Search
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-800 flex-1 overflow-hidden flex flex-col shadow-xl">
        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="pb-3 font-semibold px-2">Case ID</th>
                <th className="pb-3 font-semibold">Citizen Name</th>
                <th className="pb-3 font-semibold">Mobile</th>
                <th className="pb-3 font-semibold">Flags</th>
                <th className="pb-3 font-semibold">Service Health</th>
                <th className="pb-3 font-semibold text-right px-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300">
              {cases.map(c => (
                <tr key={c.caseId} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 font-mono text-xs px-2">{c.caseId}</td>
                  <td className="py-4 font-medium text-white">{c.name}</td>
                  <td className="py-4 font-mono text-xs">{c.mobileNumber}</td>
                  <td className="py-4">
                    <div className="flex gap-1 flex-wrap">
                      {c.adminFlags.map(f => (
                        <span key={f} className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          f === 'Priority' || f === 'VIP' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' :
                          f === 'NeedsReview' ? 'bg-orange-900/30 text-orange-400 border border-orange-800/50' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1.5">
                      <span title="Journey" className={`w-2 h-2 rounded-full ${c.serviceHealth.journey === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span title="Bookings" className={`w-2 h-2 rounded-full ${c.serviceHealth.bookings === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span title="Vehicles" className={`w-2 h-2 rounded-full ${c.serviceHealth.vehicles === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span title="Documents" className={`w-2 h-2 rounded-full ${c.serviceHealth.documents === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span title="Verification" className={`w-2 h-2 rounded-full ${c.serviceHealth.verification === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                  </td>
                  <td className="py-4 text-right px-2">
                    <button className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold bg-blue-900/20 hover:bg-blue-900/40 px-3 py-1.5 rounded border border-blue-900/50 transition-colors">
                      View Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
