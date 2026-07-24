'use client';
import { useCommandCentreStore } from '@/store/command-centre/commandCentreStore';
import { Activity, Database, Server, Wifi } from 'lucide-react';

export default function GovernmentSystemStatusOverlay() {
  const status = useCommandCentreStore(state => state.systemStatus);
  const isConnected = status.websocket === 'connected';

  return (
    <div className="absolute top-4 right-4 bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[280px]">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h3 className="font-semibold text-sm tracking-widest uppercase text-zinc-400">System Health</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500"><Wifi size={14}/> Gateway</div>
          <div className={isConnected ? "text-emerald-400" : "text-red-400"}>{status.websocket.toUpperCase()}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500"><Activity size={14}/> Engine</div>
          <div className="text-emerald-400">NOMINAL</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500"><Database size={14}/> DB Sync</div>
          <div className="text-emerald-400">SYNCED</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500"><Server size={14}/> Spatial Node</div>
          <div className="text-emerald-400">ACTIVE</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
        <span>LAST UPDATE</span>
        <span>{status.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : 'N/A'}</span>
      </div>
    </div>
  );
}
