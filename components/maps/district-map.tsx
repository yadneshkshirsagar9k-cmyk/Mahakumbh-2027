'use client';

/**
 * @file DistrictMap component
 * @description Geographically accurate interactive SVG map of Maharashtra.
 * Renders all 36 administrative districts with division-based color branding
 * and premium hover highlight details.
 */

import { useState, useMemo } from 'react';
import { MAHARASHTRA_DISTRICTS, MHDistrict } from '@/constants/maharashtra-map-data';
import { cn } from '@/utils/cn';

export interface DistrictMapProps {
  districts: any[]; // Kept for compatibility
  selectedDistrict: any | null;
  onSelectDistrict: (dist: any) => void;
  className?: string;
}

export function DistrictMap({
  selectedDistrict,
  onSelectDistrict,
  className
}: DistrictMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<MHDistrict | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 1. Calculate bounding box dynamically for absolute precision
  const bounds = useMemo(() => {
    let minLat = 999;
    let maxLat = -999;
    let minLng = 999;
    let maxLng = -999;

    MAHARASHTRA_DISTRICTS.forEach((d) => {
      d.polygon.forEach((p) => {
        if (p[0] < minLat) minLat = p[0];
        if (p[0] > maxLat) maxLat = p[0];
        if (p[1] < minLng) minLng = p[1];
        if (p[1] > maxLng) maxLng = p[1];
      });
    });

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;
    const padding = 0.06; // 6% padding to ensure labels fit comfortably

    return {
      minLat: minLat - latRange * padding,
      maxLat: maxLat + latRange * padding,
      minLng: minLng - lngRange * padding,
      maxLng: maxLng + lngRange * padding,
    };
  }, []);

  const width = 600;
  const height = 480;

  // 2. Projection function mapping Lat/Lng to SVG ViewBox coordinates
  const project = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * height;
    return { x, y };
  };

  // 3. Division Colors - cohesive shades of blue representing different regions
  const getDivisionColor = (division: string) => {
    switch (division.toLowerCase()) {
      case 'konkan':
        return '#0284c7'; // Sky/Coastal Blue
      case 'pune':
        return '#1d4ed8'; // Bright Royal Blue
      case 'nashik':
        return '#1e3a8a'; // Deep Navy Blue
      case 'aurangabad':
      case 'chh. sambhajinagar':
      case 'chhatrapati sambhajinagar':
      case 'marathwada':
        return '#0f766e'; // Teal/Muted Sea Blue
      case 'amravati':
        return '#0369a1'; // Muted Ocean Blue
      case 'nagpur':
        return '#4338ca'; // Deep Indigo Blue
      default:
        return '#2563eb';
    }
  };

  // Handle Mouse Move for dynamic tooltip positioning
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 40,
    });
  };

  return (
    <div 
      className={cn(
        'relative w-full h-full bg-[#022B5D]/5 dark:bg-[#0A1621] rounded-2xl p-4 flex flex-col justify-between border border-stone-grey-100 dark:border-white/5 select-none overflow-hidden shadow-inner',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {/* SVG Map Container */}
      <div className="w-full flex-grow flex items-center justify-center min-h-[360px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[440px] drop-shadow-md transition-all duration-300"
        >
          {/* Render All 36 Districts */}
          {MAHARASHTRA_DISTRICTS.map((dist) => {
            const isSelected = selectedDistrict?.id === dist.id;
            const isHovered = hoveredDistrict?.id === dist.id;
            
            // Map polygon coordinates to SVG points string
            const pointsStr = dist.polygon
              .map((p) => {
                const pt = project(p[0], p[1]);
                return `${pt.x},${pt.y}`;
              })
              .join(' ');

            // Calculate label centroid
            const centroid = project(dist.labelPos[0], dist.labelPos[1]);

            return (
              <g key={dist.id} className="group cursor-pointer">
                {/* District Boundary Polygon */}
                <polygon
                  points={pointsStr}
                  onClick={() => onSelectDistrict(dist)}
                  onMouseEnter={() => setHoveredDistrict(dist)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  className="transition-all duration-200 ease-in-out"
                  style={{
                    fill: isSelected || isHovered ? '#ffffff' : getDivisionColor(dist.division),
                    stroke: isSelected || isHovered ? '#F26F21' : '#ffffff',
                    strokeWidth: isSelected || isHovered ? 2.5 : 1.0,
                    strokeOpacity: isSelected || isHovered ? 1.0 : 0.6,
                    filter: isSelected || isHovered ? 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' : 'none',
                  }}
                />
                
                {/* Text Label on Map */}
                <text
                  x={centroid.x}
                  y={centroid.y}
                  textAnchor="middle"
                  className={cn(
                    "text-[8px] font-extrabold pointer-events-none transition-all duration-150 select-none",
                    isSelected || isHovered 
                      ? "fill-[#022B5D] scale-110" 
                      : "fill-white/80 dark:fill-white/70"
                  )}
                >
                  {dist.mapLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Division Legend */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-stone-grey-200/50 dark:border-white/5 text-[9px] font-bold text-[#022B5D]/80 dark:text-stone-grey-300">
        {[
          { label: 'Konkan', color: '#0284c7' },
          { label: 'Pune', color: '#1d4ed8' },
          { label: 'Nashik', color: '#1e3a8a' },
          { label: 'Chh. Sambhajinagar', color: '#0f766e' },
          { label: 'Amravati', color: '#0369a1' },
          { label: 'Nagpur', color: '#4338ca' }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Interactive Tooltip */}
      {hoveredDistrict && (
        <div
          className="absolute z-50 bg-[#022B5D] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center gap-0.5 border border-white/10"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <span className="text-[10px] text-[#F26F21] uppercase tracking-wider">{hoveredDistrict.division} Region</span>
          <span className="font-extrabold text-white text-xs">{hoveredDistrict.name}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#022B5D]" />
        </div>
      )}
    </div>
  );
}

export default DistrictMap;
