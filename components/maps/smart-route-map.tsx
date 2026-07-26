'use client';

/**
 * @file SmartRouteMap
 * @description Leaflet map component with real-time traffic segments, satellite styling toggles, and animated GPS dots.
 */

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/utils/cn';
import { Layers, AlertTriangle, ShieldCheck, MapPin, Compass, Eye } from 'lucide-react';

// ============================================================
// CUSTOM MARKERS
// ============================================================
const createCustomMarker = (color: string, emoji: string) => {
  return L.divIcon({
    html: `
      <div class="relative w-10 h-10 flex items-center justify-center transform hover:scale-110 transition-all duration-200">
        <div class="absolute w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md border-2" style="border-color: ${color}">
          <span class="text-sm">${emoji}</span>
        </div>
        <div class="absolute -bottom-1 w-3 h-3 rounded-full border border-white shadow-sm" style="background-color: ${color}; transform: rotate(45deg);"></div>
      </div>
    `,
    className: 'bg-transparent border-0',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -36]
  });
};

const createGPSPointer = () => {
  return L.divIcon({
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute w-6 h-6 rounded-full bg-[#005BAC] border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
        </div>
        <div class="absolute w-8 h-8 rounded-full border-2 border-[#005BAC] animate-ping opacity-60"></div>
      </div>
    `,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// ============================================================
// AUTO-BOUNDS CONTROLLER
// ============================================================
function MapBoundsController({
  origin,
  destination,
  path,
  gpsPos,
  isNavigating
}: {
  origin: [number, number];
  destination: [number, number];
  path: [number, number][];
  gpsPos: [number, number] | null;
  isNavigating?: boolean;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (isNavigating && gpsPos) {
      // Zoom closely and track the moving car in navigation mode
      map.setView(gpsPos, 16, { animate: true, duration: 0.8 });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([origin, destination]);
      path.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.2 });
    }
  }, [origin, destination, path, gpsPos, isNavigating, map]);

  return null;
}

// ============================================================
// TYPES
// ============================================================
export interface RouteOption {
  id: string;
  name: string;
  path: [number, number][];
  color: string;
  isCongested: boolean;
  distance: string;
  duration: string;
  trafficStatus: string;
}

export interface SmartRouteMapProps {
  origin: { lat: number; lng: number; label: string };
  destination: { lat: number; lng: number; label: string };
  routes: RouteOption[];
  activeRouteId: string;
  onSelectRoute: (routeId: string) => void;
  isNavigating?: boolean;
  gpsPos?: [number, number] | null;
  className?: string;
}

// ============================================================
// COMPONENT
// ============================================================
export function SmartRouteMap({
  origin,
  destination,
  routes,
  activeRouteId,
  onSelectRoute,
  isNavigating = false,
  gpsPos = null,
  className
}: SmartRouteMapProps) {
  const [mapStyle, setMapStyle] = useState<'vector' | 'satellite' | 'dark'>('vector');
  const [showTraffic, setShowTraffic] = useState(true);

  const tileUrl = useMemo(() => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      default:
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  }, [mapStyle]);

  const originMarker = useMemo(() => createCustomMarker('#005BAC', '📍'), []);
  const destMarker = useMemo(() => createCustomMarker('#FF9933', '🏁'), []);
  const gpsMarker = useMemo(() => createGPSPointer(), []);

  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  // Helper to segment path coordinates and color them by live traffic density
  const getTrafficSegments = (path: [number, number][], isCongested: boolean) => {
    if (path.length < 2) return [];
    const segments = [];
    for (let i = 0; i < path.length - 1; i++) {
      let color = '#10B981'; // Clear (Green)
      let status = 'Clear • Flow speed 60 km/h';

      if (isCongested) {
        if (i === 1) {
          color = '#EF4444'; // Heavy traffic (Red)
          status = 'Heavy Congestion • Flow speed 12 km/h';
        } else if (i === 2) {
          color = '#F59E0B'; // Moderate traffic (Orange)
          status = 'Slow Traffic • Flow speed 28 km/h';
        }
      } else {
        if (i === 1 && path.length > 3) {
          color = '#F59E0B'; 
          status = 'Moderate Traffic • Flow speed 35 km/h';
        }
      }

      segments.push({
        positions: [path[i], path[i+1]] as [number, number][],
        color,
        status
      });
    }
    return segments;
  };

  const segments = useMemo(() => {
    return getTrafficSegments(activeRoute.path, activeRoute.isCongested);
  }, [activeRoute]);

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-[#E5E7EB] flex flex-col', className)}>
      
      {/* Floating Layer controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        
        {/* Map Styles Selector */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-stone-200/80 flex flex-col gap-1 text-[10px] font-bold text-stone-700 pointer-events-auto">
          <div className="flex items-center gap-1 border-b border-stone-100 pb-1.5 px-1 uppercase tracking-wider text-stone-500">
            <Layers size={10} />
            <span>Map Layers</span>
          </div>
          <button
            onClick={() => setMapStyle('vector')}
            className={cn('px-2.5 py-1 rounded text-left transition-all', mapStyle === 'vector' ? 'bg-[#005BAC] text-white' : 'hover:bg-stone-50')}
          >
            Default Vector
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={cn('px-2.5 py-1 rounded text-left transition-all', mapStyle === 'satellite' ? 'bg-[#005BAC] text-white' : 'hover:bg-stone-50')}
          >
            Satellite View
          </button>
          <button
            onClick={() => setMapStyle('dark')}
            className={cn('px-2.5 py-1 rounded text-left transition-all', mapStyle === 'dark' ? 'bg-[#005BAC] text-white' : 'hover:bg-stone-50')}
          >
            Dark Mode
          </button>
        </div>

        {/* Traffic Overlay Toggle */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={cn(
            "p-2.5 rounded-xl shadow-lg border font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 pointer-events-auto",
            showTraffic 
              ? "bg-[#2E7D32] text-white border-[#1B5E20]" 
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          )}
        >
          <Eye size={12} />
          <span>Traffic Layer</span>
        </button>
      </div>

      {/* Floating Checkpoint Status */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-stone-200/80 max-w-[200px] pointer-events-auto text-left text-[10px] space-y-1">
        <span className="font-black uppercase tracking-wider text-[#005BAC] text-[8px] flex items-center gap-1">
          <Compass size={10} className="animate-spin" /> Live Transit Telemetry
        </span>
        <div className="font-semibold text-stone-700">
          <div>Speed limit: <strong className="text-stone-900">50 km/h</strong></div>
          <div>GPS Signal: <strong className="text-[#2E7D32]">Excellent</strong></div>
        </div>
      </div>

      <MapContainer
        center={[19.98, 73.70]}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          key={tileUrl}
          attribution='&copy; Mapbox &copy; OpenStreetMap'
          url={tileUrl}
        />

        {activeRoute && (
          <MapBoundsController 
            origin={[origin.lat, origin.lng]} 
            destination={[destination.lat, destination.lng]} 
            path={activeRoute.path} 
            gpsPos={gpsPos}
            isNavigating={isNavigating}
          />
        )}

        {/* Render Traffic colored sub-segments if traffic is toggled */}
        {showTraffic ? (
          segments.map((seg, idx) => (
            <Polyline
              key={idx}
              positions={seg.positions}
              pathOptions={{
                color: seg.color,
                weight: 6,
                opacity: 0.95
              }}
            >
              <Popup>
                <div className="text-[10px] font-bold text-stone-800">
                  {seg.status}
                </div>
              </Popup>
            </Polyline>
          ))
        ) : (
          /* Render simple single-color line */
          <Polyline
            positions={activeRoute.path}
            pathOptions={{
              color: activeRoute.color,
              weight: 5,
              opacity: 0.8
            }}
          />
        )}

        {/* Render other route alternatives in thin grey */}
        {routes.filter(r => r.id !== activeRouteId).map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: '#9CA3AF',
              weight: 4,
              opacity: 0.35
            }}
            eventHandlers={{
              click: () => onSelectRoute(route.id)
            }}
          />
        ))}

        {/* Render Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originMarker}>
          <Popup className="custom-leaflet-popup">
            <div className="text-xs p-1 space-y-1 min-w-[150px] text-left">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#005BAC] bg-[#F5F7FA] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                Departure Point
              </span>
              <h4 className="font-black text-sm text-[#111827]">{origin.label}</h4>
            </div>
          </Popup>
        </Marker>

        {/* Render Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destMarker}>
          <Popup className="custom-leaflet-popup">
            <div className="text-xs p-1 space-y-1 min-w-[150px] text-left">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#FF9933] bg-[#FFF5EB] px-1.5 py-0.5 rounded border border-[#FF9933]/30">
                Arrival Destination
              </span>
              <h4 className="font-black text-sm text-[#111827]">{destination.label}</h4>
            </div>
          </Popup>
        </Marker>

        {/* Pulsing GPS Pointer at current position */}
        {isNavigating && gpsPos && (
          <Marker position={gpsPos} icon={gpsMarker}>
            <Popup>
              <div className="text-[10px] font-bold text-stone-850">
                You are here. Syncing turn-by-turn sensors...
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default SmartRouteMap;
