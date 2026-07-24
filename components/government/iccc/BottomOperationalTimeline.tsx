'use client';
import { useMergedTimelineEvents } from '@/store/selectors/mergedSelectors';
import { simulationRecorder } from '@/services/simulation/SimulationRecorder';
import { replayController } from '@/services/simulation/ReplayController';
import { useState } from 'react';

export default function BottomOperationalTimeline() {
  const events = useMergedTimelineEvents();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  return (
    <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col shrink-0">
      <div className="p-2 border-b border-slate-800 flex justify-between items-center px-4 bg-slate-900/50">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">Operational Timeline</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (isRecording) {
                const session = simulationRecorder.stopRecording();
                if (session) {
                  replayController.loadSession(session);
                  setHasRecording(true);
                }
                setIsRecording(false);
              } else {
                simulationRecorder.startRecording();
                setIsRecording(true);
              }
            }}
            className={`bg-slate-800 hover:bg-slate-700 border ${isRecording ? 'border-red-500 text-red-400' : 'border-slate-700 text-slate-400'} px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center gap-1`}
          >
            {isRecording ? '⏹ Stop Rec' : '⏺ Record'}
          </button>
          
          {hasRecording && !isRecording && (
            <button 
              onClick={() => replayController.play()}
              className="bg-blue-900/50 hover:bg-blue-800/50 border border-blue-500 text-blue-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center gap-1"
            >
              <span>⏪</span> Replay
            </button>
          )}
          <div className="h-4 w-px bg-slate-700 mx-2"></div>
          <div className="flex gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            <button className="hover:text-white">All Events</button>
            <button className="hover:text-white">Incidents</button>
            <button className="hover:text-white">Cross-Dept Requests</button>
            <button className="hover:text-white ml-2" title="Toggle Fullscreen">⛶</button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto p-4 flex gap-4 items-center">
        {events.length === 0 && (
          <div className="text-xs text-slate-500 italic">Listening for operational events via Event Bus...</div>
        )}
        
        {events.map(ev => (
          <div key={ev.eventId} className="min-w-[250px] bg-slate-800 border border-slate-700 rounded p-3 shrink-0 relative overflow-hidden group hover:border-slate-500 transition-colors cursor-pointer">
            {ev.simulationFlag && <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>}
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-mono text-slate-400">{new Date(ev.timestamp).toLocaleTimeString()}</span>
              <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-300 border border-slate-700">{ev.source}</span>
            </div>
            <p className="text-xs font-semibold text-white truncate">{ev.eventType.replace(/_/g, ' ')}</p>
            {ev.eventType === 'AI_OUTCOME_ANALYSIS' && (
              <p className="text-[10px] text-green-400 mt-1 truncate">{(ev.payload as any).predictedOutcome}</p>
            )}
          </div>
        ))}
        <div className="min-w-[250px] bg-slate-800 border border-slate-700 rounded p-3 shrink-0 relative overflow-hidden group hover:border-slate-500 transition-colors cursor-pointer">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-mono text-slate-400">Just Now</span>
            <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-300 border border-slate-700">Health &rarr; Police</span>
          </div>
          <p className="text-xs font-semibold text-white">Request Crowd Control at P1</p>
          <button className="text-[9px] mt-2 bg-purple-900/50 text-purple-300 border border-purple-800 px-2 py-0.5 rounded hover:bg-purple-800/50 transition-colors">Acknowledge</button>
        </div>
      </div>
    </div>
  );
}
