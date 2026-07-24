import React from 'react';
import { type OfficialRegistrationRecord, formatAddress } from '@/types/citizen.types';
import { useCredentialContext } from '../engine/CredentialContext';
import { QrCodeRenderer } from './QrCodeRenderer';
import { CredentialType } from '@/types/credential.types';
import { generateQrPayload } from '@/utils/credential-generator';

interface Props {
  record: OfficialRegistrationRecord;
}

export function IdentityZone({ record }: Props) {
  const context = useCredentialContext();
  const { identity, medical, derived, registration, contact, address, journey, travel, accommodation } = record;
  
  const aadhaarId = identity.identification?.find(id => id.type === 'Aadhaar');
  const maskedAadhaar = aadhaarId 
    ? `XXXX-XXXX-${aadhaarId.number.slice(-4)}` 
    : (identity.identification?.[0]?.number ? `XXXX-${identity.identification[0].number.slice(-4)}` : 'XXXX-XXXX-8899');

  const fullAddressStr = address ? formatAddress(address) : 'Nashik, Maharashtra - 422001';

  const emergencyContact = contact.emergencyContacts?.primary || { name: 'Emergency Helpline', phone: '112 / 108', relationship: 'Official Support' };
  const vehicleStr = travel.vehicle?.vehicleNumber ? `${travel.vehicle.vehicleNumber} (${travel.vehicle.vehicleType || 'Car'})` : (travel.modeOfTravel || 'Public Transit / Train');
  const accommodationStr = accommodation.camp || accommodation.details?.name ? `${accommodation.camp || accommodation.details?.name} (Sector ${accommodation.sector || 'Sadhugram'})` : 'Designated Pilgrim Camp Sector';

  const isRegistrationCert = context.credential.credentialType === CredentialType.REGISTRATION_CERTIFICATE;
  const isIdCard = context.credential.credentialType === CredentialType.PILGRIM_IDENTITY;
  const isPermitOrEmergency = !isRegistrationCert && !isIdCard;
  const qrPayload = generateQrPayload(record, context.credential.credentialType, context.credential.documentNumber);

  if (isPermitOrEmergency) {
    return (
      <div className="mt-3 font-sans text-xs text-[#111827]">
        <div className="bg-[#111827] text-white px-3 py-1.5 text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
          <span>AUTHORIZED PASS HOLDER IDENTITY RECORD</span>
          <span className="text-[9px] bg-white text-[#111827] px-1.5 py-0.5 rounded font-bold">BIOMETRIC CLEARED</span>
        </div>
        <div className="border border-[#6B7280] bg-white p-3 flex items-center gap-4">
          <div className="w-20 h-24 border-2 border-[#111827] bg-[#F9FAFB] shrink-0 flex items-center justify-center overflow-hidden relative shadow-2xs">
            {identity.photograph ? (
              <img src={identity.photograph} alt={identity.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] font-bold text-gray-400">NO PHOTO</span>
            )}
          </div>
          <table className="w-full border-collapse text-[10.5px]">
            <tbody>
              <tr className="border-b border-[#E5E7EB]">
                <td className="py-1 px-2 font-bold text-[#374151] w-[30%] bg-[#F9FAFB]">Full Name</td>
                <td className="py-1 px-2 font-black text-sm uppercase text-[#111827]">{identity.fullName || 'N/A'}</td>
                <td className="py-1 px-2 font-bold text-[#374151] w-[25%] bg-[#F9FAFB]">Aadhaar / ID Ref</td>
                <td className="py-1 px-2 font-mono font-bold text-[#111827]">{maskedAadhaar}</td>
              </tr>
              <tr className="border-b border-[#E5E7EB]">
                <td className="py-1 px-2 font-bold text-[#374151] bg-[#F9FAFB]">Contact Mobile</td>
                <td className="py-1 px-2 font-mono font-bold text-[#111827]">{contact.primaryMobile || '+91 98765 43210'}</td>
                <td className="py-1 px-2 font-bold text-[#374151] bg-[#F9FAFB]">Blood Group</td>
                <td className="py-1 px-2 font-bold text-[#991B1B]">{medical.bloodGroup || 'O+'}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 font-bold text-[#374151] bg-[#F9FAFB]">Emergency Phone</td>
                <td className="py-1 px-2 font-mono font-bold text-[#991B1B]">{emergencyContact.phone} ({emergencyContact.name})</td>
                <td className="py-1 px-2 font-bold text-[#374151] bg-[#F9FAFB]">Verification Status</td>
                <td className="py-1 px-2 font-bold text-[#047857] uppercase">{context.credential.status || 'Verified & Active'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Dedicated ID Card Layout when PILGRIM_IDENTITY
  if (isIdCard) {
    return (
      <div className="flex flex-col gap-3 font-sans text-xs text-[#111827] p-2 bg-white border border-[#6B7280]">
        <div className="flex justify-between items-center gap-3 pb-2 border-b-2 border-[#111827]">
          <div className="w-20 h-24 border border-[#111827] bg-[#F9FAFB] shrink-0 overflow-hidden relative">
            {identity.photograph ? (
              <img src={identity.photograph} alt={identity.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] font-bold text-gray-400 p-2 text-center block">NO PHOTO</span>
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <h2 className="text-sm font-black uppercase tracking-tight text-[#111827]">{identity.fullName || 'Authorized Pilgrim'}</h2>
            <div className="text-[10px] font-mono font-bold text-[#EA580C]">ID: {registration.registrationNumber || context.credential.documentNumber}</div>
            <div className="text-[9.5px] font-bold text-[#374151]">Aadhaar: {maskedAadhaar} | Blood: <span className="text-[#991B1B] font-black">{medical.bloodGroup || 'O+'}</span></div>
            <div className="text-[9px] text-[#374151]">Emergency: {emergencyContact.phone}</div>
          </div>
          <div className="shrink-0">
            <QrCodeRenderer payload={qrPayload} size={85} showDownload={false} />
          </div>
        </div>
      </div>
    );
  }

  // Full Char Dham Registration Letter Layout (REGISTRATION_CERTIFICATE)
  return (
    <div className="flex flex-col gap-3 font-sans text-xs text-[#111827]">
      {/* Top Block: Photograph alongside Large QR Code (as in official Uttarakhand Char Dham reference letter) */}
      <div className="flex justify-between items-start gap-4 pb-3 border-b-2 border-[#111827]">
        {/* Left: Photograph */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-28 h-36 border-2 border-[#111827] bg-[#F9FAFB] flex items-center justify-center overflow-hidden relative shadow-xs">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#EA580C]" />
            {identity.photograph ? (
              <img src={identity.photograph} alt={identity.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
                <span className="text-[8px]">Attached</span>
              </div>
            )}
          </div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1 text-[#374151]">
            Holder Photograph
          </span>
        </div>

        {/* Center Info Header Summary */}
        <div className="flex-1 flex flex-col justify-center space-y-1 py-1 px-2">
          <div className="inline-block px-2 py-0.5 bg-[#047857] text-white text-[9.5px] font-black uppercase tracking-widest self-start rounded-xs">
            OFFICIAL REGISTRATION CLEARANCE
          </div>
          <h2 className="text-base font-black uppercase text-[#111827] tracking-tight leading-tight pt-0.5">
            {identity.fullName || 'Authorized Pilgrim'}
          </h2>
          <div className="text-[11px] font-mono font-bold text-[#EA580C]">
            REG NO: {registration.registrationNumber || context.credential.documentNumber}
          </div>
          <div className="text-[10.5px] font-semibold text-[#374151]">
            Status: <span className="text-[#047857] font-bold uppercase">{context.credential.status || 'Verified & Active'}</span>
          </div>
          <div className="text-[9.5px] text-gray-500 font-mono pt-0.5">
            Issued: {new Date(context.credential.issueDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | Valid for Mahakumbh 2027
          </div>
        </div>

        {/* Right: Top QR Code (Juxtaposed right next to holder info) */}
        <div className="flex flex-col items-center shrink-0">
          <div className="border-2 border-[#111827] p-1.5 bg-white flex flex-col items-center justify-center shadow-xs">
            <QrCodeRenderer payload={qrPayload} size={115} showDownload={true} />
          </div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1 text-[#374151]">
            Scan to Verify Online
          </span>
        </div>
      </div>

      {/* Tabular Data Presentation (Exact Char Dham Style 2-Column Table) */}
      <div className="mt-0.5">
        <div className="bg-[#111827] text-white px-3 py-1 text-[10.5px] font-black uppercase tracking-widest">
          1. PILGRIM & REGISTRATION CONTEXT DETAILS
        </div>
        <table className="w-full border-collapse border border-[#6B7280] text-[10.5px] font-sans">
          <tbody>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] w-[35%] text-[#374151]">Unique Registration No</td>
              <td className="py-1 px-3 font-mono font-black text-[#EA580C] text-xs">{registration.registrationNumber || context.credential.documentNumber}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Group ID / Roster Ref</td>
              <td className="py-1 px-3 font-mono font-bold">{registration.groupId || registration.registrationNumber || 'INDIVIDUAL-01'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Journey ID</td>
              <td className="py-1 px-3 font-mono font-bold">{registration.journeyId || journey.journeyName || 'MK-JR-2027'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Full Name of Holder</td>
              <td className="py-1 px-3 font-bold uppercase text-xs">{identity.fullName || 'N/A'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Gender / Age</td>
              <td className="py-1 px-3 font-bold uppercase">{identity.gender || 'N/A'} / {derived.age || 'N/A'} YRS</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Aadhaar Card Number</td>
              <td className="py-1 px-3 font-mono font-bold tracking-wider">{maskedAadhaar}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Diseases / Medical Information</td>
              <td className="py-1 px-3 font-bold text-[#991B1B]">
                Blood Group: {medical.bloodGroup || 'O+'} {medical.chronicDiseases?.length ? `| Conditions: ${medical.chronicDiseases.join(', ')}` : '| No Chronic Illness Reported'}
              </td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Mobile Number</td>
              <td className="py-1 px-3 font-mono font-bold">{contact.primaryMobile || '+91 98765 43210'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Email Address</td>
              <td className="py-1 px-3 font-mono">{contact.email || 'pilgrim@kumbh.gov.in'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Residential Address</td>
              <td className="py-1 px-3 font-medium">{fullAddressStr}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">City / District / State / Country</td>
              <td className="py-1 px-3 font-semibold uppercase">{address?.villageTownCity || 'Nashik'} / {address?.district || 'Nashik'} / {address?.state || 'Maharashtra'} / {address?.country || identity.country || 'India'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Emergency Contact No</td>
              <td className="py-1 px-3 font-mono font-bold text-[#991B1B]">{emergencyContact.phone} ({emergencyContact.name} - {emergencyContact.relationship || 'Contact'})</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Profession / Occupation</td>
              <td className="py-1 px-3 font-semibold">{identity.occupation || 'Self Employed / Pilgrim'}</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Mode of Travel / Vehicle</td>
              <td className="py-1 px-3 font-semibold uppercase">{vehicleStr}</td>
            </tr>
            <tr>
              <td className="py-1 px-3 font-bold bg-[#F9FAFB] border-r border-[#6B7280] text-[#374151]">Designated Accommodation</td>
              <td className="py-1 px-3 font-semibold">{accommodationStr}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
