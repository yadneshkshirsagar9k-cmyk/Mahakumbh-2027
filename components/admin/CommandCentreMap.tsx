'use client';

import { useEffect, useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { useCommandCentreStore } from '@/store/command-centre/commandCentreStore';
import { useCrowdStore } from '@/store/command-centre/crowdStore';
import { useTrafficStore } from '@/store/command-centre/trafficStore';
import { useIncidentStore } from '@/store/command-centre/incidentStore';
import { usePredictionStore } from '@/store/command-centre/predictionStore';
import { layerRegistry } from './map-registry/LayerRegistry';

import './map-registry/CrowdHeatmapLayer';
import './map-registry/TrafficIntelligenceLayer';
import './map-registry/EmergencyIntelligenceLayer';
import './map-registry/PredictiveCrowdLayer';

const INITIAL_VIEW_STATE = {
  longitude: 73.7900,
  latitude: 20.0000,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

export default function CommandCentreMap() {
  const activeLayers = useCommandCentreStore(state => state.activeLayers);
  
  const crowdPoints = useCrowdStore(state => state.points);
  const trafficSegments = useTrafficStore(state => state.segments);
  const incidents = useIncidentStore(state => state.incidents);
  const predictedPoints = usePredictionStore(state => state.predictedPoints);

  const [time, setTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setTime(t => t + 0.01);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const layers = useMemo(() => {
    const deckLayers: any[] = [
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
    
    if (activeLayers['crowd-heatmap'] && crowdPoints.length > 0) {
      const layer = layerRegistry.get('crowd-heatmap');
      if (layer) deckLayers.push(layer.generateLayer(crowdPoints));
    }
    if (activeLayers['traffic-intelligence'] && trafficSegments.length > 0) {
      const layer = layerRegistry.get('traffic-intelligence');
      if (layer) deckLayers.push(layer.generateLayer(trafficSegments));
    }
    if (activeLayers['emergency-intelligence'] && incidents.length > 0) {
      const layer = layerRegistry.get('emergency-intelligence');
      if (layer) deckLayers.push(layer.generateLayer(incidents, { time }));
    }
    if (activeLayers['predictive-crowd'] && predictedPoints.length > 0) {
      const layer = layerRegistry.get('predictive-crowd');
      if (layer) deckLayers.push(layer.generateLayer(predictedPoints));
    }
    return deckLayers.filter(Boolean);
  }, [activeLayers, crowdPoints, trafficSegments, incidents, predictedPoints, time]);

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

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
