import React from 'react';
import { documentTypography } from '@/config/document-tokens';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

interface Props {
  department: string;
  documentTitle: string;
  documentNumber: string;
}

export function GovernmentHeaderZone({ department, documentTitle, documentNumber }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center border-b-[3px] border-[#111827] pb-2.5 mb-2.5 font-sans">
      {/* Official State Government Emblem / Header Banner */}
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <div className="w-14 h-14 rounded-full border-2 border-[#111827] p-1 flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full border border-dashed border-[#EA580C] flex flex-col items-center justify-center bg-[#F9FAFB]">
            <span className="text-[9px] font-black text-[#111827] leading-none uppercase">
              {GOVERNMENT_PORTAL_ENABLED ? 'GOVT' : 'BOARD'}
            </span>
            <span className="text-[7px] font-bold text-[#EA580C] leading-none">
              {GOVERNMENT_PORTAL_ENABLED ? 'MAHA' : 'CELL'}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center px-2">
          <div className="text-[10px] font-bold text-[#374151] uppercase tracking-[0.2em]">
            {GOVERNMENT_PORTAL_ENABLED ? 'STATE GOVERNMENT OF MAHARASHTRA' : 'NASHIK SIMHASTHA COMMITTEE'}
          </div>
          <h1 className="text-base md:text-lg font-black text-[#111827] uppercase tracking-wider leading-tight py-0.5" style={{ fontFamily: documentTypography.fonts.primary }}>
            {department || 'NASHIK-TRIMBAKESHWAR SIMHASTHA MAHAKUMBH 2027'}
          </h1>
          <div className="text-[9.5px] font-semibold text-[#374151] uppercase tracking-widest">
            {GOVERNMENT_PORTAL_ENABLED 
              ? 'DEPARTMENT OF CROWD MANAGEMENT, PILGRIM WELFARE & POLICE SECURITY' 
              : 'CROWD MANAGEMENT & PILGRIM WELFARE SERVICES'}
          </div>
        </div>

        <div className="w-14 h-14 rounded-full border-2 border-[#111827] p-1 flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full border border-dashed border-[#047857] flex flex-col items-center justify-center bg-[#F9FAFB]">
            <span className="text-[8px] font-black text-[#047857] leading-none uppercase">SATYA</span>
            <span className="text-[7px] font-bold text-[#111827] leading-none">MEVA</span>
          </div>
        </div>
      </div>
      
      {/* Document Title Bar */}
      <div className="w-full bg-[#111827] text-white py-1.5 px-4 shadow-sm my-1 flex items-center justify-between">
        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mx-auto" style={{ fontFamily: documentTypography.fonts.secondary }}>
          {documentTitle}
        </h3>
      </div>
      
      {/* Document Reference Subline */}
      <div className="flex justify-between w-full text-[11px] font-mono font-bold pt-1 px-1 text-[#111827]">
        <span>REF NUMBER: <span className="text-[#EA580C]">{documentNumber}</span></span>
        <span>ISSUE AUTHORITY: <span className="text-[#047857]">NIC DIGITAL CLEARANCE CELL</span></span>
      </div>
    </div>
  );
}
