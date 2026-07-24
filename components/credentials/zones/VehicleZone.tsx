import React from 'react';
import type { OfficialRegistrationRecord } from '@/types/citizen.types';
import { CredentialType } from '@/types/credential.types';

interface Props {
  record: OfficialRegistrationRecord;
  credentialType?: string;
}

export function VehicleZone({ record, credentialType }: Props) {
  const vehicle = record.travel.vehicle;
  const journey = record.journey;


  // Default to VEHICLE_PASS layout (high visibility for windshield check)
  return (
    <div className="mt-3 font-sans text-[#111827]">
      <div className="bg-[#111827] text-white px-3 py-1.5 text-[11px] font-black uppercase tracking-widest flex items-center justify-between border border-[#111827]">
        <span>AUTHORIZED VEHICLE TRANSIT PERMIT</span>
        <span className="bg-white text-[#111827] px-2 py-0.5 rounded-sm text-[9px]">WINDSHIELD MOUNT</span>
      </div>
      <div className="border-x border-[#111827] p-5 text-center bg-[#F9FAFB]">
        <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Registered Vehicle Number</div>
        <div className="text-4xl sm:text-5xl font-mono font-black text-[#111827] tracking-widest">{vehicle?.vehicleNumber || 'MH-15-AB-1234'}</div>
        <div className="inline-block bg-[#047857] text-white px-4 py-1 text-xs font-bold uppercase rounded-sm tracking-wider shadow-sm mt-3">
          {vehicle?.vehicleType || 'Private SUV'} • {vehicle?.fuelType || 'Petrol / EV'}
        </div>
      </div>
      <table className="w-full border-collapse border border-[#111827] text-[11px] font-sans bg-white">
        <tbody>
          <tr className="border-b border-[#111827]/30">
            <td className="py-2 px-3 font-bold bg-[#F3F4F6] border-r border-[#111827]/30 w-[35%] text-[#374151]">Authorized Driver</td>
            <td className="py-2 px-3 font-bold uppercase">{vehicle?.driverName || record.identity.fullName || 'Registered Pilgrim'} ({vehicle?.driverMobile || record.contact.primaryMobile})</td>
          </tr>
          <tr className="border-b border-[#111827]/30">
            <td className="py-1.5 px-3 font-bold bg-[#F3F4F6] border-r border-[#111827]/30 text-[#374151]">Designated Approach Route</td>
            <td className="py-1.5 px-3 font-bold text-[#005BAC]">{journey.route || 'Expressway Corridor -> Checkpoint 2'}</td>
          </tr>
          <tr className="border-b border-[#111827]/30">
          </tr>
          <tr>
            <td className="py-1.5 px-3 font-bold bg-[#F3F4F6] border-r border-[#111827]/30 text-[#374151]">Transit Clearance ID</td>
            <td className="py-1.5 px-3 font-mono font-bold text-[#EA580C]">{vehicle?.vehiclePassId || `VP-${record.registration.registrationNumber}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
