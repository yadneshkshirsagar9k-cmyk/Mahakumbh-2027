'use client';

/**
 * @file RegistrationNetwork component
 * @description The main homepage section container for the Physical Registration Network.
 * Integrates search input, layer filter chips, map legend, Leaflet GIS map,
 * and a right information details panel.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Accessibility, 
  X, 
  Filter, 
  Compass, 
  Info,
  Map,
  Users,
  QrCode,
  Shield,
  Layers,
  ChevronDown
} from 'lucide-react';
import { 
  REGISTRATION_CENTRES_DATA, 
  RegistrationCentre, 
  CentreCategory, 
  CATEGORY_METADATA 
} from '@/constants/registration-centres';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';
import { MapWrapper } from '@/components/maps/map-wrapper';
import { cn } from '@/utils/cn';
import { motionVariants, motionTransitions } from '@/lib/animations';
import { LOCATION_CONFIG, navigateToCoordinates } from '@/constants/location-config';

const getCentrePlaceId = (name: string) => {
  if (name.includes('Nashik Road Railway')) return LOCATION_CONFIG.NASHIK_ROAD_STATION.placeId;
  if (name.includes('Thakkar Bazar')) return LOCATION_CONFIG.THAKKAR_BAZAR_BUS.placeId;
  if (name.includes('CSMT')) return LOCATION_CONFIG.MUMBAI_CSMT.placeId;
  if (name.includes('Pune Junction')) return LOCATION_CONFIG.PUNE_STATION.placeId;
  if (name.includes('Ozar Airport')) return LOCATION_CONFIG.OZAR_AIRPORT.placeId;
  if (name.includes('Collectorate Office')) return LOCATION_CONFIG.COLLECTORATE_OFFICE.placeId;
  if (name.includes('Sadhugram Sector 1')) return LOCATION_CONFIG.SADHVUGRAM_BOOTH.placeId;
  if (name.includes('Ambedkar Airport')) return LOCATION_CONFIG.NAGPUR_AIRPORT.placeId;
  if (name.includes('Sainagar Shirdi')) return LOCATION_CONFIG.SHIRDI_STATION.placeId;
  if (name.includes('Ram Kund Police')) return LOCATION_CONFIG.RAMKUND_POLICE.placeId;
  return undefined;
};

export function RegistrationNetwork() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCentre, setSelectedCentre] = useState<RegistrationCentre | null>(null);
  
  // Mobile UI collapsible states
  const [legendOpen, setLegendOpen] = useState(true);

  // Filter chips definitions
  const FILTER_OPTIONS = [
    { value: 'all', label: 'All Layers' },
    { value: 'railway', label: 'Railway Stations' },
    { value: 'bus', label: 'Bus Stands' },
    { value: 'airport', label: 'Airports' },
    { value: 'government', label: GOVERNMENT_PORTAL_ENABLED ? 'Govt Centres' : 'Official Centres' },
    { value: 'medical', label: 'Medical Screening' },
    { value: 'police', label: 'Police Help' },
    { value: 'info', label: 'Info Centres' }
  ];

  // Filtering & Search Logic
  const filteredCentres = useMemo(() => {
    return REGISTRATION_CENTRES_DATA.filter((centre) => {
      // 1. Category Filter Check
      const matchesCategory = 
        selectedCategory === 'all' || centre.category === selectedCategory;

      // 2. Search Query Check (Centre Name, District, City, Address)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        centre.name.toLowerCase().includes(q) ||
        centre.district.toLowerCase().includes(q) ||
        centre.city.toLowerCase().includes(q) ||
        centre.address.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Select first item if current selection is filtered out
  const activeSelection = useMemo(() => {
    if (!selectedCentre) return null;
    const stillExists = filteredCentres.some((c) => c.id === selectedCentre.id);
    return stillExists ? selectedCentre : null;
  }, [selectedCentre, filteredCentres]);

  // Clean filters
  const handleResetSearch = () => {
    setSearchQuery('');
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFBFC] border-t border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* SECTION 1: HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#005BAC] bg-[#005BAC]/10 px-3.5 py-1.5 rounded-full border border-[#005BAC]/20 inline-block">
            GIS Locator
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)]">
            Physical Registration Network
          </h2>
          <p className="text-sm sm:text-base text-[#374151] max-w-2xl mx-auto leading-relaxed">
            Locate official Mahakumbh registration centres across Maharashtra before beginning your pilgrimage.
          </p>
        </div>

        {/* SECTION 5 & 6: FILTERS & SEARCH ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
          {/* Search bar */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by District, City, or Station..."
              className={cn(
                'w-full pl-11 pr-10 py-3 rounded-xl text-sm font-medium border transition-all duration-200 outline-none',
                'bg-[#FAFBFC] border-[#E5E7EB] text-[#111827]',
                'focus:border-[#005BAC]'
              )}
            />
            {searchQuery && (
              <button 
                onClick={handleResetSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#111827]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Chips list */}
          <div className="lg:col-span-8 flex flex-wrap items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <Filter size={14} className="text-[#005BAC] mr-1 hidden sm:inline" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedCategory(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 border',
                  selectedCategory === opt.value
                    ? 'bg-[#005BAC] border-[#005BAC] text-white shadow-sm'
                    : 'bg-white border-[#E5E7EB] text-[#374151] hover:bg-[#F5F7FA]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DISPLAY MODULE: Map Area & Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px]">
          
          {/* LEFT: Map + Legend Container */}
          <div className="lg:col-span-8 relative flex flex-col h-[500px] lg:h-auto rounded-2xl overflow-hidden shadow-md">
            
            {/* Dynamic Map Wrapper */}
            <MapWrapper
              centres={filteredCentres}
              selectedCentre={activeSelection}
              onSelectCentre={(centre) => setSelectedCentre(centre)}
            />

            {/* SECTION 7: FLOATING LEGEND */}
            <div className="absolute bottom-4 left-4 z-20 max-w-[280px]">
              <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-sm">
                <button
                  onClick={() => setLegendOpen(!legendOpen)}
                  className="w-full flex items-center justify-between font-bold text-[10px] uppercase tracking-wider text-[#111827] focus:outline-none"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers size={12} className="text-[#005BAC]" />
                    Map Legend
                  </span>
                  <ChevronDown size={12} className={cn('transition-transform duration-200', legendOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {legendOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 space-y-2 border-t border-[#E5E7EB] pt-2 text-[10px] text-[#374151]"
                    >
                      {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                          <span className="font-semibold">{meta.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Empty search results notification inside map wrapper */}
            {filteredCentres.length === 0 && (
              <div className="absolute inset-0 bg-[#EFEFEF]/80 z-20 flex flex-col items-center justify-center text-center p-6 gap-2">
                <Map size={36} className="text-[#6B7280] animate-pulse" />
                <h4 className="font-bold text-sm text-[#111827]">No Centres Found</h4>
                <p className="text-xs text-[#374151] max-w-xs leading-normal">
                  No registration offices match your active filter search parameters. Please refine your inputs.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 8: RIGHT REUSABLE INFORMATION PANEL */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-grow rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <AnimatePresence mode="wait">
                {activeSelection ? (
                  <motion.div
                    key={activeSelection.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 h-full flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white',
                          activeSelection.category === 'medical' ? 'bg-red-500' :
                          activeSelection.category === 'police' ? 'bg-slate-600' :
                          activeSelection.category === 'government' ? 'bg-emerald-600' :
                          'bg-gov-blue-500'
                        )}>
                          {CATEGORY_METADATA[activeSelection.category].label}
                        </span>
                        
                        {/* Live Status indicator */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>LIVE</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-[#111827] font-[var(--font-heading)] leading-snug">
                        {activeSelection.name}
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {activeSelection.district} District • {activeSelection.city}
                      </p>
                    </div>

                    {/* Meta Lists */}
                    <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-[#005BAC] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Address</h4>
                          <p className="text-xs text-[#374151]">{activeSelection.address}</p>
                        </div>
                      </div>

                      {/* Timings */}
                      <div className="flex items-start gap-3">
                        <Clock size={16} className="text-[#005BAC] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Operating Hours</h4>
                          <p className="text-xs text-[#374151]">{activeSelection.operatingHours}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-[#005BAC] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Contact Hotline</h4>
                          <p className="text-xs text-[#374151]">{activeSelection.contactNumber}</p>
                        </div>
                      </div>

                      {/* Accessibility */}
                      <div className="flex items-start gap-3">
                        <Accessibility size={16} className="text-[#005BAC] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Accessibility Services</h4>
                          <p className="text-xs text-[#374151]">{activeSelection.accessibility}</p>
                        </div>
                      </div>
                    </div>

                    {/* Services Checklist */}
                    <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Available Services</h4>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {activeSelection.availableServices.map((service, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-[#374151]">
                            <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Future Indicators Overlay (Visual Placeholders) */}
                    <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#E5E7EB] text-[10px] font-bold text-[#6B7280]">
                      <div className="p-2 rounded-lg bg-[#F5F7FA] flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-[#6B7280]">Queue Status</span>
                          <span className="text-emerald-600 mt-0.5">{activeSelection.futureQueueTime}</span>
                        </div>
                        <Users size={12} />
                      </div>

                      <div className="p-2 rounded-lg bg-[#F5F7FA] flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-[#6B7280]">Crowd State</span>
                          <span className="text-amber-600 mt-0.5 uppercase">{activeSelection.futureCrowdDensity}</span>
                        </div>
                        <Info size={12} />
                      </div>
                    </div>

                    {/* Navigate/Register Action */}
                    <div className="pt-6">
                      <button
                        onClick={() => navigateToCoordinates(activeSelection.coordinates.lat, activeSelection.coordinates.lng)}
                        className={cn(
                          'w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded',
                          'text-xs font-bold uppercase tracking-wider text-white',
                          'bg-[#005BAC] hover:bg-[#0F4C81]',
                          'shadow-sm transition-all duration-200 active:scale-[0.98]'
                        )}
                      >
                        <Compass size={14} />
                        <span>Navigate to Centre</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#005BAC]/10 text-[#005BAC]">
                      <MapPin size={22} />
                    </div>
                    <h3 className="font-bold text-sm text-[#111827] font-[var(--font-heading)]">
                      Select Registration Centre
                    </h3>
                    <p className="text-xs text-[#6B7280] max-w-xs leading-normal">
                      Click any pulsing marker on the Maharashtra map to load live coordinates, available services, timings, and queue forecasts.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default RegistrationNetwork;
