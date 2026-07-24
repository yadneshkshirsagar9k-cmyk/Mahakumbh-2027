'use client';

/**
 * @file WeatherMapWrapper component
 * @description Parent wrapper that dynamically loads the WeatherMap component
 * with ssr: false, preventing pre-rendering failures. Renders a loading
 * skeleton when downloading scripts.
 */

import dynamic from 'next/dynamic';
import { WeatherMapProps } from './weather-map';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// Dynamically import client-only WeatherMap
const ClientWeatherMap = dynamic(
  () => import('./weather-map').then((mod) => mod.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#EFEFEF] dark:bg-[#011D40] rounded-2xl border border-dashed border-stone-grey-300 dark:border-white/10 animate-pulse min-h-[500px]">
        <Loader2 className="animate-spin text-[#F26F21]" size={36} />
        <span className="text-sm font-semibold text-[#022B5D] dark:text-[#FAF0E1] tracking-wide">
          Loading Meteorological GIS Engine...
        </span>
      </div>
    )
  }
);

export function WeatherMapWrapper(props: WeatherMapProps) {
  return <ClientWeatherMap {...props} />;
}

export default WeatherMapWrapper;
