'use client';

/**
 * @file SmartRoutePage
 * @description Smart travel route calculation dashboard incorporating simulated turn-by-turn GPS telemetry, dynamic ETAs, and segmented traffic speeds.
 */

import { useState, useEffect, useMemo } from 'react';
import { useJourneyStore } from '@/store/journey-store';
import dynamic from 'next/dynamic';
import { MapPin, Route, Navigation, AlertTriangle, Lock, X, Volume2, VolumeX, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

// Dynamically import map component to prevent SSR issues
const SmartRouteMap = dynamic(() => import('@/components/maps/smart-route-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-50 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-slate-400 font-medium">
      <MapPin className="w-8 h-8 mb-2 animate-bounce opacity-50 text-[#005BAC]" /> 
      <span>Loading Live Google Maps Engine...</span>
    </div>
  )
});

const DEFAULT_ORIGIN = { lat: 19.957, lng: 73.844, label: 'Nashik Road Railway Station' };
const DEFAULT_DEST = { lat: 19.932, lng: 73.531, label: 'Trimbakeshwar Temple' };

export default function SmartRoutePage() {
  const { journey, isPipelineComplete } = useJourneyStore();
  
  const [activeRouteId, setActiveRouteId] = useState('alt-1');
  const [isNavigating, setIsNavigating] = useState(false);
  const [gpsProgress, setGpsProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

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
  const routes = useMemo(() => {
    const isToTrimbak = destination.lat === 19.932 || destination.label.includes('Trimbakeshwar');
    
    if (isToTrimbak) {
      return [
        {
          id: 'primary',
          name: 'Nashik-Trimbakeshwar Hwy (Primary NH848)',
          path: [
            [origin.lat, origin.lng],
            [19.972, 73.829], // Bytco Point
            [19.988, 73.812], // Dwarka Circle approach
            [19.992, 73.803], // Dwarka Circle
            [19.998, 73.784], // Thakkar Bazaar / CBS
            [19.996, 73.765], // Satpur Phata
            [19.993, 73.733], // Satpur MIDC
            [19.988, 73.712], // Carbon Naka
            [19.976, 73.693], // Garware Point
            [19.968, 73.670], // Satpur Bypass junction
            [19.961, 73.645], // Dhonda Naka
            [19.954, 73.618], // Belgaon Dhaga
            [19.948, 73.590], // Khambale
            [19.942, 73.565], // Kojoli
            [19.939, 73.542], // Trimbakeshwar Checkpoint
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
            [19.972, 73.829],
            [19.992, 73.803], // Dwarka
            [20.005, 73.792], // Ramkund / Panchavati area
            [20.015, 73.778], // Gangapur Road Start
            [20.022, 73.755], // Someshwar Waterfall Area
            [20.025, 73.730], // Gangapur Dam Road
            [20.027, 73.710], // Gangapur Reservoir Side
            [20.035, 73.670], // Girnare Bypass Road
            [20.038, 73.640], // Girnare Village road
            [20.018, 73.605], // Talegaon Junction
            [19.988, 73.585], // Torangan Phata
            [19.962, 73.560], // North Trimbak Entrance
            [19.939, 73.542], // Trimbakeshwar Checkpoint
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
            [19.948, 73.825], // Upanagar
            [19.935, 73.805], // Bodhale Nagar
            [19.922, 73.785], // Ambad Link Road / Highway crossing
            [19.915, 73.755], // Ambad MIDC Center
            [19.920, 73.735], // Satpur-Ambad Link Road
            [19.945, 73.725], // Satpur Industrial Area South
            [19.965, 73.705], // Vasasan Village Road
            [19.968, 73.670], // Rejoin NH848
            [19.961, 73.645],
            [19.954, 73.618], // Belgaon Dhaga
            [19.948, 73.590],
            [19.942, 73.565],
            [19.939, 73.542], // Trimbakeshwar Checkpoint
            [destination.lat, destination.lng]
          ] as [number, number][],
          color: '#3B82F6', // Blue
          isCongested: false,
          distance: '30.8 km',
          duration: '1 hr 10 min',
          trafficStatus: 'Light Traffic'
        }
      ];
    } else {
      return [
        {
          id: 'primary',
          name: 'Dwarka Highway Route',
          path: [
            [origin.lat, origin.lng],
            [19.972, 73.829],
            [19.988, 73.812],
            [19.992, 73.803], // Dwarka Circle
            [20.001, 73.798], // Panchavati Approach
            [destination.lat, destination.lng]
          ] as [number, number][],
          color: '#DC2626',
          isCongested: true,
          distance: '8.2 km',
          duration: '35 min',
          trafficStatus: 'Heavy Congestion'
        },
        {
          id: 'alt-1',
          name: 'Godavari Riverbank Bypass',
          path: [
            [origin.lat, origin.lng],
            [19.965, 73.835],
            [19.970, 73.815],
            [19.985, 73.800],
            [19.998, 73.790],
            [destination.lat, destination.lng]
          ] as [number, number][],
          color: '#10B981',
          isCongested: false,
          distance: '9.5 km',
          duration: '15 min',
          trafficStatus: 'Fastest Route'
        },
        {
          id: 'alt-2',
          name: 'Jail Road Route',
          path: [
            [origin.lat, origin.lng],
            [19.968, 73.848], // Jail Road
            [19.982, 73.840], // Shivaji Nagar
            [19.995, 73.820], // Panchavati East
            [20.002, 73.805], // Godavari Bridge
            [destination.lat, destination.lng]
          ] as [number, number][],
          color: '#3B82F6',
          isCongested: false,
          distance: '10.1 km',
          duration: '22 min',
          trafficStatus: 'Light Traffic'
        }
      ];
    }
  }, [origin, destination]);

  const activeRoute = useMemo(() => {
    return routes.find(r => r.id === activeRouteId) || routes[0];
  }, [routes, activeRouteId]);

  // simulated navigation loop
  useEffect(() => {
    let interval: any;
    if (isNavigating && activeRoute) {
      setGpsProgress(0);
      interval = setInterval(() => {
        setGpsProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 2; // Increments of 2%
        });
      }, 700);
    } else {
      setGpsProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, activeRouteId, activeRoute]);

  // Compute interpolated GPS coordinates for the moving marker
  const gpsPos = useMemo<[number, number] | null>(() => {
    if (!isNavigating || !activeRoute || activeRoute.path.length === 0) return null;
    const path = activeRoute.path;
    const totalPoints = path.length;
    const fractionalIdx = (gpsProgress / 100) * (totalPoints - 1);
    const lowIdx = Math.floor(fractionalIdx);
    const highIdx = Math.ceil(fractionalIdx);
    if (lowIdx === highIdx) return path[lowIdx];
    const t = fractionalIdx - lowIdx;
    const lat = path[lowIdx][0] + t * (path[highIdx][0] - path[lowIdx][0]);
    const lng = path[lowIdx][1] + t * (path[highIdx][1] - path[lowIdx][1]);
    return [lat, lng];
  }, [isNavigating, activeRoute, gpsProgress]);

  // Compute dynamic turn-by-turn guidance directions
  const navigationHUD = useMemo(() => {
    if (!isNavigating) return null;
    let dist = 'In 200m';
    let action = 'Head west on the main corridor route.';
    let speed = '48 km/h';

    if (gpsProgress < 20) {
      dist = 'In 150m';
      action = 'Depart from hub and keep left to join transit lane.';
      speed = '32 km/h';
    } else if (gpsProgress < 45) {
      if (activeRoute.isCongested) {
        dist = 'In 1.2 km';
        action = 'Caution: Approaching heavy congestion zone. Average speed is dropping.';
        speed = '12 km/h';
      } else {
        dist = 'In 3.5 km';
        action = 'Merge onto bypass corridor. Traffic is flowing smoothly.';
        speed = '55 km/h';
      }
    } else if (gpsProgress < 75) {
      dist = 'In 900m';
      action = 'Keep right for security checkpost clearance gate.';
      speed = '25 km/h';
    } else if (gpsProgress < 95) {
      dist = 'In 400m';
      action = 'Slow down. Designated pilgrim drop-off zone ahead.';
      speed = '15 km/h';
    } else {
      dist = 'In 20m';
      action = 'You have arrived at your destination.';
      speed = '0 km/h';
    }

    return { dist, action, speed };
  }, [isNavigating, gpsProgress, activeRoute]);

  if (!isPipelineComplete()) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-200 rounded-2xl mt-10 max-w-lg mx-auto p-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Feature Locked</h2>
        <p className="text-slate-600 text-xs max-w-sm leading-relaxed">
          Please complete the registration pipeline (Pilgrims, Vehicle, Snan, and Darshan bookings) to unlock the Smart Route Map.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Route Map</h1>
          <p className="text-slate-600 mt-1 text-xs">Real-time GPS navigation with AI traffic prediction</p>
        </div>
      </div>

      <div className={cn("grid grid-cols-1 gap-6", isNavigating ? "h-[80vh]" : "lg:grid-cols-4 h-[650px]")}>
        {/* Sidebar Panel - Hidden in Navigation Mode */}
        {!isNavigating && (
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="relative space-y-3">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-slate-200 z-0"></div>
                
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3 relative z-10">
                  <div className="bg-blue-50 p-1.5 rounded-lg shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Starting Hub</span>
                    <p className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{origin.label}</p>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3 relative z-10">
                  <div className="bg-orange-50 p-1.5 rounded-lg shrink-0">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Destination</span>
                    <p className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{destination.label}</p>
                  </div>
                </div>
              </div>

              <h3 className="font-extrabold text-xs text-slate-900 pt-2 border-t border-slate-100 flex items-center uppercase tracking-wider">
                <Route className="w-4 h-4 mr-1.5 text-slate-400" /> Alternatives
              </h3>
              
              <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                {routes.map(route => {
                  const isActive = route.id === activeRouteId;
                  return (
                    <button
                      key={route.id}
                      onClick={() => setActiveRouteId(route.id)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden",
                        isActive ? "border-blue-600 bg-blue-50/20 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {isActive && (
                        <div className="absolute top-0 right-0 p-1 bg-blue-600 rounded-bl-lg shadow-sm">
                          <Navigation className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <h4 className={cn("font-bold text-[12px] pr-6 leading-tight", isActive ? "text-blue-900 font-extrabold" : "text-slate-700")}>
                        {route.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-bold mt-1.5">
                        <span className={route.isCongested ? "text-red-600 bg-red-50 px-1.5 py-0.5 rounded" : "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded"}>
                          {route.duration}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600">{route.distance}</span>
                      </div>
                      
                      {route.isCongested ? (
                        <div className="mt-2.5 flex items-center text-[9px] font-bold text-red-600 bg-red-50/50 py-1 px-2 rounded w-fit border border-red-100/50">
                          <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Heavy Congestion
                        </div>
                      ) : (
                        isActive && (
                          <div className="mt-2.5 flex items-center text-[9px] font-bold text-emerald-700 bg-emerald-50/50 py-1 px-2 rounded w-fit border border-emerald-100/50">
                            <Navigation className="w-2.5 h-2.5 mr-1" /> Fastest Route
                          </div>
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => setIsNavigating(true)}
              className="w-full bg-[#005BAC] hover:bg-[#004a8c] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md text-xs uppercase tracking-wider select-none outline-none border-none cursor-pointer mt-4"
            >
              <Navigation className="w-3.5 h-3.5 mr-2" /> Start Navigation
            </button>
          </div>
        )}

        {/* Map View */}
        <div className={cn(
          "bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative z-0 flex flex-col",
          isNavigating ? "lg:col-span-4 h-full" : "lg:col-span-3 h-[450px] lg:h-auto"
        )}>
          {/* Navigation Overlay HUD */}
          {isNavigating && navigationHUD && (
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row justify-between items-start gap-4 pointer-events-none">
              
              {/* Turn-by-Turn Card */}
              <div className="bg-[#005BAC]/95 backdrop-blur-md text-white p-4.5 rounded-2xl shadow-xl pointer-events-auto max-w-sm w-full border border-blue-400/20 text-left">
                <div className="flex items-start gap-3 border-b border-blue-400/40 pb-3 mb-3">
                  <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
                    <Navigation className="w-6 h-6 transform rotate-45 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-blue-200 uppercase tracking-widest">{navigationHUD.dist}</span>
                    <h3 className="text-sm font-black leading-snug mt-0.5">{navigationHUD.action}</h3>
                  </div>
                </div>
                <div className="flex items-center justify-between font-bold text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-blue-200 block uppercase">Time Left</span>
                    <span className="text-emerald-400 font-black">{activeRoute.duration}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-blue-200 block uppercase">Distance</span>
                    <span>{activeRoute.distance}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-blue-200 block uppercase">Speed</span>
                    <span className="font-mono text-emerald-300">{navigationHUD.speed}</span>
                  </div>
                </div>
              </div>

              {/* Voice / Exit buttons */}
              <div className="flex gap-2 pointer-events-auto shrink-0 self-end sm:self-start">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-white hover:bg-stone-50 text-stone-700 p-3 rounded-xl shadow-lg transition-colors border border-stone-200 outline-none cursor-pointer"
                  title={isMuted ? "Unmute navigation guidance" : "Mute navigation guidance"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <button 
                  onClick={() => setIsNavigating(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 border-none outline-none cursor-pointer uppercase tracking-wider"
                >
                  <X className="w-3.5 h-3.5" /> End Navigation
                </button>
              </div>
            </div>
          )}
          
          <div className="flex-1 w-full h-full min-h-[400px]">
            <SmartRouteMap
              origin={origin}
              destination={destination}
              routes={routes}
              activeRouteId={activeRouteId}
              onSelectRoute={setActiveRouteId}
              isNavigating={isNavigating}
              gpsPos={gpsPos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
