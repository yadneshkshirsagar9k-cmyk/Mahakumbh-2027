'use client';
import { useMemo } from 'react';
import { useIncidentStore } from '@/store/government/operations/incidentStore';
import { Users, Target, ShieldAlert } from 'lucide-react';

export default function IncidentManager({ deptId }: { deptId: string }) {
  const allIncidents = useIncidentStore(state => state.incidents);
  
  const incidents = useMemo(() => 
    allIncidents.filter(i => i.departmentId === deptId),
  [allIncidents, deptId]);
  
  const familyIncidents = useMemo(() => 
    allIncidents.filter(i => i.type === 'FamilySeparation' && i.status !== 'Closed' && i.status !== 'Reunified'),
  [allIncidents]);

  const showFamilyWidget = deptId === 'police' || deptId === 'health' || deptId === 'volunteer';

  return (
    <div className="flex h-full bg-slate-900">
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Incident Queue</h2>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold">
              + Report Incident
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-semibold">
              Escalation Matrix
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase tracking-widest">
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">SLA Target</th>
                <th className="pb-3 font-semibold">AI Score</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300">
              {incidents.map(inc => (
                <tr key={inc.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 font-mono text-xs">{inc.id}</td>
                  <td className="py-3">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                      inc.priority === 'Critical' ? 'bg-red-900/50 text-red-400' :
                      inc.priority === 'High' ? 'bg-orange-900/50 text-orange-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.priority}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-white">{inc.title}</td>
                  <td className="py-3">
                    <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-900/50">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-slate-400" suppressHydrationWarning>
                    {new Date(inc.reportedAt + inc.slaTargetMs).toLocaleTimeString()}
                  </td>
                  <td className="py-3">
                    <span className="text-green-400 font-mono text-xs">{inc.aiPriorityScore}%</span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
                    <button className="text-xs text-slate-400 hover:text-white">Assign</button>
                  </td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No active incidents in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFamilyWidget && (
        <div className="w-80 flex flex-col bg-slate-900/50 shrink-0">
          <div className="p-4 border-b border-slate-800 bg-purple-900/20">
            <h3 className="text-[10px] text-purple-400 font-black uppercase tracking-widest flex items-center gap-2">
              <Users size={12}/> Family Ops Command
            </h3>
            <p className="text-xs text-purple-300 mt-1 font-semibold">{familyIncidents.length} active separations</p>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {familyIncidents.map(inc => (
              <div key={inc.id} className="bg-slate-800 border border-slate-700 rounded p-3 hover:border-purple-500/50 transition-colors cursor-pointer shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-purple-400">{inc.id}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">{inc.status}</span>
                </div>
                <p className="text-xs font-bold text-slate-200 mt-2">{inc.title}</p>
                <div className="flex items-center justify-between mt-3 border-t border-slate-700/50 pt-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Target size={12}/> AI Priority: {inc.aiPriorityScore}%</span>
                  <button className="text-[9px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition-colors uppercase font-bold tracking-widest">Deploy</button>
                </div>
              </div>
            ))}
            {familyIncidents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <ShieldAlert size={24} className="mb-2 opacity-50" />
                <span className="text-xs font-bold">No active family separations</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
