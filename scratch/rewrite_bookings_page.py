import os

content = """'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, Car, Compass, Sparkles, Star, MapPin, Users, HeartPulse, QrCode, Smile, Layers, Info, Calendar, ShieldCheck, CreditCard, ChevronRight, ArrowRight, Loader2, X, Printer, FileText, CheckCircle, Clock
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { 
  SERVICE_CARDS_DATA, ACCOMMODATIONS_DATA, VEHICLE_CATEGORIES_DATA, PARKING_ZONES_DATA, PILGRIM_SERVICES_DATA 
} from '@/constants/booking-data';
import { ProtectedFeature } from '@/components/auth/protected-feature';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore } from '@/store/journey-store';
import { createDefaultAccommodation, createDefaultVehicleInfo, createAuditMetadata, GovernmentApplication } from '@/types/citizen.types';
import { cn } from '@/utils/cn';
import { ApplicationDetailsDrawer } from '@/components/bookings/unified-application';

function getBookingIcon(iconName: string, className?: string) {
  switch (iconName) {
    case 'Home': return <Home className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Users': return <Users className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'QrCode': return <QrCode className={className} />;
    case 'Smile': return <Smile className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Info':
    default: return <Info className={className} />;
  }
}

export default function BookingsPortal() {
  const { isAuthenticated } = useAuthStore();
  const { journey, submitApplication, simulateApplicationWorkflow } = useJourneyStore();

  const [activeApplication, setActiveApplication] = useState<GovernmentApplication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Derive Active Applications
  const activeApplications = [
    journey?.vehicleInfo as any,
    journey?.accommodation as any,
    journey?.parkingReservation as any
  ].filter(app => app && app.status && app.status !== 'Not Started');

  const totalApplications = activeApplications.length;
  const inProgress = activeApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;
  const approved = activeApplications.filter(a => a.status === 'Approved' || a.status === 'Confirmed').length;

  const handleSmoothScroll = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openApplication = (app: GovernmentApplication) => {
    setActiveApplication(app);
    setIsDrawerOpen(true);
  };

  // --- Handlers for unified application ---
  const handleRegisterVehicle = (category: string, label: string) => {
    if (!journey) {
      alert("Please register a Journey first.");
      return;
    }
    
    // Simulate interactive form capture
    const mockFormData = {
      ...createDefaultVehicleInfo(),
      vehicleType: category as any,
      vehicleNumber: `MH-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`,
      driverName: 'Verified Pilgrim',
      driverMobile: '+91 9999999999',
      fuelType: 'Petrol',
      referenceNumber: `VEH-MH27-${Math.floor(100000 + Math.random() * 900000)}`
    };

    submitApplication('vehicleInfo', mockFormData);
    simulateApplicationWorkflow('vehicleInfo');
    
    alert("Vehicle Registration Application Submitted!");
  };

  const handleBookLodging = (id: string, name: string, price: number, type: string) => {
    if (!journey) {
      alert("Please register a Journey first.");
      return;
    }

    const mockFormData = {
      ...createDefaultAccommodation(),
      type: type as any,
      name,
      referenceNumber: `ACC-MH27-${Math.floor(100000 + Math.random() * 900000)}`,
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString(),
    };

    submitApplication('accommodation', mockFormData);
    simulateApplicationWorkflow('accommodation');
    
    alert("Accommodation Application Submitted!");
  };

  const handleReserveParking = (id: string, name: string) => {
    if (!journey) {
      alert("Please register a Journey first.");
      return;
    }

    // Explicit Eligibility check
    const vehicleApp = journey.vehicleInfo as any;
    if (!vehicleApp || vehicleApp.status !== 'Approved') {
      alert("Eligibility Failed: You must have an Approved Vehicle Registration to reserve a parking zone.");
      return;
    }

    const mockFormData = {
      serviceType: 'Parking',
      zoneId: id,
      zoneName: name,
      referenceNumber: `PKG-MH27-${Math.floor(100000 + Math.random() * 900000)}`
    };

    submitApplication('parkingReservation', mockFormData);
    simulateApplicationWorkflow('parkingReservation');
    
    alert("Parking Reservation Application Submitted!");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFBFC] text-[#111827]">
      <Navbar />
      <ApplicationDetailsDrawer 
        application={activeApplication} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#005BAC] bg-[#F5F7FA] px-3.5 py-1.5 rounded-full border border-[#E5E7EB] inline-block">
              Government Application Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)] leading-tight">
              Unified Services Dashboard
            </h1>
            <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Submit, track, and manage your official Government digital applications.
            </p>
          </div>

          <ProtectedFeature featureName="Pilgrim Booking Dashboard" className="w-full">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                Application Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Total Applications</span>
                  <p className="font-extrabold text-2xl text-[#111827]">{totalApplications}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">In Progress</span>
                  <p className="font-extrabold text-2xl text-amber-600">{inProgress}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Approved / Confirmed</span>
                  <p className="font-extrabold text-2xl text-green-600">{approved}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm opacity-50">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Cancelled</span>
                  <p className="font-extrabold text-2xl text-[#111827]">0</p>
                </div>
              </div>

              {activeApplications.length > 0 && (
                <div className="pt-8">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-2 mb-4">
                    Active Applications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {activeApplications.map((app, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => openApplication(app)}
                        className="bg-white p-5 rounded-xl border border-[#E5E7EB] hover:border-[#005BAC]/30 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between h-full"
                      >
                        <div className="space-y-3">
                           <div className="flex justify-between items-start">
                             <div className="w-10 h-10 bg-[#F5F7FA] text-[#005BAC] rounded flex items-center justify-center">
                                <FileText size={18} />
                             </div>
                             <span className={cn(
                               "px-2 py-1 text-[9px] font-bold uppercase rounded",
                               app.status === 'Approved' || app.status === 'Confirmed' ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                             )}>
                               {app.status}
                             </span>
                           </div>
                           <div>
                             <h4 className="font-bold text-[#111827] text-base">{app.serviceType} Application</h4>
                             <p className="text-xs text-[#6B7280]">{app.referenceNumber}</p>
                           </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-[10px] text-[#6B7280] font-semibold flex items-center justify-between">
                          <span>Updated: {new Date(app.lastUpdated).toLocaleDateString()}</span>
                          <span className="text-[#005BAC]">Manage &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ProtectedFeature>

          {/* New Service Application Categories */}
          <div className="pt-8">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-2 mb-6">
              Start New Application
            </h3>
            
            {/* 1. Vehicle Registration */}
            <div id="vehicle-section" className="mb-12 space-y-4">
               <h4 className="font-extrabold text-xl text-[#111827]">Vehicle Registration</h4>
               <p className="text-sm text-[#6B7280]">Register private cars, pilgrimage buses, or commercial goods vehicles.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {VEHICLE_CATEGORIES_DATA.map((cat) => (
                    <div key={cat.id} className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                       <div className="space-y-2">
                         <span className="text-[10px] font-bold text-[#005BAC] bg-[#F5F7FA] px-2 py-0.5 rounded uppercase">{cat.tag}</span>
                         <h5 className="font-bold text-sm text-[#111827]">{cat.label}</h5>
                         <p className="text-[11px] text-[#6B7280]">{cat.description}</p>
                       </div>
                       <button
                         onClick={() => handleRegisterVehicle(cat.id, cat.label)}
                         className="mt-4 w-full py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold rounded-lg transition-colors"
                       >
                         Apply Now
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* 2. Accommodation */}
            <div id="accommodation-section" className="mb-12 space-y-4">
               <h4 className="font-extrabold text-xl text-[#111827]">Official Lodging & Camps</h4>
               <p className="text-sm text-[#6B7280]">Apply for verified shelters, ashrams, Swiss tents, and budget hotels.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                 {ACCOMMODATIONS_DATA.map((acc) => (
                    <div key={acc.id} className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                       <div className="space-y-2">
                         <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold text-[#005BAC] bg-[#F5F7FA] px-2 py-0.5 rounded uppercase">{acc.type}</span>
                           <span className="text-[10px] font-bold text-amber-500 flex items-center"><Star size={10} className="mr-0.5" />{acc.futureRating}</span>
                         </div>
                         <h5 className="font-bold text-sm text-[#111827]">{acc.name}</h5>
                         <p className="text-[11px] text-[#6B7280] line-clamp-2">{acc.description}</p>
                       </div>
                       <button
                         onClick={() => handleBookLodging(acc.id, acc.name, acc.futurePricePerNightINR, acc.type)}
                         className="mt-4 w-full py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold rounded-lg transition-colors"
                       >
                         Apply Now
                       </button>
                    </div>
                 ))}
               </div>
            </div>

            {/* 3. Parking */}
            <div id="parking-section" className="mb-12 space-y-4">
               <h4 className="font-extrabold text-xl text-[#111827]">Parking Zone Reservation</h4>
               <p className="text-sm text-[#6B7280]">Reserve official parking zones. <strong className="text-red-500">Requires Approved Vehicle Registration.</strong></p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                 {PARKING_ZONES_DATA.map((zone) => (
                    <div key={zone.id} className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                       <div className="space-y-2">
                         <span className="text-[10px] font-bold text-[#005BAC] bg-[#F5F7FA] px-2 py-0.5 rounded uppercase">{zone.type}</span>
                         <h5 className="font-bold text-sm text-[#111827]">{zone.name}</h5>
                         <p className="text-[11px] text-[#6B7280]">{zone.description}</p>
                         <p className="text-[10px] font-semibold text-stone-500 flex items-center gap-1"><MapPin size={10} /> {zone.walkingDistance}</p>
                       </div>
                       <button
                         onClick={() => handleReserveParking(zone.id, zone.name)}
                         className="mt-4 w-full py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold rounded-lg transition-colors"
                       >
                         Check Eligibility & Apply
                       </button>
                    </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
"""

with open('app/bookings/page.tsx', 'w', encoding='utf-8') as page_file:
    page_file.write(content)
