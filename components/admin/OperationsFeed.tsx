'use client';
import { useIncidentStore } from '@/store/command-centre/incidentStore';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function OperationsFeed() {
  const incidents = useIncidentStore(state => state.incidents);

  // Sorting newest first
  const sortedIncidents = [...incidents].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="absolute left-4 top-48 bottom-4 w-80 bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-md text-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
        <h3 className="font-semibold text-sm tracking-widest uppercase text-zinc-400 flex items-center gap-2">
          <AlertCircle size={16} />
          Operations Feed
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {sortedIncidents.length === 0 ? (
          <div className="text-zinc-500 text-sm text-center py-10">No active incidents</div>
        ) : (
          sortedIncidents.map(incident => (
            <div key={incident.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-sm flex gap-3 items-start relative overflow-hidden">
              <div className={`w-1 absolute left-0 top-0 bottom-0 ${
                incident.severity === 'critical' ? 'bg-red-500' : 
                incident.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
              }`} />
              <div className="mt-0.5">
                {incident.severity === 'critical' ? <ShieldAlert size={16} className="text-red-500" /> :
                 incident.severity === 'high' ? <AlertTriangle size={16} className="text-orange-500" /> :
                 <Info size={16} className="text-yellow-500" />}
              </div>
              <div className="flex-1">
                <div className="font-medium flex justify-between items-center">
                  <span className="uppercase text-xs tracking-wider">{incident.type}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div className="text-zinc-400 text-xs mt-1">
                  Incident reported at [{incident.coordinates[0].toFixed(4)}, {incident.coordinates[1].toFixed(4)}].
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
