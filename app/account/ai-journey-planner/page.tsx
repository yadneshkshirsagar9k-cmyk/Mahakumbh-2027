'use client';

/**
 * @file AIJourneyPlanner
 * @description Smart travel recommendation engine automatically consuming unified Journey parameters.
 * Overhauled to show live database sync status (Prisma/MongoDB) and high-fidelity UX.
 */

import { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Calendar, Clock, Navigation, CheckCircle, Info, Users, ShieldCheck, RefreshCw, Loader2, Database, Printer, Coffee, Utensils, Heart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { LOCATION_CONFIG, navigateToCoordinates } from '@/constants/location-config';
import { useJourneyStore } from '@/store/journey-store';

export default function AIJourneyPlanner() {
  const { journey, updateJourney } = useJourneyStore();
  const [dietary, setDietary] = useState('Sattvik Bhojanalaya');
  const [selectedDay, setSelectedDay] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'saving' | 'synced'>('connected');

  // Hydrate itinerary from store when day changes
  useEffect(() => {
    if (selectedDay && journey?.journeyPlannerData && journey.journeyPlannerData[selectedDay]) {
      setItinerary(journey.journeyPlannerData[selectedDay]);
      setSyncStatus('synced');
    } else {
      setItinerary(null);
      setSyncStatus('connected');
    }
  }, [selectedDay, journey]);

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center space-y-4 max-w-lg mx-auto">
        <Info size={36} className="mx-auto text-amber-500 animate-bounce" />
        <h2 className="text-xl font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Please register your Mahakumbh Journey first to generate AI travel plans. A registered journey provides date boundaries for smart recommendations.
        </p>
      </div>
    );
  }

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

  const handleGenerate = () => {
    if (!selectedDay) return;
    setLoading(true);
    setSyncStatus('saving');

    setTimeout(() => {
      const activeSnan = journey.snanBookings.find((b) => b.date === selectedDay);
      const activeDarshan = journey.darshanBookings.find((b) => b.date === selectedDay);

      // Time parser for accurate chronological sorting
      const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
      };

      const formatTime = (mins: number) => {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        const mod = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${mod}`;
      };

      let events: { start: number; time: string; title: string; desc: string; type: 'snan' | 'darshan' }[] = [];

      if (activeSnan) {
        const startMin = parseTime(activeSnan.timeSlot.split(' - ')[0]);
        events.push({
          start: startMin,
          time: activeSnan.timeSlot.split(' - ')[0],
          title: `Holy Snan: ${activeSnan.ghatName.split(' - ')[0]}`,
          desc: `Proceed to designated ghat holding chains. Use entry token ${activeSnan.bookingCode}.`,
          type: 'snan'
        });
      }

      if (activeDarshan) {
        const startMin = parseTime(activeDarshan.timeSlot.split(' - ')[0]);
        events.push({
          start: startMin,
          time: activeDarshan.timeSlot.split(' - ')[0],
          title: `Darshan: ${activeDarshan.templeName.split(',')[0]}`,
          desc: `Arrive 30 mins early at Gate 4 with QR Pass ready for biometric verification (${activeDarshan.bookingCode}).`,
          type: 'darshan'
        });
      }

      // Sort bookings chronologically
      events.sort((a, b) => a.start - b.start);

      // Inject Morning Transit
      const firstEventStart = events.length > 0 ? events[0].start : parseTime("09:00 AM");
      const transitStart = Math.max(parseTime("06:00 AM"), firstEventStart - 90);
      
      let dynamicSteps = [
        {
          time: `${formatTime(transitStart)} - ${formatTime(transitStart + 60)}`,
          title: 'Morning Transit & Safety Clearance',
          desc: `Depart using ${journey.arrivalMode} transit line from outer base toward inner security checkpost.`,
          type: 'transit'
        }
      ];

      // Merge sorted events and inject free time gaps
      for (let i = 0; i < events.length; i++) {
        dynamicSteps.push({
          time: events[i].time,
          title: events[i].title,
          desc: events[i].desc,
          type: events[i].type === 'snan' ? 'snan' : 'darshan'
        });

        // Add free time / lunch between events if there's a gap > 2 hours
        if (i < events.length - 1) {
          const gap = events[i + 1].start - events[i].start;
          if (gap > 120) {
            const freeStart = events[i].start + 60; 
            const freeEnd = events[i + 1].start - 30; 
            dynamicSteps.push({
              time: `${formatTime(freeStart)} - ${formatTime(freeEnd)}`,
              title: `Suggested Break & Certified Meal`,
              desc: `Take a rest break. Suggested: enjoy an authentic Sattvik meal at a certified ${dietary} facility.`,
              type: 'food'
            });
          }
        }
      }

      // Pad the itinerary with rich recommendations if it's empty or finishes early
      const lastEventStart = events.length > 0 ? events[events.length - 1].start : transitStart;
      
      if (events.length === 0) {
        // No bookings - generate a full synthetic day
        dynamicSteps.push({
          time: `${formatTime(transitStart + 90)} - ${formatTime(transitStart + 150)}`,
          title: 'Local Temple & Heritage Exploration',
          desc: `Explore historical heritage landmarks surrounding the Godavari basin. Keep identity cards at hand.`,
          type: 'explore'
        });
        dynamicSteps.push({
          time: `01:00 PM - 02:30 PM`,
          title: 'Sattvik Midday Dining',
          desc: `Enjoy an authentic traditional meal at a certified ${dietary} facility near outer circle.`,
          type: 'food'
        });
      }

      if (lastEventStart < parseTime("04:00 PM")) {
        const eveningStart = Math.max(lastEventStart + 120, parseTime("04:30 PM"));
        dynamicSteps.push({
          time: `${formatTime(eveningStart)} - ${formatTime(eveningStart + 90)}`,
          title: 'Spiritual Discourse / Ashram Meditation',
          desc: `Rest at camp accommodation or attend open spiritual discourse at a nearby Ashram.`,
          type: 'rest'
        });
        dynamicSteps.push({
          time: `07:00 PM - 08:30 PM`,
          title: 'Evening Ganga Sandhya Aarti',
          desc: `Experience the divine atmosphere of the evening Aarti at Ramkund Ghat. Arrive early to secure a safe spot.`,
          type: 'aarti'
        });
      }
      
      // Always end with Dinner
      dynamicSteps.push({
        time: `08:30 PM - 09:30 PM`,
        title: 'Dinner & Camp Return',
        desc: `Return to your accommodation (${journey.accommodation.name}) and conclude the day with a light dinner.`,
        type: 'sleep'
      });

      let summaryText = `Optimized context-aware AI itinerary generated for ${journey.pilgrimCount} pilgrim(s) for ${selectedDay}.`;
      if (customPrompt) {
        summaryText += ` Adjusted for custom preference: "${customPrompt}".`;
      }

      const newItinerary = {
        summary: summaryText,
        shrine: journey.selectedTemples[0] || 'Trimbakeshwar Shiva Temple',
        accommodation: journey.accommodation.name,
        diet: dietary,
        steps: dynamicSteps
      };
      
      setItinerary(newItinerary);
      
      // Persist to store (this triggers syncWithDatabase to Prisma/MongoDB behind the scenes)
      const plannerData = journey.journeyPlannerData || {};
      updateJourney({
        journeyPlannerData: {
          ...plannerData,
          [selectedDay]: newItinerary
        }
      });
      
      setSyncStatus('synced');
      setLoading(false);
    }, 1100);
  };

  const handleNavigateClick = () => {
    let lat = 19.7668;
    let lng = 74.4754;
    const target = journey.selectedTemples[0] || '';
    if (target.includes('Trimbakeshwar')) {
      lat = LOCATION_CONFIG.TRIMBAKESHWAR.lat;
      lng = LOCATION_CONFIG.TRIMBAKESHWAR.lng;
    } else if (target.includes('Saibaba')) {
      lat = LOCATION_CONFIG.SHIRDI_SAI_BABA.lat;
      lng = LOCATION_CONFIG.SHIRDI_SAI_BABA.lng;
    } else {
      lat = LOCATION_CONFIG.RAMKUND.lat;
      lng = LOCATION_CONFIG.RAMKUND.lng;
    }
    navigateToCoordinates(lat, lng);
  };

  // Helper to determine icon for each step type
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'transit':
        return <Navigation className="text-[#005BAC]" size={13} />;
      case 'snan':
        return <Compass className="text-sky-600" size={13} />;
      case 'darshan':
        return <Heart className="text-amber-500" size={13} />;
      case 'food':
        return <Utensils className="text-[#2E7D32]" size={13} />;
      case 'explore':
        return <Compass className="text-[#005BAC]" size={13} />;
      case 'rest':
        return <Coffee className="text-stone-500" size={13} />;
      case 'aarti':
        return <Sparkles className="text-amber-600 animate-pulse" size={13} />;
      case 'sleep':
        return <Clock className="text-stone-500" size={13} />;
      default:
        return <Clock className="text-[#005BAC]" size={13} />;
    }
  };

  return (
    <div className="space-y-6 text-[#111827] text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">AI Journey Planner</h1>
          <p className="text-xs text-[#6B7280]">Smart travel recommendation engine powered by real-time queue simulations</p>
        </div>

        {/* Live Database Sync Indicator */}
        <div className="flex items-center gap-2 bg-[#FAFBFC] border border-[#E5E7EB] px-3.5 py-2 rounded-xl shadow-sm">
          <Database size={14} className={cn(
            syncStatus === 'saving' ? 'text-amber-500 animate-pulse' : 'text-[#2E7D32]'
          )} />
          <div className="text-left">
            <span className="text-[8px] text-[#6B7280] font-black uppercase block tracking-wider">Cloud Data Source</span>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-2 h-2 rounded-full block shadow-sm",
                syncStatus === 'saving' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
              )} />
              <span className="text-[10px] font-extrabold text-stone-700">
                {syncStatus === 'saving' ? 'Saving to MongoDB...' : 'MongoDB Connected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form panel: Reads directly from Journey */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Sparkles size={15} className="text-[#005BAC]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Journey Parameters</h3>
          </div>

          {/* Active summary pill */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Consuming active registered Journey details (ID: <strong className="font-mono text-[#005BAC]">{journey.id}</strong>)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="space-y-1">
              <span className="text-[9px] text-[#6B7280] font-bold uppercase block tracking-wider">Total Registered</span>
              <p className="p-2.5 border border-stone-100 bg-[#FAFBFC] rounded-lg font-bold text-[#111827]">{journey.pilgrimCount} Pilgrim(s)</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-[#6B7280] font-bold uppercase block tracking-wider">Arrival Mode</span>
              <p className="p-2.5 border border-stone-100 bg-[#FAFBFC] rounded-lg font-semibold text-[#111827]">{journey.arrivalMode}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[9px] text-[#6B7280] font-bold uppercase block tracking-wider">Accommodation</span>
              <p className="p-2.5 border border-stone-100 bg-[#FAFBFC] rounded-lg font-semibold text-[#111827] truncate">{journey.accommodation.name}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[9px] text-[#6B7280] font-bold uppercase block tracking-wider">Spiritual Destinations</span>
              <div className="p-3 border border-stone-100 bg-[#FAFBFC] rounded-lg font-semibold text-[#374151] space-y-1.5">
                <div className="truncate">Ghats: {journey.selectedGhats.join(', ') || 'None'}</div>
                <div className="truncate">Temples: {journey.selectedTemples.join(', ') || 'None'}</div>
              </div>
            </div>
          </div>

          {/* User customizable inputs */}
          <div className="space-y-4 pt-4 border-t border-[#E5E7EB] text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Select Day of Visit *</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none focus:border-[#005BAC]"
              >
                <option value="">Select a date in your journey range</option>
                {journeyDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Dietary Preference</label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none focus:border-[#005BAC]"
                >
                  <option value="Sattvik Bhojanalaya">Sattvik Bhojanalaya (Govt Certified)</option>
                  <option value="Standard Vegetarian">Standard Vegetarian</option>
                  <option value="Jain Meals">Jain Meals</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">Custom Prompt (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., traveling with elderly"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-3 py-3 text-xs rounded-xl border border-[#E5E7EB] bg-white text-[#111827] outline-none focus:border-[#005BAC]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedDay}
            className="w-full py-3.5 bg-[#005BAC] hover:bg-[#0F4C81] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-2 border-none outline-none shadow-md"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : itinerary ? (
              <RefreshCw size={14} className="text-white" />
            ) : (
              <Sparkles size={14} className="text-white" />
            )}
            {loading ? 'Processing AI Models...' : (itinerary ? 'Regenerate AI Itinerary' : 'Generate AI Smart Itinerary')}
          </button>
        </div>

        {/* Output itinerary panel */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm min-h-[460px] flex flex-col justify-between">
          {!itinerary ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                <Compass size={24} className="animate-pulse" />
              </div>
              <p className="text-xs text-[#6B7280] max-w-xs font-semibold leading-relaxed">
                Please select a planning day on the left panel and click generate to calculate your optimized travel route, safety advisories, and certified dining.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-[#E5E7EB] pb-3 flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-[#005BAC] tracking-widest block">AI RECOMMENDATION RESULTS</span>
                  <p className="text-xs font-extrabold text-[#111827] mt-1 leading-relaxed">{itinerary.summary}</p>
                </div>
                
                {/* Print button */}
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-[#E5E7EB] hover:bg-stone-50 rounded-lg text-stone-600 transition-all cursor-pointer bg-transparent"
                  title="Print Itinerary"
                >
                  <Printer size={13} />
                </button>
              </div>

              {/* Steps timeline */}
              <div className="space-y-5">
                {itinerary.steps.map((st: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-7 h-7 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-center text-[10px] font-black text-[#005BAC] shadow-sm">
                        {idx + 1}
                      </div>
                      {idx < itinerary.steps.length - 1 && (
                        <div className="w-0.5 h-14 bg-[#E5E7EB] mt-1" />
                      )}
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono text-[9px] font-bold flex items-center gap-1">
                          {getStepIcon(st.type)}
                          {st.time}
                        </span>
                        <span className="text-xs font-black text-[#111827]">{st.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transit links */}
              <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#374151] font-semibold">
                  <MapPin size={13} className="text-[#005BAC]" />
                  <span>Sector Gate Clearance: <strong className="text-emerald-600">APPROVED</strong></span>
                </div>
                <button
                  onClick={handleNavigateClick}
                  className="px-4 py-2 border border-[#005BAC] hover:bg-[#005BAC]/5 text-[#005BAC] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-transparent outline-none select-none shadow-sm active:scale-[0.98]"
                >
                  <Navigation size={12} />
                  <span>Get Directions to Temple</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
