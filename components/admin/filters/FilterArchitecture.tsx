'use client';
import { useCommandCentreStore } from '@/store/command-centre/commandCentreStore';
import { Layers } from 'lucide-react';
import { MapLayerId } from '@/types/command-centre';
import { layerRegistry } from '../map-registry/LayerRegistry';
import { useEffect, useState } from 'react';

export default function FilterArchitecture() {
  const activeLayers = useCommandCentreStore(state => state.activeLayers);
  const toggleLayer = useCommandCentreStore(state => state.toggleLayer);
  
  const [availableLayers, setAvailableLayers] = useState<any[]>([]);
  
  useEffect(() => {
    setAvailableLayers(layerRegistry.getAll());
  }, []);

  return (
    <div className="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl min-w-[320px]">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-3">
        <Layers size={16} className="text-zinc-400" />
        <h3 className="font-semibold text-sm tracking-widest uppercase text-zinc-400">Map Layers</h3>
      </div>
      
      <div className="flex flex-col gap-2">
        {availableLayers.map(layer => (
          <label key={layer.id} className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/20"
              checked={!!activeLayers[layer.id]}
              onChange={() => toggleLayer(layer.id as MapLayerId)}
            />
            <span className="text-sm font-medium text-zinc-300">{layer.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
