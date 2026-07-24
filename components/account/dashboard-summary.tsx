'use client';

/**
 * @file Dashboard Summary
 * @description Master dashboard summary widget reading unified Journey state from store.
 */

import { StatusBadge } from './status-badge';
import { Calendar, ShieldCheck, QrCode, Bell, Users, Waves, Navigation } from 'lucide-react';
import { useJourneyStore } from '@/store/journey-store';

interface DashboardSummaryProps {
  userName: string;
  registrationType: string;
  registrationId: string;
}

export function DashboardSummary({ userName, registrationType, registrationId }: DashboardSummaryProps) {
  const { journey } = useJourneyStore();

  if (!journey) {
    return null;
  }

  // Get upcoming Snan and Darshan
  const upcomingSnan = journey.snanBookings && journey.snanBookings.length > 0 
    ? journey.snanBookings[0] 
    : null;

  const upcomingDarshan = journey.darshanBookings && journey.darshanBookings.length > 0 
    ? journey.darshanBookings[0] 
    : null;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] space-y-5">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div className="space-y-1 text-left">
          <span className="text-xs font-extrabold text-[#FF9933] uppercase tracking-wider block">
            Simhastha Mahakumbh 2027
          </span>
          <h2 className="text-2xl font-black text-[#111827] font-[var(--font-heading)] leading-tight">
            Welcome, {userName || 'Pilgrim'}
          </h2>
          <p className="text-xs font-bold text-[#6B7280]">
            Registration Category:{' '}
            <span className="text-[#005BAC] underline underline-offset-2">{registrationType}</span>
            {' '}• Reg ID:{' '}
            <span className="font-mono text-[#FF9933] bg-[#FAFBFC] px-2 py-0.5 rounded border border-[#E5E7EB]">
              {journey.registrationNumber}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#FAFBFC] p-2 rounded-lg border border-[#E5E7EB] shrink-0">
          <span className="text-xs font-extrabold text-[#005BAC]">Journey Status:</span>
          <StatusBadge status={journey.journeyStatus.toLowerCase().replace(' ', '_') as any} />
        </div>
      </div>

      {/* Journey Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-[#374151]">
          <span>Journey Progress:</span>
          <span className="text-[#FF9933]">{journey.journeyProgress}% ({journey.journeyStatus})</span>
        </div>
        <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#E5E7EB]">
          <div 
            className="h-full bg-[#FF9933] transition-all duration-550 rounded-full" 
            style={{ width: `${journey.journeyProgress}%` }}
          />
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {/* Journey Dates */}
        <div className="bg-[#FAFBFC] rounded-lg p-4 border border-[#E5E7EB] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#005BAC]">
            <Calendar size={16} className="text-[#FF9933] shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider">Journey Dates</span>
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#111827]">{journey.startDate} to {journey.endDate}</p>
            <p className="text-[9px] font-bold text-[#6B7280] uppercase mt-0.5">{journey.journeyType} Type</p>
          </div>
        </div>

        {/* Pilgrim Count */}
        <div className="bg-[#FAFBFC] rounded-lg p-4 border border-[#E5E7EB] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#005BAC]">
            <Users size={16} className="text-[#FF9933] shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider">Pilgrims</span>
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#111827]">{journey.pilgrimCount} Accompanying</p>
            <p className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">Verified Members</p>
          </div>
        </div>

        {/* Upcoming Snan */}
        <div className="bg-[#FAFBFC] rounded-lg p-4 border border-[#E5E7EB] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#005BAC]">
            <Waves size={16} className="text-[#FF9933] shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider">Upcoming Snan</span>
          </div>
          <div>
            {upcomingSnan ? (
              <>
                <p className="text-xs font-extrabold text-[#111827] truncate">{upcomingSnan.ghatName.split(' - ')[0]}</p>
                <p className="text-[9px] font-bold text-[#6B7280]">{upcomingSnan.date} • {upcomingSnan.timeSlot.split(' (')[0]}</p>
              </>
            ) : (
              <>
                <p className="text-xs font-extrabold text-amber-600">No Booking Yet</p>
                <p className="text-[9px] font-bold text-[#6B7280]">Select date in Smart Snan</p>
              </>
            )}
          </div>
        </div>

        {/* Upcoming Darshan */}
        <div className="bg-[#FAFBFC] rounded-lg p-4 border border-[#E5E7EB] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#005BAC]">
            <Navigation size={16} className="text-[#FF9933] shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider">Upcoming Darshan</span>
          </div>
          <div>
            {upcomingDarshan ? (
              <>
                <p className="text-xs font-extrabold text-[#111827] truncate">{upcomingDarshan.templeName.split(' (')[0]}</p>
                <p className="text-[9px] font-bold text-[#6B7280]">{upcomingDarshan.date} • {upcomingDarshan.timeSlot.split(' (')[0]}</p>
              </>
            ) : (
              <>
                <p className="text-xs font-extrabold text-amber-600">No Booking Yet</p>
                <p className="text-[9px] font-bold text-[#6B7280]">Select date in Smart Darshan</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
