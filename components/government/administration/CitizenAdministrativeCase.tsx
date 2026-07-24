'use client';
import { useState } from 'react';
import { useCitizenCaseStore } from '@/store/government/administration/citizenCaseStore';

export default function CitizenAdministrativeCase({ caseId }: { caseId: string }) {
  const caseData = useCitizenCaseStore(state => state.cases.find(c => c.caseId === caseId));
  const [activeTab, setActiveTab] = useState<'overview' | 'family'>('overview');

  if (!caseData) return <div className="p-8 text-white">Case Not Found</div>;

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white tracking-wide">{caseData.name}</h1>
            {caseData.isServiceLocked && (
              <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1 shadow shadow-red-900/50">
                <span>🔒</span> Service Locked
              </span>
            )}
          </div>
          <div className="flex gap-4 text-sm font-mono text-slate-400">
            <span>ID: {caseData.caseId}</span>
            <span>CIT: {caseData.citizenId}</span>
            <span>{caseData.mobileNumber}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {caseData.adminFlags.map(f => (
            <span key={f} className={`text-[10px] uppercase px-2 py-1 rounded font-bold border ${
              f === 'Priority' || f === 'VIP' ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' :
              f === 'NeedsReview' ? 'bg-orange-900/30 text-orange-400 border-orange-800/50' :
              'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {f}
            </span>
          ))}
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-xs border border-slate-700 transition-colors ml-4">
            + Add Flag
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('family')}
          className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'family' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <span>👨‍👩‍👧‍👦</span> Family Safety
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: Service Health & Links */}
          <div className="col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Service Health</h3>
              <div className="space-y-3">
                {Object.entries(caseData.serviceHealth).map(([service, health]) => (
                  <div key={service} className="flex justify-between items-center">
                    <span className="text-sm text-slate-300 capitalize">{service}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      health === 'Healthy' ? 'bg-green-900/30 text-green-400 border-green-900/50' :
                      health === 'Warning' ? 'bg-orange-900/30 text-orange-400 border-orange-900/50' :
                      'bg-red-900/30 text-red-400 border-red-900/50'
                    }`}>
                      {health}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Internal Admin Notes</h3>
              <div className="space-y-3">
                {caseData.internalNotes.map(note => (
                  <div key={note.id} className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-500">{note.authorId}</span>
                      <span className="text-[9px] font-mono text-slate-600">{new Date(note.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Business Timeline */}
          <div className="col-span-2">
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 h-full shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Business Timeline</h3>
                <button className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">
                  Switch to Audit Log ↹
                </button>
              </div>
              
              <div className="relative border-l border-slate-700 ml-3 space-y-6">
                {caseData.businessTimeline.map(evt => (
                  <div key={evt.id} className="pl-6 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5 border-2 border-slate-900 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-bold text-white">{evt.type}</span>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(evt.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-400">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-lg border border-purple-900/30 p-4 shadow-xl">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Family Tracking Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded border border-slate-700">
                <div>
                  <span className="text-sm text-white block">Safe Radius</span>
                  <span className="text-[10px] text-slate-400">Dynamic AI (Current: 50m)</span>
                </div>
                <span className="text-green-400 font-bold text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded border border-slate-700">
                <div>
                  <span className="text-sm text-white block">Current Risk Level</span>
                  <span className="text-[10px] text-slate-400">Predicted by AI Engine</span>
                </div>
                <span className="text-green-400 font-bold text-sm">Low</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded border border-slate-700">
                <div>
                  <span className="text-sm text-white block">Assigned Guardian</span>
                  <span className="text-[10px] text-slate-400">Temporary Safety Lead</span>
                </div>
                <span className="text-slate-500 italic text-sm">None Assigned</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Separation Incidents & Broadcasts</h3>
            <div className="text-center p-8 bg-slate-800/50 rounded border border-dashed border-slate-700">
              <span className="text-slate-500 text-sm">No Active Incidents for this Family</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
