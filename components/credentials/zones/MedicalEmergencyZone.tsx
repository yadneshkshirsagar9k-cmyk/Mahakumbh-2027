import React from 'react';
import type { OfficialRegistrationRecord } from '@/types/citizen.types';

interface Props {
  record: OfficialRegistrationRecord;
  compact?: boolean;
}

export function MedicalEmergencyZone({ record, compact = false }: Props) {
  const { medical, contact, identity } = record;
  const emergency = contact.emergencyContacts?.primary || { name: 'Emergency Helpline', phone: '112 / 108', relationship: 'Official Support' };
  
  return (
    <div className={`mt-2 font-sans text-xs text-[#111827] ${compact ? 'mb-1' : 'mb-2'}`}>
      <div className="bg-[#B91C1C] text-white px-3 py-1.5 text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
        <span>EMERGENCY MEDICAL CLEARANCE & HELPLINE RECORDS</span>
        <span className="text-[9px] bg-white text-[#B91C1C] px-1.5 py-0.5 rounded font-bold">CRITICAL BIO-DATA</span>
      </div>
      <table className="w-full border-collapse border border-[#B91C1C] text-[11px] font-sans">
        <tbody>
          <tr className="border-b border-[#B91C1C]">
            <td className="py-2 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] w-[35%] text-[#991B1B]">Holder Blood Group</td>
            <td className="py-2 px-3 font-black text-[#B91C1C] text-lg">{medical.bloodGroup || 'O+ (Verified)'}</td>
          </tr>
          <tr className="border-b border-[#B91C1C]">
            <td className="py-1.5 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] text-[#991B1B]">Known Allergies & Sensitivities</td>
            <td className="py-1.5 px-3 font-bold text-[#111827]">{medical.allergies || 'None Reported / No Drug Sensitivity Reported'}</td>
          </tr>
          <tr className="border-b border-[#B91C1C]">
            <td className="py-1.5 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] text-[#991B1B]">Chronic Conditions / History</td>
            <td className="py-1.5 px-3 font-semibold text-[#111827]">{medical.chronicDiseases?.length ? medical.chronicDiseases.join(', ') : 'No Chronic Illness or Cardiac History Reported'}</td>
          </tr>
          <tr className="border-b border-[#B91C1C]">
            <td className="py-1.5 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] text-[#991B1B]">Current Prescribed Medication</td>
            <td className="py-1.5 px-3 font-medium text-[#111827]">{medical.currentMedication || 'None / Standard Personal First-Aid'}</td>
          </tr>
          <tr className="border-b border-[#B91C1C]">
            <td className="py-1.5 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] text-[#991B1B]">Special Assistance / Wheelchair</td>
            <td className="py-1.5 px-3 font-bold uppercase">{medical.specialAssistanceRequired ? '⚠ YES — SPECIAL DISABILITY ASSISTANCE REQUIRED' : 'Not Required — Ambulatory Pilgrim'}</td>
          </tr>
          <tr className="border-b border-[#B91C1C]">
            <td className="py-1.5 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] text-[#991B1B]">Primary Emergency Contact</td>
            <td className="py-1.5 px-3 font-bold text-[#111827] uppercase">{emergency.name} ({emergency.relationship || 'Emergency Relative'}) — <span className="font-mono font-black text-[#B91C1C]">{emergency.phone}</span></td>
          </tr>
          <tr>
            <td className="py-1.5 px-3 font-bold bg-[#FEF2F2] border-r border-[#B91C1C] text-[#991B1B]">Designated Emergency Hospital</td>
            <td className="py-1.5 px-3 font-semibold text-[#111827]">Sector-A Civil Base Hospital & 24x7 Emergency Medical Camp Unit (Dial 108)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
