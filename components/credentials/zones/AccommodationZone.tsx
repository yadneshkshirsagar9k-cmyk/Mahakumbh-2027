import React from 'react';
import type { OfficialRegistrationRecord } from '@/types/citizen.types';

interface Props {
  record: OfficialRegistrationRecord;
}

export function AccommodationZone({ record }: Props) {
  const acc = record.accommodation;
  const details = acc.details;
  
  const fmtDate = (d: string) => {
    if (!d) return 'N/A';
    try { return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return d; }
  };

  return (
    <div className="mt-2 font-sans text-xs text-[#111827]">
      <div className="bg-[#111827] text-white px-3 py-1.5 text-[11px] font-black uppercase tracking-widest">
        DESIGNATED SADHUGRAM ACCOMMODATION ALLOTMENT DETAILS
      </div>
      <table className="w-full border-collapse border border-[#6B7280] text-[11px] font-sans">
        <tbody>
          <tr className="border-b border-[#6B7280]">
            <td className="py-2 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] w-[35%] text-[#374151]">Camp / Facility Name</td>
            <td className="py-2 px-3 font-black text-[#111827] text-sm uppercase">{acc.camp || details?.name || 'Mahakumbh Designated Pilgrim Sadhugram Camp'}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Accommodation & Facility Type</td>
            <td className="py-1.5 px-3 font-semibold uppercase">{details?.type || 'Standard Swiss Cottage / Dormitory Tent Facility'}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Sector / Zone Location</td>
            <td className="py-1.5 px-3 font-bold text-[#047857] uppercase">Sector: {acc.sector || details?.sector || 'Sector-A (Sadhugram Center)'} | Zone: {details?.zone || 'Zone 2 (Godavari Bank Corridor)'}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Booking Reference Ref</td>
            <td className="py-1.5 px-3 font-mono font-bold text-[#EA580C]">{acc.bookingReference || `ACC-MH-${record.registration.registrationNumber}`}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Check-In Schedule</td>
            <td className="py-1.5 px-3 font-mono font-bold text-[#111827]">{fmtDate(acc.checkIn || record.journey.arrivalDate)}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Check-Out Schedule</td>
            <td className="py-1.5 px-3 font-mono font-bold text-[#111827]">{fmtDate(acc.checkOut || record.journey.departureDate)}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Total Occupants Cleared</td>
            <td className="py-1.5 px-3 font-bold">{record.pilgrims.pilgrimCount || 1} Registered Pilgrims</td>
          </tr>
          <tr>
            <td className="py-1.5 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Allotment Clearance Status</td>
            <td className="py-1.5 px-3 font-bold text-[#047857] uppercase">{details?.status || 'Confirmed & Ready for Camp Check-In'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
