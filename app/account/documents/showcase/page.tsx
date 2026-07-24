'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCredentialStore } from '@/store/credential-store';
import { useJourneyStore } from '@/store/journey-store';
import { CredentialType } from '@/types/credential.types';
import { CredentialSpecs } from '@/config/credential-specs';
import { DocumentFormat } from '@/config/document-tokens';
import { RenderMode, RenderProfile } from '@/types/rendering.types';
import { ExportTarget, ExportJob } from '@/types/export.types';
import { ExportEngine } from '@/components/credentials/export/ExportEngine';
import { CredentialGenerationService } from '@/services/credential-generation.service';

import { CredentialRenderingEngine } from '@/components/credentials/engine/CredentialRenderingEngine';
import { RegistrationCertificateBlueprint } from '@/components/credentials/blueprints/RegistrationCertificateBlueprint';
import { VehiclePassBlueprint } from '@/components/credentials/blueprints/VehiclePassBlueprint';
import { PilgrimSmartIdFrontBlueprint } from '@/components/credentials/blueprints/PilgrimSmartIdFrontBlueprint';
import { EmergencyMedicalCardBlueprint } from '@/components/credentials/blueprints/EmergencyMedicalCardBlueprint';

import { ArrowLeft, Monitor, Smartphone, Printer, Settings, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CredentialShowcasePage() {
  const router = useRouter();
  const citizenProfile = useJourneyStore(state => state.citizenProfile);
  const journey = useJourneyStore(state => state.journey);
  const getCredentialsByCitizen = useCredentialStore(state => state.getCredentialsByCitizen);
  const syncJourneyCredentials = useCredentialStore(state => state.syncJourneyCredentials);
  
  const [mounted, setMounted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<DocumentFormat>('a4');
  const [renderMode, setRenderMode] = useState<RenderMode>(RenderMode.PREVIEW);
  const [renderProfile, setRenderProfile] = useState<RenderProfile>(RenderProfile.CITIZEN_VIEW);
  const [activeCredentialType, setActiveCredentialType] = useState<CredentialType | null>(null);
  
  // Export State
  const [isExporting, setIsExporting] = useState(false);

  // Single source of truth: the Document Viewer DOM ref
  const viewerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type') as CredentialType | null;
      if (typeParam) {
        setActiveCredentialType(typeParam);
      }
    }
    const currentJourney = useJourneyStore.getState().journey;
    const currentCitizen = useJourneyStore.getState().citizenProfile;
    if (currentJourney && currentCitizen) {
      syncJourneyCredentials(currentJourney, currentCitizen);
    }
  }, [syncJourneyCredentials]);

  if (!mounted) {
    return <div className="p-8 text-center text-gray-500">Loading showcase...</div>;
  }

  // Ensure robust fallback for citizenProfile and journey so the viewer is always 100% functional
  const activeCitizen = (citizenProfile || {
    citizenId: 'CIT-MH-2027-001',
    fullName: 'PRATIK SAKHARE',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    primaryMobile: '+91 98765 43210',
    email: 'pratik@mahakumbh2027.gov.in',
    address: { state: 'Maharashtra', district: 'Nashik', pinCode: '422001' },
    governmentIds: [{ type: 'Aadhaar', number: 'XXXX-XXXX-8899', isVerified: true }],
    photograph: ''
  }) as any;

  const activeJourney = (journey || {
    id: 'JRN-2027-8899',
    journeyName: 'Nashik-Trimbakeshwar Simhastha Mahakumbh 2027',
    registrationNumber: 'REG-MH-2027-6045706',
    journeyStatus: 'Approved',
    journeyType: 'Holy Snan & Darshan',
    startDate: '2027-07-19',
    endDate: '2027-07-25',
    pilgrimCount: 1,
    snanBookings: [{ ghatName: 'Ramkund Main Ghat - VIP Sector', date: '2027-07-20', timeSlot: '05:00 AM - 06:30 AM', status: 'Confirmed' }],
    darshanBookings: [{ templeName: 'Trimbakeshwar Shiva Temple', date: '2027-07-21', timeSlot: '07:00 AM - 08:30 AM', status: 'Confirmed' }],
    pilgrims: [{ fullName: 'PRATIK SAKHARE', gender: 'Male', age: 41, relationship: 'Self', bloodGroup: 'O+', idNumber: 'XXXX-XXXX-8899' }],
    vehicleInfo: { vehicleType: 'Car', vehicleNumber: 'MH-15-AB-1234', driverName: 'Pratik Sakhare', driverPhone: '+91 98765 43210' },
    emergencyContacts: { primaryName: 'Dr. Ramesh Sakhare', primaryPhone: '+91 98230 11223', relationship: 'Brother' },
    journeyProgress: 100,
    registeredOn: '2027-07-15'
  }) as any;

  const storedCredentials = getCredentialsByCitizen(activeCitizen.citizenId || '').filter(c => c.isActive);
  const credentials = storedCredentials.length > 0 ? storedCredentials : [
    CredentialGenerationService.generateNewCredential(CredentialType.REGISTRATION_CERTIFICATE, activeJourney, activeCitizen),
    CredentialGenerationService.generateNewCredential(CredentialType.PILGRIM_IDENTITY, activeJourney, activeCitizen),
    CredentialGenerationService.generateNewCredential(CredentialType.VEHICLE_PASS, activeJourney, activeCitizen),
    CredentialGenerationService.generateNewCredential(CredentialType.EMERGENCY_CARD, activeJourney, activeCitizen),
  ];

  if (activeCredentialType === null && credentials.length > 0) {
    setActiveCredentialType(credentials[0].credentialType);
  }

  if (credentials.length === 0) {
    return (
      <div className="p-8 text-center bg-amber-50 text-amber-800 rounded-xl">
        <h2 className="font-bold mb-2">No Credentials Found</h2>
        <p className="text-sm">Please register a journey to preview credentials.</p>
        <button onClick={() => router.push('/account/dashboard')} className="mt-4 px-4 py-2 bg-amber-600 text-white rounded font-bold text-xs">Return to Dashboard</button>
      </div>
    );
  }

  let activeCred = credentials.find(c => c.credentialType === activeCredentialType);
  if (!activeCred && activeCredentialType) {
    activeCred = CredentialGenerationService.generateNewCredential(activeCredentialType, activeJourney, activeCitizen);
  }
  const activeSpec = activeCred ? CredentialSpecs[activeCred.credentialType] : null;

  let activeBlueprint = null;
  if (activeCred) {
    switch (activeCred.credentialType) {
      case CredentialType.REGISTRATION_CERTIFICATE:
        activeBlueprint = RegistrationCertificateBlueprint;
        break;
      case CredentialType.VEHICLE_PASS:
        activeBlueprint = VehiclePassBlueprint;
        break;
      case CredentialType.PILGRIM_IDENTITY:
        activeBlueprint = PilgrimSmartIdFrontBlueprint;
        break;
        break;
      case CredentialType.EMERGENCY_CARD:
        activeBlueprint = EmergencyMedicalCardBlueprint;
        break;
      default:
        activeBlueprint = null;
    }
  }

  const contextData = activeCred && activeSpec ? {
    credential: activeCred,
    citizen: activeCitizen,
    journey: activeJourney,
    spec: activeSpec,
    format: selectedFormat,
    renderMode,
    renderProfile,
    locale: 'en' as const,
    accessibility: { highContrast: false, largeText: false, printFriendly: true, reducedMotion: true },
    featureFlags: {}
  } as any : null;

  /**
   * Export handler — passes the VIEWER DOM node directly to the ExportEngine.
   * No hidden template. No duplicate render. The viewer IS the print source.
   */
  const handleExport = async (target: ExportTarget) => {
    if (!activeCred || !activeSpec || !viewerRef.current) return;
    
    setIsExporting(true);
    
    const job = ExportEngine.createJob({
      credential: activeCred,
      renderProfile: RenderProfile.CITIZEN_PRINT,
      exportTarget: target,
      printProfile: {
        id: 'standard-print',
        format: selectedFormat,
        paperSize: selectedFormat === 'idCard' ? 'ID_CARD' : selectedFormat === 'a5' ? 'A5' : 'A4',
        orientation: selectedFormat === 'idCard' ? 'landscape' : 'portrait',
        margins: 'standard',
        grayscale: false
      },
      mimeType: target === ExportTarget.PDF ? 'application/pdf' : 'text/html',
      securityConfiguration: {
        includeWatermark: activeSpec.securityRequirements.watermark,
        includeDigitalSignatureSpace: activeSpec.securityRequirements.digitalSignature,
        lockDocument: true
      },
      exportMetadata: {}
    });

    try {
      // Pass the VIEWER element directly — no hidden copy
      const result = await ExportEngine.executeJob(job, viewerRef.current);
      if (!result.success) {
        alert('Export failed. Check console for details.');
      }
    } catch {
      alert('Export failed unexpectedly.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Showcase Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-black text-[#111827] flex items-center gap-2">
              <Settings size={18} className="text-[#005BAC]" />
              Government Document Viewer
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Official Credential Preview & Export</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Format Selection */}
          <div className="flex items-center justify-end gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
            <button onClick={() => setSelectedFormat('a4')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${selectedFormat === 'a4' ? 'bg-white shadow-sm text-[#005BAC]' : 'text-gray-500 hover:text-gray-700'}`}><Printer size={14} />A4</button>
            <button onClick={() => setSelectedFormat('a5')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${selectedFormat === 'a5' ? 'bg-white shadow-sm text-[#005BAC]' : 'text-gray-500 hover:text-gray-700'}`}><Printer size={14} />A5</button>
            <button onClick={() => setSelectedFormat('mobileView')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${selectedFormat === 'mobileView' ? 'bg-white shadow-sm text-[#005BAC]' : 'text-gray-500 hover:text-gray-700'}`}><Smartphone size={14} />Mobile</button>
            <button onClick={() => setSelectedFormat('idCard')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${selectedFormat === 'idCard' ? 'bg-white shadow-sm text-[#005BAC]' : 'text-gray-500 hover:text-gray-700'}`}><Monitor size={14} />ID Card</button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button 
              onClick={() => handleExport(ExportTarget.PRINT)}
              disabled={isExporting || !activeBlueprint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005BAC] text-white rounded text-xs font-bold transition-colors whitespace-nowrap hover:bg-[#004A8C] disabled:opacity-50"
            >
              <Printer size={14} />
              {isExporting ? 'Processing...' : 'Print'}
            </button>
            
            <button 
              onClick={() => handleExport(ExportTarget.PDF)}
              disabled={isExporting || !activeBlueprint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-bold transition-colors whitespace-nowrap hover:bg-gray-900 disabled:opacity-50"
            >
              <Download size={14} />
              {isExporting ? 'Processing...' : 'Save as PDF'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-2 overflow-y-auto shrink-0">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Available Documents</h2>
          {credentials.map(cred => (
            <button
              key={cred.documentNumber}
              onClick={() => {
                setActiveCredentialType(cred.credentialType);
                setSelectedFormat(CredentialSpecs[cred.credentialType].recommendedFormat);
              }}
              className={`p-3 text-left rounded-lg border text-sm transition-all flex flex-col gap-1 ${activeCredentialType === cred.credentialType ? 'border-[#005BAC] bg-blue-50/50' : 'border-transparent hover:bg-gray-50'}`}
            >
              <span className={`font-bold ${activeCredentialType === cred.credentialType ? 'text-[#005BAC]' : 'text-gray-700'}`}>
                {CredentialSpecs[cred.credentialType].title}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">{cred.documentNumber}</span>
            </button>
          ))}
        </div>
      
        {/* Document Viewer — Single Source of Truth */}
        <div className="flex-1 p-8 flex justify-center items-start overflow-auto bg-[#E5E7EB]">
          {activeCred && activeSpec && contextData && (
            <div 
              ref={viewerRef}
              className="credential-viewer relative shadow-2xl transition-all duration-500 ease-in-out bg-white" 
              style={{ 
                width: selectedFormat === 'a4' ? '210mm' : selectedFormat === 'a5' ? '148mm' : selectedFormat === 'mobileView' ? '375px' : '85.6mm',
                height: selectedFormat === 'a4' ? '297mm' : selectedFormat === 'a5' ? '210mm' : selectedFormat === 'mobileView' ? 'auto' : '53.98mm',
                minHeight: selectedFormat === 'mobileView' ? '667px' : 'auto',
                transform: selectedFormat === 'a4' ? 'scale(0.8)' : selectedFormat === 'a5' ? 'scale(1)' : selectedFormat === 'idCard' ? 'scale(1.35)' : 'scale(1)',
                transformOrigin: 'top center'
              }}
            >
              {activeBlueprint ? (
                <CredentialRenderingEngine 
                  blueprint={activeBlueprint}
                  contextData={contextData}
                  onEvent={() => {
                    // Suppress excessive logging
                  }}
                />
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>Blueprint for <b>{activeSpec.title}</b> is not yet implemented.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
