'use client';
import { operationalEventBus } from '@/services/event-bus/OperationalEventBus';
import { useICCCStore } from '@/store/government/icccStore';

export default function RightDecisionSupportPanel() {
  const mode = useICCCStore(state => state.operationalMode);

  const handleExecute = () => {
    operationalEventBus.publish({
      eventId: `rec-exec-${Date.now()}`,
      eventType: 'RECOMMENDATION_EXECUTED',
      timestamp: Date.now(),
      source: 'AIDecisionSupport',
      simulationFlag: mode === 'Simulation',
      payload: {
        id: 'rec-123',
        type: 'deploy_police',
        targetZone: 'Ramkund Approach'
      }
    });
  };
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Decision Support</h2>
        <button className="text-slate-500 hover:text-white" title="Pin Panel">📌</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">AI Recommendations</h3>
          
          <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2 mb-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-white">Deploy Additional Police</span>
              <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800 px-1 rounded">92% Conf</span>
            </div>
            <p className="text-[10px] text-slate-400">Crowd density at Ramkund approach exceeds warning threshold.</p>
            <div className="flex gap-2 mt-2">
              <button onClick={handleExecute} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] py-1 rounded transition-colors">Execute</button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] py-1 rounded transition-colors">Dismiss</button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Quick Launch</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded p-2 text-left transition-colors">
              <span className="block text-lg mb-1">🚨</span>
              <span className="block text-[10px] font-semibold text-slate-300">Incident Mgmt</span>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded p-2 text-left transition-colors">
              <span className="block text-lg mb-1">🚒</span>
              <span className="block text-[10px] font-semibold text-slate-300">Resource Mgmt</span>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded p-2 text-left transition-colors">
              <span className="block text-lg mb-1">📈</span>
              <span className="block text-[10px] font-semibold text-slate-300">Analytics</span>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded p-2 text-left transition-colors">
              <span className="block text-lg mb-1">🏢</span>
              <span className="block text-[10px] font-semibold text-slate-300">Workspaces</span>
            </button>
          </div>
        </div>

        {/* Context Panel Placeholder */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex justify-between">
            <span>Context Panel</span>
            <span className="text-slate-500 cursor-pointer">⚙️</span>
          </h3>
          <p className="text-[10px] text-slate-500 italic">Select an entity on the map or timeline to view detailed operational context here.</p>
        </div>
      </div>
    </div>
  );
}
