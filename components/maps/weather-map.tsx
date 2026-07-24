'use client';

/**
 * @file WeatherMap component
 * @description Client-only Leaflet map for displaying real-time temperatures
 * and weather conditions across Maharashtra\'s districts. Clicking a district
 * triggers navigation to its detailed forecast page.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { WeatherDistrict } from '@/constants/weather-data';
import { cn } from '@/utils/cn';

// ============================================================
// CUSTOM TEMPERATURE LABEL ICON
// ============================================================

const createWeatherMarker = (name: string, temp: number, condition: string) => {
  let emoji = '☀️';
  if (condition === 'Rain') emoji = '🌧️';
  else if (condition === 'Cloudy') emoji = '☁️';
  else if (condition === 'Thunderstorm') emoji = '⛈️';
  else if (condition === 'Heatwave') emoji = '🔥';
  else if (condition === 'Cold') emoji = '❄️';
  else if (condition === 'Windy') emoji = '💨';

  return L.divIcon({
    html: `
      <div class="flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-200 cursor-pointer">
        <div class="px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-[#011D40]/95 border border-gov-blue-900/20 shadow-md text-center">
          <div class="text-[9px] font-extrabold uppercase tracking-wider text-[#8A8A8A] leading-none">${name}</div>
          <div class="flex items-center gap-1 mt-0.5 justify-center">
            <span class="text-xs">${emoji}</span>
            <span class="text-xs font-bold text-[#022B5D] dark:text-gold-300 leading-none">${temp}°C</span>
          </div>
        </div>
      </div>
    `,
    className: 'bg-transparent border-0',
    iconSize: [60, 42],
    iconAnchor: [30, 21]
  });
};

// ============================================================
// COMPONENT
// ============================================================

export interface WeatherMapProps {
  districts: WeatherDistrict[];
  className?: string;
}

export function WeatherMap({ districts, className }: WeatherMapProps) {
  const router = useRouter();

  const defaultCenter = { lat: 19.60, lng: 75.30 };
  const defaultZoom = 7;

  const handleDistrictClick = (slug: string) => {
    router.push(`/weather/${slug}`);
  };

  return (
    <div className={cn('relative w-full h-[500px] rounded-2xl overflow-hidden border border-stone-grey-100 dark:border-white/5 shadow-inner', className)}>
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

        {/* Boundary Polygons with click navigation */}
        {districts.map((dist) => {
          // Fallback simple square boundaries if full polygon details aren't configured
          // (Nashik, Ahmednagar, Mumbai, Pune have actual polygon structures mapped)
          const fallbackPolygon: [number, number][] = [
            [dist.coordinates.lat + 0.15, dist.coordinates.lng - 0.15],
            [dist.coordinates.lat + 0.15, dist.coordinates.lng + 0.15],
            [dist.coordinates.lat - 0.15, dist.coordinates.lng + 0.15],
            [dist.coordinates.lat - 0.15, dist.coordinates.lng - 0.15],
          ];

          const coordinatesList = dist.id.startsWith('wd-gen-') 
            ? fallbackPolygon 
            : (dist.slug === 'nashik' ? [
                [20.55, 73.30], [20.80, 73.80], [20.30, 74.45], [19.65, 74.55], [19.45, 73.90], [19.70, 73.30]
              ] : dist.slug === 'ahilyanagar' ? [
                [19.90, 74.30], [19.95, 74.80], [19.10, 75.20], [18.45, 75.00], [18.70, 74.20], [19.45, 73.90]
              ] : dist.slug === 'mumbai-city' ? [
                [19.25, 72.75], [19.28, 72.95], [18.90, 72.88], [18.90, 72.78]
              ] : [
                [19.25, 73.35], [19.30, 73.90], [18.70, 74.80], [17.90, 74.45], [18.05, 73.35]
              ]) as [number, number][];

          return (
            <Polygon
              key={`poly-${dist.id}`}
              positions={coordinatesList}
              eventHandlers={{
                click: () => handleDistrictClick(dist.slug)
              }}
              pathOptions={{
                color: dist.currentWeather.condition === 'Rain' ? '#3B82F6' :
                             dist.currentWeather.condition === 'Thunderstorm' ? '#8B5CF6' :
                             dist.currentWeather.condition === 'Sunny' ? '#F59E0B' : '#6B7280',
                fillColor: dist.currentWeather.condition === 'Rain' ? '#3B82F6' :
                                 dist.currentWeather.condition === 'Thunderstorm' ? '#8B5CF6' :
                                 dist.currentWeather.condition === 'Sunny' ? '#F59E0B' : '#6B7280',
                fillOpacity: 0.05,
                weight: 1.0,
                dashArray: '2, 3'
              }}
            >
              <Tooltip sticky>
                <div className="text-xs p-1 space-y-1">
                  <h4 className="font-bold text-[#022B5D]">{dist.name}</h4>
                  <p className="text-[10px] text-stone-grey-500 font-semibold">
                    Condition: {dist.currentWeather.condition} ({dist.currentWeather.tempCelsius}°C)
                  </p>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Clickable Temperature labels */}
        {districts.map((dist) => (
          <Marker
            key={`marker-${dist.id}`}
            position={[dist.coordinates.lat, dist.coordinates.lng]}
            icon={createWeatherMarker(dist.name, dist.currentWeather.tempCelsius, dist.currentWeather.condition)}
            eventHandlers={{
              click: () => handleDistrictClick(dist.slug)
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default WeatherMap;
