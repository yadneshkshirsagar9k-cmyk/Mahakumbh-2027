'use client';

/**
 * @file SmartSnanBooking
 * @description Smart Snan Allocation linked directly to the unified Journey Registration dates.
 * Overhauled with real-time simulated IoT database slot capacities and river safety sensors.
 */

import { useState, useEffect } from 'react';
import { Waves, HelpCircle, AlertCircle, ShieldAlert, Award, FileText, CheckCircle, Trash2, Loader2, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { useJourneyStore, SnanBooking } from '@/store/journey-store';

export default function SmartSnanBooking() {
  const { journey, addSnanBooking, removeSnanBooking } = useJourneyStore();
  const [ghatZone, setGhatZone] = useState('Kusha Varta Ghat - Trimbakeshwar');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Trigger simulated IoT network fetch when date or ghat zone changes
  useEffect(() => {
    if (date) {
      setLoading(true);
      setSelectedSlot('');
      const timer = setTimeout(() => {
        setLoading(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [date, ghatZone]);

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle size={36} className="mx-auto text-amber-500 animate-bounce" />
        <h2 className="text-xl font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Please register your Mahakumbh Journey first to book a Holy Snan slot. A registered journey provides date boundaries for slot allocation.
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
  const getDynamicSlots = (ghatName: string, dateStr: string) => {
    const timeSlots = [
      { id: 's1', time: '04:00 AM - 06:00 AM' },
      { id: 's2', time: '06:00 AM - 08:00 AM' },
      { id: 's3', time: '08:00 AM - 10:00 AM' },
      { id: 's4', time: '10:00 AM - 12:00 PM' },
      { id: 's5', time: '12:00 PM - 02:00 PM' },
      { id: 's6', time: '02:00 PM - 04:00 PM' },
    ];

    return timeSlots.map((ts) => {
      const combined = `${ghatName}-${dateStr}-${ts.time}`;
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
      }
      const seed = Math.abs(hash);

      const occupancy = 15 + (seed % 81); // 15% to 95%
      
      let label = 'Moderate Crowd';
      let color = 'bg-blue-500/10 text-blue-600 border-blue-300';
      if (occupancy > 85) {
        label = 'Critical Crowd';
        color = 'bg-red-500/10 text-red-600 border-red-300';
      } else if (occupancy > 60) {
        label = 'High Crowd';
        color = 'bg-amber-500/10 text-amber-600 border-amber-300';
      } else if (occupancy < 30) {
        label = 'Low Crowd';
        color = 'bg-emerald-500/10 text-emerald-600 border-emerald-300';
      }

      return {
        id: ts.id,
        time: ts.time,
        occupancy,
        label,
        color
      };
    });
  };

  const slots = date ? getDynamicSlots(ghatZone, date) : [];

  const getLiveMetrics = (ghatName: string, dateStr: string) => {
    if (!dateStr) return { flowRate: 'N/A', depth: 'N/A', count: 0, maxCap: 1000, safetyIndex: 'N/A', color: 'text-stone-400' };
    const combined = `${ghatName}-${dateStr}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const flowVal = 0.5 + (seed % 7) / 10; // 0.5 to 1.1 m/s
    const flowRate = `${flowVal.toFixed(1)} m/s (${flowVal > 0.9 ? 'Moderate' : 'Safe'})`;
    
    const depthVal = 2.8 + (seed % 14) / 10; // 2.8 to 4.1 ft
    const depth = `${depthVal.toFixed(1)} ft (Normal)`;

    const count = 180 + (seed % 750);
    const maxCap = ghatName.includes('Kusha') ? 800 : 1200;
    
    const safetyVal = 9.9 - (count / maxCap);
    const safetyIndex = `${safetyVal.toFixed(1)}/10`;

    let color = 'text-[#2E7D32] bg-[#E8F5E9]';
    if (safetyVal < 8.0) {
      color = 'text-[#EF6C00] bg-[#FFF3E0]';
    }

    return {
      flowRate,
      depth,
      count,
      maxCap,
      safetyIndex,
      color
    };
  };

  const metrics = getLiveMetrics(ghatZone, date);

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
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Smart Snan Allocation</h1>
        <p className="text-xs text-[#6B7280]">Ghat monitoring grid managing water levels, flow dynamics and crowd safety tokens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm space-y-5">
          <div className="border-b border-[#E5E7EB] pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
              <Waves size={14} className="text-[#005BAC]" />
              <span>Reserve Snan Slot</span>
            </h3>
            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
              Live Bath Tokens
            </span>
          </div>

          {/* Alert Success Box */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800">
            <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={15} />
            <p className="text-[11px] leading-relaxed font-semibold">
              Journey validated. ID: <strong className="font-mono text-[#005BAC]">{journey.id}</strong>. Booking matches date boundaries: {journey.startDate} to {journey.endDate}.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Select Ghat Zone</label>
              <select
                value={ghatZone}
                onChange={(e) => setGhatZone(e.target.value)}
                className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none focus:border-[#005BAC] focus:ring-1 focus:ring-[#005BAC]"
              >
                <option value="Kusha Varta Ghat - Trimbakeshwar">Kusha Varta Ghat - Trimbakeshwar</option>
                <option value="Ramkund Ghat - Sector A">Ramkund Ghat - Sector A</option>
                <option value="Tapovan Ghat - Sector B">Tapovan Ghat - Sector B</option>
                <option value="Ganga Godavari Ghat">Ganga Godavari Ghat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Ritual Date *</label>
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
          </div>

          {/* Time Slot Grid */}
          {date && (
            <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
              <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Select Time Slot</label>
              
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-500">
                  <Loader2 className="animate-spin text-[#005BAC]" size={28} />
                  <span className="text-xs font-semibold animate-pulse">Syncing with IoT flow meters...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {slots.map((sl) => {
                    const isBooked = isSlotBooked(sl.time);
                    return (
                      <button
                        key={sl.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(sl.id)}
                        className={cn(
                          'p-4 border rounded-xl cursor-pointer transition-all flex flex-col justify-between items-start text-left gap-2 w-full bg-white relative overflow-hidden select-none outline-none focus:ring-1 focus:ring-[#005BAC]',
                          isBooked
                            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                            : selectedSlot === sl.id
                            ? 'border-[#005BAC] ring-1 ring-[#005BAC] bg-[#F5F7FA]'
                            : 'border-[#E5E7EB] hover:border-[#005BAC]/40'
                        )}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-black text-[#111827]">{sl.time}</span>
                          {isBooked ? (
                            <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-500 text-[8px] font-black uppercase">
                              Booked
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-500 font-bold">{sl.occupancy}% Filled</span>
                          )}
                        </div>

                        {/* Progress Bar under timing */}
                        {!isBooked && (
                          <div className="w-full h-1 rounded-full bg-[#FAFBFC] border border-stone-100 overflow-hidden my-0.5">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-300',
                                sl.occupancy > 85
                                  ? 'bg-red-500'
                                  : sl.occupancy > 60
                                  ? 'bg-[#EF6C00]'
                                  : 'bg-[#2E7D32]'
                              )}
                              style={{ width: `${sl.occupancy}%` }}
                            />
                          </div>
                        )}

                        <span className={cn('px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border', sl.color)}>
                          {sl.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Safety Checklist */}
          <CollapsibleSection title="River Safety Directives (Required to Accept)" icon={<CheckCircle size={14} className="text-[#2E7D32]" />} defaultOpen={true} card={false}>
            <label className="flex items-start gap-2.5 p-3.5 bg-[#FAFBFC] rounded-xl cursor-pointer border border-[#E5E7EB] hover:bg-[#F5F7FA]/30 transition-all select-none">
              <input
                type="checkbox"
                checked={safetyAgreed}
                onChange={(e) => setSafetyAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E7EB] accent-[#005BAC] mt-0.5 shrink-0"
              />
              <div className="text-[10px] text-[#374151] leading-normal text-left">
                <strong className="block text-[#111827] mb-0.5">Acknowledge River Safety Directives:</strong>
                <ul className="list-disc pl-3.5 space-y-0.5 font-semibold text-stone-600">
                  <li>I will hold the safety chains at all times.</li>
                  <li>I will respect the water depth markers and lifeguards.</li>
                  <li>I agree not to carry plastics, soaps, or chemical toiletries into the river.</li>
                </ul>
              </div>
            </label>
          </CollapsibleSection>

          <button
            onClick={handleBook}
            disabled={!date || !selectedSlot || !safetyAgreed || loading}
            className="w-full py-3.5 bg-[#005BAC] hover:bg-[#0F4C81] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 border-none outline-none shadow-md"
          >
            <span>Confirm Ghat Snan Reservation</span>
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ghat Metrics */}
          <CollapsibleSection
            title={`IoT Safety Sensors: ${ghatZone.split(' - ')[0]}`}
            icon={<Waves size={15} className="text-[#005BAC]" />}
            defaultOpen={true}
            badge={ghatZone.split(' - ')[1] || 'Nashik'}
          >
            <div className="space-y-4">
              {date ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">River Flow Rate</span>
                      <span className="text-xs font-black text-[#2E7D32] block mt-1">{metrics.flowRate}</span>
                    </div>
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">Water Depth</span>
                      <span className="text-xs font-black text-[#005BAC] block mt-1">{metrics.depth}</span>
                    </div>
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">Current Crowd density</span>
                      <span className="text-xs font-black text-stone-700 block mt-1">{metrics.count} / {metrics.maxCap}</span>
                    </div>
                    <div className="bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 rounded-xl">
                      <span className="text-[8px] text-[#6B7280] font-black block uppercase tracking-wider">Ghat Safety Index</span>
                      <span className={cn('text-[10px] font-black block mt-1.5 px-1.5 py-0.5 rounded border text-center inline-block', metrics.color)}>
                        {metrics.safetyIndex}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-yellow-50/50 border border-yellow-100 rounded-xl flex items-start gap-2.5 text-yellow-800 text-[10px] leading-relaxed">
                    <AlertCircle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-yellow-900 mb-0.5">Real-time River Advisory:</strong>
                      Water flow and depth levels are synchronized via automated river telemetry. Bathing is strictly limited to fenced sectors and chains must be held at all times.
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-stone-400 text-[10px] font-semibold flex items-center justify-center gap-1.5">
                  <Info size={13} />
                  <span>Choose a date to connect live IoT river sensors</span>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Active Tokens list */}
          <CollapsibleSection
            title={`Active Snan Tokens (${journey.snanBookings.length})`}
            icon={<Waves size={15} className="text-[#2E7D32]" />}
            defaultOpen={true}
          >
            {journey.snanBookings.length === 0 ? (
              <div className="py-10 text-center space-y-2 text-[#6B7280]">
                <Waves size={32} className="mx-auto text-stone-300" />
                <p className="text-[11px] font-bold text-stone-500">No Snan tokens booked.</p>
                <p className="text-[10px] text-stone-400">Select a date and ghat slot to generate a security bath token.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {journey.snanBookings.map((b, idx) => (
                  <div key={idx} className="p-3.5 border border-emerald-100 bg-emerald-50/40 rounded-xl flex justify-between items-center text-xs animate-fadeIn relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2E7D32]" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-[#005BAC] truncate max-w-[210px]">{b.ghatName}</h4>
                      <p className="text-[10px] text-stone-500 font-semibold">{b.date} • {b.timeSlot}</p>
                      <span className="text-[9px] font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9] mt-1.5 inline-block">
                        {b.bookingCode}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSnanBooking(b.bookingCode)}
                      className="p-2 text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                      title="Cancel Snan Slot"
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
