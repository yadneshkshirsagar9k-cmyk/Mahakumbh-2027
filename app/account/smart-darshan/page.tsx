'use client';

/**
 * @file SmartDarshanBooking
 * @description timed queue access pass booking linked directly to the unified Journey Registration dates.
 */

import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, ShieldCheck, Heart, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { useJourneyStore, DarshanBooking } from '@/store/journey-store';

export default function SmartDarshanBooking() {
  const { journey, addDarshanBooking, removeDarshanBooking } = useJourneyStore();
  const [shrine, setShrine] = useState('Trimbakeshwar Shiva Temple');
  const [date, setDate] = useState('');
  const [queueClass, setQueueClass] = useState('General Entry');
  const [selectedSlot, setSelectedSlot] = useState('');

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center space-y-4">
        <AlertTriangle size={28} className="mx-auto text-amber-500" />
        <h2 className="text-lg font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280]">Please register your Mahakumbh Journey first to book a Darshan slot.</p>
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
    { id: 's1', time: '06:00 AM - 08:00 AM', left: 700, wait: '40 mins', label: 'normal', capacity: '18% Filled' },
    { id: 's2', time: '08:00 AM - 10:00 AM', left: 50, wait: '120 mins', label: 'busy', capacity: '62% Filled' },
    { id: 's3', time: '10:00 AM - 12:00 PM', left: 10, wait: '180 mins', label: 'critical', capacity: '95% Filled' },
    { id: 's4', time: '12:00 PM - 02:00 PM', left: 1400, wait: '35 mins', label: 'ai', capacity: '31% Filled' },
  ];

  const isSlotBooked = (timeStr: string) => {
    return journey.darshanBookings.some(
      (b) => b.templeName === shrine && b.date === date && b.timeSlot === timeStr
    );
  };

  const handleBook = () => {
    if (!date || !selectedSlot) {
      alert('Please select both a date and a time slot.');
      return;
    }
    const slotInfo = slots.find(s => s.id === selectedSlot);
    if (!slotInfo) return;

    if (isSlotBooked(slotInfo.time)) {
      alert('You have already reserved this slot. Please select a different time or date.');
      return;
    }

    const newBooking: DarshanBooking = {
      templeName: shrine,
      date: date,
      timeSlot: slotInfo.time,
      bookingCode: `MK-DAR-${Math.floor(100000 + Math.random() * 900000)}`
    };

    addDarshanBooking(newBooking);
    setSelectedSlot('');
    alert('Darshan slot pass reserved successfully!');
  };

  return (
    <div className="space-y-6 text-[#111827] text-left">
      <div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Smart Darshan Booking</h1>
        <p className="text-xs text-[#6B7280]">IoT-synced slot pre-allocation portal tying ticket generation to regional security limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Booking parameters */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Select Booking Metrics</h3>
          </div>

          {/* Alert Success Box */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800">
            <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={15} />
            <p className="text-[11px] leading-relaxed font-semibold">
              Journey validated successfully under Registration ID: <strong className="font-mono text-[#005BAC]">{journey.id}</strong>. Showing dates between {journey.startDate} and {journey.endDate} only.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#374151]">Select Shrine</label>
              <select
                value={shrine}
                onChange={(e) => setShrine(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none"
              >
                <option value="Trimbakeshwar Shiva Temple">Trimbakeshwar Shiva Temple</option>
                <option value="Shree Saibaba Sansthan Temple (Ahilyanagar)">Shree Saibaba Sansthan Temple (Ahilyanagar)</option>
                <option value="Bhadra Maruti Temple">Bhadra Maruti Temple</option>
                <option value="Grishneshwar Jyotirlinga">Grishneshwar Jyotirlinga</option>
                <option value="Mohiniraj Temple">Mohiniraj Temple</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#374151]">Date of Darshan *</label>
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

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#374151]">Queue Class</label>
                <select
                  value={queueClass}
                  onChange={(e) => setQueueClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] outline-none font-semibold"
                >
                  <option value="General Entry">General Entry</option>
                  <option value="VIP Access">VIP Access</option>
                  <option value="Paid Pass">Paid Pass</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slots list */}
          {date && (
            <div className="space-y-2 animate-fadeIn text-xs">
              <label className="block text-[11px] font-bold text-[#374151]">Select Time Slot</label>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {slots.map((sl) => {
                  const isBooked = isSlotBooked(sl.time);
                  return (
                    <label
                      key={sl.id}
                      className={cn(
                        'flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-150 bg-white',
                        isBooked
                          ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200'
                          : selectedSlot === sl.id
                          ? 'border-[#005BAC] bg-[#F5F7FA]'
                          : 'border-[#E5E7EB] hover:border-[#005BAC]/40'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="slot"
                          value={sl.id}
                          disabled={isBooked}
                          checked={selectedSlot === sl.id}
                          onChange={() => setSelectedSlot(sl.id)}
                          className="w-4 h-4 accent-[#005BAC]"
                        />
                        <div className="space-y-0.5 text-left">
                          <span className="text-xs font-bold text-[#111827] block">{sl.time}</span>
                          <span className="text-[10px] text-stone-500 font-semibold">Est. Wait: {sl.wait} • {!isBooked && sl.capacity}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {isBooked ? (
                          <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-500 text-[8px] font-black uppercase">
                            Booked
                          </span>
                        ) : (
                          <>
                            {sl.label === 'ai' && (
                              <span className="px-2 py-0.5 rounded bg-[#2E7D32] text-white text-[8px] font-black uppercase block mb-1">
                                AI Recommended
                              </span>
                            )}
                            {sl.label === 'busy' && (
                              <span className="px-2 py-0.5 rounded bg-[#F59E0B] text-white text-[8px] font-black uppercase block mb-1">
                                50 Left
                              </span>
                            )}
                            {sl.label === 'critical' && (
                              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[8px] font-black uppercase block mb-1">
                                10 Left
                              </span>
                            )}
                            {sl.label === 'normal' && (
                              <span className="text-[10px] text-[#2E7D32] font-bold block">{sl.left} Left</span>
                            )}
                          </>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!date || !selectedSlot}
            className="w-full py-3 bg-[#005BAC] hover:bg-[#0F4C81] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 border-none outline-none"
          >
            <span>Confirm Darshan Reservation</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Right Side: Live monitor + active passes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Queue Monitor */}
          <CollapsibleSection title={`Live Queue Monitor: ${shrine.split(' (')[0]}`} icon={<Clock size={15} className="text-[#005BAC]" />} defaultOpen={true}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Average Wait</span>
                <span className="text-xs font-black text-[#005BAC] block mt-1">180 mins</span>
              </div>
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Status</span>
                <span className="text-[10px] font-black text-red-600 block mt-1.5">High Crowd</span>
              </div>
              <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2 rounded-xl">
                <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Safety Rating</span>
                <span className="text-xs font-black text-[#2E7D32] block mt-1">9.2/10</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* Active Passes list */}
          <CollapsibleSection title={`Active Darshan Passes (${journey.darshanBookings.length})`} icon={<ShieldCheck size={15} className="text-[#2E7D32]" />} defaultOpen={true}>
            {journey.darshanBookings.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-[#6B7280]">
                <ShieldCheck size={28} className="mx-auto text-stone-300" />
                <p className="text-[11px] font-semibold text-stone-500">No Darshan Pass.</p>
                <p className="text-[10px] text-stone-400">Book your timed Darshan to continue planning.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {journey.darshanBookings.map((b, idx) => (
                  <div key={idx} className="p-3 border border-emerald-200 bg-[#F0FDF4] rounded-xl flex justify-between items-center text-xs animate-fadeIn">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#005BAC] truncate max-w-[200px]">{b.templeName}</h4>
                      <p className="text-[10px] text-stone-500 font-semibold mt-0.5">{b.date} • {b.timeSlot}</p>
                      <span className="text-[9px] font-mono font-bold text-[#2E7D32] mt-1 block">{b.bookingCode}</span>
                    </div>
                    <button
                      onClick={() => removeDarshanBooking(b.bookingCode)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer border-none bg-transparent"
                      title="Cancel Darshan Slot"
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
