import React from 'react';
import { QrCodeRenderer } from './QrCodeRenderer';
import type { GovernmentCredential } from '@/types/credential.types';
import { CredentialType } from '@/types/credential.types';
import { useCredentialContext } from '../engine/CredentialContext';
import { generateQrPayload, getOfficialRegistrationRecord } from '@/utils/credential-generator';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

interface Props {
  credential: GovernmentCredential;
}

export function SecurityZone({ credential }: Props) {
  const context = useCredentialContext();
  const record = getOfficialRegistrationRecord(context.journey, context.citizen);
  
  const isRegistrationCert = credential.credentialType === CredentialType.REGISTRATION_CERTIFICATE;
  const isIdCard = credential.credentialType === CredentialType.PILGRIM_IDENTITY;

  // For Registration Certificate and ID Card, the QR code is already rendered inside IdentityZone.
  // Returning null avoids rendering two QR codes and prevents vertical overflow into multiple pages.
  if (isRegistrationCert || isIdCard) {
    return null;
  }

  const qrPayload = generateQrPayload(record, credential.credentialType, credential.documentNumber);

  return (
    <div className="flex flex-col gap-3 mt-3 border-t-2 border-[#111827] pt-3 font-sans text-xs">
      <div className="flex gap-4 items-center bg-[#F9FAFB] p-3 border border-[#9CA3AF]">
        <div className="w-[125px] bg-white border-2 border-[#111827] p-1 flex items-center justify-center shrink-0 shadow-2xs">
          <QrCodeRenderer payload={qrPayload} size={110} showDownload={true} />
        </div>
        
        <div className="flex-1 space-y-1 text-left">
          <h4 className="text-[11px] font-black text-[#111827] uppercase tracking-wider">
            OFFICIALLY VERIFIABLE DIGITAL CREDENTIAL (QR VERIFICATION)
          </h4>
          <p className="text-[10px] text-[#374151] leading-snug">
            Scan using the official {GOVERNMENT_PORTAL_ENABLED ? 'Government ' : 'Simhastha '}Checkpoint App to verify pass authenticity and biometric clearance instantly.
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9.5px] font-mono text-[#111827] bg-white p-1.5 border border-[#E5E7EB] mt-1">
            <div><span className="font-bold">DOC ID:</span> {credential.documentNumber}</div>
            <div><span className="font-bold">ROSTER:</span> {record.registration.groupId || 'IND-01'}</div>
            <div><span className="font-bold">ISSUED:</span> {new Date(qrPayload.issueTimestamp || Date.now()).toLocaleDateString('en-IN')}</div>
            <div><span className="font-bold">STATUS:</span> <span className="text-[#047857] font-bold">{context.credential.status || 'ACTIVE'}</span></div>
          </div>
        </div>
      </div>

      {/* Compact Checkpoint Directions Table to fit neatly on single A4 sheet */}
      <div className="space-y-1 text-left">
        <h4 className="text-[10.5px] font-black text-[#111827] uppercase tracking-wider">
          CHECKPOINT & SECTOR ENTRY DIRECTIONS
        </h4>
        <table className="w-full border-collapse border border-[#6B7280] text-[10px] font-sans">
          <thead>
            <tr className="bg-[#E5E7EB] text-[#111827] font-bold border-b border-[#6B7280]">
              <th className="py-1 px-2 border-r border-[#6B7280] w-1/2">Mandatory Do's</th>
              <th className="py-1 px-2 w-1/2">Strict Don'ts</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-2 border-r border-[#6B7280]">✓ Keep this Digital/Printed pass ready at gate checkpoints</td>
              <td className="py-1 px-2">✕ Do not overspeed or obstruct designated sector ring routes</td>
            </tr>
            <tr className="border-b border-[#6B7280]">
              <td className="py-1 px-2">✕ Do not litter or carry prohibited/plastic items near ghats</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
