'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/utils/cn';

// ============================================================
// CUSTOM MARKER GENERATOR
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

// ============================================================
// MAP CONTROLLER (BOUNDS AUTO-FIT & NAVIGATION VIEW)
// ============================================================
function MapBoundsController({ origin, destination, path, isNavigating }: { origin: [number, number], destination: [number, number], path: [number, number][], isNavigating?: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (isNavigating && origin) {
      // In navigation mode, zoom closely on the origin to simulate turn-by-turn perspective
      map.setView(origin, 16, { animate: true, duration: 1.5 });
    } else if (origin && destination) {
      // Standard overview mode
      const bounds = L.latLngBounds([origin, destination]);
      path.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
    }
  }, [origin, destination, path, isNavigating, map]);

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
  className
}: SmartRouteMapProps) {
  
  // Default map viewport centered around Nashik/Trimbakeshwar area
  const defaultCenter = { lat: 19.98, lng: 73.70 };
  const defaultZoom = 11;

  const originMarker = useMemo(() => createCustomMarker('#005BAC', '📍'), []);
  const destMarker = useMemo(() => createCustomMarker('#FF9933', '🏁'), []);
  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-[#E5E7EB]', className)}>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {activeRoute && (
          <MapBoundsController 
            origin={[origin.lat, origin.lng]} 
            destination={[destination.lat, destination.lng]} 
            path={activeRoute.path} 
            isNavigating={isNavigating}
          />
        )}

        {/* Render all routes. Non-active routes are semi-transparent and thinner */}
        {routes.map((route) => {
          const isActive = route.id === activeRouteId;
          return (
            <Polyline
              key={route.id}
              positions={route.path}
              pathOptions={{
                color: route.color,
                weight: isActive ? 6 : 4,
                opacity: isActive ? 1 : 0.4,
                dashArray: route.isCongested && isActive ? '10, 10' : undefined
              }}
              eventHandlers={{
                click: () => onSelectRoute(route.id)
              }}
            >
              <Popup>
                <div className="text-xs font-bold text-[#111827]">
                  {route.name}
                  <br/>
                  <span className={route.isCongested ? "text-red-600" : "text-emerald-600"}>
                    {route.duration} • {route.distance}
                  </span>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originMarker}>
          <Popup className="custom-leaflet-popup">
            <div className="text-xs p-1 space-y-1 min-w-[150px]">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#005BAC] bg-[#F5F7FA] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                Origin
              </span>
              <h4 className="font-bold text-sm text-[#111827]">{origin.label}</h4>
            </div>
          </Popup>
        </Marker>

        {/* Render Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destMarker}>
          <Popup className="custom-leaflet-popup">
            <div className="text-xs p-1 space-y-1 min-w-[150px]">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#FF9933] bg-[#FFF5EB] px-1.5 py-0.5 rounded border border-[#FF9933]/30">
                Destination
              </span>
              <h4 className="font-bold text-sm text-[#111827]">{destination.label}</h4>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default SmartRouteMap;
