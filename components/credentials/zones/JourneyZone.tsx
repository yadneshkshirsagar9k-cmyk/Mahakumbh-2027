import React from 'react';
import type { OfficialRegistrationRecord } from '@/types/citizen.types';
import { useCredentialContext } from '../engine/CredentialContext';
import { CredentialType } from '@/types/credential.types';

interface Props {
  record: OfficialRegistrationRecord;
}

export function JourneyZone({ record }: Props) {
  const context = useCredentialContext();
  const { journey, pilgrims, travel, accommodation } = record;
  
  const fmtDate = (d: string) => {
    if (!d) return 'N/A';
    try { return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };

  const ghatScheduleStr = journey.route 
    ? `${journey.route} (Reporting & Darshan clearance active)`
    : 'Ramkund Main Ghat, Trimbakeshwar Temple & Designated Sadhugram Sector';

  const isRegistrationCert = context.credential.credentialType === CredentialType.REGISTRATION_CERTIFICATE;
  const isPermitOrCard = !isRegistrationCert;

  if (isPermitOrCard) {
    return (
      <div className="mt-2 font-sans text-xs text-[#111827]">
        <div className="bg-[#111827] text-white px-3 py-1 text-[10.5px] font-black uppercase tracking-widest">
          APPROVED JOURNEY & CHECKPOINT CORRIDOR DETAILS
        </div>
        <table className="w-full border-collapse border border-[#6B7280] text-[10.5px] font-sans">
          <tbody>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] w-[30%] text-[#374151]">Validity Period & Schedule</td>
              <td className="py-1 px-3 font-mono font-bold text-[#047857]">{fmtDate(journey.arrivalDate)} TO {fmtDate(journey.departureDate)} ({record.derived.journeyDurationDays || 3} Days)</td>
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] w-[20%] text-[#374151]">Pilgrims / Roster</td>
              <td className="py-1 px-3 font-bold uppercase">{pilgrims.pilgrimCount || 1} Member(s) ({pilgrims.pilgrimCategory || 'General'})</td>
            </tr>
            <tr>
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Checkpoint Entry / Exit</td>
              <td colSpan={3} className="py-1 px-3 font-medium uppercase text-[#111827]">
                Entry Gate: {journey.entryZone || 'Outer Ring Checkpoint Gate-1'} | Exit Gate: {journey.exitZone || 'Highway Checkpoint Gate-4'} | Ghat: {ghatScheduleStr}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mt-3 font-sans text-xs text-[#111827]">
      <div className="bg-[#111827] text-white px-3 py-1 text-[10.5px] font-black uppercase tracking-widest">
        2. APPROVED JOURNEY SCHEDULE & DARSHAN ITINERARY
      </div>
      <table className="w-full border-collapse border border-[#6B7280] text-[10.5px] font-sans">
        <tbody>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] w-[35%] text-[#374151]">Pilgrimage / Event Name</td>
            <td className="py-1 px-3 font-black text-[#111827] uppercase">{journey.journeyName || 'Nashik-Trimbakeshwar Simhastha Mahakumbh 2027'}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Category & Pilgrim Roster</td>
            <td className="py-1 px-3 font-semibold uppercase">{pilgrims.pilgrimCategory || journey.journeyType || 'General Citizen'} ({pilgrims.pilgrimCount || 1} Registered Members)</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Tour Days / Validity Period</td>
            <td className="py-1 px-3 font-mono font-bold text-[#047857]">{fmtDate(journey.arrivalDate)} TO {fmtDate(journey.departureDate)} ({record.derived.journeyDurationDays || 3} Days)</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Selected Dham / Ghat Schedule</td>
            <td className="py-1 px-3 font-bold text-[#111827]">{ghatScheduleStr}</td>
          </tr>
          <tr className="border-b border-[#6B7280]">
            <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Entry / Exit Checkpoint Corridors</td>
            <td className="py-1 px-3 font-medium uppercase">Entry: {journey.entryZone || 'Outer Ring Checkpoint Gate-1'} | Exit: {journey.exitZone || 'Highway Checkpoint Gate-4'}</td>
          </tr>
          <tr>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
