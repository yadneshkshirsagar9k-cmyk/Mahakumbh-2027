'use client';

/**
 * @file DistrictMapWrapper component
 * @description Parent wrapper that dynamically loads the DistrictMap component
 * with ssr: false, preventing pre-rendering failures. Renders a loading
 * skeleton when downloading scripts.
 */

import dynamic from 'next/dynamic';
import { DistrictMapProps } from './district-map';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// Dynamically import client-only DistrictMap
const ClientDistrictMap = dynamic(
  () => import('./district-map').then((mod) => mod.DistrictMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#EFEFEF] dark:bg-[#011D40] rounded-2xl border border-dashed border-stone-grey-300 dark:border-white/10 animate-pulse">
        <Loader2 className="animate-spin text-[#F26F21]" size={36} />
        <span className="text-sm font-semibold text-[#022B5D] dark:text-[#FAF0E1] tracking-wide">
          Loading Districts GIS Engine...
        </span>
      </div>
    )
  }
);

export function DistrictMapWrapper(props: DistrictMapProps) {
  return <ClientDistrictMap {...props} />;
}

export default DistrictMapWrapper;
