import React from 'react';
import type { GovernmentCredential } from '@/types/credential.types';

interface Props {
  credential: GovernmentCredential;
}

export function AuthorityZone({ credential }: Props) {
  const fmtDate = (d: string) => {
    if (!d) return 'N/A';
    try { return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };
  
  return (
    <div className="mt-4 pt-3 border-t-2 border-[#111827] font-sans text-xs text-[#111827]">
      <div className="flex justify-between items-start gap-4">
        {/* Left: Issue Date & Validity */}
        <div className="space-y-1 text-left">
          <div className="bg-[#F9FAFB] p-2 border border-[#9CA3AF] space-y-1 text-[11px]">
            <div><span className="font-bold uppercase text-[#374151]">Issue Date:</span> <span className="font-mono font-bold text-[#111827]">{fmtDate(credential.issueDate)}</span></div>
            <div><span className="font-bold uppercase text-[#374151]">Valid Until:</span> <span className="font-mono font-bold text-[#047857]">{credential.expiryDate ? fmtDate(credential.expiryDate) : 'Simhastha Mahakumbh 2027 End Date'}</span></div>
            <div><span className="font-bold uppercase text-[#374151]">Clearance Ref:</span> <span className="font-mono text-[#EA580C] font-bold">NIC-MH-2027-{credential.documentNumber.slice(-6)}</span></div>
          </div>
          <div className="text-[9px] font-mono font-bold text-[#047857] uppercase">
            ✓ Cryptographically Signed & Digitally Verified Record
          </div>
        </div>

        {/* Center: Official Seal Badge */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div className="w-20 h-20 rounded-full border-[3px] border-[#B91C1C] flex flex-col items-center justify-center p-1 relative shadow-sm opacity-90 rotate-[-8deg]">
            <div className="w-full h-full rounded-full border border-dashed border-[#B91C1C] flex flex-col items-center justify-center text-center p-1">
              <span className="text-[7.5px] font-black uppercase tracking-tighter leading-none text-[#B91C1C]">MAHAKUMBH</span>
              <span className="text-[6px] font-bold uppercase tracking-tight text-[#B91C1C] leading-tight my-0.5">AUTHORITY SEAL</span>
              <span className="text-[6.5px] font-black uppercase text-[#B91C1C] leading-none">NASHIK 2027</span>
            </div>
          </div>
        </div>

        {/* Right: Digital Signature Box */}
        <div className="text-center flex flex-col items-end">
          <div className="w-48 h-12 mb-1 flex items-center justify-center border-b-2 border-[#111827] relative">
            <span style={{ fontFamily: "'Brush Script MT', cursive" }} className="text-2xl text-[#111827] font-bold tracking-wider">
              {credential.issuingAuthority.officerName || 'Jt. Commissioner of Police'}
            </span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-[#111827]">
            {credential.issuingAuthority.officerName || 'DIG / Joint Commissioner'}
          </div>
          <div className="text-[9px] font-semibold text-[#374151] uppercase tracking-wider">
            {credential.issuingAuthority.departmentName || 'Special Crowd & Security Division'}
          </div>
        </div>
      </div>

      {/* Government Footer Bar */}
      <div className="mt-3 pt-2 border-t border-[#D1D5DB] text-center text-[9.5px] font-mono text-[#4B5563] bg-[#F3F4F6] py-1.5 px-2">
        <span className="font-bold text-[#111827]">POWERED BY:</span> MAHAKUMBH SMART PILGRIM MANAGEMENT PLATFORM (NIC DIGITAL VERIFICATION CELL) | 
        <span className="text-[#047857] font-bold"> VERIFICATION ID: {credential.documentNumber}</span>
      </div>
    </div>
  );
}
