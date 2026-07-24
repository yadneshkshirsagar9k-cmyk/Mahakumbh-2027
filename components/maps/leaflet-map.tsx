'use client';

/**
 * @file LeafletMap component
 * @description Leaflet client-only map that displays registration locations
 * with custom colored pulsing markers, supports selection flying,
 * and maps basic boundaries of Mahakumbh regions (Nashik, Shirdi, Mumbai, Pune, Nagpur).
 */

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RegistrationCentre, CATEGORY_METADATA } from '@/constants/registration-centres';
import { cn } from '@/utils/cn';

// ============================================================
// CUSTOM MARKER GENERATOR
// ============================================================

const createCustomMarker = (color: string, category: string) => {
  let emoji = '📍';
  if (category === 'railway') emoji = '🚆';
  else if (category === 'bus') emoji = '🚌';
  else if (category === 'airport') emoji = '✈️';
  else if (category === 'government') emoji = '🏛️';
  else if (category === 'temporary') emoji = '⛺';
  else if (category === 'info') emoji = 'ℹ️';
  else if (category === 'medical') emoji = '🏥';
  else if (category === 'police') emoji = '🚨';

  return L.divIcon({
    html: `
      <div class="relative w-9 h-9 flex items-center justify-center transform hover:scale-110 transition-all duration-200">
        <div class="absolute w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md border-2" style="border-color: ${color}">
          <span class="text-sm">${emoji}</span>
        </div>
        <div class="absolute -bottom-1 w-2.5 h-2.5 rounded-full border border-white" style="background-color: ${color}; transform: rotate(45deg);"></div>
        <div class="absolute inset-0 rounded-full animate-ping opacity-20" style="background-color: ${color}; animation-duration: 3s;"></div>
      </div>
    `,
    className: 'bg-transparent border-0',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

// ============================================================
// MAP CONTROLLER (FLY TO COORDINATES)
// ============================================================

interface MapControllerProps {
  center: { lat: number; lng: number } | null;
  zoom: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, zoom, map]);

  return null;
}

// ============================================================
// MOCK REGION BOUNDARIES (MAHARASHTRA DISTRICTS)
// ============================================================

// Coordinates representing simplified boundary polygons for Nashik and Shirdi regions
const NASHIK_REGION_POLYGON: [number, number][] = [
  [20.35, 73.40],
  [20.45, 73.80],
  [20.20, 74.30],
  [19.70, 74.40],
  [19.55, 73.90],
  [19.75, 73.40],
];

const SHIRDI_REGION_POLYGON: [number, number][] = [
  [19.90, 74.35],
  [19.95, 74.65],
  [19.65, 74.70],
  [19.55, 74.35],
];

// ============================================================
// COMPONENT
// ============================================================

export interface LeafletMapProps {
  centres: RegistrationCentre[];
  selectedCentre: RegistrationCentre | null;
  onSelectCentre: (centre: RegistrationCentre) => void;
  className?: string;
}

export function LeafletMap({
  centres,
  selectedCentre,
  onSelectCentre,
  className
}: LeafletMapProps) {
  
  // Default map viewport centered on India
  const defaultCenter = { lat: 21.00, lng: 78.96 };
  const defaultZoom = 5;

  // Determine current map center
  const mapCenter = selectedCentre 
    ? selectedCentre.coordinates 
    : defaultCenter;
  
  const mapZoom = selectedCentre ? 12 : defaultZoom;

  return (
    <div className={cn('relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-[#E5E7EB]', className)}>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* Modern clean tile layer suitable for high-tech portal aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic map center and zoom controller */}
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Nashik District GIS Boundary Layer */}
        <Polygon
          positions={NASHIK_REGION_POLYGON}
          pathOptions={{
            color: '#005BAC',
            fillColor: '#005BAC',
            fillOpacity: 0.05,
            weight: 1.5,
            dashArray: '4, 4'
          }}
        >
          <Popup>
            <div className="text-xs font-bold text-[#111827]">Nashik District Boundary (GIS Layer)</div>
          </Popup>
        </Polygon>

        {/* Shirdi / Ahilyanagar District GIS Boundary Layer */}
        <Polygon
          positions={SHIRDI_REGION_POLYGON}
          pathOptions={{
            color: '#005BAC',
            fillColor: '#005BAC',
            fillOpacity: 0.04,
            weight: 1.5,
            dashArray: '4, 4'
          }}
        >
          <Popup>
            <div className="text-xs font-bold text-[#111827]">Ahilyanagar District Boundary (GIS Layer)</div>
          </Popup>
        </Polygon>

        {/* Markers rendering */}
        {centres.map((centre) => {
          const meta = CATEGORY_METADATA[centre.category];
          const isSelected = selectedCentre?.id === centre.id;

          return (
            <Marker
              key={centre.id}
              position={[centre.coordinates.lat, centre.coordinates.lng]}
              icon={createCustomMarker(meta.color, centre.category)}
              eventHandlers={{
                click: () => onSelectCentre(centre)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="text-xs p-1 space-y-1.5 min-w-[200px]">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#005BAC] bg-[#F5F7FA] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                    {meta.label}
                  </span>
                  <h4 className="font-bold text-sm text-[#111827] leading-tight">{centre.name}</h4>
                  <p className="text-[10px] text-[#6B7280] leading-normal">{centre.address}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] text-[9px] font-semibold text-[#6B7280]">
                    <span>{centre.city}</span>
                    <span className="text-[#005BAC] font-bold">{centre.district} Dist.</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
