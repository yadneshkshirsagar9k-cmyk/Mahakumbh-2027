import React, { useMemo } from 'react';
import { DocumentZoneType, type ResolvedZone } from '@/types/rendering.types';
import { useCredentialContext } from './CredentialContext';
import { getOfficialRegistrationRecord, generateQrPayload } from '@/utils/credential-generator';
import { CredentialType, type GovernmentCredential } from '@/types/credential.types';
import type { OfficialRegistrationRecord } from '@/types/citizen.types';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

// Existing Zones
import { GovernmentHeaderZone } from '../zones/GovernmentHeaderZone';
import { IdentityZone } from '../zones/IdentityZone';
import { JourneyZone } from '../zones/JourneyZone';
import { SecurityZone } from '../zones/SecurityZone';
import { AuthorityZone } from '../zones/AuthorityZone';
import { VehicleZone } from '../zones/VehicleZone';
import { AccommodationZone } from '../zones/AccommodationZone';
import { MedicalEmergencyZone } from '../zones/MedicalEmergencyZone';
import { QrCodeRenderer } from '../zones/QrCodeRenderer';

import { DocumentBackgroundLayer } from '../layers/DocumentBackgroundLayer';
import { WatermarkLayer } from '../layers/WatermarkLayer';
import { SealLayer } from '../layers/SealLayer';

const PilgrimSmartIdCardView = ({ record, credential }: { record: OfficialRegistrationRecord; credential: GovernmentCredential }) => {
  const { identity, medical, registration, contact, journey } = record;
  const emergencyContact = contact.emergencyContacts?.primary || { name: 'Emergency Helpline', phone: '112 / 108', relationship: 'Official Support' };
  const aadhaarId = identity.identification?.find(id => id.type === 'Aadhaar');
  const maskedAadhaar = aadhaarId ? `XXXX-XXXX-${aadhaarId.number.slice(-4)}` : (identity.identification?.[0]?.number ? `XXXX-${identity.identification[0].number.slice(-4)}` : 'XXXX-XXXX-8899');
  const qrPayload = generateQrPayload(record, credential.credentialType, credential.documentNumber);

  return (
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
          <h2 className="text-[10px] font-black uppercase tracking-wider text-white leading-tight">PILGRIM SMART IDENTITY CARD</h2>
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
            {identity.photograph ? (
              <img src={identity.photograph} alt={identity.fullName} className="w-full h-full object-cover" />
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
          <h3 className="text-[11px] font-black text-[#111827] uppercase leading-tight truncate tracking-tight" title={identity.fullName}>
            {identity.fullName || 'AUTHORIZED PILGRIM'}
          </h3>
          
          <div className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[8px] font-mono font-black text-[#EA580C] w-fit">
            <span>REG ID:</span>
            <span>{registration.registrationNumber || credential.documentNumber}</span>
          </div>

          <div className="flex items-center justify-between text-[8px] font-bold text-[#374151] pt-0.5 border-t border-gray-200">
            <span>Aadhaar: <strong className="font-mono text-[#111827]">{maskedAadhaar}</strong></span>
            <span className="px-1.5 py-0.5 bg-red-100 border border-red-200 text-[#991B1B] font-black rounded text-[8px]">
              BLOOD: {medical.bloodGroup || 'O+'}
            </span>
          </div>

          <div className="text-[8px] font-semibold text-[#4B5563] space-y-0.5 pt-0.5 truncate">
            <div className="truncate"><strong>Zone:</strong> {journey.entryZone || 'Sadhugram Sector A / Gate 1'}</div>
            <div className="truncate text-[#047857]"><strong>Valid:</strong> {new Date(journey.arrivalDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(journey.departureDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
          </div>
        </div>

        {/* Right: High-density scannable QR & Digital Stamp */}
        <div className="flex flex-col items-center justify-between shrink-0 w-[78px] py-0.5">
          <div className="bg-white p-1 border border-gray-300 rounded shadow-2xs flex items-center justify-center shrink-0" style={{ width: '72px', height: '72px' }}>
            <QrCodeRenderer payload={qrPayload} size={64} showDownload={false} />
          </div>
          <div className="text-[6px] font-bold text-[#047857] uppercase tracking-tighter text-center mt-1 leading-none">
            NIC DIGITAL SEAL • BIOMETRIC OK
          </div>
        </div>
      </div>

      {/* Bottom Footer Band (30px) */}
      <div className="w-full bg-[#F3F4F6] border-t border-gray-300 px-2 py-1 flex items-center justify-between z-10 shrink-0 h-[30px] text-[7.5px] font-mono font-bold text-[#4B5563]">
        <span>REF: {credential.documentNumber}</span>
        <span className="text-[#005BAC] uppercase">CHIEF REGISTRATION OFFICER • NASHIK</span>
      </div>
    </div>
  );
};

const EmergencySmartIdCardView = ({ record, credential }: { record: OfficialRegistrationRecord; credential: GovernmentCredential }) => {
  const { identity, medical, contact } = record;
  const emergencyContact = contact.emergencyContacts?.primary || { name: 'Emergency Helpline', phone: '112 / 108', relationship: 'Official Support' };
  const qrPayload = generateQrPayload(record, credential.credentialType, credential.documentNumber);

  return (
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
          <div className="text-[7.5px] font-bold text-amber-200 uppercase tracking-widest leading-none">{GOVERNMENT_PORTAL_ENABLED ? 'HEALTH & FAMILY WELFARE DEPT • GOVT OF MH' : 'HEALTH & FAMILY WELFARE SERVICES • MHK27'}</div>
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
            {identity.photograph ? (
              <img src={identity.photograph} alt={identity.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[8px] font-bold text-red-800 text-center px-1">PASSPORT PHOTO</span>
            )}
          </div>
          <div className="mt-1 w-full bg-[#991B1B] text-white text-[8px] font-black uppercase text-center py-0.5 rounded-sm tracking-wider shadow-2xs">
            BLOOD: {medical.bloodGroup || 'O+'}
          </div>
        </div>

        {/* Center: Emergency Medical & SOS Bio-data */}
        <div className="flex-1 flex flex-col justify-center min-w-0 space-y-1 text-left">
          <h3 className="text-[11px] font-black text-[#111827] uppercase leading-tight truncate tracking-tight" title={identity.fullName}>
            {identity.fullName || 'AUTHORIZED PILGRIM'}
          </h3>
          
          <div className="bg-red-50 border border-red-200 p-1 rounded text-[8px] text-[#991B1B] font-bold space-y-0.5">
            <div className="truncate"><strong>Allergies:</strong> {medical.allergies || 'None reported / No drug allergy'}</div>
            <div className="truncate"><strong>Conditions:</strong> {medical.chronicDiseases?.length ? medical.chronicDiseases.join(', ') : 'Fit for pilgrimage (No chronic illness)'}</div>
          </div>

          <div className="bg-amber-50 border border-amber-300 p-1 rounded text-[8px] text-[#78350F] font-bold">
            <div className="truncate text-[8px] font-black text-[#B45309]">SOS PRIMARY CONTACT:</div>
            <div className="truncate text-[#111827] font-black">{emergencyContact.name} ({emergencyContact.relationship || 'Relative'})</div>
            <div className="font-mono text-[#B91C1C] font-black text-[9px]">📞 {emergencyContact.phone}</div>
          </div>
        </div>

        {/* Right: Paramedic Scannable QR & Stamp */}
        <div className="flex flex-col items-center justify-between shrink-0 w-[78px] py-0.5">
          <div className="bg-white p-1 border border-red-300 rounded shadow-2xs flex items-center justify-center shrink-0" style={{ width: '72px', height: '72px' }}>
            <QrCodeRenderer payload={qrPayload} size={64} showDownload={false} />
          </div>
          <div className="text-[6px] font-bold text-[#991B1B] uppercase tracking-tighter text-center mt-1 leading-none">
            PARAMEDIC EHR RECORD • INSTANT ACCESS
          </div>
        </div>
      </div>

      {/* Bottom Emergency Band (30px) */}
      <div className="w-full bg-[#FEF2F2] border-t border-red-200 px-2 py-1 flex items-center justify-between z-10 shrink-0 h-[30px] text-[7.5px] font-mono font-bold text-[#991B1B]">
        <span>REF: {credential.documentNumber}</span>
        <span className="bg-[#991B1B] text-white px-1.5 py-0.5 rounded font-bold">EMERGENCY HELPLINE: DIAL 108 / 112</span>
      </div>
    </div>
  );
};

export function ZoneResolver({ resolvedZones }: { resolvedZones: ResolvedZone[] }) {
  const context = useCredentialContext();
  
  // Sort zones by order
  const sortedZones = [...resolvedZones].sort((a, b) => a.order - b.order);

  // Derive the OfficialRegistrationRecord (the Aggregation Layer) just-in-time
  // so that all zones get the strictly modeled schema.
  const record = useMemo(() => {
    return getOfficialRegistrationRecord(context.journey, context.citizen);
  }, [context.journey, context.citizen]);

  const renderZone = (zone: ResolvedZone) => {
    if (!zone.isVisible) return null;

    switch (zone.type) {
      case DocumentZoneType.BACKGROUND:
        return null; // Backgrounds wrap the whole thing, handled higher up or specially
      case DocumentZoneType.WATERMARK:
        return <WatermarkLayer key={zone.id} />;
      case DocumentZoneType.SEAL:
        return <SealLayer key={zone.id} />;
      case DocumentZoneType.HEADER:
        return (
          <GovernmentHeaderZone 
            key={zone.id}
            department={context.spec.department}
            documentTitle={context.spec.title}
            documentNumber={context.credential.documentNumber}
          />
        );
      case DocumentZoneType.IDENTITY:
        return <IdentityZone key={zone.id} record={record} />;
      case DocumentZoneType.JOURNEY:
        return <JourneyZone key={zone.id} record={record} />;
      case DocumentZoneType.VEHICLE:
        return <VehicleZone key={zone.id} record={record} credentialType={context.credential.credentialType} />;
      case DocumentZoneType.ACCOMMODATION:
        return <AccommodationZone key={zone.id} record={record} />;
      case DocumentZoneType.MEDICAL:
        return <MedicalEmergencyZone key={zone.id} record={record} compact={false} />;
      case DocumentZoneType.EMERGENCY:
        return <MedicalEmergencyZone key={zone.id} record={record} compact={true} />;
      case DocumentZoneType.SECURITY_QR:
        return (
          <SecurityZone 
            key={zone.id}
            credential={context.credential}
          />
        );
      case DocumentZoneType.AUTHORITY:
        return (
          <AuthorityZone 
            key={zone.id}
            credential={context.credential}
          />
        );
      default:
        // For unmapped zones, fail gracefully
        return null;
    }
  };

  // Dedicated Smart ID Wallet Card layouts when format is idCard or credential is card type
  if (context.credential.credentialType === CredentialType.PILGRIM_IDENTITY || context.format === 'idCard') {
    if (context.credential.credentialType === CredentialType.EMERGENCY_CARD) {
      return (
        <DocumentBackgroundLayer format={context.format}>
          <div className="w-full h-full flex items-center justify-center bg-[#FEF2F2] overflow-hidden">
            <EmergencySmartIdCardView record={record} credential={context.credential} />
          </div>
        </DocumentBackgroundLayer>
      );
    }
    return (
      <DocumentBackgroundLayer format={context.format}>
        <div className="w-full h-full flex items-center justify-center bg-[#F3F4F6] overflow-hidden">
          <PilgrimSmartIdCardView record={record} credential={context.credential} />
        </div>
      </DocumentBackgroundLayer>
    );
  }

  if (context.credential.credentialType === CredentialType.EMERGENCY_CARD) {
    return (
      <DocumentBackgroundLayer format={context.format}>
        <div className="w-full h-full flex items-center justify-center bg-[#FEF2F2] overflow-hidden">
          <EmergencySmartIdCardView record={record} credential={context.credential} />
        </div>
      </DocumentBackgroundLayer>
    );
  }

  // Background and absolute layers are extracted
  const absoluteLayers = sortedZones.filter(z => 
    z.type === DocumentZoneType.WATERMARK || z.type === DocumentZoneType.SEAL
  );
  
  const contentZones = sortedZones.filter(z => 
    z.type !== DocumentZoneType.WATERMARK && 
    z.type !== DocumentZoneType.SEAL &&
    z.type !== DocumentZoneType.BACKGROUND
  );

  return (
    <DocumentBackgroundLayer format={context.format}>
      {absoluteLayers.map(renderZone)}
      <div className="relative z-50 p-5 md:p-6 flex flex-col h-full bg-white/95 justify-between overflow-hidden" style={{ minHeight: '100%' }}>
        {contentZones.map(zone => {
          // Add spacer before QR/Authority to push to bottom
          if (zone.type === DocumentZoneType.SECURITY_QR || zone.type === DocumentZoneType.AUTHORITY) {
            // Find if this is the first of the bottom elements to insert a spacer before it
            const isFirstBottom = contentZones.find(z => z.type === DocumentZoneType.SECURITY_QR || z.type === DocumentZoneType.AUTHORITY) === zone;
            if (isFirstBottom) {
              return (
                <React.Fragment key={`frag-${zone.id}`}>
                  <div className="flex-1 min-h-[4px]" />
                  {renderZone(zone)}
                </React.Fragment>
              );
            }
          }
          return renderZone(zone);
        })}
      </div>
    </DocumentBackgroundLayer>
  );
}
