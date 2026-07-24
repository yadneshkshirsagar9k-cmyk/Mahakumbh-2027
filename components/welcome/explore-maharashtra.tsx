'use client';

/**
 * @file ExploreMaharashtra component
 * @description Highly detailed, high-fidelity interactive map of all 36 districts of Maharashtra,
 * using precise geographic vector paths that tile together perfectly like puzzle pieces.
 */

import { useState, useMemo } from 'react';
import { MAHARASHTRA_DISTRICTS, MHDistrict } from '@/constants/maharashtra-map-data';
import {
  MAHARASHTRA_VIEWBOX,
  MAHARASHTRA_DISTRICT_CODES,
  MAHARASHTRA_DISTRICT_NAMES,
  MAHARASHTRA_SVG_PATHS,
} from '@/constants/maharashtra-svg-paths';
import { Compass, Landmark, Info, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

// Map 3-letter codes to district IDs in our constants file
const CODE_TO_ID: Record<string, string> = {
  NDB: 'nandurbar',
  DHU: 'dhule',
  JAL: 'jalgaon',
  NAS: 'nashik',
  AHM: 'ahilyanagar',
  THA: 'thane',
  PAL: 'palghar',
  MUM: 'mumbai-city',
  RAI: 'raigad',
  RAT: 'ratnagiri',
  SIN: 'sindhudurg',
  KOL: 'kolhapur',
  SAT: 'satara',
  SAN: 'sangli',
  PUN: 'pune',
  SOL: 'solapur',
  BEE: 'beed',
  OSM: 'dharashiv',
  LAT: 'latur',
  NAN: 'nanded',
  PAR: 'parbhani',
  HIN: 'hingoli',
  AUR: 'chhatrapati-sambhajinagar',
  JLN: 'jalna',
  BUL: 'buldhana',
  AKO: 'akola',
  WAS: 'washim',
  AMA: 'amravati',
  YAV: 'yavatmal',
  WAR: 'wardha',
  NAG: 'nagpur',
  GON: 'gondia',
  BHA: 'bhandara',
  CHA: 'chandrapur',
  GAD: 'gadchiroli',
};

// Curated colorful palette matching the user's uploaded reference image
const DISTRICT_COLORS: Record<string, string> = {
  NDB: '#9ade3f', // Nandurbar
  DHU: '#d6c0cc', // Dhule
  JAL: '#dfabf0', // Jalgaon
  NAS: '#76e053', // Nashik
  AHM: '#f5c6f0', // Ahmednagar
  THA: '#fae3cb', // Thane
  PAL: '#c74492', // Palghar
  MUM: '#fca15d', // Mumbai
  RAI: '#d6247c', // Raigad
  RAT: '#cf27a1', // Ratnagiri
  SIN: '#fcf0af', // Sindhudurg
  KOL: '#e019cc', // Kolhapur
  SAT: '#dbe62c', // Satara
  SAN: '#e67322', // Sangli
  PUN: '#fae373', // Pune
  SOL: '#f7dfd0', // Solapur
  BEE: '#e86154', // Beed
  OSM: '#faeed1', // Osmanabad / Dharashiv
  LAT: '#eb8f17', // Latur
  NAN: '#23295e', // Nanded
  PAR: '#c4357b', // Parbhani
  HIN: '#e8db1a', // Hingoli
  AUR: '#82cc43', // Aurangabad / Chhatrapati Sambhajinagar
  JLN: '#fca4f9', // Jalna
  BUL: '#fca9f1', // Buldana
  AKO: '#5ce87b', // Akola
  WAS: '#d91ac6', // Washim
  AMA: '#db147b', // Amravati
  YAV: '#e05948', // Yavatmal
  WAR: '#f0c24d', // Wardha
  NAG: '#e67326', // Nagpur
  GON: '#ede051', // Gondia
  BHA: '#95de3a', // Bhandara
  CHA: '#e64082', // Chandrapur
  GAD: '#c7cc9a', // Gadchiroli
};

// Hand-tuned coordinates inside the viewBox coordinates space (1132 -929.7 3105.8 2453)
// to display floating labels nicely over each district centroid.
const LABEL_CENTROIDS: Record<string, { x: number; y: number }> = {
  NDB: { x: 1720, y: -380 },
  DHU: { x: 1800, y: -220 },
  JAL: { x: 1980, y: -230 },
  NAS: { x: 1720, y: -100 },
  AHM: { x: 1850, y: 150 },
  THA: { x: 1590, y: 180 },
  PAL: { x: 1510, y: 80 },
  MUM: { x: 1515, y: 245 },
  RAI: { x: 1590, y: 350 },
  RAT: { x: 1610, y: 580 },
  SIN: { x: 1640, y: 790 },
  KOL: { x: 1780, y: 720 },
  SAT: { x: 1780, y: 460 },
  SAN: { x: 1880, y: 580 },
  PUN: { x: 1740, y: 300 },
  SOL: { x: 2000, y: 450 },
  BEE: { x: 2150, y: 250 },
  OSM: { x: 2280, y: 390 },
  LAT: { x: 2380, y: 320 },
  NAN: { x: 2520, y: 240 },
  PAR: { x: 2360, y: 120 },
  HIN: { x: 2420, y: 20 },
  AUR: { x: 2020, y: -20 },
  JLN: { x: 2180, y: -40 },
  BUL: { x: 2160, y: -200 },
  AKO: { x: 2300, y: -180 },
  WAS: { x: 2320, y: -80 },
  AMA: { x: 2460, y: -220 },
  YAV: { x: 2580, y: -80 },
  WAR: { x: 2700, y: -190 },
  NAG: { x: 2840, y: -220 },
  GON: { x: 3120, y: -240 },
  BHA: { x: 3000, y: -230 },
  CHA: { x: 2840, y: 40 },
  GAD: { x: 3100, y: 120 },
};

export function ExploreMaharashtra() {
  const [selectedCode, setSelectedCode] = useState<string>('NAS'); // Nashik by default
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Get active district data from constants matching selected code
  const selectedDistrict = useMemo<MHDistrict>(() => {
    const districtId = CODE_TO_ID[selectedCode] || 'nashik';
    return (
      MAHARASHTRA_DISTRICTS.find((d) => d.id === districtId) ||
      MAHARASHTRA_DISTRICTS.find((d) => d.id === 'nashik')!
    );
  }, [selectedCode]);

  const hoveredDistrictName = useMemo(() => {
    if (!hoveredCode) return null;
    return MAHARASHTRA_DISTRICT_NAMES[hoveredCode] || hoveredCode;
  }, [hoveredCode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left + 15, // 15px offset to the right of cursor
      y: e.clientY - rect.top + 15,  // 15px offset to the bottom of cursor
    });
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b1623] to-[#011D40] text-white relative overflow-hidden">
      {/* Background textures */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -left-40 bottom-10 w-80 h-80 bg-[#1D70B8]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* Section Header */}
        <div className="space-y-2 text-center lg:text-left">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#F26F21] block">
            Interactive City & District Map
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[var(--font-heading)]">
            Explore Maharashtra
          </h2>
          <p className="text-sm text-stone-400 max-w-xl font-medium">
            Click on any city or district tile to view its spiritual heritage, cities, tourist hotspots, and local details.
          </p>
        </div>

        {/* 2-Column Grid Layout (5 cols left, 7 cols right for larger map space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ─── LEFT PANEL: District Details ─── */}
          <div className="lg:col-span-5 space-y-6 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-2xl transition-all duration-300">

            {/* Title & Classification */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-3xl font-black tracking-tight text-white font-[var(--font-heading)]">
                  {selectedDistrict.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border text-[#b3d7ff] bg-[#1D70B8]/15 border-white/10">
                  {selectedDistrict.division} Division
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-[#F26F21]/30 text-[#F26F21] bg-[#F26F21]/5">
                  HQ: {selectedDistrict.headquarters}
                </span>
              </div>
              <p className="text-sm text-stone-300 leading-relaxed font-medium">
                {selectedDistrict.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-white/10 text-xs text-stone-300">
              
              {/* Spiritual Importance */}
              <div className="space-y-1.5">
                <span className="text-[#F26F21] font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1">
                  <Compass size={12} className="shrink-0" /> Spiritual Importance
                </span>
                <p className="leading-relaxed">{selectedDistrict.spiritualImportance}</p>
              </div>

              {/* Major Attractions */}
              <div className="space-y-1.5">
                <span className="text-[#F26F21] font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1">
                  <Landmark size={12} className="shrink-0" /> Major Attractions
                </span>
                <ul className="list-disc list-inside space-y-0.5">
                  {selectedDistrict.majorAttractions.map((attr) => (
                    <li key={attr} className="truncate">{attr}</li>
                  ))}
                </ul>
              </div>

              {/* Shrines Counter */}
              <div className="space-y-1.5">
                <span className="text-[#F26F21] font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1">
                  <MapPin size={12} className="shrink-0" /> Important Shrines
                </span>
                <p className="leading-relaxed">
                  Home to {selectedDistrict.templeCount} major temples and spiritual heritage spots.
                </p>
              </div>

              {/* Pilgrimage Sites */}
              <div className="space-y-1.5">
                <span className="text-[#F26F21] font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1">
                  <MapPin size={12} className="shrink-0" /> Nearby Pilgrimage Sites
                </span>
                <p className="leading-relaxed">
                  {selectedDistrict.nearbyPilgrimageSites.join(', ')}
                </p>
              </div>

              {/* Quick Fact Box */}
              <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <span className="text-[#F26F21] font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1">
                  <Info size={12} className="shrink-0" /> Interesting Fact
                </span>
                <p className="italic text-stone-200 leading-relaxed font-semibold">
                  "{selectedDistrict.interestingFact}"
                </p>
              </div>

            </div>

            {/* Redirect Button */}
            <div className="pt-6 border-t border-white/10 flex justify-center sm:justify-start">
              <a
                href="/account/discover-maharashtra"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-[#011D40] text-xs font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 select-none"
              >
                <span>Discover All Destinations</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

          {/* ─── RIGHT PANEL: High-Fidelity District Vector Map (Col span 7 for bigger size) ─── */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
            
            {/* Map Container - Larger sizing (max-w-[620px] and tracking mouse move for tooltip) */}
            <div 
              onMouseMove={handleMouseMove}
              className="relative w-full max-w-[620px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#09111c]/60 p-4"
            >
              
              <svg
                viewBox="1100 -620 2250 1700"
                className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {MAHARASHTRA_DISTRICT_CODES.map((code) => {
                  const isActive = selectedCode === code;
                  const isHovered = hoveredCode === code;
                  const pathData = MAHARASHTRA_SVG_PATHS[code];

                  if (!pathData) return null;

                  return (
                    <g key={code} className="group cursor-pointer">
                      
                      {/* District Tile Shape */}
                      <path
                        d={pathData}
                        onClick={() => setSelectedCode(code)}
                        onMouseEnter={() => setHoveredCode(code)}
                        onMouseLeave={() => setHoveredCode(null)}
                        className="transition-all duration-300 ease-out select-none"
                        style={{
                          fill: isActive 
                            ? '#ffffff' 
                            : isHovered 
                              ? '#ffffff' 
                              : DISTRICT_COLORS[code] || '#1D70B8', 
                          stroke: '#000000',
                          strokeWidth: isActive ? 4.5 : isHovered ? 3.5 : 1.2,
                          strokeOpacity: 0.9,
                          transformBox: 'fill-box',
                          transformOrigin: 'center center',
                          transform: isHovered || isActive ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                          filter: isHovered || isActive ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.45))' : 'none',
                        }}
                      />

                    </g>
                  );
                })}
              </svg>

              {/* Cursor-tracking HTML Floating Tooltip Box */}
              {hoveredDistrictName && (
                <div 
                  className="absolute z-50 pointer-events-none bg-slate-900/90 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded shadow-xl border border-white/20 select-none animate-fadeIn transition-all duration-75"
                  style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`,
                  }}
                >
                  {hoveredDistrictName}
                </div>
              )}

            </div>

            {/* Quick Navigation Quick Links */}
            <div className="text-center space-y-1.5 select-none w-full max-w-[620px]">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {['NAS', 'PUN', 'MUM', 'AUR', 'NAG', 'KOL'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedCode(code)}
                    className={cn(
                      'text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded border transition-all cursor-pointer',
                      selectedCode === code
                        ? 'bg-white text-[#011D40] border-white'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                    )}
                  >
                    {MAHARASHTRA_DISTRICT_NAMES[code]}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default ExploreMaharashtra;
