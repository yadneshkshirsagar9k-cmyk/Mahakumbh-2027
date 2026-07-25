'use client';

import { useState, useMemo } from 'react';
import { useJourneyStore } from '@/store/journey-store';
import dynamic from 'next/dynamic';
import { MapPin, Route, Navigation, AlertTriangle, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';

// Dynamically import map component to prevent SSR issues
const SmartRouteMap = dynamic(() => import('@/components/maps/smart-route-map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-slate-400 font-medium"><MapPin className="w-8 h-8 mb-2 animate-bounce opacity-50" /> Loading Smart Maps...</div>
});

const DEFAULT_ORIGIN = { lat: 19.957, lng: 73.844, label: 'Nashik Road Railway Station' };
const DEFAULT_DEST = { lat: 19.932, lng: 73.531, label: 'Trimbakeshwar Temple' };

export default function SmartRoutePage() {
  const { journey, isPipelineComplete } = useJourneyStore();
  
  const [activeRouteId, setActiveRouteId] = useState('alt-1');

  // Compute Origin from Journey Data
  const origin = useMemo(() => {
    if (journey?.arrivalPoint) {
      return { lat: 19.957, lng: 73.844, label: journey.arrivalPoint };
    }
    return DEFAULT_ORIGIN;
  }, [journey]);

  // Compute Destination from Journey Bookings
  const destination = useMemo(() => {
    if (journey?.darshanBookings && journey.darshanBookings.length > 0) {
      return { lat: 19.932, lng: 73.531, label: journey.darshanBookings[0].templeName };
    }
    if (journey?.snanBookings && journey.snanBookings.length > 0) {
      return { lat: 20.005, lng: 73.792, label: journey.snanBookings[0].ghatName };
    }
    return DEFAULT_DEST;
  }, [journey]);

  // Mock Route Data Generation (between origin and destination)
  const routes = useMemo(() => [
    {
      id: 'primary',
      name: 'Nashik-Trimbakeshwar Hwy (Primary)',
      path: [
        [origin.lat, origin.lng],
        [19.965, 73.750],
        [19.940, 73.650],
        [destination.lat, destination.lng]
      ] as [number, number][],
      color: '#DC2626', // Red
      isCongested: true,
      distance: '28.5 km',
      duration: '1 hr 45 min',
      trafficStatus: 'Heavy Congestion'
    },
    {
      id: 'alt-1',
      name: 'Gangapur Road Bypass',
      path: [
        [origin.lat, origin.lng],
        [20.020, 73.780],
        [19.980, 73.600],
        [destination.lat, destination.lng]
      ] as [number, number][],
      color: '#10B981', // Green
      isCongested: false,
      distance: '32.1 km',
      duration: '55 min',
      trafficStatus: 'Fastest Route'
    },
    {
      id: 'alt-2',
      name: 'Ambad-Satpur Link',
      path: [
        [origin.lat, origin.lng],
        [19.900, 73.750],
        [19.920, 73.600],
        [destination.lat, destination.lng]
      ] as [number, number][],
      color: '#3B82F6', // Blue
      isCongested: false,
      distance: '30.8 km',
      duration: '1 hr 10 min',
      trafficStatus: 'Light Traffic'
    }
  ], [origin, destination]);

  if (!isPipelineComplete()) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-200 rounded-2xl mt-10">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">Feature Locked</h2>
        <p className="text-slate-600 max-w-md text-lg">
          Please complete the registration pipeline (Pilgrims, Vehicle, Snan, and Darshan bookings) to unlock the Smart Route Map.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Route Map</h1>
          <p className="text-slate-600 mt-1">Real-time GPS navigation with AI traffic prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Sidebar Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col h-full">
          <div className="mb-6 relative space-y-3">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-slate-200 z-0"></div>
            
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3 relative z-10">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starting Point</span>
                <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{origin.label}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3 relative z-10">
              <div className="bg-orange-50 p-1.5 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</span>
                <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{destination.label}</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 mb-3 flex items-center">
            <Route className="w-4 h-4 mr-2 text-slate-400" /> Suggested Routes
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {routes.map(route => {
              const isActive = route.id === activeRouteId;
              return (
                <button
                  key={route.id}
                  onClick={() => setActiveRouteId(route.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden",
                    isActive ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 p-1.5 bg-blue-600 rounded-bl-xl shadow-sm">
                      <Navigation className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <h4 className={cn("font-bold text-[13px] mb-2 pr-6 leading-tight", isActive ? "text-blue-900" : "text-slate-700")}>
                    {route.name}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs font-bold">
                    <span className={route.isCongested ? "text-red-600" : "text-emerald-600"}>
                      {route.duration}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{route.distance}</span>
                  </div>
                  {route.isCongested && (
                    <div className="mt-3 flex items-center text-[10px] font-bold text-red-600 bg-red-50 py-1.5 px-2.5 rounded-lg w-fit border border-red-100">
                      <AlertTriangle className="w-3 h-3 mr-1.5" /> Heavy Congestion Detected
                    </div>
                  )}
                  {!route.isCongested && isActive && (
                    <div className="mt-3 flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-2.5 rounded-lg w-fit border border-emerald-100">
                      <Navigation className="w-3 h-3 mr-1.5" /> Fastest Route (Live)
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button className="w-full bg-[#005BAC] hover:bg-[#004a8c] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm shadow-blue-600/20 active:scale-[0.98]">
              <Navigation className="w-4 h-4 mr-2" /> Start Navigation
            </button>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[500px] lg:h-auto relative z-0">
          <SmartRouteMap
            origin={origin}
            destination={destination}
            routes={routes}
            activeRouteId={activeRouteId}
            onSelectRoute={setActiveRouteId}
          />
        </div>
      </div>
    </div>
  );
}
