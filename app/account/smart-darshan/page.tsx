'use client';

/**
 * @file SmartDarshanBooking
 * @description timed queue access pass booking linked directly to the unified Journey Registration dates.
 * Overhauled with real-time simulated IoT database slot capacities and premium UX.
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, ShieldCheck, Heart, ArrowRight, Trash2, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { useJourneyStore, DarshanBooking } from '@/store/journey-store';

export default function SmartDarshanBooking() {
  const { journey, addDarshanBooking, removeDarshanBooking } = useJourneyStore();
  const [shrine, setShrine] = useState('Trimbakeshwar Shiva Temple');
  const [date, setDate] = useState('');
  const [queueClass, setQueueClass] = useState('General Entry');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);

  // Trigger simulated IoT network fetch when date or shrine changes
  useEffect(() => {
    if (date) {
      setLoading(true);
      setSelectedSlot('');
      const timer = setTimeout(() => {
        setLoading(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [date, shrine]);

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle size={36} className="mx-auto text-amber-500 animate-bounce" />
        <h2 className="text-xl font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Please register your Mahakumbh Journey first to book a timed Darshan slot. A registered journey provides date boundaries for slot allocation.
        </p>
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

  // Dynamic slot calculations
  const getDynamicSlots = (shrineName: string, dateStr: string) => {
    const timeSlots = [
      { id: 's1', time: '06:00 AM - 08:00 AM' },
      { id: 's2', time: '08:00 AM - 10:00 AM' },
      { id: 's3', time: '10:00 AM - 12:00 PM' },
      { id: 's4', time: '12:00 PM - 02:00 PM' },
      { id: 's5', time: '02:00 PM - 04:00 PM' },
      { id: 's6', time: '06:00 PM - 08:00 PM' },
    ];

    return timeSlots.map((ts) => {
      const combined = `${shrineName}-${dateStr}-${ts.time}`;
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
      }
      const seed = Math.abs(hash);

      const occupancy = 20 + (seed % 76); // 20% to 96%
      let maxCapacity = 2000;
      if (shrineName.includes('Saibaba')) maxCapacity = 5000;
      else if (shrineName.includes('Trimbakeshwar')) maxCapacity = 3000;

      // Adjust occupancy if user has already booked this slot (subtract 1)
      const isBooked = journey.darshanBookings.some(
        (b) => b.templeName === shrineName && b.date === dateStr && b.timeSlot === ts.time
      );

      const slotsLeft = Math.max(0, Math.floor(maxCapacity * (1 - occupancy / 100)) - (isBooked ? 1 : 0));

      let waitTime = '15 mins';
      if (occupancy > 85) waitTime = '120-180 mins';
      else if (occupancy > 65) waitTime = '60-95 mins';
      else if (occupancy > 40) waitTime = '30-50 mins';

      let label: 'normal' | 'busy' | 'critical' | 'ai' = 'normal';
      if (occupancy > 85) label = 'critical';
      else if (occupancy > 65) label = 'busy';
      else if (seed % 3 === 0) label = 'ai';

      return {
        id: ts.id,
        time: ts.time,
        occupancy,
        slotsLeft,
        waitTime,
        label
      };
    });
  };

  const slots = date ? getDynamicSlots(shrine, date) : [];

  const getLiveMetrics = (shrineName: string, dateStr: string) => {
    if (!dateStr) return { avgWait: 'N/A', status: 'Inactive', rating: 'N/A', statusColor: 'text-stone-400', count: 0, density: 0 };
    const combined = `${shrineName}-${dateStr}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const density = 25 + (seed % 70); // 25% to 95% average density
    const count = 12000 + (seed % 18000);

    let avgWait = '25 mins';
    let status = 'Low Crowd';
    let statusColor = 'text-[#2E7D32] bg-[#E8F5E9] border-[#A5D6A7]';
    let rating = (9.8 - (density / 100)).toFixed(1);

    if (density > 80) {
      avgWait = '140 mins';
      status = 'Heavy Crowd';
      statusColor = 'text-[#C62828] bg-[#FFEBEE] border-[#FFCDD2]';
    } else if (density > 55) {
      avgWait = '65 mins';
      status = 'Moderate';
      statusColor = 'text-[#EF6C00] bg-[#FFF3E0] border-[#FFE0B2]';
    }

    return {
      avgWait,
      status,
      rating,
      statusColor,
      count,
      density
    };
  };

  const metrics = getLiveMetrics(shrine, date);

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
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Smart Darshan Booking</h1>
        <p className="text-xs text-[#6B7280]">Real-time IoT queue pre-allocation portal synchronizing queue passes with temple density levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Booking parameters */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
              <Calendar size={14} className="text-[#005BAC]" />
              <span>Select Booking Details</span>
            </h3>
            <span className="text-[10px] font-bold text-[#005BAC] bg-[#005BAC]/5 border border-[#005BAC]/10 px-2 py-0.5 rounded-full">
              Simhastha 2027 Portal
            </span>
          </div>

          {/* Validation Alert */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800">
            <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={15} />
            <p className="text-[11px] leading-relaxed font-semibold">
              Journey validated. ID: <strong className="font-mono text-[#005BAC]">{journey.id}</strong>. Booking matches date boundaries: {journey.startDate} to {journey.endDate}.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Select Shrine / Temple</label>
              <select
                value={shrine}
                onChange={(e) => setShrine(e.target.value)}
                className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none focus:border-[#005BAC] focus:ring-1 focus:ring-[#005BAC]"
              >
                <option value="Trimbakeshwar Shiva Temple">Trimbakeshwar Shiva Temple</option>
                <option value="Shree Saibaba Sansthan Temple (Ahilyanagar)">Shree Saibaba Sansthan Temple (Ahilyanagar)</option>
                <option value="Bhadra Maruti Temple">Bhadra Maruti Temple</option>
                <option value="Grishneshwar Jyotirlinga">Grishneshwar Jyotirlinga</option>
                <option value="Mohiniraj Temple">Mohiniraj Temple</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Date of Darshan *</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none focus:border-[#005BAC] focus:ring-1 focus:ring-[#005BAC]"
                >
                  <option value="">Choose a date</option>
                  {journeyDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Queue Category</label>
                <select
                  value={queueClass}
                  onChange={(e) => setQueueClass(e.target.value)}
                  className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] outline-none font-semibold focus:border-[#005BAC]"
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
            <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
              <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-[#005BAC]" />
                <span>Real-Time Slot Capacities</span>
              </label>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-500">
                  <Loader2 className="animate-spin text-[#005BAC]" size={28} />
                  <span className="text-xs font-semibold animate-pulse">Syncing with IoT density meters...</span>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {slots.map((sl) => {
                    const isBooked = isSlotBooked(sl.time);
                    
                    return (
                      <label
                        key={sl.id}
                        className={cn(
                          'flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all duration-150 bg-white relative overflow-hidden group select-none',
                          isBooked
                            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                            : selectedSlot === sl.id
                            ? 'border-[#005BAC] ring-1 ring-[#005BAC] bg-[#F5F7FA]'
                            : 'border-[#E5E7EB] hover:border-[#005BAC]/40'
                        )}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <input
                            type="radio"
                            name="slot"
                            value={sl.id}
                            disabled={isBooked}
                            checked={selectedSlot === sl.id}
                            onChange={() => setSelectedSlot(sl.id)}
                            className="w-4 h-4 accent-[#005BAC]"
                          />
                          <div className="space-y-1 text-left">
                            <span className="text-xs font-black text-[#111827] block">{sl.time}</span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-stone-500 font-semibold">
                                Est. Wait: <strong className="text-stone-700">{sl.waitTime}</strong>
                              </span>
                              {!isBooked && (
                                <span className="text-[9px] font-bold text-stone-400">
                                  • {sl.occupancy}% capacity
                                </span>
                              )}
                            </div>
                            {/* Visual Progress Bar inside each slot card */}
                            {!isBooked && (
                              <div className="w-28 h-1 rounded-full bg-[#FAFBFC] border border-stone-100 overflow-hidden mt-1.5">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all duration-300',
                                    sl.occupancy > 85
                                      ? 'bg-red-500'
                                      : sl.occupancy > 65
                                      ? 'bg-[#EF6C00]'
                                      : 'bg-[#2E7D32]'
                                  )}
                                  style={{ width: `${sl.occupancy}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right relative z-10 flex flex-col items-end justify-center">
                          {isBooked ? (
                            <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-500 text-[8px] font-black uppercase">
                              Booked
                            </span>
                          ) : (
                            <>
                              {sl.label === 'ai' && (
                                <span className="px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] text-[8px] font-black uppercase flex items-center gap-0.5 mb-1.5 shadow-sm">
                                  <Sparkles size={8} /> AI Recommended
                                </span>
                              )}
                              {sl.label === 'busy' && (
                                <span className="px-2 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] text-[8px] font-black uppercase block mb-1.5 shadow-sm">
                                  Busy • {sl.slotsLeft} Left
                                </span>
                              )}
                              {sl.label === 'critical' && (
                                <span className="px-2 py-0.5 rounded bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] text-[8px] font-black uppercase block mb-1.5 shadow-sm animate-pulse">
                                  Critical • {sl.slotsLeft} Left
                                </span>
                              )}
                              {sl.label === 'normal' && (
                                <span className="text-[10px] text-[#2E7D32] font-black bg-[#E8F5E9] px-2 py-1 border border-[#C8E6C9] rounded-md shadow-sm">
                                  {sl.slotsLeft} Available
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!date || !selectedSlot || loading}
            className="w-full py-3.5 bg-[#005BAC] hover:bg-[#0F4C81] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 border-none outline-none shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            <span>Confirm Darshan Reservation</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Right Side: Live monitor + active passes */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Queue Monitor */}
          <CollapsibleSection
            title={`Live IoT Monitor: ${shrine.split(' (')[0]}`}
            icon={<Clock size={15} className="text-[#005BAC]" />}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {date ? (
                <>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">Avg Wait Time</span>
                      <span className="text-xs sm:text-sm font-black text-[#005BAC] block mt-1">{metrics.avgWait}</span>
                    </div>
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">Queue Flow</span>
                      <span className={cn('text-[9px] font-black block mt-1.5 px-1.5 py-0.5 rounded-md border text-center', metrics.statusColor.split(' ')[0], metrics.statusColor.split(' ')[1], metrics.statusColor.split(' ')[2])}>
                        {metrics.status}
                      </span>
                    </div>
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">Safety Index</span>
                      <span className="text-xs sm:text-sm font-black text-[#2E7D32] block mt-1">{metrics.rating}/10</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[10px] space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-500">Day Registration Count:</span>
                      <span className="font-extrabold text-stone-800">{metrics.count.toLocaleString()} Pilgrims</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-500">Security Density Alert:</span>
                      <span className={cn('font-extrabold', metrics.density > 80 ? 'text-[#C62828]' : 'text-[#2E7D32]')}>
                        {metrics.density > 80 ? 'Congested (Restrictive Gates Active)' : 'Smooth Passage'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-stone-400 text-[10px] font-semibold flex items-center justify-center gap-1.5">
                  <Info size={13} />
                  <span>Choose a date to connect live IoT sensors</span>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Active Passes list */}
          <CollapsibleSection
            title={`Active Darshan Passes (${journey.darshanBookings.length})`}
            icon={<ShieldCheck size={15} className="text-[#2E7D32]" />}
            defaultOpen={true}
          >
            {journey.darshanBookings.length === 0 ? (
              <div className="py-10 text-center space-y-2 text-[#6B7280]">
                <ShieldCheck size={32} className="mx-auto text-stone-300" />
                <p className="text-[11px] font-bold text-stone-500">No Darshan passes booked.</p>
                <p className="text-[10px] text-stone-400">Select a time slot and date to generate a barcode pass.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {journey.darshanBookings.map((b, idx) => (
                  <div key={idx} className="p-3.5 border border-emerald-100 bg-emerald-50/40 rounded-xl flex justify-between items-center text-xs animate-fadeIn relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2E7D32]" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-[#005BAC] truncate max-w-[210px]">{b.templeName}</h4>
                      <p className="text-[10px] text-stone-500 font-semibold">{b.date} • {b.timeSlot}</p>
                      <span className="text-[9px] font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9] mt-1.5 inline-block">
                        {b.bookingCode}
                      </span>
                    </div>
                    <button
                      onClick={() => removeDarshanBooking(b.bookingCode)}
                      className="p-2 text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                      title="Cancel Darshan Slot"
                    >
                      <Trash2 size={14} />
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
