'use client';

/**
 * @file Weather Dashboard Page
 * @description Provides a comprehensive overview of real-time meteorological metrics,
 * alerts, forecasts, and travel advisories across all 36 districts of Maharashtra.
 * Supports Search autocomplete, layer filtering, and grid vs map toggling.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Map, 
  LayoutGrid, 
  CloudSun, 
  Droplet, 
  Wind, 
  AlertTriangle, 
  TrendingUp, 
  Compass, 
  ChevronRight,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Thermometer,
  Snowflake,
  ShieldAlert,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { 
  WEATHER_DISTRICTS_DATA, 
  WeatherDistrict, 
  CONDITION_COLORS, 
  WeatherAlert 
} from '@/constants/weather-data';
import { WeatherMapWrapper } from '@/components/maps/weather-map-wrapper';
import { cn } from '@/utils/cn';

// ============================================================
// HELPER TO RENDER WEATHER ICONS DYNAMICALLY
// ============================================================

export function getWeatherIcon(iconName: string, className?: string) {
  switch (iconName) {
    case 'Sun':
      return <Sun className={cn('text-amber-500', className)} />;
    case 'CloudRain':
      return <CloudRain className={cn('text-blue-500', className)} />;
    case 'CloudLightning':
      return <CloudLightning className={cn('text-purple-500', className)} />;
    case 'Wind':
      return <Wind className={cn('text-slate-500', className)} />;
    case 'Snowflake':
      return <Snowflake className={cn('text-indigo-400', className)} />;
    case 'Thermometer':
      return <Thermometer className={cn('text-red-500', className)} />;
    case 'Cloud':
    default:
      return <Cloud className={cn('text-sky-400', className)} />;
  }
}

// Helper to resolve alert priority styling
const getAlertPriorityClasses = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'high':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'medium':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function WeatherForecastPortal() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Filter chips definitions
  const FILTER_OPTIONS = [
    { value: 'all', label: 'All Conditions' },
    { value: 'Sunny', label: 'Sunny' },
    { value: 'Cloudy', label: 'Cloudy' },
    { value: 'Rain', label: 'Rainy' },
    { value: 'Thunderstorm', label: 'Thunderstorms' },
    { value: 'Heatwave', label: 'Heatwave' },
    { value: 'Cold', label: 'Cold Wave' },
    { value: 'Windy', label: 'Windy' }
  ];

  // Filtering & Search logic
  const filteredDistricts = useMemo(() => {
    return WEATHER_DISTRICTS_DATA.filter((dist) => {
      // 1. Condition Filter Check
      const matchesFilter = 
          selectedFilter === 'all' || dist.currentWeather.condition === selectedFilter;

      // 2. Search Autocomplete Match (Name, Coordinates, Advisories)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
          q === '' ||
          dist.name.toLowerCase().includes(q) ||
          dist.pilgrimAdvisory.some((adv) => adv.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  // Aggregate active alert tickets across all districts
  const activeAlerts = useMemo(() => {
    const alertsList: (WeatherAlert & { districtName: string; districtSlug: string })[] = [];
    WEATHER_DISTRICTS_DATA.forEach((dist) => {
      dist.alerts.forEach((alert) => {
        alertsList.push({
          ...alert,
          districtName: dist.name,
          districtSlug: dist.slug
        });
      });
    });
    return alertsList;
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827]">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-12">
          
          {/* SECTION 1: HEADER */}
          <div className="text-center space-y-4">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#FF9933] bg-[#FFF5EB] px-3.5 py-1.5 rounded-full border border-[#FF9933]/25 inline-block">
              Meteorological Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)] leading-tight">
              Maharashtra Weather Forecast
            </h1>
            <p className="text-sm sm:text-base text-[#374151] max-w-2xl mx-auto leading-relaxed">
              Check current weather conditions and forecast for every district before planning your pilgrimage.
            </p>
          </div>

          {/* SECTION 7: CRITICAL WEATHER ALERTS BANNER BAR (IF ANY ALERT ACTIVE) */}
          {activeAlerts.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert size={16} className="animate-bounce" />
                <span>Active Met Office Alerts & Travel Warnings ({activeAlerts.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAlerts.map((alert) => (
                  <Link 
                    key={alert.id} 
                    href={`/weather/${alert.districtSlug}`}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white border border-red-200 hover:border-red-500 transition-colors text-left shadow-sm"
                  >
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111827]">
                          {alert.districtName} District
                        </span>
                        <span className={cn('px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border', getAlertPriorityClasses(alert.priority))}>
                          {alert.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#374151] leading-normal">
                        {alert.message}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CONTROLS BAR: SEARCH, FILTERS, TOGGLE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative z-30">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district, city or advice..."
                className="w-full pl-11 pr-10 py-3 rounded-xl text-sm font-medium border transition-all duration-200 outline-none bg-white border-[#E5E7EB] text-[#111827] focus:border-[#005BAC]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#111827] bg-transparent border-none cursor-pointer outline-none"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Chips list */}
            <div className="lg:col-span-6 flex flex-wrap items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFilter(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer',
                    selectedFilter === opt.value
                      ? 'bg-[#005BAC] border-[#005BAC] text-white shadow-sm'
                      : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#374151] hover:border-[#005BAC]/30'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Toggle view mode */}
            <div className="lg:col-span-2 flex items-center justify-end">
              <div className="flex rounded-xl bg-[#FAFBFC] p-1 border border-[#E5E7EB] w-full sm:w-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 border-none bg-transparent cursor-pointer',
                    viewMode === 'grid'
                      ? 'bg-white text-[#005BAC] shadow-sm border border-[#E5E7EB]'
                      : 'text-[#374151] hover:text-[#111827]'
                  )}
                >
                  <LayoutGrid size={14} />
                  <span>Grid View</span>
                </button>
                
                <button
                  onClick={() => setViewMode('map')}
                  className={cn(
                    'flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 border-none bg-transparent cursor-pointer',
                    viewMode === 'map'
                      ? 'bg-white text-[#005BAC] shadow-sm border border-[#E5E7EB]'
                      : 'text-[#374151] hover:text-[#111827]'
                  )}
                >
                  <Map size={14} />
                  <span>Map View</span>
                </button>
              </div>
            </div>

          </div>

          {/* VIEW SWITCHER CONTENT CONTAINER */}
          <div className="min-h-[400px]">
            {viewMode === 'map' ? (
              /* SECTION 5: MAP VIEW METEOROLOGICAL MODULE */
              <WeatherMapWrapper districts={filteredDistricts} />
            ) : (
              /* SECTION 3: DISTRICT WEATHER CARDS GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDistricts.map((dist) => {
                  const current = dist.currentWeather;
                  const colorClasses = CONDITION_COLORS[current.condition] || '';

                  return (
                    <Link
                      key={dist.id}
                      href={`/weather/${dist.slug}`}
                      className="group p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col justify-between hover:shadow-premium hover:border-[#005BAC]/30 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
                    >
                      {/* Name & updated status */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-extrabold text-base text-[#111827] font-[var(--font-heading)]">
                            {dist.name}
                          </h3>
                          <span className="text-[9px] text-[#6B7280]">
                            Updated {current.lastUpdated}
                          </span>
                        </div>

                        {/* Condition Badge */}
                        <span className={cn('px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border', colorClasses)}>
                          {current.condition}
                        </span>
                      </div>

                      {/* Temperature & Large Icon */}
                      <div className="flex items-center justify-between my-4">
                        <div className="text-3xl font-extrabold text-[#111827] tracking-tight">
                          {current.tempCelsius}°C
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-center">
                          {getWeatherIcon(current.icon, 'w-6 h-6')}
                        </div>
                      </div>

                      {/* Small Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 border-t border-[#E5E7EB] pt-3 text-[10px] font-bold text-[#374151]">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-[#6B7280]">Humidity</span>
                          <span className="text-[#374151] mt-0.5 flex items-center gap-0.5 font-semibold">
                            <Droplet size={10} className="text-blue-500" />
                            {current.humidity}%
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-[#6B7280]">Wind</span>
                          <span className="text-[#374151] mt-0.5 flex items-center gap-0.5 font-semibold">
                            <Wind size={10} className="text-slate-400" />
                            {current.windSpeedKmh}kph
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-[#6B7280]">Rain Prob</span>
                          <span className="text-[#374151] mt-0.5 flex items-center gap-0.5 font-semibold">
                            <CloudRain size={10} className="text-blue-500" />
                            {current.rainProbability}%
                          </span>
                        </div>
                      </div>

                      {/* Explore buttons */}
                      <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] font-bold text-[#005BAC] group-hover:text-[#FF9933] transition-colors">
                        <span>DETAILED FORECAST</span>
                        <ChevronRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {filteredDistricts.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center p-12 gap-3 rounded-2xl bg-white border border-[#E5E7EB] min-h-[400px]">
                <CloudSun size={48} className="text-[#6B7280] animate-pulse" />
                <h3 className="font-bold text-lg text-[#111827]">No Districts Found</h3>
                <p className="text-xs text-[#6B7280] max-w-sm leading-normal">
                  No weather metrics match your search query or condition filters. Please update filter choices.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
