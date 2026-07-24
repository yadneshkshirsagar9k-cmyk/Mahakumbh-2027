'use client';

/**
 * @file Timings & Route Map
 */

import { Clock, MapPin, ShieldAlert, Compass, Shield, HeartPulse, Square } from 'lucide-react';
import { cn } from '@/utils/cn';
import { LOCATION_CONFIG, navigateToCoordinates } from '@/constants/location-config';

interface ScheduleItem {
  temple: string;
  slot: string;
  status: 'Open' | 'Crowded' | 'Closed';
  waitingTime: string;
}

const TEMPLE_SCHEDULES: ScheduleItem[] = [
  { temple: 'Trimbakeshwar Shiva Temple', slot: '06:00 AM - 12:00 PM', status: 'Crowded', waitingTime: '90 mins' },
  { temple: 'Ramkund Ghat Snan Slot', slot: '04:00 AM - 10:00 AM', status: 'Open', waitingTime: '15 mins' }
];

export default function TimingsRouteMapPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-[#111827] font-[var(--font-heading)]">
          Simhastha Slots & Route Directory
        </h1>
        <p className="text-xs text-[#6B7280]">
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Temple Timings Slots & Waiting Times */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <Clock size={16} className="text-[#005BAC]" />
              <h3 className="font-extrabold text-sm text-[#111827]">Darshan Slots Schedule</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#374151]">
                    <th className="py-2.5 font-bold">Temple / Ghat</th>
                    <th className="py-2.5 font-bold">Slot Timing</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold text-right">Est. Queue</th>
                  </tr>
                </thead>
                <tbody>
                  {TEMPLE_SCHEDULES.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#FAFBFC]">
                      <td className="py-2.5 font-semibold text-[#111827]">{item.temple}</td>
                      <td className="py-2.5 text-[#374151]">{item.slot}</td>
                      <td className="py-2.5">
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider',
                          item.status === 'Open'
                            ? 'bg-[#F0FDF4] text-[#2E7D32]'
                            : item.status === 'Crowded'
                            ? 'bg-[#FFFBEB] text-[#F59E0B]'
                            : 'bg-red-50 text-red-600'
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-[#005BAC]">{item.waitingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>

        {/* Right Column: Emergency & Medical Stations Directory */}
        <div className="space-y-6">
          {/* Medical Centres */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <HeartPulse size={16} className="text-red-600" />
              <h3 className="font-extrabold text-sm text-[#111827]">Emergency Medical Hubs</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Sector C Medical Camp', location: 'Near Sadhugram Entry Gate', tel: '108 / +91-253-2550011' },
                { name: 'Trimbak Medical Post', location: 'Adjacent to main Temple steps', tel: '+91-253-2550022' },
                { name: 'Ramkund First-Aid Hub', location: 'Ghat exit pathway', tel: '+91-253-2550033' },
              ].map((med, idx) => (
                <div key={idx} className="p-3 border border-red-100 bg-red-50/20 rounded space-y-1">
                  <h4 className="font-bold text-[#111827]">{med.name}</h4>
                  <p className="text-[10px] text-[#374151]">Location: {med.location}</p>
                  <p className="text-[10px] font-bold text-red-600">Helpline: {med.tel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crowd Advisory warning */}
          <div className="bg-amber-50/30 border border-amber-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <ShieldAlert size={16} />
              <h3 className="font-bold text-xs uppercase tracking-wider">Crowd Flow Advisory</h3>
            </div>
            <p className="text-xs text-[#374151] leading-relaxed font-semibold">
              Main bathing ghats are anticipating extreme crowd densities around the auspicious snan Muhurta (04:00 AM - 07:00 AM). Pilgrims are advised to arrive 45 minutes prior to their allocated slots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
