'use client';

import { useState, useEffect } from 'react';
import { useCredentialStore } from '@/store/credential-store';
import { useJourneyStore } from '@/store/journey-store';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye,
  ShieldCheck,
  AlertTriangle,
  History,
  QrCode
} from 'lucide-react';
import { CredentialStatus, VerificationStatus, CredentialType, DocumentCategory } from '@/types/credential.types';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

export default function MyDocumentsPage() {
  const citizenProfile = useJourneyStore(state => state.citizenProfile);
  const journey = useJourneyStore(state => state.journey);
  const getMyDocumentsSummary = useCredentialStore(state => state.getMyDocumentsSummary);
  const syncJourneyCredentials = useCredentialStore(state => state.syncJourneyCredentials);
  const recordAction = useCredentialStore(state => state.recordAction);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (journey && citizenProfile) {
      syncJourneyCredentials(journey, citizenProfile);
    }
  }, [journey, citizenProfile, syncJourneyCredentials]);

  if (!mounted || !citizenProfile) {
    return <div className="p-8 text-center text-gray-500">Loading documents...</div>;
  }

  const documents = getMyDocumentsSummary(citizenProfile.citizenId || '');

  // Evaluate dynamic lock/unlock criteria based on MongoDB database contents
  const hasJourney = !!journey;
  const hasPilgrims = journey && journey.pilgrims && journey.pilgrims.length >= 1;
  const hasBookings = journey && ((journey.snanBookings && journey.snanBookings.length >= 1) || (journey.darshanBookings && journey.darshanBookings.length >= 1));
  
  const pilgrimPassUnlocked = hasJourney && hasPilgrims && hasBookings;
  
  const hasVehicleDetails = journey && journey.vehicleInfo && journey.vehicleInfo.vehicleNumber && journey.vehicleInfo.vehicleNumber.trim() !== '';
  const isPublicTransit = journey && !journey.hasPrivateVehicle && !hasVehicleDetails;
  const vehiclePassUnlocked = hasJourney && (isPublicTransit || hasVehicleDetails);
  
  const hasEmergencyContact = citizenProfile && citizenProfile.emergencyContacts?.primary?.phone && citizenProfile.emergencyContacts.primary.phone.trim() !== '';
  const emergencyCardUnlocked = hasEmergencyContact;

  const docSpecs = [
    {
      type: CredentialType.REGISTRATION_CERTIFICATE,
      title: 'Registration Certificate',
      description: 'Official clearance of Simhastha Mahakumbh entry registration.',
      isUnlocked: hasJourney,
      isApplicable: true,
      checklist: [
        { label: 'Register Mahakumbh Journey', isDone: hasJourney, link: '/account/dashboard' }
      ]
    },
    {
      type: CredentialType.PILGRIM_IDENTITY,
      title: 'Pilgrim Identity Card',
      description: 'Personal gatepass with QR verification code for security sector entry.',
      isUnlocked: pilgrimPassUnlocked,
      isApplicable: true,
      checklist: [
        { label: 'Register Journey Itinerary', isDone: hasJourney, link: '/account/dashboard' },
        { label: 'Add at least one Pilgrim', isDone: !!hasPilgrims, link: '/account/manage-pilgrims' },
        { label: 'Book a Snan or Darshan slot', isDone: !!hasBookings, link: '/account/smart-snan' }
      ]
    },
    {
      type: CredentialType.VEHICLE_PASS,
      title: 'Vehicle Parking Pass',
      description: 'Parking clearance permit for inner security ring transit.',
      isUnlocked: vehiclePassUnlocked,
      isApplicable: !isPublicTransit,
      checklist: [
        { label: 'Register Private Vehicle option', isDone: hasJourney && (journey.hasPrivateVehicle || hasVehicleDetails), link: '/account/dashboard' },
        { label: 'Provide Vehicle Registration & Driver Details', isDone: !!hasVehicleDetails, link: '/bookings/vehicle' }
      ]
    },
    {
      type: CredentialType.EMERGENCY_CARD,
      title: 'Emergency Medical & SOS Card',
      description: 'Medical bio-card with emergency details and blood group.',
      isUnlocked: emergencyCardUnlocked,
      isApplicable: true,
      checklist: [
        { label: 'Add Primary Emergency Contact to Profile', isDone: !!emergencyCardUnlocked, link: '/account/profile' }
      ]
    }
  ];

  const handleAction = (docNum: string, action: 'VIEW' | 'DOWNLOAD' | 'PRINT', credType: CredentialType) => {
    recordAction(docNum, action);
    window.location.href = `/account/documents/showcase?type=${credType}`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-[#111827] font-[var(--font-heading)] tracking-tight flex items-center gap-2">
              <FileText size={24} className="text-[#005BAC]" />
              My Documents & Permits
            </h1>
            <p className="text-xs font-bold text-[#6B7280]">
              View, download, and print your official credentials. Pass generation is locked until required database information is complete.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/account/documents/showcase'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] border border-[#E5E7EB] text-[#0F4C81] text-xs font-bold rounded hover:bg-white transition-colors shadow-sm"
          >
            <Eye size={14} />
            Visual Design Showcase
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {docSpecs.map((spec) => {
          // Find if the document is actually generated in the credential registry
          const matchedDoc = documents.find(d => d.credentialType === spec.type);
          
          if (!spec.isApplicable && spec.type === CredentialType.VEHICLE_PASS) {
            // Arriving via Public Transit - Vehicle Pass Not Applicable
            return (
              <div key={spec.type} className="bg-white border border-blue-200 rounded-xl shadow-xs p-5 space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full flex items-center justify-center opacity-30 pointer-events-none">
                  <span className="text-2xl">🚌</span>
                </div>
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    PUBLIC TRANSIT
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900">{spec.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    You have declared your arrival via public transport (train, bus, or walk). No private vehicle clearance pass is required for your journey. Free shuttle transit is active.
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-blue-600 font-bold">
                  <span>Authorized transit clearance active</span>
                  <span>✔ Exempted</span>
                </div>
              </div>
            );
          }

          if (spec.isUnlocked && matchedDoc) {
            // Unlocked & Issued Pass State
            return (
              <div key={spec.type} className="bg-white border border-[#E5E7EB] hover:border-[#005BAC] rounded-xl shadow-sm overflow-hidden flex flex-col justify-between transition-all group">
                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Document ID</div>
                    <div className="font-mono text-xs font-black text-[#0F4C81]">{matchedDoc.documentNumber}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    ✔ ISSUED
                  </span>
                </div>
                
                <div className="p-5 flex-grow space-y-3">
                  <h3 className="text-base font-black text-gray-900">{spec.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{spec.description}</p>
                  <div className="text-[10px] text-gray-400 font-semibold pt-1">
                    Issued: {new Date(matchedDoc.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {matchedDoc.version}
                  </div>
                </div>

                <div className="bg-gray-50/80 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#005BAC] uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={12} /> SECURE CRYPTO ID
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(matchedDoc.documentNumber, 'VIEW', spec.type)}
                      className="p-1.5 text-gray-500 hover:text-[#0F4C81] hover:bg-gray-100 rounded transition-colors"
                      title="View Pass"
                    >
                      <Eye size={15} />
                    </button>
                    <button 
                      onClick={() => handleAction(matchedDoc.documentNumber, 'PRINT', spec.type)}
                      className="p-1.5 text-gray-500 hover:text-[#0F4C81] hover:bg-gray-100 rounded transition-colors"
                      title="Print Pass"
                    >
                      <Printer size={15} />
                    </button>
                    <button 
                      onClick={() => handleAction(matchedDoc.documentNumber, 'DOWNLOAD', spec.type)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#005BAC] text-white text-xs font-bold rounded hover:bg-[#0F4C81] transition-colors shadow-2xs"
                    >
                      <Download size={13} />
                      Get PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Locked Pass State - Show required checklist steps
          return (
            <div key={spec.type} className="bg-[#FAFBFB] border border-dashed border-gray-300 rounded-xl p-5 shadow-inner flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    ⚠ PENDING DETAILS
                  </span>
                  <span className="text-gray-400 font-bold text-xs">Locked</span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  🔒 {spec.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{spec.description}</p>
              </div>

              {/* Requirement Checklist */}
              <div className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-2 shadow-2xs">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Required Steps to Generate:</h4>
                <ul className="space-y-1.5">
                  {spec.checklist.map((step, idx) => (
                    <li key={idx} className="flex items-start justify-between text-xs font-medium">
                      <div className="flex items-center gap-2">
                        {step.isDone ? (
                          <span className="text-emerald-600 font-bold text-sm">✓</span>
                        ) : (
                          <span className="text-gray-300 font-bold text-xs select-none">○</span>
                        )}
                        <span className={step.isDone ? "text-gray-400 line-through" : "text-gray-700"}>
                          {step.label}
                        </span>
                      </div>
                      {!step.isDone && (
                        <a 
                          href={step.link} 
                          className="text-[#005BAC] hover:underline text-[10px] font-extrabold shrink-0 uppercase tracking-wide"
                        >
                          Complete →
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-[10px] text-gray-400 font-semibold text-center italic">
                Credential will auto-generate once database checklist is verified.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
