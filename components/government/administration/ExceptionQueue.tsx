'use client';
import { useVerificationStore } from '@/store/government/administration/verificationStore';

export default function ExceptionQueue() {
  const exceptions = useVerificationStore(state => state.exceptionQueue);

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider text-red-500 flex items-center gap-2">
            <span>🚨</span> Exception Management Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manual review required for identity conflicts and invalid documents</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800 px-4 py-2 rounded text-xs font-semibold transition-colors">
            Bulk Resolve (Selected)
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-800 flex-1 overflow-hidden flex flex-col shadow-xl">
        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="pb-3 font-semibold px-2 w-10">
                  <input type="checkbox" className="accent-red-500" />
                </th>
                <th className="pb-3 font-semibold">Exception ID</th>
                <th className="pb-3 font-semibold">Related Case</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right px-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300">
              {exceptions.map(ex => (
                <tr key={ex.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-2">
                    <input type="checkbox" className="accent-red-500" />
                  </td>
                  <td className="py-4 font-mono text-xs">{ex.id}</td>
                  <td className="py-4 font-mono text-xs text-blue-400 cursor-pointer hover:underline">{ex.relatedCaseId}</td>
                  <td className="py-4 font-medium text-white">{ex.type.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="py-4">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                      ex.severity === 'High' ? 'bg-red-900/50 text-red-400 border border-red-800/50' :
                      ex.severity === 'Medium' ? 'bg-orange-900/50 text-orange-400 border border-orange-800/50' :
                      'bg-yellow-900/50 text-yellow-400 border border-yellow-800/50'
                    }`}>
                      {ex.severity}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-xs text-slate-500">
                    {new Date(ex.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {ex.status}
                    </span>
                  </td>
                  <td className="py-4 text-right px-2">
                    <button className="text-[11px] text-white font-semibold bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition-colors shadow shadow-red-900/20">
                      Review Exception
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
