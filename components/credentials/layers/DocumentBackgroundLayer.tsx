import React from 'react';
import { DocumentFormat } from '@/config/document-tokens';

interface Props {
  format: DocumentFormat;
  children: React.ReactNode;
}

export function DocumentBackgroundLayer({ format, children }: Props) {
  if (format === 'idCard') {
    return (
      <div className="relative w-full h-full bg-white overflow-hidden flex flex-col select-none">
        {children}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Guilloche security micro-pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #111827 0px, #111827 1px, transparent 1px, transparent 12px)`
      }} />
      {/* Decorative Official Government Top Borders */}
      <div className="absolute top-0 left-0 w-full h-3 bg-[#111827] z-20" />
      <div className="absolute top-3 left-0 w-full h-1 bg-[#EA580C] z-20" />
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col flex-1">
        {children}
      </div>

      {/* Decorative Official Government Bottom Borders */}
      <div className="absolute bottom-1 left-0 w-full h-1 bg-[#047857] z-20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#111827] z-20" />
    </div>
  );
}
