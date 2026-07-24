'use client';
import { useMemo, useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { layerRegistry } from '../map-registry/LayerRegistry';

interface SpatialIntelligenceCoreProps {
  activeLayerIds: string[];
  layerData: Record<string, any>;
  options?: Record<string, any>;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

const DEFAULT_VIEW_STATE = {
  longitude: 73.7800,
  latitude: 20.0100, // Default to Trimbakeshwar
  zoom: 14,
  pitch: 45,
  bearing: 0
};

export default function SpatialIntelligenceCore({
  activeLayerIds,
  layerData,
  options,
  initialViewState = DEFAULT_VIEW_STATE
}: SpatialIntelligenceCoreProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const layers = useMemo(() => {
    const baseLayers = [
      new TileLayer({
        id: 'carto-dark-basemap',
        data: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        renderSubLayers: props => {
          const { west, south, east, north } = props.tile.bbox as any;
          return new BitmapLayer(props, {
            data: undefined,
            image: props.data,
            bounds: [west, south, east, north]
          });
        }
      })
    ];

    const dynamicLayers = activeLayerIds.map(layerId => {
      const registryEntry = layerRegistry.get(layerId);
      if (registryEntry && layerData[layerId]) {
        return registryEntry.generateLayer(layerData[layerId], options);
      }
      return null;
    }).filter(Boolean);

    return [...baseLayers, ...dynamicLayers];
  }, [activeLayerIds, layerData, options]);

  const [viewState, setViewState] = useState(initialViewState);

  // Sync when prop changes
  useEffect(() => {
    setViewState(initialViewState);
  }, [initialViewState]);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full relative">
      <DeckGL
        viewState={viewState}
        onViewStateChange={e => setViewState(e.viewState as any)}
        controller={true}
        layers={layers}
        style={{ position: 'absolute', top: '0px', left: '0px' }}
      />
    </div>
  );
}
