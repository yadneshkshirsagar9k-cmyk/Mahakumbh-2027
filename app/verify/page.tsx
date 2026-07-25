'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, ShieldAlert, BadgeCheck, FileText, User, Calendar, MapPin, Hash, Activity, Phone, Droplet } from 'lucide-react';
import { useJourneyStore } from '@/store/journey-store';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

interface MinifiedPayload {
  id: string; // documentNumber
  ct: string; // credentialType
  vs: string; // verificationSignature
  nm: string; // fullName
  st: string; // verificationStatus
  dt: string; // journeyDates
  sz: string; // pilgrimCount
  vh: string; // vehicleRegistration
  sc: string; // assignedSector
  gd?: string; // gender
  db?: string; // dob
  ec?: string; // emergencyContact
  ph?: string; // photograph
  bg?: string; // bloodGroup
}

function VerifyScreen() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  const { citizenProfile, journey } = useJourneyStore();
  
  const [payload, setPayload] = useState<MinifiedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationTime, setVerificationTime] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    setVerificationTime(new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }));
  }, []);

  useEffect(() => {
    if (!dataParam) {
      setError('No verification data found in URL. Please scan a valid Mahakumbh Official QR Code.');
      return;
    }

    try {
      // Decode Base64 and parse JSON
      const decodedString = decodeURIComponent(atob(dataParam));
      const parsedData = JSON.parse(decodedString) as MinifiedPayload;
      
      if (!parsedData.vs || !parsedData.ct || !parsedData.id) {
        throw new Error('Invalid or corrupted pass data. Signature or ID missing.');
      }
      
      setPayload(parsedData);
      
      // Attempt to load photo from payload or fallback to local storage (for prototype demo)
      if (parsedData.ph) {
        setPhotoUrl(parsedData.ph);
      } else if ((citizenProfile as any)?.photo) {
        setPhotoUrl((citizenProfile as any).photo);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to verify document. The QR code may be tampered with, corrupted, or not issued by the Mahakumbh Authority.');
    }
  }, [dataParam, citizenProfile]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center p-4 font-sans">
        <div className="bg-white border-t-4 border-red-600 rounded-xl shadow-xl max-w-md w-full p-8 text-center space-y-4">
          <ShieldAlert size={64} className="text-red-500 mx-auto" />
          <h1 className="text-2xl font-black text-gray-900 uppercase">Verification Failed</h1>
          <p className="text-sm text-gray-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#005BAC] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#005BAC] font-bold tracking-widest uppercase text-sm">Verifying Digital Signature...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-12 font-sans selection:bg-[#005BAC] selection:text-white">
      {/* Government Header */}
      <div className="bg-[#005BAC] text-white pt-10 pb-28 px-4 text-center shadow-md relative overflow-hidden border-b-4 border-[#EA580C]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="w-16 h-16 mx-auto bg-white rounded-full p-2 shadow-lg mb-4 flex items-center justify-center">
            <img src="/emblem.png" alt="Emblem" className="w-12 h-12" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <h1 className="text-xs sm:text-sm font-black tracking-widest uppercase text-blue-100">{GOVERNMENT_PORTAL_ENABLED ? 'Government of Maharashtra' : 'Nashik Simhastha Committee'}</h1>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">Mahakumbh Digital Clearance</h2>
          <p className="text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-[#0F4C81]/50 inline-block px-3 py-1 rounded-full border border-[#0F4C81]">Official Credential Verification Portal</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden relative">
          
          {/* Authentic Background Watermark */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <img src="/emblem.png" alt="" className="w-96 h-96 grayscale" />
          </div>

          {/* Status Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 p-8 flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
              <CheckCircle2 size={56} className="text-emerald-600 drop-shadow-sm" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-emerald-700 uppercase tracking-tight drop-shadow-sm">{payload.st || 'Verified & Active'}</h3>
              <p className="text-xs font-bold text-emerald-600/90 uppercase tracking-widest mt-1.5 bg-emerald-100/50 inline-block px-3 py-1 rounded-full">Cryptographically Secured</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8 relative z-10">
            {/* Conditional Layouts Based on Credential Type */}
            
            {/* 1. REGISTRATION_CERTIFICATE Layout */}
            {payload.ct === 'REGISTRATION_CERTIFICATE' && (
              <div className="bg-white border-[3px] border-[#111827] p-6 shadow-xl relative overflow-hidden flex flex-col font-sans">
                {/* Watermark Background */}
                <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-4 border-[#005BAC] rounded-full flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-[#005BAC]">🕉️</span>
                    <span className="text-sm font-black text-[#005BAC] mt-2">MAHAKUMBH 2027</span>
                  </div>
                </div>

                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center border-b-[3px] border-[#111827] pb-3 mb-4 relative z-10">
                  <div className="flex items-center justify-between w-full px-2 mb-2">
                    <div className="w-12 h-12 rounded-full border border-[#111827] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-[#111827] uppercase">{GOVERNMENT_PORTAL_ENABLED ? 'GOVT' : 'BOARD'}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-2">
                      <div className="text-[9px] font-bold text-[#374151] uppercase tracking-[0.2em]">{GOVERNMENT_PORTAL_ENABLED ? 'STATE GOVERNMENT OF MAHARASHTRA' : 'NASHIK SIMHASTHA COMMITTEE'}</div>
                      <h1 className="text-sm sm:text-base font-black text-[#111827] uppercase tracking-wider leading-tight py-0.5">NASHIK-TRIMBAKESHWAR MAHAKUMBH 2027</h1>
                      <div className="text-[8px] sm:text-[9px] font-bold text-[#374151] uppercase tracking-widest">{GOVERNMENT_PORTAL_ENABLED ? 'DEPARTMENT OF CROWD MANAGEMENT & POLICE SECURITY' : 'CROWD MANAGEMENT DIVISION'}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-[#111827] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-[#047857] uppercase">SEAL</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#111827] text-white py-1.5 px-4 shadow-sm my-1">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-center">OFFICIAL REGISTRATION CERTIFICATE</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="relative z-10 space-y-4">
                  {/* Pilgrim Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 border-2 border-[#111827] bg-gray-50 shrink-0 relative">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Pilgrim" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                          <User size={32} />
                          <span className="text-[8px] font-bold mt-1">NO PHOTO</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between h-24 sm:h-28 py-1">
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Registrant</div>
                        <div className="text-lg sm:text-xl font-black text-[#111827] uppercase leading-tight">{payload.nm || citizenProfile?.fullName || 'N/A'}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Registration ID</div>
                          <div className="text-xs font-mono font-bold text-[#EA580C]">{payload.id}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Group Size</div>
                          <div className="text-xs font-bold text-[#111827]">{payload.sz || journey?.pilgrimCount || '1'} Pilgrim(s)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Journey Info Box */}
                  <div className="border-[2px] border-[#005BAC] p-3 bg-blue-50/50 mt-4">
                    <div className="text-[10px] font-black text-[#005BAC] uppercase tracking-widest border-b border-[#005BAC]/20 pb-1 mb-2">Pilgrimage Itinerary & Clearance</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={10}/> Allocated Sector</div>
                        <div className="text-sm font-black text-[#111827] uppercase">{payload.sc || 'Sadhugram Sector'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1"><Calendar size={10}/> Valid Duration</div>
                        <div className="text-xs sm:text-sm font-bold text-[#047857] uppercase">{payload.dt || 'Approved Dates'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Authority */}
                <div className="mt-8 pt-4 border-t-[3px] border-[#111827] flex items-end justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono font-bold text-gray-500">DIGITAL SIGNATURE HASH</div>
                    <div className="text-[9px] font-mono font-black text-[#111827]">SHA256:{payload.id.split('-').pop()}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-8 border-b-2 border-dashed border-[#111827] mb-1">
                      {/* Fake Signature graphic */}
                      <svg viewBox="0 0 100 30" className="w-full h-full opacity-60">
                        <path d="M 10 20 Q 20 5 30 15 T 50 10 T 70 20 T 90 10" fill="none" stroke="#111827" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="text-[9px] font-black text-[#111827] uppercase tracking-wider">Authorised Signatory</div>
                    <div className="text-[7px] font-bold text-gray-500 uppercase">Chief Registration Officer</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PILGRIM_IDENTITY Layout */}
            {(payload.ct === 'PILGRIM_IDENTITY' || payload.ct === 'VEHICLE_PASS' || payload.ct === 'OFFICIAL_PASS') && (
              <div className="w-[323.5px] h-[204px] bg-white border-2 border-[#111827] rounded-md shadow-md flex flex-col justify-between overflow-hidden relative select-none shrink-0 mx-auto" style={{ width: '323.5px', height: '204px' }}>
                {/* Background security micro-pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, #005BAC 0px, #005BAC 1px, transparent 1px, transparent 10px)` }} />
                <div className="absolute right-12 top-8 opacity-10 pointer-events-none z-0 text-[#005BAC] font-black text-6xl rotate-[-20deg]">🕉️</div>
          
                {/* Top Banner Bar (34px) */}
                <div className="w-full bg-gradient-to-r from-[#005BAC] via-[#0A3161] to-[#005BAC] text-white px-2 py-1 flex items-center justify-between border-b-2 border-[#EA580C] z-10 shrink-0 h-[34px]">
                  <div className="w-6 h-6 rounded-full bg-white border border-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-[9px] font-black text-[#005BAC] leading-none">{GOVERNMENT_PORTAL_ENABLED ? 'GOV' : 'MHK27'}</span>
                  </div>
                  <div className="flex-1 text-center px-1">
                    <div className="text-[7.5px] font-bold text-amber-300 uppercase tracking-widest leading-none">{GOVERNMENT_PORTAL_ENABLED ? 'GOVERNMENT OF MAHARASHTRA' : 'NASHIK SIMHASTHA COMMITTEE'} • SIMHASTHA 2027</div>
                    <h2 className="text-[10px] font-black uppercase tracking-wider text-white leading-tight">{payload.ct.replace(/_/g, ' ')}</h2>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#047857] border border-white flex items-center justify-center shrink-0">
                    <span className="text-[7px] font-black text-white leading-none uppercase">MH27</span>
                  </div>
                </div>
          
                {/* Card Middle Section (140px) */}
                <div className="flex justify-between items-center px-2 py-1 z-10 flex-1 gap-2 overflow-hidden">
                  {/* Left: Photo Frame & Verified Badge */}
                  <div className="flex flex-col items-center shrink-0 w-[72px]">
                    <div className="w-[62px] h-[76px] border-2 border-[#005BAC] bg-[#F9FAFB] rounded-sm overflow-hidden relative shadow-xs flex items-center justify-center">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Holder Photo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-gray-400 text-center px-1">PASSPORT PHOTO</span>
                      )}
                    </div>
                    <div className="mt-1 w-full bg-[#047857] text-white text-[7.5px] font-black uppercase text-center py-0.5 rounded-sm tracking-wider shadow-2xs">
                      ✔ VERIFIED ID
                    </div>
                  </div>
          
                  {/* Center: Citizen & Journey Bio-data */}
                  <div className="flex-1 flex flex-col justify-center min-w-0 space-y-0.5 text-left">
                    <h3 className="text-[11px] font-black text-[#111827] uppercase leading-tight truncate tracking-tight" title={payload.nm || citizenProfile?.fullName}>
                      {payload.nm || citizenProfile?.fullName || 'AUTHORIZED PILGRIM'}
                    </h3>
                    
                    <div className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[8px] font-mono font-black text-[#EA580C] w-fit">
                      <span>REG ID:</span>
                      <span>{payload.id}</span>
                    </div>
          
                    <div className="flex items-center justify-between text-[8px] font-bold text-[#374151] pt-0.5 border-t border-gray-200">
                      <span>Gender/Age: <strong className="font-mono text-[#111827]">{payload.gd || 'N/A'} / {payload.db || 'N/A'}y</strong></span>
                      <span className="px-1.5 py-0.5 bg-red-100 border border-red-200 text-[#991B1B] font-black rounded text-[8px]">
                        BLOOD: {payload.bg || citizenProfile?.bloodGroup || 'O+'}
                      </span>
                    </div>
          
                    <div className="text-[8px] font-semibold text-[#4B5563] space-y-0.5 pt-0.5 truncate">
                      <div className="truncate"><strong>Zone:</strong> {payload.sc || 'Sadhugram Sector A'}</div>
                      <div className="truncate text-[#047857]"><strong>Valid:</strong> {payload.dt || 'N/A'}</div>
                      {payload.vh && payload.vh !== 'N/A' && (
                        <div className="truncate text-[#005BAC]"><strong>Vehicle:</strong> {payload.vh}</div>
                      )}
                    </div>
                  </div>
                </div>
          
                {/* Bottom Footer Band (30px) */}
                <div className="w-full bg-[#F3F4F6] border-t border-gray-300 px-2 py-1 flex items-center justify-between z-10 shrink-0 h-[30px] text-[7.5px] font-mono font-bold text-[#4B5563]">
                  <span>REF: {payload.id}</span>
                  <span className="text-[#005BAC] uppercase">CHIEF REGISTRATION OFFICER • NASHIK</span>
                </div>
              </div>
            )}

            {/* 3. EMERGENCY_CARD Layout */}
            {payload.ct === 'EMERGENCY_CARD' && (
              <div className="w-[323.5px] h-[204px] bg-white border-2 border-[#991B1B] rounded-md shadow-md flex flex-col justify-between overflow-hidden relative select-none shrink-0 mx-auto" style={{ width: '323.5px', height: '204px' }}>
                {/* Background medical pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, #991B1B 0px, #991B1B 1px, transparent 1px, transparent 10px)` }} />
                <div className="absolute right-14 top-8 opacity-10 pointer-events-none z-0 text-[#991B1B] font-black text-6xl rotate-[-15deg]">🏥</div>
          
                {/* Top Emergency Banner Bar (34px) */}
                <div className="w-full bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#991B1B] text-white px-2 py-1 flex items-center justify-between border-b-2 border-amber-400 z-10 shrink-0 h-[34px]">
                  <div className="w-6 h-6 rounded-full bg-white text-[#991B1B] flex items-center justify-center shrink-0 font-black text-xs shadow-2xs">
                    ➕
                  </div>
                  <div className="flex-1 text-center px-1">
                    <div className="text-[7.5px] font-bold text-amber-200 uppercase tracking-widest leading-none">HEALTH & FAMILY WELFARE DEPT • GOVT OF MH</div>
                    <h2 className="text-[10px] font-black uppercase tracking-wider text-white leading-tight">EMERGENCY MEDICAL & CONTACT CARD</h2>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white text-[#B91C1C] font-black text-[8px] flex items-center justify-center shrink-0">
                    SOS
                  </div>
                </div>
          
                {/* Card Middle Section (140px) */}
                <div className="flex justify-between items-center px-2 py-1 z-10 flex-1 gap-2 overflow-hidden">
                  {/* Left: Photo Frame & Huge Blood Group Badge */}
                  <div className="flex flex-col items-center shrink-0 w-[72px]">
                    <div className="w-[62px] h-[76px] border-2 border-[#991B1B] bg-[#FEF2F2] rounded-sm overflow-hidden relative shadow-xs flex items-center justify-center">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Holder Photo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-red-800 text-center px-1">PASSPORT PHOTO</span>
                      )}
                    </div>
                    <div className="mt-1 w-full bg-[#991B1B] text-white text-[8px] font-black uppercase text-center py-0.5 rounded-sm tracking-wider shadow-2xs">
                      BLOOD: {payload.bg || citizenProfile?.bloodGroup || 'O+'}
                    </div>
                  </div>
          
                  {/* Center: Emergency Medical & SOS Bio-data */}
                  <div className="flex-1 flex flex-col justify-center min-w-0 space-y-1 text-left">
                    <h3 className="text-[11px] font-black text-[#111827] uppercase leading-tight truncate tracking-tight" title={payload.nm || citizenProfile?.fullName}>
                      {payload.nm || citizenProfile?.fullName || 'AUTHORIZED PILGRIM'}
                    </h3>
                    
                    <div className="bg-red-50 border border-red-200 p-1 rounded text-[8px] text-[#991B1B] font-bold space-y-0.5">
                      <div className="truncate"><strong>Allergies:</strong> {citizenProfile?.medicalProfile?.knownAllergies || 'None reported / No drug allergy'}</div>
                      <div className="truncate"><strong>Conditions:</strong> {citizenProfile?.medicalProfile?.chronicDiseases?.length ? citizenProfile.medicalProfile.chronicDiseases.join(', ') : 'Fit for pilgrimage (No chronic illness)'}</div>
                    </div>
          
                    <div className="bg-amber-50 border border-amber-300 p-1 rounded text-[8px] text-[#78350F] font-bold">
                      <div className="truncate text-[8px] font-black text-[#B45309]">SOS PRIMARY CONTACT:</div>
                      <div className="truncate text-[#111827] font-black">{citizenProfile?.emergencyContacts?.primary?.name || 'Emergency Relative'} ({citizenProfile?.emergencyContacts?.primary?.relationship || 'Relative'})</div>
                      <div className="font-mono text-[#B91C1C] font-black text-[9px]">📞 {payload.ec || citizenProfile?.emergencyContacts?.primary?.phone || '112 / 108'}</div>
                    </div>
                  </div>
                </div>
          
                {/* Bottom Emergency Band (30px) */}
                <div className="w-full bg-[#FEF2F2] border-t border-red-200 px-2 py-1 flex items-center justify-between z-10 shrink-0 h-[30px] text-[7.5px] font-mono font-bold text-[#991B1B]">
                  <span>REF: {payload.id}</span>
                  <span className="bg-[#991B1B] text-white px-1.5 py-0.5 rounded font-bold">EMERGENCY HELPLINE: DIAL 108 / 112</span>
                </div>
              </div>
            )}

            {/* Security Footer */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 mt-8 flex items-start gap-4 shadow-sm">
              <BadgeCheck size={36} className="text-[#005BAC] shrink-0" />
              <div className="space-y-2">
                <div>
                  <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Digital Signature Hash</p>
                  <p className="text-[10px] font-mono font-bold text-stone-700 break-all leading-tight mt-0.5 select-all">{payload.vs}</p>
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Timestamp of Verification</p>
                  <p className="text-[10px] font-bold text-emerald-700 mt-0.5">{verificationTime}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div className="text-center mt-8 space-y-1">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            NIC Digital Clearance System &bull; Mahakumbh 2027
          </p>
          <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">
            This is an officially generated electronic record.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">Loading Verification...</div>}>
      <VerifyScreen />
    </Suspense>
  );
}
