'use client';

/**
 * @file Vehicle Registration Page
 * @description Official Vehicle Pass Registration Page for Nashik Mahakumbh.
 */

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { VEHICLE_CATEGORIES_DATA } from '@/constants/booking-data';
import { Car, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function VehicleRegistrationPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#005BAC] bg-[#F5F7FA] px-3 py-1 rounded-md border border-[#E5E7EB] inline-block">
              Transit Services
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)]">
              Vehicle Pass Registration
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Register transit vehicles to obtain gate access permits and route passes.
            </p>
          </div>

          {/* Vehicle Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLE_CATEGORIES_DATA.map((v) => (
              <div 
                key={v.category} 
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#005BAC] uppercase tracking-wider">
                      {v.label}
                    </span>
                    <span className={cn(
                      'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
                      v.tollRequired
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-[#F0FDF4] border-[#DCFCE7] text-[#2E7D32]'
                    )}>
                      {v.tollRequired ? 'Toll Applicable' : 'Free Entry'}
                    </span>
                  </div>

                  <p className="text-xs text-[#374151] leading-relaxed">{v.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-[#374151] pt-2 border-t border-[#E5E7EB]">
                    <span className="font-semibold text-stone-600">
                      Capacity limit: {v.maxCapacity} passengers
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-[#6B7280]">Pass validity</span>
                    <span className="text-sm font-bold text-[#111827]">Event Duration</span>
                  </div>
                  <Link 
                    href="/bookings#vehicle-section"
                    className="px-4 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold uppercase tracking-wider rounded text-center select-none"
                  >
                    Register Pass
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Pass Guidelines */}
          <div className="p-6 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] space-y-3">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-1.5 uppercase tracking-wider">
              <Info size={16} className="text-[#005BAC]" />
              Transit & Parking Guidelines
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#374151]">
              <li>Heavy vehicles and buses are restricted inside the city boundaries during peak festival days.</li>
              <li>Vehicles must possess a valid parking reservation before crossing the outer ring checkpoints.</li>
              <li>Emergency, volunteer, and official convoys are exempted from tolls and general routing limits.</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
