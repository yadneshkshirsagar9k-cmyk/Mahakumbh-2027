import React from 'react';

export function SealLayer() {
  return (
    <div className="absolute top-12 right-12 w-32 h-32 opacity-20 pointer-events-none z-0">
      <div className="w-full h-full rounded-full border-[6px] border-double border-[#991B1B] flex flex-col items-center justify-center">
         <span className="text-[8px] font-black text-[#991B1B] uppercase tracking-widest text-center mt-2">
           Valid<br/>Official<br/>Record
         </span>
      </div>
    </div>
  );
}
