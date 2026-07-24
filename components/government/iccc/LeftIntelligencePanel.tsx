'use client';
import { useState, useMemo } from 'react';
import { useMergedIncidents } from '@/store/selectors/mergedSelectors';

export default function LeftIntelligencePanel() {
  const [activeTab, setActiveTab] = useState<'kpi'|'mission'|'matrix'>('kpi');
  const incidents = useMergedIncidents();

  const familyStats = useMemo(() => {
    const familyOps = incidents.filter(i => (i as any).type === 'FamilySeparation');
    const active = familyOps.filter(i => i.status !== 'resolved').length;
    const resolved = familyOps.filter(i => i.status === 'resolved').length;
    return { active, resolved };
  }, [incidents]);

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Intelligence Panel</h2>
        <button className="text-slate-500 hover:text-white" title="Pin Panel">📌</button>
      </div>

      <div className="flex border-b border-slate-800">
        <button onClick={() => setActiveTab('kpi')} className={`flex-1 py-2 text-xs font-semibold ${activeTab==='kpi'?'text-blue-400 border-b-2 border-blue-500':'text-slate-500 hover:text-slate-300'}`}>KPIs</button>
        <button onClick={() => setActiveTab('mission')} className={`flex-1 py-2 text-xs font-semibold ${activeTab==='mission'?'text-blue-400 border-b-2 border-blue-500':'text-slate-500 hover:text-slate-300'}`}>Missions</button>
        <button onClick={() => setActiveTab('matrix')} className={`flex-1 py-2 text-xs font-semibold ${activeTab==='matrix'?'text-blue-400 border-b-2 border-blue-500':'text-slate-500 hover:text-slate-300'}`}>Matrix</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'kpi' && (
          <>
            <div className="bg-slate-800 rounded border border-slate-700 p-3">
              <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Executive Summary</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Festival operating normally. Crowd increasing at Ramkund. Parking Zone P3 nearing capacity. Weather stable. Three incidents under resolution.</p>
            </div>

            {/* Family Operations Summary */}
            <div className="bg-slate-800 rounded border border-purple-900/50 p-3">
              <h3 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1 cursor-pointer hover:text-purple-300">
                <span>👨‍👩‍👧‍👦</span> Family Operations Summary
              </h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Active Families</span>
                  <span className="text-white font-mono">14,205</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Separations</span>
                  <span className="text-red-400 font-bold font-mono">{familyStats.active}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">SOS Alerts</span>
                  <span className="text-red-400 font-mono">0</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Reunifications</span>
                  <span className="text-green-400 font-mono">{familyStats.resolved}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Live Crowd Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">Ramkund Ghat</span>
                  <span className="text-xs font-mono text-orange-400">85% Cap</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                  <div className="bg-orange-500 h-full w-[85%]"></div>
                </div>
              </div>
            </div>

            {/* Zone Health Cards Placeholder */}
            <div>
              <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex justify-between items-center">
                <span>Zone Health</span>
                <span className="text-[9px] text-slate-500 bg-slate-800 px-1 rounded cursor-pointer">+ Watch List</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800 border border-green-900 rounded p-2 text-center">
                  <span className="text-xs font-semibold text-green-400 block">Z-North</span>
                  <span className="text-[10px] text-slate-400">Stable</span>
                </div>
                <div className="bg-slate-800 border border-orange-900 rounded p-2 text-center">
                  <span className="text-xs font-semibold text-orange-400 block">Z-South</span>
                  <span className="text-[10px] text-slate-400">Warning</span>
                </div>
              </div>
            </div>

            {/* Operational Bookmarks Placeholder */}
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs py-1.5 rounded border border-slate-700 transition-colors">
                🔖 Bookmarks
              </button>
            </div>
          </>
        )}
        
        {activeTab === 'mission' && (
          <div>
            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Active Missions</h3>
            <div className="bg-slate-800 border border-slate-700 p-3 rounded">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-white">Crowd Diversion Alpha</span>
                <span className="text-[10px] bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">Police</span>
              </div>
              <div className="w-full bg-slate-700 h-1 rounded overflow-hidden mb-1">
                <div className="bg-blue-500 h-full w-[40%]"></div>
              </div>
              <span className="text-[10px] text-slate-400">40% Complete • Est. 14:00</span>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div>
            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Department Status Matrix</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs p-2 bg-slate-800 rounded border border-slate-700">
                <span className="text-slate-300">Police Command</span>
                <span className="text-green-400 font-mono">Normal</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-slate-800 rounded border border-slate-700">
                <span className="text-slate-300">Health Command</span>
                <span className="text-orange-400 font-mono">High Load</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
