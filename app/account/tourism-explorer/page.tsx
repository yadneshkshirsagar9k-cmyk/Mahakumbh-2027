'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { navigateToCoordinates } from '@/constants/location-config';

interface Shrine {
  id: string;
  name: string;
  category: 'Jyotirlinga' | 'Temple' | 'Ashram' | 'Heritage' | 'Fort' | 'Museum';
  district: string;
  desc: string;
  crowd: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  waitTime: string;
  features: string[];
  lat: number;
  lng: number;
  placeId?: string;
  image: string;
}

const SHRINES: Shrine[] = [
  {
    id: '1',
    name: 'Shree Saibaba Sansthan Temple',
    category: 'Temple',
    district: 'Ahmednagar District',
    desc: 'The world-famous shrine of Saint Saibaba, promoting peace, faith, and patience. Visited by millions annually.',
    crowd: 'HIGH',
    waitTime: '180 mins',
    features: ['Prasadalaya', 'Dharamshala', 'VIP Darshan', 'Locker Rooms', 'Medical Center'],
    lat: 19.7668,
    lng: 74.4754,
    placeId: 'ChIJP-o6-m5D2jsR1K37TmhP1W0',
    image: '/assets/images/shirdi/shirdi-3_v2.jpg'
  },
  {
    id: '2',
    name: 'Trimbakeshwar Shiva Temple',
    category: 'Jyotirlinga',
    district: 'Nashik District',
    desc: 'An ancient temple dedicated to Lord Shiva, housing one of the twelve Jyotirlingas. Origin of the sacred Godavari River.',
    crowd: 'CRITICAL',
    waitTime: '240 mins',
    features: ['Inner Sanctum Access', 'Kushavarta Kund Snan', 'Vedic Puja Halls', 'Security Escort'],
    lat: 19.9324,
    lng: 73.5307,
    placeId: 'ChIJV2d4wweD2DsRP-xveb2Z-2Q',
    image: '/assets/images/tourism/trimbakeshwar_2.jpg'
  },
  {
    id: '3',
    name: 'Grishneshwar Jyotirlinga Temple',
    category: 'Jyotirlinga',
    district: 'Aurangabad District',
    desc: 'The 12th and final Jyotirlinga temple, located close to the Ellora Caves. Renowned for its stunning stone carvings.',
    crowd: 'MODERATE',
    waitTime: '45 mins',
    features: ['Monolithic Carvings', 'Free Queue Line', 'Security Desk', 'Prasad Counters'],
    lat: 20.0268,
    lng: 75.1771,
    placeId: 'ChIJr2d4-m1D2jsRv2d4xweD2Ds',
    image: '/assets/images/tourism/grishneshwar_1_v3.jpg'
  },
  {
    id: '4',
    name: 'Shani Shingnapur Temple',
    category: 'Temple',
    district: 'Ahmednagar District',
    desc: 'Unique open-air temple of Lord Shani. The village has no doors or locks, reflecting the profound faith in Shani Dev.',
    crowd: 'HIGH',
    waitTime: '90 mins',
    features: ['Open-air Platform', 'Oil Abhishek', 'Locker System', 'Security Control'],
    lat: 19.3833,
    lng: 74.8167,
    placeId: 'ChIJP-o6-m5D2jsR-OilAbhishek',
    image: '/assets/images/tourism/shani_shingnapur_1.jpg'
  }
];

export default function TourismExplorer() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedShrine, setSelectedShrine] = useState<Shrine>(SHRINES[0]);

  const tabs = ['All', 'Jyotirlinga', 'Temple', 'Ashram', 'Heritage', 'Fort', 'Museum'];

  const filtered = SHRINES.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.district.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeTab === 'All' || item.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-[#111827]">
      <div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Spiritual Tourism Explorer</h1>
        <p className="text-xs text-[#6B7280]">Official guide to Maharashtra spiritual, cultural, and historical landmarks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Shrine list */}
        <div className="lg:col-span-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-grey-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shrine name or district..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#E5E7EB] bg-white text-[#111827] outline-none"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 select-none shrink-0 scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border-none outline-none',
                  activeTab === tab
                    ? 'bg-[#005BAC] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#005BAC]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedShrine(item)}
                className={cn(
                  'p-4 border rounded-2xl cursor-pointer transition-all flex gap-3 text-left relative',
                  selectedShrine.id === item.id
                    ? 'border-[#005BAC] bg-[#F5F7FA]'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#FAFBFC]'
                )}
              >
                <div className="space-y-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#111827]">{item.name}</h4>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider',
                        item.crowd === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                        item.crowd === 'HIGH' ? 'bg-[#F59E0B] text-white' : 'bg-[#2E7D32] text-white'
                      )}
                    >
                      {item.crowd}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 font-bold">
                    <MapPin size={11} className="text-[#005BAC]" />
                    <span>{item.district}</span>
                  </div>
                  <p className="text-[11px] text-[#374151] leading-relaxed line-clamp-2 pt-1 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map & detail */}
        <div className="lg:col-span-6 space-y-4">
          {/* Map */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm h-[280px]">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedShrine.lng - 0.05}%2C${selectedShrine.lat - 0.05}%2C${selectedShrine.lng + 0.05}%2C${selectedShrine.lat + 0.05}&layer=mapnik&marker=${selectedShrine.lat}%2C${selectedShrine.lng}`}
              className="w-full h-full"
            />
          </div>

          <CollapsibleSection title={selectedShrine.name} icon={<MapPin size={14} className="text-[#005BAC]" />} defaultOpen={true} badge={selectedShrine.waitTime + ' wait'}>
            <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-3">
              <Image
                src={selectedShrine.image}
                alt={selectedShrine.name}
                fill
                className="object-cover animate-fadeIn"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <p className="text-[11px] text-[#374151] leading-relaxed font-medium mb-3">
              {selectedShrine.desc}
            </p>

            <CollapsibleSection title="Facilities & Features" defaultOpen={false} card={false}>
              <div className="flex flex-wrap gap-1">
                {selectedShrine.features.map((feat) => (
                  <span
                    key={feat}
                    className="px-2.5 py-1 rounded-md bg-[#F5F7FA] text-[#005BAC] text-[10px] font-bold border border-[#E5E7EB]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </CollapsibleSection>

            <div className="flex justify-between items-center text-[10px] text-stone-500 font-bold border-t border-[#E5E7EB] pt-3 mt-3">
              <div>
                <span>COORDINATES</span>
                <span className="block font-mono text-[#005BAC] mt-0.5">
                  LAT: {selectedShrine.lat.toFixed(4)} | LNG: {selectedShrine.lng.toFixed(4)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigateToCoordinates(selectedShrine.lat, selectedShrine.lng)}
                  className="px-4 py-2 bg-[#005BAC] hover:bg-[#005BAC]/90 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border-none outline-none select-none"
                >
                  <Navigation size={11} />
                  <span>Get Transit Directions</span>
                </button>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
