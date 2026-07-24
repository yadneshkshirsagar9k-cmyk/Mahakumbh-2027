'use client';

/**
 * @file EmergencyMap component
 * @description Client-only Leaflet map displaying emergency hubs (camps, police stations,
 * hospitals) in the Mahakumbh sector. Clicking markers displays contact hotlines.
 */

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { HELP_CENTRES_DATA, HelpCentre } from '@/constants/emergency-data';
import { cn } from '@/utils/cn';

// ============================================================
// CUSTOM MARKER GENERATOR
// ============================================================

const createEmergencyIcon = (category: string) => {
  let emoji = '🚨';
  let color = '#DC2626'; // Red
  
  if (category === 'police') {
    emoji = '🚨';
    color = '#475569'; // Slate
  } else if (category === 'hospital') {
    emoji = '🏥';
    color = '#DC2626'; // Red
  } else if (category === 'camp') {
    emoji = '⛺';
    color = '#DC2626'; // Red
  } else if (category === 'lost_found') {
    emoji = '🔍';
    color = '#F59E0B'; // Amber
  } else if (category === 'info') {
    emoji = 'ℹ️';
    color = '#06B6D4'; // Cyan
  }

  return L.divIcon({
    html: `
      <div class="relative w-9 h-9 flex items-center justify-center transform hover:scale-110 transition-all duration-200">
        <div class="absolute w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md border-2" style="border-color: ${color}">
          <span class="text-sm">${emoji}</span>
        </div>
        <div class="absolute -bottom-1 w-2.5 h-2.5 rounded-full border border-white" style="background-color: ${color}; transform: rotate(45deg);"></div>
        <div class="absolute inset-0 rounded-full animate-ping opacity-20 bg-red-500" style="animation-duration: 2.5s;"></div>
      </div>
    `,
    className: 'bg-transparent border-0',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

// ============================================================
// MAP VIEWPORT CONTROLLER
// ============================================================

function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13, { animate: true, duration: 1.0 });
    }
  }, [center, map]);
  return null;
}

// ============================================================
// COMPONENT
// ============================================================

export interface EmergencyMapProps {
  centres: HelpCentre[];
  selectedCentre: HelpCentre | null;
  className?: string;
}

export function EmergencyMap({
  centres,
  selectedCentre,
  className
}: EmergencyMapProps) {
  
  const defaultCenter = { lat: 20.0058, lng: 73.7919 }; // Ram Kund center
  const mapCenter = selectedCentre ? selectedCentre.coordinates : defaultCenter;

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden border border-stone-grey-100 dark:border-white/5 shadow-inner', className)}>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Map Focus controller */}
        <MapController center={mapCenter} />

        {/* Render markers for each emergency centre */}
        {centres.map((centre) => (
          <Marker
            key={centre.id}
            position={[centre.coordinates.lat, centre.coordinates.lng]}
            icon={createEmergencyIcon(centre.category)}
          >
            <Popup>
              <div className="text-xs p-1 space-y-1.5 min-w-[180px]">
                <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                  {centre.category === 'camp' ? 'Medical Camp' : centre.category}
                </span>
                <h4 className="font-bold text-sm text-[#022B5D] leading-tight">{centre.name}</h4>
                <p className="text-[10px] text-stone-grey-500 leading-normal">{centre.address}</p>
                <div className="pt-1 border-t border-stone-grey-100 text-[10px] font-semibold text-red-600 flex items-center justify-between">
                  <span>Call Hotline:</span>
                  <span className="font-bold">{centre.contact}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default EmergencyMap;
