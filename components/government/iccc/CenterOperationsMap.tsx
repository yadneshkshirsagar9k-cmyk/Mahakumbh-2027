'use client';
import React, { useState } from 'react';
import SpatialIntelligenceCore from '@/components/admin/spatial-core/SpatialIntelligenceCore';
import { useICCCStore } from '@/store/government/icccStore';
import { useMergedIncidents, useMergedCrowdPoints } from '@/store/selectors/mergedSelectors';
import { ShieldAlert, Users, Target } from 'lucide-react';
import '@/components/admin/map-registry/CrowdHeatmapLayer';
import '@/components/admin/map-registry/EmergencyIntelligenceLayer';

export default function CenterOperationsMap() {
  const { mapFocus, setMapFocus } = useICCCStore();
  const [showFamilyOverlay, setShowFamilyOverlay] = useState(true);
  const allIncidents = useMergedIncidents();
  const crowdPoints = useMergedCrowdPoints();
  const familyIncidents = React.useMemo(() => 
    allIncidents.filter(i => (i as any).type === 'FamilySeparation' && i.status !== 'resolved' && (i as any).status !== 'Reunified'),
  [allIncidents]);

  const handleQuickFocus = (lon: number, lat: number) => {
    setMapFocus([lon, lat]);
  };

  return (
    <div className="flex-1 relative bg-black">
      <SpatialIntelligenceCore 
        activeLayerIds={['crowd-heatmap', 'emergency-intelligence']} 
        layerData={{ 
          'crowd-heatmap': crowdPoints,
          'emergency-intelligence': allIncidents
        }}
        initialViewState={mapFocus ? { longitude: mapFocus[0], latitude: mapFocus[1], zoom: 16, pitch: 45, bearing: 0 } : undefined}
      />
      
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <button onClick={() => handleQuickFocus(73.7900, 20.0000)} className="bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded hover:bg-slate-800 hover:text-white uppercase font-bold tracking-widest transition-colors">
          Ramkund Focus
        </button>
        <button onClick={() => handleQuickFocus(73.7800, 20.0100)} className="bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded hover:bg-slate-800 hover:text-white uppercase font-bold tracking-widest transition-colors">
          Trimbakeshwar Focus
        </button>
      </div>

      {/* FAMILY OPERATIONS MOCKED OVERLAY */}
      {showFamilyOverlay && (
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-purple-500/50 rounded-lg p-3 z-10 w-64 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <div className="flex items-center justify-between mb-3 border-b border-purple-500/30 pb-2">
            <h3 className="text-[10px] text-purple-400 font-black uppercase tracking-widest flex items-center gap-2">
              <Users size={12}/> Family Ops Command
            </h3>
            <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
              {familyIncidents.length} ACTIVE
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {familyIncidents.map(inc => (
              <div key={inc.id} className="bg-slate-800/80 border border-slate-700 rounded p-2 text-left hover:border-purple-500/50 transition-colors cursor-pointer" onClick={() => handleQuickFocus(73.7900, 20.0000)}>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-purple-400">{inc.id}</span>
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">{inc.status}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-200 mt-1">{(inc as any).title || inc.id}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-slate-400 flex items-center gap-1"><Target size={10}/> {(inc as any).location || inc.coordinates?.join(',')}</span>
                  <button className="text-[9px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-0.5 rounded transition-colors">Dispatch Unit</button>
                </div>
              </div>
            ))}
            {familyIncidents.length === 0 && (
              <div className="text-center text-slate-500 text-[10px] font-bold py-2">No active family separations</div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 rounded p-3 z-10 w-48">
        <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Live Layers</h3>
        <label className="flex items-center gap-2 text-xs text-slate-300 mb-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-blue-500" /> Crowd Heatmap
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300 mb-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-blue-500" /> Traffic Flow
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300 mb-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-blue-500" /> Police Units
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300 mb-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-blue-500" /> Medical Camps
        </label>
        <label className="flex items-center gap-2 text-xs text-purple-300 cursor-pointer">
          <input type="checkbox" checked={showFamilyOverlay} onChange={(e) => setShowFamilyOverlay(e.target.checked)} className="accent-purple-500" /> Family Operations Overlay
        </label>
      </div>
    </div>
  );
}
