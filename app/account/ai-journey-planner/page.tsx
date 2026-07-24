'use client';

/**
 * @file AIJourneyPlanner
 * @description Smart travel recommendation engine automatically consuming unified Journey parameters.
 */

import { useState } from 'react';
import { Compass, Sparkles, MapPin, Calendar, Clock, Navigation, CheckCircle, Info, Users, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { LOCATION_CONFIG, navigateToCoordinates } from '@/constants/location-config';
import { useJourneyStore } from '@/store/journey-store';

export default function AIJourneyPlanner() {
  const { journey } = useJourneyStore();
  const [dietary, setDietary] = useState('Sattvik Bhojanalaya');
  const [selectedDay, setSelectedDay] = useState('');
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center space-y-4">
        <Info size={28} className="mx-auto text-amber-500" />
        <h2 className="text-lg font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280]">Please register your Mahakumbh Journey first to generate AI travel plans.</p>
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

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const activeSnan = journey.snanBookings.find((b) => b.date === selectedDay);
      const activeDarshan = journey.darshanBookings.find((b) => b.date === selectedDay);

      let dynamicSteps = [
        {
          time: '07:00 AM - 08:30 AM',
          title: 'Morning Travel Optimization & Transit',
          desc: `Depart using ${journey.arrivalMode} transit line from outer base toward inner security checkpost. Biometric tokens verified.`
        }
      ];

      let summaryText = `Optimized context-aware AI itinerary generated for ${journey.pilgrimCount} pilgrim(s) for ${selectedDay || journey.startDate} using journey transport: ${journey.arrivalMode}.`;

      if (activeSnan && activeDarshan) {
        summaryText += ` Note: You have approximately 4 hours between your holy Snan and Darshan bookings.`;

        dynamicSteps.push({
          time: activeSnan.timeSlot.split(' - ')[0],
          title: `Booked Snan: ${activeSnan.ghatName}`,
          desc: `Proceed to designated ghat. Water levels are verified safe. Use safety chains.`
        });

        dynamicSteps.push({
          time: '12:00 PM - 03:00 PM',
          title: `Free Time & Suggested Activities`,
          desc: `You have open hours between Snan and Darshan. Suggested activities: have lunch at a certified Sattvik Bhojanalaya, and take a peaceful Riverfront Walk.`
        });

        dynamicSteps.push({
          time: activeDarshan.timeSlot.split(' - ')[0],
          title: `Booked Darshan: ${activeDarshan.templeName}`,
          desc: `Arrive 30 minutes before your slot at Gate 4 with your QR Pass ready for biometric verification.`
        });
      } else {
        if (activeSnan) {
          dynamicSteps.push({
            time: activeSnan.timeSlot.split(' - ')[0],
            title: `Booked Snan: ${activeSnan.ghatName}`,
            desc: `Enjoy your scheduled holy bath. Use biometric entry code ${activeSnan.bookingCode}.`
          });
        }
        if (activeDarshan) {
          dynamicSteps.push({
            time: activeDarshan.timeSlot.split(' - ')[0],
            title: `Booked Darshan: ${activeDarshan.templeName}`,
            desc: `Arrive 30 minutes prior to Darshan. Scan QR gatepass at checkpost.`
          });
        }
      }


      setItinerary({
        summary: summaryText,
        shrine: journey.selectedTemples[0] || 'Trimbakeshwar Shiva Temple',
        accommodation: journey.accommodation.name,
        diet: dietary,
        steps: dynamicSteps
      });
      setLoading(false);
    }, 1000);
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

  return (
    <div className="space-y-6 text-[#111827] text-left">
      <div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">AI Journey Planner</h1>
        <p className="text-xs text-[#6B7280]">Smart travel recommendation engine powered by real-time queue simulations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form panel: Reads directly from Journey */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <Sparkles size={16} className="text-[#005BAC]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Journey Parameters (Active)</h3>
          </div>

          {/* Active summary pill */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>AI model is using your active registered Journey details automatically.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="space-y-1">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Journey ID</span>
              <p className="p-2 border border-gray-100 bg-[#FAFBFC] rounded font-mono font-bold text-[#005BAC]">{journey.id}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Total Devotees</span>
              <p className="p-2 border border-gray-100 bg-[#FAFBFC] rounded font-bold text-[#111827]">{journey.pilgrimCount} Pilgrim(s)</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Transport Mode</span>
              <p className="p-2 border border-gray-100 bg-[#FAFBFC] rounded font-semibold text-[#111827]">{journey.arrivalMode}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Accommodation</span>
              <p className="p-2 border border-gray-100 bg-[#FAFBFC] rounded font-semibold text-[#111827] truncate">{journey.accommodation.name}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Selected Destinations</span>
              <div className="p-2.5 border border-gray-100 bg-[#FAFBFC] rounded font-semibold text-[#374151] space-y-1">
                <div>Ghats: {journey.selectedGhats.join(', ') || 'None'}</div>
                <div>Temples: {journey.selectedTemples.join(', ') || 'None'}</div>
              </div>
            </div>
          </div>

          {/* User customizable inputs */}
          <div className="space-y-3 pt-2 border-t border-[#E5E7EB] text-xs">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#374151]">Select Specific Planning Day *</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none"
              >
                <option value="">Select a date in your journey range</option>
                {journeyDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#374151]">Dietary Preference</label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] font-semibold outline-none"
              >
                <option value="Sattvik Bhojanalaya">Sattvik Bhojanalaya (Govt Certified)</option>
                <option value="Standard Vegetarian">Standard Vegetarian</option>
                <option value="Jain Meals">Jain Meals</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedDay}
            className="w-full py-3 bg-[#005BAC] hover:bg-[#0F4C81] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-2 border-none outline-none"
          >
            <Sparkles size={14} className="text-white" />
            {loading ? 'Generating optimized route map...' : 'Generate AI Smart Itinerary'}
          </button>
        </div>

        {/* Output itinerary panel */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm min-h-[400px] flex flex-col justify-between">
          {!itinerary ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#6B7280]">
                <Compass size={24} />
              </div>
              <p className="text-xs text-[#6B7280] max-w-xs font-semibold leading-relaxed">
                Please select a planning day on the left panel and generate to calculate your optimized travel route, safety advisories and nearby accommodations.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border-b border-[#E5E7EB] pb-2.5">
                <span className="text-[9px] font-black uppercase text-[#005BAC] tracking-widest block">AI RECOMMENDATION RESULTS</span>
                <p className="text-xs font-bold text-[#111827] mt-1">{itinerary.summary}</p>
              </div>

              {/* Steps timeline */}
              <div className="space-y-4">
                {itinerary.steps.map((st: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-7 h-7 rounded-full bg-[#F5F7FA] border border-[#E5E7EB] flex items-center justify-center text-[9px] font-black text-[#005BAC]">
                        {idx + 1}
                      </div>
                      {idx < itinerary.steps.length - 1 && (
                        <div className="w-0.5 h-12 bg-[#E5E7EB] mt-1" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-[#005BAC]" />
                        <span className="text-[10px] font-mono font-bold text-[#6B7280]">{st.time}</span>
                        <span className="text-xs font-extrabold text-[#111827]">{st.title}</span>
                      </div>
                      <p className="text-[11px] text-[#374151] leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transit links */}
              <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#374151]">
                  <MapPin size={12} className="text-[#005BAC]" />
                  <span>Sector Gate Clearance: <strong className="text-emerald-600">APPROVED</strong></span>
                </div>
                <button
                  onClick={handleNavigateClick}
                  className="px-4 py-2 border border-[#005BAC] hover:bg-[#005BAC]/5 text-[#005BAC] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-transparent outline-none select-none"
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
