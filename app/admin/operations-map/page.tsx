'use client';
import { useEffect } from 'react';
import CommandCentreMap from '@/components/admin/CommandCentreMap';
import GovernmentSystemStatusOverlay from '@/components/admin/GovernmentSystemStatusOverlay';
import OperationsFeed from '@/components/admin/OperationsFeed';
import FilterArchitecture from '@/components/admin/filters/FilterArchitecture';
import { commandCentreGateway } from '@/services/gateway/commandCentreGateway';
import { Network } from 'lucide-react';

export default function GovernmentOperationsMap() {
  useEffect(() => {
    commandCentreGateway.connect();

    return () => {
      commandCentreGateway.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
      <CommandCentreMap />
      
      <FilterArchitecture />
      <OperationsFeed />
      <GovernmentSystemStatusOverlay />
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-md p-4 rounded-xl shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Network className="text-emerald-500" size={24} />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-widest uppercase text-zinc-100">National Command & Control Centre</h1>
              <p className="text-xs text-zinc-400">Integrated Operational Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
