'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useFamilyTrackingStore } from '@/features/family/stores/familyTrackingStore';
import { useFamilySafetyStore } from '@/features/family/stores/familySafetyStore';
import { useJourneyStore } from '@/store/journey-store';
import { Map, Navigation, ShieldAlert, Crosshair, Users, MapPin, Radio, Compass, Phone, RefreshCw, Layers, ShieldCheck, Activity, Battery, BatteryWarning, AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const DynamicFamilyMap = dynamic(() => import('./FamilyMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#e8eae6] text-gray-500 font-black uppercase tracking-widest text-xl opacity-50">
      Loading Spatial Engine...
    </div>
  )
});

export default function FamilySafetyDashboard() {
  const { journey } = useJourneyStore();
  const journeyId = journey?.id || '';
  const { configs } = useFamilySafetyStore();
  const config = configs[journeyId];
  
  const getFamilyMembers = useFamilyTrackingStore(state => state.getFamilyMembers);
  const members = React.useMemo(() => getFamilyMembers(journey), [journey, getFamilyMembers]);
  const trackingStatus = useFamilyTrackingStore(state => state.getTrackingStatus(journeyId));

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showRadius, setShowRadius] = useState(true);
  
  // Interactive feature states
  const [activeModal, setActiveModal] = useState<'none' | 'broadcast' | 'meeting' | 'guardian'>('none');
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [mapAction, setMapAction] = useState<string | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const [meetingPoint, setMeetingPoint] = useState<[number, number] | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);

  // Helper to trigger map actions and reset them so they can be re-triggered
  const triggerMapAction = (action: string) => {
    setMapAction(action);
    setTimeout(() => setMapAction(null), 100);
  };

  if (!journey || journey.pilgrims.length <= 1) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 bg-gray-50 rounded-xl border border-gray-100 h-full mt-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <Users size={28} />
        </div>
        <h3 className="text-base font-black text-gray-700">Family Safety Inactive</h3>
        <p className="text-xs text-gray-500 max-w-sm font-semibold">
          Add pilgrims to your journey to automatically activate the Family Tracking & Reunification ecosystem.
        </p>
      </div>
    );
  }

  const safeCount = members.filter(m => m.status === 'Safe').length;
  const outsideCount = members.filter(m => m.status === 'Outside Radius').length;
  const emergencyCount = members.filter(m => m.status === 'Emergency').length;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-100">
      
      {/* 1. FAMILY STATUS BAR (Top) */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black text-[#111827] flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#005BAC]" />
            Family Intelligence Map
          </h2>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
            <span className="text-gray-500 flex items-center gap-1"><Users size={12}/> {members.length} Members</span>
            <span className="text-green-600 flex items-center gap-1"><Check size={12}/> {safeCount} Safe</span>
            {outsideCount > 0 && <span className="text-yellow-600 flex items-center gap-1"><AlertTriangle size={12}/> {outsideCount} Warning</span>}
            {emergencyCount > 0 && <span className="text-red-600 flex items-center gap-1"><ShieldAlert size={12}/> {emergencyCount} SOS</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Activity size={10} className="text-green-500 animate-pulse" /> Live Sync Active
          </span>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded">
            Meeting Point: Safe Zone Alpha
          </span>
        </div>
      </div>

      {/* 2. 70/30 SPLIT CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT PANEL: 70% INTERACTIVE MAP */}
        <div className="flex-[7] bg-[#e5e9ec] relative flex flex-col h-full border-r border-gray-200">
          
          {/* REAL LEAFLET MAP INTEGRATION */}
          <DynamicFamilyMap 
            members={members}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            showRadius={showRadius}
            safeRadiusMeters={config?.safeRadiusMeters || 50}
            mapLayer={mapLayer}
            mapAction={mapAction}
            navigationTarget={navigationTarget}
            meetingPoint={meetingPoint}
          />

          {/* SMART MAP CONTROLS (Floating) */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
            <button onClick={() => triggerMapAction('fit_all')} className="w-8 h-8 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#005BAC] hover:bg-gray-50 transition-colors" title="Locate Family">
              <Users size={16} />
            </button>
            <button onClick={() => triggerMapAction('center_leader')} className="w-8 h-8 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#005BAC] hover:bg-gray-50 transition-colors" title="Locate Me">
              <Crosshair size={16} />
            </button>
            <button 
              className={cn("w-8 h-8 rounded shadow-sm border flex items-center justify-center transition-colors", showRadius ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')} 
              onClick={() => setShowRadius(!showRadius)}
              title="Toggle Safe Radius"
            >
              <Radio size={16} />
            </button>
            <button onClick={() => setMapLayer(l => l === 'street' ? 'satellite' : 'street')} className="w-8 h-8 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#005BAC] hover:bg-gray-50 transition-colors" title="Toggle Layer">
              <Layers size={16} />
            </button>
            <button onClick={() => triggerMapAction('fit_all')} className="w-8 h-8 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#005BAC] hover:bg-gray-50 transition-colors mt-4" title="Reset View">
              <Compass size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: 30% MEMBER INFORMATION */}
        <div className="flex-[3] bg-white h-full overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-gray-100 shrink-0 sticky top-0 bg-white/95 backdrop-blur z-10">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Family Roster</h3>
          </div>
          
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {members.map((member, idx) => {
              const isSelected = selectedMember === member.id;
              const isSOS = member.status === 'Emergency';
              const isOutside = member.status === 'Outside Radius';
              const safeRadius = config?.safeRadiusMeters || 50;
              const distanceMeters = idx === 0 ? 0 : Math.round(isOutside ? safeRadius * 1.5 : safeRadius * 0.5);

              return (
                <div 
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={cn(
                    'border rounded-xl p-3 cursor-pointer transition-all duration-200 shadow-sm relative overflow-hidden',
                    isSelected ? 'ring-2 ring-offset-1 ring-[#005BAC] border-transparent' : 'border-gray-200 hover:border-[#005BAC]',
                    isSOS ? 'bg-red-50' : isOutside ? 'bg-amber-50' : 'bg-white'
                  )}
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                      <span className="text-sm font-bold text-gray-500">{member.id.substring(0,2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-[#111827] truncate">{member.id}</h4>
                        <span className={cn(
                          'text-[9px] font-black uppercase px-2 py-0.5 rounded',
                          isSOS ? 'bg-red-100 text-red-700 border border-red-200' :
                          isOutside ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          'bg-green-100 text-green-700 border border-green-200'
                        )}>{member.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold truncate">ID: {member.id}</p>
                      
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-gray-600">
                        <span className="flex items-center gap-1"><MapPin size={10}/> {distanceMeters}m away</span>
                        <span className="flex items-center gap-1"><Battery size={10} className="text-green-500"/> 85%</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Actions */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50 flex gap-2 relative z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setNavigationTarget(navigationTarget === member.id ? null : member.id); triggerMapAction('fit_all'); }}
                        className={cn("flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors", navigationTarget === member.id ? "bg-green-600 text-white hover:bg-green-700" : "bg-[#005BAC] text-white hover:bg-[#0F4C81]")}
                      >
                        <Navigation size={12}/> {navigationTarget === member.id ? 'Navigating...' : 'Navigate'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:1234567890'; }}
                        className="flex-1 bg-white text-[#005BAC] border border-[#005BAC] py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-indigo-50"
                      >
                        <Phone size={12}/> Call
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODALS */}
      {activeModal !== 'none' && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">
                {activeModal === 'broadcast' && 'Broadcast Message'}
                {activeModal === 'meeting' && 'Set Meeting Point'}
                {activeModal === 'guardian' && 'Assign Guardian'}
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {activeModal === 'broadcast' && (
                <>
                  <p className="text-xs text-gray-500">Send an urgent alert to all family members.</p>
                  <textarea 
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#005BAC] focus:ring-1 focus:ring-[#005BAC]" 
                    rows={3} 
                    placeholder="Enter your message..."
                  ></textarea>
                  <button 
                    onClick={() => { alert('Broadcast sent to all members!'); setActiveModal('none'); }}
                    className="w-full bg-[#005BAC] hover:bg-[#0F4C81] text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Send Broadcast
                  </button>
                </>
              )}
              
              {activeModal === 'meeting' && (
                <>
                  <p className="text-xs text-gray-500">Choose a common landmark to reunite your family.</p>
                  <select className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#005BAC]">
                    <option>Safe Zone Alpha (Trimbakeshwar)</option>
                    <option>Medical Camp 12</option>
                    <option>Main Ghat Information Center</option>
                  </select>
                  <button 
                    onClick={() => { 
                      setMeetingPoint([20.005, 73.785]); // Set dummy coordinates on map
                      triggerMapAction('fit_all'); // Zoom to show everyone + meeting point
                      setActiveModal('none'); 
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Set Point & Notify Family
                  </button>
                </>
              )}

              {activeModal === 'guardian' && (
                <>
                  <p className="text-xs text-gray-500">Assign a temporary guardian for selected members.</p>
                  <select className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#005BAC]">
                    {members.filter((m, idx) => idx !== 0).map(m => (
                      <option key={m.id}>{m.id}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="temp" className="rounded text-[#005BAC] focus:ring-[#005BAC]" />
                    <label htmlFor="temp" className="text-xs text-gray-600">Assign to Mahakumbh Volunteer (Emergency)</label>
                  </div>
                  <button 
                    onClick={() => { alert('Guardian successfully assigned!'); setActiveModal('none'); }}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2"
                  >
                    Confirm Guardian
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. QUICK ACTIONS (Bottom) */}
      <div className="bg-white border-t border-gray-200 p-3 shrink-0 z-10 shadow-sm flex items-center justify-between overflow-x-auto relative">
        <div className="flex items-center gap-2 min-w-max">
          <button onClick={() => setActiveModal('broadcast')} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors">
            <Radio size={14}/> Broadcast
          </button>
          <button onClick={() => setActiveModal('meeting')} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors">
            <MapPin size={14}/> Meeting Point
          </button>
          <button onClick={() => setActiveModal('guardian')} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors">
            <ShieldCheck size={14}/> Assign Guardian
          </button>
        </div>
        
        <div className="flex items-center min-w-max ml-4">
          <button 
            onClick={() => {
              if (window.confirm("Activate EMERGENCY SOS? This will alert authorities and your family.")) {
                setIsSosActive(true);
                alert("Emergency SOS Activated. Help is on the way.");
              }
            }}
            className={cn("px-6 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all", isSosActive ? "bg-red-600 text-white animate-pulse" : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200")}
          >
            <ShieldAlert size={14} className={isSosActive ? "" : "animate-pulse"}/> {isSosActive ? "SOS ACTIVE" : "Emergency SOS"}
          </button>
        </div>
      </div>
      
    </div>
  );
}
