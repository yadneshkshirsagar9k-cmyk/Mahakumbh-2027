'use client';

/**
 * @file Manage Tour Page (Manage Journey)
 * @description Master panel for viewing the registered Mahakumbh Journey and modifying it, matching the premium styling.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Search, Trash2, Edit3, Info, QrCode, Download, Calendar, Users, MapPin, HeartPulse, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore, JourneyStatus } from '@/store/journey-store';
import { StatusBadge } from '@/components/account/status-badge';
import { cn } from '@/utils/cn';

export default function ManageTourPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { journey, setJourney, updateJourney } = useJourneyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [devMode, setDevMode] = useState(false);

  const handleStatusChange = (status: JourneyStatus) => {
    updateJourney({ journeyStatus: status });
  };

  if (!user) return null;

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center space-y-4">
        <Info size={28} className="mx-auto text-amber-500" />
        <h2 className="text-lg font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280]">Please register your Mahakumbh Journey first.</p>
        <button
          onClick={() => router.push('/account/dashboard?action=new')}
          className="px-5 py-2.5 bg-[#005BAC] text-white text-xs font-bold uppercase rounded cursor-pointer border-none"
        >
          Register Journey
        </button>
      </div>
    );
  }

  const handleEditJourney = () => {
    router.push(`/account/dashboard?id=${journey.id}`);
  };

  const handleDeleteJourney = () => {
    if (confirm('Are you sure you want to cancel/delete this entire Mahakumbh Journey? This will clear all bookings and pilgrims.')) {
      setJourney(null);
      router.push('/account/dashboard');
    }
  };

  const handleRegenerateQR = () => {
    const newQR = 'MK-QR-REGEN-' + Math.floor(100000 + Math.random() * 900000);
    updateJourney({ qrCode: newQR });
    alert(`QR Code regenerated successfully! New Token: ${newQR}`);
  };

  const handleDownloadRegistration = () => {
    // Route directly to the Single Source of Truth Document Viewer / Export Engine
    router.push('/account/documents/showcase');
  };

  const invalidSnanBookings = journey.snanBookings?.filter((b) => b.isValid === false) || [];
  const invalidDarshanBookings = journey.darshanBookings?.filter((b) => b.isValid === false) || [];
  const hasInvalidBookings = invalidSnanBookings.length > 0 || invalidDarshanBookings.length > 0;

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div>
        <h1 
          className="text-xl font-extrabold text-[#111827] font-[var(--font-heading)] cursor-pointer select-none"
          onDoubleClick={() => {
            setDevMode(!devMode);
            alert(`Developer mode ${!devMode ? 'enabled' : 'disabled'}.`);
          }}
          title="Double click to toggle lifecycle test tools"
        >
          Manage Your Journey
        </h1>
        <p className="text-xs text-[#6B7280]">
          Configure your Simhastha travel permits, accommodations, vehicle registries and verify checkpoint clearances.
        </p>
      </div>

      {/* Smart Booking Revalidation Friendly Warnings */}
      {hasInvalidBookings && (
        <div className="space-y-2 animate-fadeIn text-xs">
          {invalidSnanBookings.map((b) => (
            <div key={b.bookingCode} className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-amber-800">
              <div className="space-y-0.5">
                <p className="font-extrabold">Snan Slot Date Conflict</p>
                <p className="text-[11px] text-amber-700 leading-normal">
                  Your previous Snan booking ({b.ghatName.split(' - ')[0]} on {b.date}) is outside your updated Journey dates. Please select a new slot.
                </p>
              </div>
              <button
                onClick={() => router.push('/account/smart-snan')}
                className="px-3 py-1.5 bg-[#FF9933] hover:bg-[#E0852A] text-white text-[10px] font-bold uppercase rounded-lg border-none outline-none cursor-pointer shrink-0"
              >
                Rebook
              </button>
            </div>
          ))}

          {invalidDarshanBookings.map((b) => (
            <div key={b.bookingCode} className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-amber-800">
              <div className="space-y-0.5">
                <p className="font-extrabold">Darshan Slot Date Conflict</p>
                <p className="text-[11px] text-amber-700 leading-normal">
                  Your previous Darshan booking ({b.templeName.split(' (')[0]} on {b.date}) is outside your updated Journey dates. Please select a new slot.
                </p>
              </div>
              <button
                onClick={() => router.push('/account/smart-darshan')}
                className="px-3 py-1.5 bg-[#FF9933] hover:bg-[#E0852A] text-white text-[10px] font-bold uppercase rounded-lg border-none outline-none cursor-pointer shrink-0"
              >
                Rebook
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-6">
        
        {/* Journey Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#E5E7EB] pb-5">
          <div className="space-y-2">
            <h2 className="text-sm font-extrabold text-[#005BAC] uppercase tracking-wide">Journey Specifications</h2>
            <div className="text-xs space-y-1.5 font-sans">
              <div>Name: <span className="font-bold text-[#111827]">{journey.journeyName}</span></div>
              <div>Type: <span className="font-bold text-[#111827] font-mono">{journey.journeyType || (journey as any).journeyCategory}</span></div>
              <div>Dates: <span className="font-bold text-[#111827]">{journey.startDate} to {journey.endDate}</span></div>
              <div>Arrival Hub: <span className="font-bold text-[#111827]">{journey.arrivalPoint} ({journey.arrivalMode})</span></div>
              <div>Accommodation: <span className="font-bold text-[#111827]">{journey.accommodation?.name || 'N/A'}{journey.accommodation?.type ? ` - ${journey.accommodation.type}` : ''}</span></div>
              <div>Sector & Zone: <span className="font-bold text-[#111827]">{journey.journeyMetadata?.sector || 'N/A'} / {journey.journeyMetadata?.zone || 'N/A'}</span></div>
              <div>Vehicle Reg: <span className="font-bold text-[#111827] font-mono">{(journey.vehicleInfo as any)?.vehicleNumber || (journey.vehicleInfo as any)?.registrationNumber || 'None'} ({(journey.vehicleInfo as any)?.vehicleType || (journey.vehicleInfo as any)?.category || ''})</span></div>
              <div>Driver Info: <span className="font-bold text-[#111827]">{journey.vehicleInfo?.driverName || 'N/A'} ({journey.vehicleInfo?.driverMobile || 'N/A'})</span></div>
              <div>Emergency: <span className="font-bold text-[#111827]">{journey.emergencyContacts || '112'}</span></div>
            </div>
          </div>

          <div className="space-y-3 flex flex-col justify-between items-start md:items-end">
            <div className="text-left md:text-right space-y-1">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Clearance Status</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={journey.journeyStatus.toLowerCase().replace(' ', '_') as any} />
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleRegenerateQR}
                className="px-3 py-1.5 bg-white border border-[#005BAC] text-[#005BAC] hover:bg-[#F5F7FA] text-[10px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all select-none"
              >
                <RefreshCw size={12} />
                <span>Regenerate QR</span>
              </button>

              <button
                onClick={handleDownloadRegistration}
                className="px-3 py-1.5 bg-[#005BAC] text-white hover:bg-[#0F4C81] text-[10px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all select-none border-none outline-none"
              >
                <Download size={12} />
                <span>Download Reg</span>
              </button>
            </div>
          </div>
        </div>

        {/* State Machine Tester Section (Hidden by default, shown in devMode) */}
        {devMode && (
          <div className="space-y-2 border-b border-[#E5E7EB] pb-5 animate-fadeIn">
            <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block">Journey Lifecycle Stage (Developer Tools)</span>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {([
                'Draft',
                'Journey Registered',
                'Pilgrims Added',
                'Snan Booked',
                'Darshan Booked',
                'Journey Ready',
                'Journey Active',
                'Journey Completed',
              ] as JourneyStatus[]).map((st) => {
                const isCurrent = journey.journeyStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all cursor-pointer select-none',
                      isCurrent
                        ? 'bg-[#FF9933] border-[#FF9933] text-white shadow-sm'
                        : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]'
                    )}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Destinations / Circuit Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#E5E7EB] pb-5">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block flex items-center gap-1">
              <MapPin size={13} className="text-[#FF9933]" />
              <span>Ghat Locations</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {journey.selectedGhats.length === 0 ? (
                <span className="text-xs text-stone-400 font-semibold italic">No Ghats selected</span>
              ) : (
                journey.selectedGhats.map((g) => (
                  <span key={g} className="px-2.5 py-1 bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827]">
                    {g}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block flex items-center gap-1">
              <Compass size={13} className="text-[#FF9933]" />
              <span>Temple Shrines</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {journey.selectedTemples.length === 0 ? (
                <span className="text-xs text-stone-400 font-semibold italic">No Temples selected</span>
              ) : (
                journey.selectedTemples.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827]">
                    {t}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleDeleteJourney}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase rounded transition-all cursor-pointer bg-transparent"
          >
            Delete Journey
          </button>
          
          <button
            onClick={handleEditJourney}
            className="px-6 py-2.5 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold uppercase rounded shadow-sm cursor-pointer transition-all border-none outline-none"
          >
            Modify Journey
          </button>
        </div>

      </div>
    </div>
  );
}
