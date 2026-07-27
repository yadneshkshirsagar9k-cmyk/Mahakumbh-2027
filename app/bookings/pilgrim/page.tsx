'use client';

/**
 * @file Pilgrim Services Page
 * @description Official Pilgrim Services Page for Nashik Mahakumbh.
 */

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PILGRIM_SERVICES_DATA } from '@/constants/booking-data';
import { Sparkles, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function PilgrimServicesPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#005BAC] bg-[#F5F7FA] px-3 py-1 rounded-md border border-[#E5E7EB] inline-block">
              Pilgrim Care
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)]">
              Pilgrim Services & Care
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Access digital QR gate credentials, medical registration desks, Divyang ramps, senior citizen carts, and volunteer groups.
            </p>
          </div>

          {/* Pilgrim Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILGRIM_SERVICES_DATA.map((ps) => (
              <div 
                key={ps.id} 
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#005BAC] uppercase tracking-wider">
                      {ps.name}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-[#F5F7FA] border-[#E5E7EB] text-[#005BAC]">
                      {ps.category.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-[#374151] leading-relaxed">{ps.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-[#6B7280]">Availability</span>
                    <span className="text-xs font-bold text-[#2E7D32]">Active</span>
                  </div>
                  <Link 
                    href={ps.routePath}
                    className="px-4 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold uppercase tracking-wider rounded text-center select-none"
                  >
                    Access Service
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pilgrim Care Guidelines */}
          <div className="p-6 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] space-y-3">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-1.5 uppercase tracking-wider">
              <Info size={16} className="text-[#005BAC]" />
              Support Guidelines
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#374151]">
              <li>Medical registration provides wristbands for children and senior citizens for quick biometric tracking.</li>
              <li>Volunteers wearing orange jackets are authorized by municipal authorities to guide and assist pilgrims.</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
