'use client';

/**
 * @file DistrictDetailClient component
 * @description Client-only view component displaying detailed meteorological metrics,
 * forecasts, AQI, and pilgrim advisories.
 */

import Link from 'next/link';
import { 
  ArrowLeft, 
  CloudRain, 
  Droplet, 
  Wind, 
  AlertTriangle, 
  Eye,
  Activity,
  UserCheck,
  TrendingUp,
  Clock,
  Sparkles,
  HelpCircle,
  Sunset,
  Sunrise,
  Calendar,
  Compass,
  Info
} from 'lucide-react';
import { WeatherDistrict, CONDITION_COLORS } from '@/constants/weather-data';
import { getWeatherIcon } from '@/app/weather/page';
import { cn } from '@/utils/cn';

interface DistrictDetailClientProps {
  dist: WeatherDistrict;
}

export function DistrictDetailClient({ dist }: DistrictDetailClientProps) {
  const current = dist.currentWeather;
  const colorClasses = CONDITION_COLORS[current.condition] || '';

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/weather"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Back to Weather Dashboard</span>
        </Link>
      </div>

      {/* MAIN DISTRICT DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Current Condition & Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CURRENT WEATHER PRIMARY CARD */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#005BAC]">
                  District Forecast
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-[var(--font-heading)]">
                  {dist.name} District
                </h1>
                <p className="text-xs text-[#6B7280]">
                  Last Updated: {current.lastUpdated} (MET Office feed)
                </p>
              </div>

              <span className={cn('px-3 py-1 rounded-xl text-xs font-extrabold uppercase border', colorClasses)}>
                {current.condition}
              </span>
            </div>

            {/* Primary Temp Indicator */}
            <div className="flex items-center gap-6 py-2">
              <div className="text-5xl sm:text-6xl font-black text-[#111827] tracking-tight leading-none">
                {current.tempCelsius}°C
              </div>
              <div className="w-16 h-16 rounded-full bg-[#FAFBFC] flex items-center justify-center border border-[#E5E7EB]">
                {getWeatherIcon(current.icon, 'w-10 h-10')}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Feels like {current.tempCelsius - 1}°C
                </h3>
                <p className="text-xs text-[#6B7280] leading-normal">
                  High humidity levels might increase apparent temperature indices.
                </p>
              </div>
            </div>

            {/* Secondary stats grid (Sunrise, Sunset, Visibility, UV Index) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E5E7EB] pt-6 text-xs text-[#374151]">
              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center gap-3">
                <Sunrise size={16} className="text-[#FF9933] flex-shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7280]">Sunrise</span>
                  <p className="font-bold text-[#111827]">{dist.sunrise}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center gap-3">
                <Sunset size={16} className="text-[#FF9933] flex-shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7280]">Sunset</span>
                  <p className="font-bold text-[#111827]">{dist.sunset}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center gap-3">
                <Eye size={16} className="text-[#005BAC] flex-shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7280]">Visibility</span>
                  <p className="font-bold text-[#111827]">{current.visibilityKm} km</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center gap-3">
                <TrendingUp size={16} className="text-purple-500 flex-shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7280]">UV Index</span>
                  <p className="font-bold text-[#111827]">{current.uvIndex} (High)</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: EMERGENCY WEATHER ALERTS SPECIFIC CARD */}
          {dist.alerts.length > 0 ? (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 shadow-sm space-y-2 text-left animate-fadeIn">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle size={16} className="animate-pulse" />
                <span>Emergency Warning Active</span>
              </div>
              {dist.alerts.map((alert) => (
                <div key={alert.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111827]">{alert.category}</span>
                    <span className="text-[9px] text-[#6B7280]">Issued {alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#374151] leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F0FDF4] text-xs font-bold text-[#2E7D32] border border-[#DCFCE7] flex items-center gap-2">
              <UserCheck size={16} />
              <span>No active weather alerts or storm warnings in this district. Safety metrics nominal.</span>
            </div>
          )}

          {/* HOURLY FORECAST (Today's Track) */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={16} className="text-[#005BAC]" />
              <span>Hourly Forecast (Today's Trend)</span>
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {dist.hourlyForecast.map((hour, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 w-24 p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex flex-col items-center gap-1.5 text-center"
                >
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase">{hour.time}</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E5E7EB]">
                    {getWeatherIcon(hour.icon, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-bold text-[#111827]">{hour.tempCelsius}°C</span>
                  <span className="text-[8px] text-[#6B7280] font-semibold truncate max-w-full">{hour.condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-DAY WEATHER FORECAST LIST */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={16} className="text-[#005BAC]" />
              <span>7-Day Meteorological Outlook</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {dist.forecast.map((day, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-between shadow-sm"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#111827]">{day.date}</span>
                    <p className="text-[10px] text-[#6B7280] leading-none">{day.condition}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="flex items-center gap-1">
                      <CloudRain size={12} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-[#6B7280]">{day.rainProbability}%</span>
                    </div>
                    <span className="font-bold text-[#111827] min-w-[45px]">
                      {day.tempMin}° / {day.tempMax}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Air Quality, Advisories & Impact */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AIR QUALITY INDEX */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={16} className="text-[#005BAC]" />
              <span>Air Quality Index</span>
            </h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#6B7280]">AQI Index</span>
                <div className="text-2xl font-extrabold text-[#2E7D32] leading-none">
                  {dist.airQuality.aqi}
                </div>
                <p className="text-[10px] text-[#6B7280] leading-normal">
                  Air quality is optimal for elderly and children.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-[#2E7D32] text-white font-extrabold text-[9px] uppercase tracking-widest">
                {dist.airQuality.status}
              </span>
            </div>
          </div>

          {/* SECTION 8: PILGRIMAGE ADVISORY */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#005BAC] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#005BAC]" />
              <span>What Should Pilgrims Know Today?</span>
            </h3>

            <div className="space-y-3">
              {dist.pilgrimAdvisory.map((adv, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#374151] leading-relaxed">
                  <HelpCircle size={14} className="text-[#FF9933] flex-shrink-0 mt-0.5" />
                  <p>{adv}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TRAVEL ADVISORY */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#005BAC] uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={16} className="text-[#005BAC]" />
              <span>Official Travel Advisory</span>
            </h3>

            <div className="space-y-3">
              {dist.travelAdvisory.map((adv, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#374151] leading-relaxed">
                  <Info size={14} className="text-[#005BAC] flex-shrink-0 mt-0.5" />
                  <p>{adv}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FUTURE CROWD WEATHER IMPACT CARD */}
          <div className="p-6 rounded-2xl bg-[#FAFBFC] border border-[#E5E7EB] shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#005BAC] flex items-center gap-1.5">
              <TrendingUp size={14} />
              <span>Crowd Weather Impact Index</span>
            </h4>
            <p className="text-xs text-[#374151] leading-relaxed">
              {dist.crowdWeatherImpact}
            </p>
            <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold bg-[#FAFBFC] p-2 rounded border border-[#E5E7EB]">
              Forecast integration pending live crowd telemetry feed.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
