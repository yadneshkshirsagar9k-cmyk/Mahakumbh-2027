'use client';

/**
 * @file MapWrapper component
 * @description Parent wrapper that dynamically loads the LeafletMap component
 * with ssr: false, preventing pre-rendering failures. Renders a loading
 * skeleton when downloading Leaflet scripts.
 */

import dynamic from 'next/dynamic';
import { LeafletMapProps } from './leaflet-map';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// Dynamically import client-only LeafletMap
const ClientMap = dynamic(
  () => import('./leaflet-map').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#EFEFEF] dark:bg-[#011D40] rounded-2xl border border-dashed border-stone-grey-300 dark:border-white/10 animate-pulse">
        <Loader2 className="animate-spin text-[#F26F21]" size={36} />
        <span className="text-sm font-semibold text-[#022B5D] dark:text-[#FAF0E1] tracking-wide">
          Loading GIS Engine...
        </span>
      </div>
    )
  }
);

export function MapWrapper(props: LeafletMapProps) {
  return <ClientMap {...props} />;
}

export default MapWrapper;
