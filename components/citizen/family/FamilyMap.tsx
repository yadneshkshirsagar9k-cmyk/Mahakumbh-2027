'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '@/utils/cn';

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FamilyMapProps {
  members: any[];
  selectedMember: string | null;
  setSelectedMember: (id: string | null) => void;
  showRadius: boolean;
  safeRadiusMeters: number;
  mapLayer: 'street' | 'satellite';
  mapAction: string | null;
  navigationTarget: string | null;
  meetingPoint: [number, number] | null;
}

// Center map on Nashik (Trimbakeshwar area) for the Mahakumbh context
export const MAP_CENTER: [number, number] = [20.0, 73.78]; 

export function getMemberPosition(idx: number, status: string, radiusMeters: number): [number, number] {
  if (idx === 0) return MAP_CENTER; // Leader is always at the center for demo
  const isOutside = status === 'Outside Radius';
  
  // 1 degree is roughly 111,111 meters.
  // We want safe members to be inside the radius (e.g. at 50% of the radius)
  // We want outside members to be outside (e.g. at 150% of the radius)
  const distanceMeters = isOutside ? (radiusMeters * 1.5) : (radiusMeters * 0.5);
  const distanceDegrees = distanceMeters / 111111;

  const latOffset = Math.sin(idx * 2) * distanceDegrees;
  const lngOffset = Math.cos(idx * 2) * distanceDegrees;
  return [MAP_CENTER[0] + latOffset, MAP_CENTER[1] + lngOffset];
}

// Component to handle imperative map actions
function MapController({ members, mapAction, meetingPoint, safeRadiusMeters }: { members: any[], mapAction: string | null, meetingPoint: [number, number] | null, safeRadiusMeters: number }) {
  const map = useMap();

  useEffect(() => {
    if (!mapAction) return;

    if (mapAction === 'fit_all') {
      const bounds = L.latLngBounds(members.map((m, idx) => getMemberPosition(idx, m.status, safeRadiusMeters)));
      if (meetingPoint) bounds.extend(meetingPoint);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (mapAction === 'center_leader') {
      map.flyTo(MAP_CENTER, 15, { animate: true, duration: 1.5 });
    }
  }, [mapAction, map, members, meetingPoint, safeRadiusMeters]);

  return null;
}

export default function FamilyMap({ 
  members, 
  selectedMember, 
  setSelectedMember, 
  showRadius, 
  safeRadiusMeters,
  mapLayer,
  mapAction,
  navigationTarget,
  meetingPoint
}: FamilyMapProps) {

  // Get leader's position (index 0) for navigation paths
  const leaderPos = getMemberPosition(0, members[0]?.status || 'Safe', safeRadiusMeters);
  const targetMemberIdx = members.findIndex(m => m.id === navigationTarget);
  const targetPos = targetMemberIdx >= 0 ? getMemberPosition(targetMemberIdx, members[targetMemberIdx].status, safeRadiusMeters) : null;

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={MAP_CENTER} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full"
      >
        <MapController members={members} mapAction={mapAction} meetingPoint={meetingPoint} safeRadiusMeters={safeRadiusMeters} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={mapLayer === 'satellite' 
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' 
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'}
        />

        {showRadius && (
          <Circle 
            center={MAP_CENTER} 
            radius={safeRadiusMeters} 
            pathOptions={{ color: '#15803d', fillColor: '#22c55e', fillOpacity: 0.15, weight: 3, dashArray: '8, 8' }} 
          />
        )}

        {meetingPoint && (
          <Marker position={meetingPoint}>
            <Popup>Assigned Meeting Point</Popup>
          </Marker>
        )}

        {targetPos && (
          <Polyline 
            positions={[leaderPos, targetPos]} 
            pathOptions={{ color: '#005BAC', weight: 4, dashArray: '5, 10' }} 
          />
        )}

        {members.map((m, idx) => {
          const isSelected = selectedMember === m.id;
          const isOutside = m.status === 'Outside Radius';
          const isSOS = m.status === 'Emergency';
          const position = getMemberPosition(idx, m.status, safeRadiusMeters);

          const color = isSOS ? '#ef4444' : isOutside ? '#eab308' : '#22c55e';
          const shadowColor = isSOS ? 'rgba(239, 68, 68, 0.5)' : isOutside ? 'rgba(234, 179, 8, 0.5)' : 'rgba(34, 197, 94, 0.5)';

          const iconHtml = `
            <div class="relative w-16 h-16 flex items-center justify-center transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
              <!-- Pulsing Blip -->
              <div class="absolute inset-0 rounded-full animate-ping opacity-50" style="background-color: ${color}; animation-duration: 2s;"></div>
              
              <!-- Map Pin SVG -->
              <div class="relative flex flex-col items-center justify-center" style="margin-top: -24px;">
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px ${shadowColor});">
                  <!-- Pin Shape -->
                  <path d="M20,2 C11.163,2 4,9.163 4,18 C4,29.2 20,38 20,38 C20,38 36,29.2 36,18 C36,9.163 28.837,2 20,2 Z" fill="${color}" stroke="white" stroke-width="2.5"/>
                  <!-- Inner Circle -->
                  <circle cx="20" cy="18" r="10" fill="white"/>
                  <!-- Text -->
                  <text x="20" y="22" font-family="sans-serif" font-size="11" font-weight="900" fill="#333" text-anchor="middle">${m.id.substring(0,2).toUpperCase()}</text>
                </svg>
                ${isSelected ? `<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">${m.status}</div>` : ''}
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'bg-transparent border-0',
            iconSize: [64, 64],
            iconAnchor: [32, 48], // Adjusted anchor so the tip of the pin hits the latlng
          });

          return (
            <Marker 
              key={m.id} 
              position={position} 
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedMember(isSelected ? null : m.id)
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
