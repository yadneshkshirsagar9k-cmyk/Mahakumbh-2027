'use client';

/**
 * @file SmartSnanBooking
 * @description Smart Snan Allocation linked directly to the unified Journey Registration dates.
 */

import { useState } from 'react';
import { Waves, HelpCircle, AlertCircle, ShieldAlert, Award, FileText, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { useJourneyStore, SnanBooking } from '@/store/journey-store';

export default function SmartSnanBooking() {
  const { journey, addSnanBooking, removeSnanBooking } = useJourneyStore();
  const [ghatZone, setGhatZone] = useState('Kusha Varta Ghat - Trimbakeshwar');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [safetyAgreed, setSafetyAgreed] = useState(false);

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center space-y-4">
        <AlertCircle size={28} className="mx-auto text-amber-500" />
        <h2 className="text-lg font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280]">Please register your Mahakumbh Journey first to book a Snan slot.</p>
      </div>
    );
  }

  // Generate date options between journey start and end dates
  const getDatesInRange = (startStr: string, endStr: string) => {
    const dates = [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const current = new Date(start);

    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const journeyDates = getDatesInRange(journey.startDate, journey.endDate);

  const slots = [
    { id: 's1', time: '04:00 AM - 06:00 AM', label: 'Low Crowd', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-300', capacity: '18% Filled' },
    { id: 's2', time: '06:00 AM - 08:00 AM', label: 'High Crowd', color: 'bg-amber-500/10 text-amber-600 border-amber-300', capacity: '62% Filled' },
    { id: 's3', time: '08:00 AM - 10:00 AM', label: 'Critical Crowd', color: 'bg-red-500/10 text-red-600 border-red-300', capacity: '95% Filled' },
    { id: 's4', time: '10:00 AM - 12:00 PM', label: 'High Crowd', color: 'bg-amber-500/10 text-amber-600 border-amber-300', capacity: '58% Filled' },
    { id: 's5', time: '12:00 PM - 02:00 PM', label: 'Moderate Crowd', color: 'bg-blue-500/10 text-blue-600 border-blue-300', capacity: '29% Filled' },
    { id: 's6', time: '02:00 PM - 04:00 PM', label: 'Moderate Crowd', color: 'bg-blue-500/10 text-blue-600 border-blue-300', capacity: '14% Filled' },
  ];

  // Check if a slot is already booked for this date and ghat in the store
  const isSlotBooked = (timeStr: string) => {
    return journey.snanBookings.some(
      (b) => b.ghatName === ghatZone && b.date === date && b.timeSlot === timeStr
    );
  };

  const handleBook = () => {
    if (!date || !selectedSlot || !safetyAgreed) {
      alert('Please fill out all fields and accept the safety directives.');
      return;
    }
    const slotInfo = slots.find(s => s.id === selectedSlot);
    if (!slotInfo) return;

    if (isSlotBooked(slotInfo.time)) {
      alert('You have already reserved this slot. Please select a different time or date.');
      return;
    }

    const newBooking: SnanBooking = {
      ghatName: ghatZone,
      date: date,
      timeSlot: slotInfo.time,
      bookingCode: `MK-SNAN-${Math.floor(100000 + Math.random() * 900000)}`
    };

    addSnanBooking(newBooking);
    setSelectedSlot('');
    setSafetyAgreed(false);
    alert('Holy Snan Ghat bath slot reserved successfully!');
  };

  return (
    <div className="space-y-6 text-[#111827] text-left">
      <div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Smart Snan Allocation</h1>
        <p className="text-xs text-[#6B7280]">Ghat monitoring grid managing water levels, flow dynamics and crowd safety tokens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Reserve Snan Slot</h3>
          </div>

          {/* Alert Success Box */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800">
            <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={15} />
            <p className="text-[11px] leading-relaxed font-semibold">
              Journey validated successfully under Registration ID: <strong className="font-mono text-[#005BAC]">{journey.id}</strong>. Showing dates between {journey.startDate} and {journey.endDate} only.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#374151]">Select Ghat Zone</label>
              <select
                value={ghatZone}
                onChange={(e) => setGhatZone(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none"
              >
                <option value="Kusha Varta Ghat - Trimbakeshwar">Kusha Varta Ghat - Trimbakeshwar</option>
                <option value="Ramkund Ghat - Sector A">Ramkund Ghat - Sector A</option>
                <option value="Tapovan Ghat - Sector B">Tapovan Ghat - Sector B</option>
                <option value="Ganga Godavari Ghat">Ganga Godavari Ghat</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#374151]">Ritual Date *</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none focus:border-[#005BAC]"
              >
                <option value="">Select a date within your journey range</option>
                {journeyDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slot Grid */}
          {date && (
            <div className="space-y-2 animate-fadeIn text-xs">
              <label className="block text-[11px] font-bold text-[#374151]">Select Time Slot</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {slots.map((sl) => {
                  const isBooked = isSlotBooked(sl.time);
                  return (
                    <button
                      key={sl.id}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(sl.id)}
                      className={cn(
                        'p-3 border rounded-xl cursor-pointer transition-all flex flex-col justify-between items-start text-left gap-1.5 w-full bg-white',
                        isBooked
                          ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200'
                          : selectedSlot === sl.id
                          ? 'border-[#005BAC] bg-[#F5F7FA]'
                          : 'border-[#E5E7EB] hover:border-[#005BAC]/40'
                      )}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-[#111827]">{sl.time}</span>
                        {isBooked ? (
                          <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-500 text-[8px] font-bold uppercase">
                            Booked
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#6B7280] font-black">{sl.capacity}</span>
                        )}
                      </div>
                      <span className={cn('px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border', sl.color)}>
                        {sl.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <CollapsibleSection title="River Safety Directives (Required to Accept)" icon={<CheckCircle size={14} className="text-[#2E7D32]" />} defaultOpen={true} card={false}>
            <label className="flex items-start gap-2.5 p-3.5 bg-[#FAFBFC] rounded-xl cursor-pointer border border-[#E5E7EB]">
              <input
                type="checkbox"
                checked={safetyAgreed}
                onChange={(e) => setSafetyAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E7EB] accent-[#005BAC] mt-0.5 shrink-0"
              />
              <div className="text-[10px] text-[#374151] leading-normal text-left">
                <strong className="block text-[#111827] mb-0.5">Acknowledge River Safety Directives:</strong>
                <ul className="list-disc pl-3.5 space-y-0.5 font-medium">
                  <li>I will hold the safety chains at all times.</li>
                  <li>I will respect the water depth markers and lifeguards.</li>
                  <li>I agree not to carry plastics or soap into the river.</li>
                </ul>
              </div>
            </label>
          </CollapsibleSection>

          <button
            onClick={handleBook}
            disabled={!date || !selectedSlot || !safetyAgreed}
            className="w-full py-3 bg-[#005BAC] hover:bg-[#0F4C81] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 border-none outline-none"
          >
            <span>Confirm Ghat Snan Reservation</span>
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ghat Metrics */}
          <CollapsibleSection title={`Ghat Metrics: ${ghatZone.split(' - ')[0]}`} icon={<Waves size={15} className="text-[#005BAC]" />} defaultOpen={true} badge={ghatZone.split(' - ')[1] || 'Nashik'}>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">River Flow</span>
                <span className="text-[10px] font-black text-[#2E7D32] block mt-1">0.8 m/s (Safe)</span>
              </div>
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Water Depth</span>
                <span className="text-[10px] font-black text-[#005BAC] block mt-1">3.2 ft (Normal)</span>
              </div>
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Devotees</span>
                <span className="text-[10px] font-black text-[#005BAC] block mt-1">450/800</span>
              </div>
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Safety Index</span>
                <span className="text-[10px] font-black text-[#2E7D32] block mt-1">9.1/10</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* Active Tokens list */}
          <CollapsibleSection title={`Active Snan Tokens (${journey.snanBookings.length})`} icon={<Waves size={15} className="text-[#2E7D32]" />} defaultOpen={true}>
            {journey.snanBookings.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-[#6B7280]">
                <Waves size={28} className="mx-auto text-stone-300" />
                <p className="text-[11px] font-semibold text-stone-500">No Snan Booking.</p>
                <p className="text-[10px] text-stone-400">Book your Holy Snan to continue planning.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {journey.snanBookings.map((b, idx) => (
                  <div key={idx} className="p-3 border border-emerald-200 bg-[#F0FDF4] rounded-xl flex justify-between items-center animate-fadeIn text-xs">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] truncate max-w-[200px]">{b.ghatName}</h4>
                      <p className="text-[10px] text-stone-500 font-semibold mt-0.5">{b.date} • {b.timeSlot}</p>
                      <span className="text-[9px] font-mono font-bold text-[#2E7D32] mt-1 block">{b.bookingCode}</span>
                    </div>
                    <button
                      onClick={() => removeSnanBooking(b.bookingCode)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer border-none bg-transparent"
                      title="Cancel Snan Slot"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
