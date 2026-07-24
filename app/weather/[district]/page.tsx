/**
 * @file Dynamic Weather District Page
 * @description Server-side route handler that pre-renders static paths (SSG)
 * for all 36 districts of Maharashtra and mounts the client-side
 * interactive weather detail dashboard.
 */

import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WEATHER_DISTRICTS_DATA } from '@/constants/weather-data';
import { DistrictDetailClient } from '@/components/weather/district-detail-client';

interface PageProps {
  params: Promise<{
    district: string;
  }>;
}

export default async function WeatherDistrictDetail({ params }: PageProps) {
  // Await params promise in Next.js 15
  const resolvedParams = await params;
  const districtSlug = resolvedParams.district;

  // Retrieve current district data
  const dist = WEATHER_DISTRICTS_DATA.find(
    (d) => d.slug === districtSlug
  );

  // If district slug doesn't exist, trigger Next.js 404
  if (!dist) {
    notFound();
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827]">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <DistrictDetailClient dist={dist} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ============================================================
// STATIC PAGE PRE-RECOMPILATION FOR NEXT.JS BUILD (SSG)
// ============================================================

export async function generateStaticParams() {
  return WEATHER_DISTRICTS_DATA.map((dist) => ({
    district: dist.slug
  }));
}
