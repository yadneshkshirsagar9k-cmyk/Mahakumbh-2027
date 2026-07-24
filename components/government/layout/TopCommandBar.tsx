'use client';
import { useICCCStore } from '@/store/government/icccStore';
import { useGovernmentAuthStore } from '@/store/government/governmentAuthStore';
import { platformHealthEngine } from '@/services/health/PlatformHealthEngine';
import { scenarioManager } from '@/services/simulation/ScenarioManager';
import { scenarioLibrary } from '@/services/simulation/ScenarioLibrary';
import { simulationClock } from '@/services/simulation/SimulationClock';
import { useState, useEffect } from 'react';

export default function TopCommandBar() {
  const { operationalMode, setOperationalMode, simulationState, setSimulationState, activeScenarioId, setActiveScenarioId } = useICCCStore();
  const profile = useGovernmentAuthStore(state => state.profile);
  const [time, setTime] = useState(new Date());
  const [simTimeMs, setSimTimeMs] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  const healthState = platformHealthEngine.getOverallHealth();

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (operationalMode === 'Simulation') {
      unsub = simulationClock.onTick((t) => setSimTimeMs(t));
    }
    return () => unsub?.();
  }, [operationalMode]);

  const handlePlayPause = () => {
    if (simulationState === 'playing') {
      scenarioManager.pause();
      setSimulationState('paused');
    } else {
      if (simulationState === 'stopped') {
        const scenario = scenarioLibrary.find(s => s.id === activeScenarioId) || scenarioLibrary[0];
        scenarioManager.loadScenario(scenario);
        scenarioManager.start();
      } else {
        scenarioManager.resume();
      }
      setSimulationState('playing');
    }
  };

  const handleStop = () => {
    scenarioManager.stop();
    setSimulationState('stopped');
  };

  return (
    <div className="flex flex-col border-b border-slate-800 bg-slate-900 shrink-0">
      {operationalMode === 'Emergency' && (
        <div className="bg-red-900 text-red-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-center flex justify-between items-center animate-pulse">
          <span>CRITICAL: EMERGENCY OPERATIONS ACTIVE</span>
          <button className="underline hover:text-white">View Details</button>
        </div>
      )}

      <div className="h-12 flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
            <span className="text-blue-500">ICCC</span> 
            <span className="text-slate-500 text-sm font-normal">| Mahakumbh '27</span>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            {isMounted ? (
              operationalMode === 'Simulation' ? (
                <span className="text-yellow-400">SIM TIME: {new Date(simTimeMs || time.getTime()).toLocaleTimeString()}</span>
              ) : (
                <span>{time.toLocaleDateString()} {time.toLocaleTimeString()} | SHIFT: ALPHA</span>
              )
            ) : (
              <span className="opacity-0">00/00/0000 00:00:00 | SHIFT: ALPHA</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Readiness Score</span>
            <span className="text-sm font-semibold text-green-400" title="Future Operational Readiness Score Placeholder">98%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Live Citizens</span>
            <span className="text-sm font-semibold text-white">4.2M</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Incidents</span>
            <span className="text-sm font-semibold text-orange-400">12</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">System Health</span>
            <span className={`text-sm font-semibold ${healthState === 'Healthy' ? 'text-green-400' : 'text-red-400'}`}>
              {healthState}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {operationalMode === 'Simulation' && (
            <div className="flex items-center gap-2 mr-4 bg-slate-800 p-1 rounded border border-slate-700">
              <select 
                value={activeScenarioId || ''} 
                onChange={(e) => setActiveScenarioId(e.target.value)}
                className="bg-slate-900 text-xs text-white p-1 rounded border border-slate-700 outline-none"
                disabled={simulationState !== 'stopped'}
              >
                {scenarioLibrary.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button 
                onClick={handlePlayPause}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors"
              >
                {simulationState === 'playing' ? '⏸ Pause' : '▶ Play'}
              </button>
              <button 
                onClick={handleStop}
                disabled={simulationState === 'stopped'}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
              >
                ⏹ Stop
              </button>
            </div>
          )}

          <select 
            value={operationalMode}
            onChange={(e) => {
              setOperationalMode(e.target.value as any);
              if (e.target.value !== 'Simulation' && simulationState !== 'stopped') {
                handleStop();
              }
            }}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded px-2 py-1 outline-none"
          >
            <option value="Normal">Mode: Normal</option>
            <option value="PeakFestival">Mode: Peak</option>
            <option value="Emergency">Mode: Emergency</option>
            <option value="VIPMovement">Mode: VIP</option>
            <option value="Simulation">Mode: Simulation</option>
          </select>
          
          {/* Multi-display Profiles Placeholder */}
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 text-xs transition-colors" title="Display Profiles (Future)">
            🖥️ 1
          </button>

          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-700 text-xs flex items-center gap-2 transition-colors">
            📸 Snapshot
          </button>

          {/* Operational Digest Placeholder */}
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-700 text-xs flex items-center gap-2 transition-colors" title="Generate Digest (Future)">
            📄 Digest
          </button>
          
          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
            {profile?.fullName?.charAt(0) || 'O'}
          </div>
        </div>
      </div>
    </div>
  );
}
