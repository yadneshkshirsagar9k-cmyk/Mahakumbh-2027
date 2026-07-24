import React from 'react';
import { documentColors, documentTypography } from '@/config/document-tokens';

export function WatermarkLayer() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
      <div 
        className="text-[120px] font-black uppercase tracking-tighter text-center transform -rotate-45 select-none"
        style={{ color: documentColors.security.watermark, lineHeight: '0.8' }}
      >
        GOVT OF<br/>UTTAR PRADESH
      </div>
    </div>
  );
}
