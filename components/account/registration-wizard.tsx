'use client';

/**
 * @file RegistrationWizard
 * @description Government-compliant multi-step Journey Registration Wizard for Nashik-Trimbakeshwar 2027.
 * Single source of truth integration.
 */

import { useState, useEffect } from 'react';
import {
  Calendar, Building, Car, Plane, Train, Bus, ShieldCheck, QrCode, MapPin, HeartPulse, ChevronRight, ChevronLeft, Info, Check, Plus, Trash2, Upload, User, Map
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore, Journey } from '@/store/journey-store';
import { 
  PilgrimProfile, 
  createDefaultPilgrimProfile, 
  createDefaultAccommodation, 
  createDefaultVehicleInfo, 
  createAuditMetadata, 
  createDefaultJourneyMetadata 
} from '@/types/citizen.types';
import {
  generateJourneyId,
  generateRegistrationNumber,
  generatePermitNumber,
  generateVehiclePass,
  generateEmergencySheet,
  generatePilgrimId
} from '@/utils/registration-ids';
import { translate } from '@/utils/translate';
import { compressImageToDataUrl } from '@/utils/image-compression';
import { QrCodeRenderer } from '@/components/credentials/zones/QrCodeRenderer';
import { useRouter } from 'next/navigation';
import { CredentialType } from '@/types/credential.types';
import { generateQrPayload, getOfficialRegistrationRecord } from '@/utils/credential-generator';

interface RegistrationWizardProps {
  editTourId?: string | null;
  onClose: () => void;
}

const PURPOSE_OPTIONS = [
  { id: 'snan', label: 'Holy Snan' },
  { id: 'darshan', label: 'Trimbakeshwar Darshan' },
  { id: 'ramkund', label: 'Ramkund' },
  { id: 'camps', label: 'Saint Camps' },
  { id: 'volunteer', label: 'Volunteer Service' },
  { id: 'discourses', label: 'Spiritual Discourses' },
  { id: 'other', label: 'Other Purpose' }
];

const GHAT_OPTIONS = [
  'Ramkund', 'Godavari Ghats', 'Laxman Kund', 'Kushavarta Kund', 'Reserved Snan Zone'
];

const TEMPLE_OPTIONS = [
  'Trimbakeshwar', 'Kapaleshwar', 'Naroshankar', 'Other supported temples'
];

export function RegistrationWizard({ editTourId, onClose }: RegistrationWizardProps) {
  const router = useRouter();
  const { language, user } = useAuthStore();
  const { journey, citizenProfile, setJourney, updateJourney } = useJourneyStore();
  const [step, setStep] = useState(1);

  // --- Step 1 States: Journey Info ---
  const [journeyName, setJourneyName] = useState('');
  const [journeyType, setJourneyType] = useState<'Individual' | 'Family' | 'Group' | 'Organization'>('Individual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [arrivalMode, setArrivalMode] = useState('Train');
  const [arrivalPoint, setArrivalPoint] = useState('Nashik Road Railway Station');
  const [accommodationType, setAccommodationType] = useState<any>('Tent City');
  const [accommodationName, setAccommodationName] = useState('Sadhugram Sector-A Tent City');
  
  // New Step 1 Fields
  const [journeySector, setJourneySector] = useState('Sector A');
  const [journeyZone, setJourneyZone] = useState('Zone 1');
  const [vehicleNum, setVehicleNum] = useState('');
  const [vehicleCat, setVehicleCat] = useState('Car');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [numPilgrims, setNumPilgrims] = useState(1);

  // --- Step 2 States: Purpose of Visit ---
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(['darshan', 'snan']);

  // --- Step 3 States: Destinations ---
  const [selectedGhats, setSelectedGhats] = useState<string[]>(['Ramkund']);
  const [selectedTemples, setSelectedTemples] = useState<string[]>(['Trimbakeshwar']);

  // --- Step 4 States: Pilgrims ---
  const [pilgrims, setPilgrims] = useState<PilgrimProfile[]>([]);
  const [activePilgrimIdx, setActivePilgrimIdx] = useState(0);

  // --- Step 6 Generation States ---
  const [generatedId, setGeneratedId] = useState('');
  const [generatedRegNum, setGeneratedRegNum] = useState('');
  const [generatedTimestamp, setGeneratedTimestamp] = useState('');

  // Load existing journey if editing or pre-existing
  useEffect(() => {
    const active = journey;
    if (active) {
      setJourneyName(active.journeyName || '');
      setJourneyType(active.journeyType || 'Individual');
      setStartDate(active.startDate || '');
      setEndDate(active.endDate || '');
      setArrivalMode(active.arrivalMode || 'Train');
      setArrivalPoint(active.arrivalPoint || '');
      setAccommodationType(active.accommodation?.type || 'Tent City');
      setAccommodationName(active.accommodation?.name || '');
      setJourneySector(active.journeyMetadata?.sector || 'Sector A');
      setJourneyZone(active.journeyMetadata?.zone || 'Zone 1');
      setVehicleNum((active.vehicleInfo as any)?.vehicleNumber || (active.vehicleInfo as any)?.registrationNumber || '');
      setVehicleCat((active.vehicleInfo as any)?.vehicleType || (active.vehicleInfo as any)?.category || 'Car');
      setDriverName(active.vehicleInfo?.driverName || '');
      setDriverPhone(active.vehicleInfo?.driverMobile || '');
      setNumPilgrims(active.pilgrimCount || 1);
      
      setSelectedGhats(active.selectedGhats || []);
      setSelectedTemples(active.selectedTemples || []);
      setPilgrims(active.pilgrims || []);
      
      if (active.registrationNumber) {
        setGeneratedId(active.id);
        setGeneratedRegNum(active.registrationNumber);
        setGeneratedTimestamp(active.registrationTimestamp);
      }
    } else {
      setJourneyName(`${user?.name || 'My'} Mahakumbh Journey`);
      setStartDate('2027-10-14');
      setEndDate('2027-10-18');
    }
  }, [journey, user]);

  // Adjust pilgrim list length based on numPilgrims
  useEffect(() => {
    if (step === 4) {
      const targetCount = numPilgrims;
      let updated = [...pilgrims];
      if (updated.length < targetCount) {
        for (let i = updated.length; i < targetCount; i++) {
          const base = createDefaultPilgrimProfile(generatePilgrimId());
          updated.push({
            ...base,
            fullName: i === 0 ? user?.name || '' : '',
            gender: 'Male',
            mobile: i === 0 ? user?.phone || '' : '',
            address: {
              ...base.address,
              state: 'Maharashtra',
              country: 'India',
            },
            bloodGroup: 'O+ Positive',
          });
        }
      } else if (updated.length > targetCount) {
        updated = updated.slice(0, targetCount);
      }
      setPilgrims(updated);
      if (activePilgrimIdx >= targetCount) {
        setActivePilgrimIdx(targetCount - 1);
      }
    }
  }, [step, numPilgrims]);

  const handlePurposeToggle = (id: string) => {
    if (selectedPurposes.includes(id)) {
      setSelectedPurposes(selectedPurposes.filter((p) => p !== id));
    } else {
      setSelectedPurposes([...selectedPurposes, id]);
    }
  };

  const handleGhatToggle = (ghat: string) => {
    if (selectedGhats.includes(ghat)) {
      setSelectedGhats(selectedGhats.filter((g) => g !== ghat));
    } else {
      setSelectedGhats([...selectedGhats, ghat]);
    }
  };

  const handleTempleToggle = (temple: string) => {
    if (selectedTemples.includes(temple)) {
      setSelectedTemples(selectedTemples.filter((t) => t !== temple));
    } else {
      setSelectedTemples([...selectedTemples, temple]);
    }
  };

  const updatePilgrimField = (idx: number, fieldPath: string, val: any) => {
    const updated = [...pilgrims];
    const p = { ...updated[idx] };
    
    if (fieldPath.includes('.')) {
      const parts = fieldPath.split('.');
      let current: any = p;
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = { ...current[parts[i]] };
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = val;
    } else {
      (p as any)[fieldPath] = val;
    }
    
    updated[idx] = p as PilgrimProfile;
    setPilgrims(updated);
  };

  const updatePilgrimMedicalFlag = (idx: number, flag: keyof PilgrimProfile['medical'], val: boolean) => {
    const updated = [...pilgrims];
    updated[idx] = {
      ...updated[idx],
      medical: {
        ...updated[idx].medical,
        [flag]: val
      }
    };
    setPilgrims(updated);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!journeyName || !startDate || !endDate || !arrivalPoint) {
        alert('Please fill out all mandatory fields for Step 1.');
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        alert('Journey End Date must be equal to or after Start Date.');
        return;
      }
      if (numPilgrims < 1) {
        alert('Number of Pilgrims must be at least 1.');
        return;
      }
    }
    if (step === 2) {
      if (selectedPurposes.length === 0) {
        alert('Please select at least one purpose for your visit.');
        return;
      }
    }
    if (step === 3) {
      if (selectedGhats.length === 0 && selectedTemples.length === 0) {
        alert('Please select at least one destination (Ghat or Temple).');
        return;
      }
    }
    if (step === 4) {
      for (let i = 0; i < pilgrims.length; i++) {
        const p = pilgrims[i];
        if (!p.fullName || !p.dateOfBirth || !p.governmentId.number) {
          alert(`Please fill out Pilgrim ${i + 1} details (Name, Date of Birth and Government ID are mandatory).`);
          setActivePilgrimIdx(i);
          return;
        }
      }
    }

    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleRegister = () => {
    const jId = generatedId || generateJourneyId();
    const regNum = generatedRegNum || generateRegistrationNumber();
    const permitNum = generatePermitNumber();
    const vPassId = generateVehiclePass();
    const emsId = generateEmergencySheet();
    const timestamp = generatedTimestamp || new Date().toLocaleString();

    setGeneratedId(jId);
    setGeneratedRegNum(regNum);
    setGeneratedTimestamp(timestamp);

    const newJourney: Journey = {
      id: jId,
      registrationNumber: regNum,
      permitNumber: permitNum,
      vehiclePassId: vPassId,
      emergencySheetId: emsId,
      qrCode: jId,
      registrationTimestamp: timestamp,
      journeyName,
      journeyType,
      journeyStatus: 'Journey Registered',
      startDate,
      endDate,
      arrivalMode,
      arrivalPoint,
      accommodation: {
        ...createDefaultAccommodation(),
        type: accommodationType,
        name: accommodationName,
        address: accommodationName,
        sector: journeySector,
        zone: journeyZone,
        audit: createAuditMetadata(),
      },
      vehicleInfo: {
        ...createDefaultVehicleInfo(),
        vehicleNumber: vehicleNum,
        vehicleType: vehicleCat as any,
        driverName,
        driverMobile: driverPhone,
        vehiclePassId: vPassId,
        audit: createAuditMetadata(),
      },
      journeyMetadata: {
        ...createDefaultJourneyMetadata(),
        category: journeyType as any,
        purpose: selectedPurposes,
        arrivalStation: arrivalPoint,
        sector: journeySector,
        zone: journeyZone,
        expectedArrivalDate: startDate,
        expectedDepartureDate: endDate,
      },
      primaryRegistrantId: pilgrims[0]?.pilgrimId || '',
      emergencyContacts: pilgrims[0]?.emergencyContact?.phone || pilgrims[0]?.mobile || '',
      pilgrimCount: pilgrims.length,
      pilgrims: pilgrims.map(p => ({ ...p, audit: createAuditMetadata() })),
      selectedGhats,
      selectedTemples,
      snanBookings: journey?.snanBookings || [],
      darshanBookings: journey?.darshanBookings || [],
      journeyPlannerData: journey?.journeyPlannerData || null,
      journeyProgress: 25,
      timelineEvents: [],
      audit: createAuditMetadata(),
    };
    
    // Add metadata for new system requirements
    (newJourney as any).metadata = {
      ipAddress: '127.0.0.1',
      deviceId: 'mobile-app',
      registrationOfficer: 'Self-Registered',
      verificationOfficer: 'Pending'
    };
    setJourney(newJourney);
    setStep(6);
  };


  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="text-lg font-black text-[#111827] leading-tight">
            {journey ? 'Modify Mahakumbh Journey' : 'Register Your Mahakumbh Journey'}
          </h2>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mt-1">
            Step {step} of 6 • {step === 1 && 'Journey Information'}
            {step === 2 && 'Purpose of Visit'}
            {step === 3 && 'Select Destinations'}
            {step === 4 && 'Add Pilgrims'}
            {step === 5 && 'Review Summary'}
            {step === 6 && 'Confirmation & Credentials'}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={cn(
                'w-6 h-1 rounded transition-all',
                i <= step ? 'bg-[#FF9933]' : 'bg-[#FAFBFC] border border-[#E5E7EB]'
              )}
            />
          ))}
        </div>
      </div>

      <div className="text-xs space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-[#FF9933] uppercase tracking-wide">
              Step 1 — Journey Core Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Journey Name *</label>
                <input type="text" value={journeyName} onChange={(e) => setJourneyName(e.target.value)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" placeholder="e.g. Family Pilgrimage 2027" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Journey Type *</label>
                <select value={journeyType} onChange={(e) => setJourneyType(e.target.value as any)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC] font-semibold">
                  <option value="Individual">Individual (1 Pilgrim)</option>
                  <option value="Family">Family (Accompanying Relatives)</option>
                  <option value="Group">Group (General tour group)</option>
                  <option value="Organization">Organization (NGO/Ashram)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">{translate('journey_start', language)} *</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">{translate('journey_end', language)} *</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Arrival Mode *</label>
                <select value={arrivalMode} onChange={(e) => setArrivalMode(e.target.value)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]">
                  <option value="Train">Indian Railways Train</option>
                  <option value="Bus">State Transport / Private Bus</option>
                  <option value="Private Car">Private Vehicle (LMV)</option>
                  <option value="Flight">Flight Transit</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Arrival Point / Station *</label>
                <input type="text" value={arrivalPoint} onChange={(e) => setArrivalPoint(e.target.value)} placeholder="e.g. Nashik Road Railway Station" className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Journey Sector</label>
                <input type="text" value={journeySector} onChange={(e) => setJourneySector(e.target.value)} placeholder="e.g. Sector A" className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Journey Zone</label>
                <input type="text" value={journeyZone} onChange={(e) => setJourneyZone(e.target.value)} placeholder="e.g. Zone 1" className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Vehicle Registration Number</label>
                <input type="text" value={vehicleNum} onChange={(e) => setVehicleNum(e.target.value)} placeholder="e.g. MH-15-BD-4422" className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Vehicle Category</label>
                <select value={vehicleCat} onChange={(e) => setVehicleCat(e.target.value)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]">
                  <option>Car</option>
                  <option>SUV</option>
                  <option>Two Wheeler</option>
                  <option>Bus</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-[#374151] block">Number of Pilgrims *</label>
                <input type="number" min={1} max={50} value={numPilgrims} onChange={(e) => setNumPilgrims(parseInt(e.target.value) || 1)} className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none focus:border-[#005BAC]" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-[#FF9933] uppercase tracking-wide">
              Step 2 — Purpose of Visit
            </h4>
            <p className="text-[10px] text-[#6B7280]">
              Select all activities that apply to your pilgrimage during Simhastha 2027.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PURPOSE_OPTIONS.map((opt) => {
                const isSelected = selectedPurposes.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handlePurposeToggle(opt.id)}
                    className={cn(
                      'p-3 border rounded-xl cursor-pointer select-none transition-all flex items-center gap-2.5 font-bold',
                      isSelected ? 'border-[#005BAC] bg-[#F5F7FA] text-[#005BAC]' : 'border-[#E5E7EB] bg-white text-[#374151]'
                    )}
                  >
                    <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 rounded border-[#E5E7EB] accent-[#005BAC]" />
                    <span>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h4 className="font-extrabold text-xs text-[#FF9933] uppercase tracking-wide">
              Step 3 — Select Destinations
            </h4>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block">Ghat Locations</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GHAT_OPTIONS.map((ghat) => (
                  <label key={ghat} className="flex items-center gap-2.5 p-2.5 border border-[#E5E7EB] rounded-lg bg-white cursor-pointer font-semibold">
                    <input type="checkbox" checked={selectedGhats.includes(ghat)} onChange={() => handleGhatToggle(ghat)} className="w-4 h-4 accent-[#005BAC]" />
                    <span>{ghat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block">Temple Shrines</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLE_OPTIONS.map((temple) => (
                  <label key={temple} className="flex items-center gap-2.5 p-2.5 border border-[#E5E7EB] rounded-lg bg-white cursor-pointer font-semibold">
                    <input type="checkbox" checked={selectedTemples.includes(temple)} onChange={() => handleTempleToggle(temple)} className="w-4 h-4 accent-[#005BAC]" />
                    <span>{temple}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-[#FF9933] uppercase tracking-wide">
              Step 4 — Accompanying Pilgrims Information
            </h4>
            <div className="flex flex-wrap gap-1 border-b border-[#E5E7EB] pb-2">
              {pilgrims.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePilgrimIdx(i)}
                  className={cn(
                    'px-3 py-1.5 rounded font-bold text-[10px] transition-all cursor-pointer border-none bg-transparent',
                    activePilgrimIdx === i ? 'bg-[#005BAC] text-white' : 'text-[#374151] hover:bg-[#F5F7FA]'
                  )}
                >
                  Pilgrim {i + 1} {i === 0 && '(Leader)'}
                </button>
              ))}
            </div>

            {pilgrims[activePilgrimIdx] && (
              <div className="p-4 border border-[#E5E7EB] bg-[#FAFBFC] rounded-xl space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-24 h-24 border-2 border-dashed border-[#E5E7EB] bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#005BAC] relative shrink-0">
                    {pilgrims[activePilgrimIdx].photo ? (
                      <img src={pilgrims[activePilgrimIdx].photo} alt="Pilgrim preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload size={20} className="text-[#6B7280] mb-1" />
                        <span className="text-[8px] text-[#6B7280] font-bold uppercase text-center px-1">Upload Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressedUrl = await compressImageToDataUrl(file);
                            updatePilgrimField(activePilgrimIdx, 'photo', compressedUrl);
                          } catch (err) {
                            console.error('Failed to compress photo', err);
                          }
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full">
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Full Name *</label>
                      <input type="text" value={pilgrims[activePilgrimIdx].fullName} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'fullName', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827]" placeholder="e.g. Alok Sharma" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Date of Birth *</label>
                      <input type="date" value={pilgrims[activePilgrimIdx].dateOfBirth} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'dateOfBirth', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827]" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Gender *</label>
                      <select value={pilgrims[activePilgrimIdx].gender} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'gender', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827] font-semibold">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Government ID / Aadhaar *</label>
                      <input type="text" value={pilgrims[activePilgrimIdx].governmentId.number} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'governmentId.number', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827]" placeholder="Aadhaar or Passport ID" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Mobile Number *</label>
                      <input type="tel" value={pilgrims[activePilgrimIdx].mobile} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'mobile', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827]" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Emergency Contact *</label>
                      <input type="tel" value={pilgrims[activePilgrimIdx].emergencyContact.phone} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'emergencyContact.phone', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827]" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">State *</label>
                      <input type="text" value={pilgrims[activePilgrimIdx].address.state} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'address.state', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827]" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#374151] block">Blood Group *</label>
                      <select value={pilgrims[activePilgrimIdx].bloodGroup} onChange={(e) => updatePilgrimField(activePilgrimIdx, 'bloodGroup', e.target.value)} className="w-full p-2 border border-[#E5E7EB] rounded bg-white text-[#111827] font-semibold">
                        <option>A+ Positive</option>
                        <option>B+ Positive</option>
                        <option>O+ Positive</option>
                        <option>AB+ Positive</option>
                        <option>A- Negative</option>
                        <option>B- Negative</option>
                        <option>O- Negative</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                  <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block">Medical & Assistance Flags</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {([
                      { id: 'diabetes', label: 'Diabetes' },
                      { id: 'pregnant', label: 'Pregnant' },
                      { id: 'wheelchairRequired', label: 'Wheelchair Req.' },
                      { id: 'physicalDisability', label: 'Disabled (Divyang)' },
                      { id: 'regularMedication', label: 'Medical Assist.' },
                    ] as const).map((flag) => (
                      <label
                        key={flag.id}
                        className={cn(
                          'p-2 border rounded-lg flex items-center gap-1.5 cursor-pointer font-bold transition-all text-[9px]',
                          pilgrims[activePilgrimIdx].medical[flag.id]
                            ? 'border-red-500 bg-red-550/5 text-red-650'
                            : 'border-[#E5E7EB] bg-white text-[#374151]'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={pilgrims[activePilgrimIdx].medical[flag.id]}
                          onChange={(e) => updatePilgrimMedicalFlag(activePilgrimIdx, flag.id, e.target.checked)}
                          className="w-3.5 h-3.5 accent-red-650 shrink-0"
                        />
                        <span>{flag.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-[#FF9933] uppercase tracking-wide">
              Step 5 — Review Your Registration Details
            </h4>
            <div className="bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl p-4 space-y-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-1.5 border-b border-[#E5E7EB]/80 pb-3">
                <span className="font-black text-[#005BAC] text-[9px] uppercase tracking-widest block">Journey & Travel</span>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px] leading-relaxed">
                  <div>Journey Name: <span className="font-extrabold text-[#111827]">{journeyName}</span></div>
                  <div>Journey Type: <span className="font-extrabold text-[#111827]">{journeyType}</span></div>
                  <div>Start Date: <span className="font-extrabold text-[#111827]">{startDate}</span></div>
                  <div>End Date: <span className="font-extrabold text-[#111827]">{endDate}</span></div>
                  <div>Arrival Mode: <span className="font-extrabold text-[#111827]">{arrivalMode} ({arrivalPoint})</span></div>
                  <div>Vehicle Info: <span className="font-extrabold text-[#111827]">{vehicleNum || 'None'}</span></div>
                </div>
              </div>

              <div className="space-y-1.5 border-b border-[#E5E7EB]/80 pb-3">
                <span className="font-black text-[#005BAC] text-[9px] uppercase tracking-widest block">Selected Circuits</span>
                <div className="text-[11px] space-y-1">
                  <div>Ghats: <span className="font-extrabold text-[#111827]">{selectedGhats.join(', ') || 'None'}</span></div>
                  <div>Temples: <span className="font-extrabold text-[#111827]">{selectedTemples.join(', ') || 'None'}</span></div>
                </div>
              </div>

              <div className="space-y-1.5 border-b border-[#E5E7EB]/80 pb-3">
                <span className="font-black text-[#005BAC] text-[9px] uppercase tracking-widest block">Accommodation</span>
                <div className="text-[11px]">
                  Assigned Location: <span className="font-extrabold text-[#111827]">{accommodationName} ({accommodationType})</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-black text-[#005BAC] text-[9px] uppercase tracking-widest block">Pilgrims (Count: {pilgrims.length})</span>
                <div className="space-y-1.5">
                  {pilgrims.map((p, idx) => (
                    <div key={idx} className="p-2 border border-[#E5E7EB] bg-white rounded-lg flex items-center justify-between text-[10px]">
                      <div>
                        <span className="font-extrabold text-[#111827]">{idx + 1}. {p.fullName || 'Accompanying Pilgrim'}</span>
                        <span className="text-stone-500 font-semibold ml-2">({p.gender}, DOB: {p.dateOfBirth})</span>
                        <span className="block text-[8px] font-mono text-[#005BAC] mt-0.5">Gov ID: {p.governmentId.number || 'Pending'}</span>
                      </div>
                      <span className="font-bold text-[#FF9933] bg-[#FFF5EB] border border-[#FF9933]/15 px-2 py-0.5 rounded text-[8px] uppercase">
                        {p.bloodGroup}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5 text-center py-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-black text-emerald-600 uppercase tracking-wider">Registration Completed!</h4>
              <p className="text-[10px] text-[#6B7280]">Your Simhastha Mahakumbh 2027 Journey has been successfully registered.</p>
            </div>

            <div className="bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2.5 text-left text-[11px] font-sans">
              <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                <span className="font-bold text-[#6B7280]">Journey ID:</span>
                <span className="font-mono font-black text-[#005BAC]">{generatedId}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                <span className="font-bold text-[#6B7280]">Reg Number:</span>
                <span className="font-mono font-black text-[#FF9933]">{generatedRegNum}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#6B7280]">Timestamp:</span>
                <span className="font-bold text-[#111827]">{generatedTimestamp}</span>
              </div>
            </div>

            <div className="p-4 border border-[#E5E7EB] rounded-xl bg-white shadow-sm space-y-3">
              <span className="text-[9px] font-black uppercase text-[#005BAC] tracking-widest block">Digital QR Entry Code</span>
              <div className="bg-[#FAFBFC] p-4 border border-[#E5E7EB] inline-block rounded-xl flex justify-center">
                <QrCodeRenderer 
                  payload={generateQrPayload(
                    getOfficialRegistrationRecord(journey || {} as any, citizenProfile || {} as any),
                    CredentialType.REGISTRATION_CERTIFICATE,
                    generatedRegNum || 'REG-MH-2027-6045706'
                  )} 
                  size={150} 
                  showDownload={true} 
                />
              </div>
              <p className="text-[9px] text-[#6B7280] leading-relaxed">Present this scannable QR Gatepass at outer sector barricades for instant biometric queue entry clearance.</p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => router.push('/account/documents/showcase')} className="flex-1 py-2.5 border border-[#005BAC] text-[#005BAC] hover:bg-[#F5F7FA] font-bold rounded-xl uppercase tracking-wider text-[9px] transition-all cursor-pointer bg-transparent">
                Open Document Viewer
              </button>
              <button type="button" onClick={() => router.push('/account/documents/showcase')} className="flex-1 py-2.5 bg-[#005BAC] text-white hover:bg-[#0F4C81] font-bold rounded-xl uppercase tracking-wider text-[9px] transition-all cursor-pointer border-none">
                Export & Print Passes
              </button>
            </div>
          </div>
        )}
      </div>

      {step < 6 && (
        <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
          <button type="button" onClick={handleBack} className="px-4 py-2 border border-[#E5E7EB] text-[#374151] rounded font-bold uppercase tracking-wider text-[10px] transition-all hover:bg-[#FAFBFC] select-none cursor-pointer bg-transparent">
            {step === 1 ? translate('cancel', language) : translate('back', language)}
          </button>
          <button type="button" onClick={step === 5 ? handleRegister : handleNext} className="px-6 py-2 bg-[#005BAC] hover:bg-[#005BAC]/90 text-white rounded font-bold uppercase tracking-wider text-[10px] transition-all select-none border-none cursor-pointer">
            {step === 5 ? 'Register Journey' : translate('continue', language)}
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="flex justify-center pt-2">
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#FF9933] text-white hover:bg-[#E0852A] rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all select-none border-none cursor-pointer">
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
