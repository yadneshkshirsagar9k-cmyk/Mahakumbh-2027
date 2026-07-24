'use client';

/**
 * @file EmergencyMapWrapper component
 * @description Parent wrapper that dynamically loads the EmergencyMap component
 * with ssr: false, preventing pre-rendering failures. Renders a loading
 * skeleton when downloading scripts.
 */

import dynamic from 'next/dynamic';
import { EmergencyMapProps } from './emergency-map';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// Dynamically import client-only EmergencyMap
const ClientEmergencyMap = dynamic(
  () => import('./emergency-map').then((mod) => mod.EmergencyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#EFEFEF] dark:bg-[#011D40] rounded-2xl border border-dashed border-stone-grey-300 dark:border-white/10 animate-pulse min-h-[400px]">
        <Loader2 className="animate-spin text-red-500" size={36} />
        <span className="text-sm font-semibold text-red-600 dark:text-[#FAF0E1] tracking-wide">
          Loading Emergency GIS Layer...
        </span>
      </div>
    )
  }
);

export function EmergencyMapWrapper(props: EmergencyMapProps) {
  return <ClientEmergencyMap {...props} />;
}

export default EmergencyMapWrapper;
