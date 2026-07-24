'use client';

/**
 * @file Tour Packages Page
 * @description Official Tour Packages Page for Nashik Mahakumbh.
 */

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Compass, Info, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function TourPackagesPage() {
  const packages = [
    { id: 'pkg-1', name: 'Simhastha Holy Snan Yatra', duration: '1 Day', routes: 'Nashik Road -> Ram Kund -> Trimbakeshwar -> Nashik Road', price: 'Free (Govt Shuttle)', type: 'government' },
    { id: 'pkg-3', name: 'Trimbakeshwar Brahmagiri Trek', duration: '1 Day', routes: 'Kushavarta Kund -> Brahmagiri Hill Temple -> Trimbakeshwar Spire', price: 'Self-guided', type: 'adventure' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#005BAC] bg-[#F5F7FA] px-3 py-1 rounded-md border border-[#E5E7EB] inline-block">
              Tourism Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)]">
              Official Tour Packages & Routes
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Explore curated spiritual circuits, heritage walks, and daily shuttle schedules designed by the Maharashtra Tourism Development Corporation (MTDC).
            </p>
          </div>

          {/* Tour Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#005BAC] uppercase tracking-wider">
                      {pkg.name}
                    </span>
                    <span className={cn(
                      'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
                      pkg.type === 'government'
                        ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#2E7D32]'
                        : 'bg-[#F5F7FA] border-[#E5E7EB] text-[#005BAC]'
                    )}>
                      {pkg.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-[#374151] leading-relaxed">
                    <strong>Duration:</strong> {pkg.duration}
                  </p>
                  
                  <div className="flex items-start gap-1.5 text-xs text-[#374151] pt-2 border-t border-[#E5E7EB]">
                    <MapPin size={14} className="text-[#005BAC] shrink-0 mt-0.5" />
                    <span>{pkg.routes}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-[#6B7280]">Package Tariff</span>
                    <span className="text-base font-extrabold text-[#111827]">{pkg.price}</span>
                  </div>
                  <Link 
                    href="/account/timings-route-map"
                    className="px-4 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold uppercase tracking-wider rounded text-center select-none"
                  >
                    View Routes
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines */}
          <div className="p-6 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] space-y-3">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-1.5 uppercase tracking-wider">
              <Info size={16} className="text-[#005BAC]" />
              Tourism Guidelines
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#374151]">
              <li>Free electric municipal shuttle buses operate continuously along the major transit paths.</li>
              <li>Always follow official maps and signage to prevent getting lost in congested sectors.</li>
              <li>Guides carrying official MTDC identity badges are authorized to facilitate pilgrim groups.</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
