import Link from 'next/link';
import { TEMPLES_DATA } from '@/constants/temples-data';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MapPin, Clock, Compass, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export const metadata = {
  title: 'Sacred Temples & Shrines | Nashik Mahakumbh 2027',
  description: 'Explore the historical, spiritual, and sacred shrines of the Nashik Mahakumbh region including Trimbakeshwar, Shirdi, and Saptashrungi.',
};

export default function TemplesListPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAF8] dark:bg-[#0A1621]">
      {/* Premium Sticky Navbar */}
      <Navbar />

      {/* Main Details Wrapper */}
      <main className="flex-grow pt-[80px]">
        {/* Banner with Title */}
        <div className="relative w-full h-[240px] md:h-[300px] flex flex-col justify-end overflow-hidden bg-[#0A1621]">
          {/* Decorative ambient gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] dark:from-[#0A1621] via-[#0E1F33]/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1F33]/40 via-transparent to-transparent z-10" />
          
          <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 text-white">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#FF9933] bg-[#FF9933]/15 px-3.5 py-1 rounded-full border border-[#FF9933]/20 inline-block mb-3">
              Pilgrim Guide
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-[var(--font-heading)] text-gold-200">
              Spiritual Shrines & Circuits
            </h1>
            <p className="text-sm sm:text-base text-stone-grey-300 max-w-2xl mt-2">
              Explore the sacred destinations, holy bathing ghats, and divine resting places of the Nashik Mahakumbh region.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A8A8A] mb-8 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#FF9933] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#1A3A6B] dark:text-gold-300">Temples</span>
          </div>

          {/* Temples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLES_DATA.map((temple) => (
              <div 
                key={temple.id} 
                className="group flex flex-col rounded-2xl bg-white dark:bg-[#122846] border border-stone-grey-100 dark:border-white/5 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={temple.heroImage}
                    alt={temple.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-[#FF9933] text-white rounded-full shadow-sm">
                      {temple.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-lg font-bold text-[#1A3A6B] dark:text-gold-300 group-hover:text-[#FF9933] transition-colors duration-200">
                    {temple.title}
                  </h3>
                  
                  {/* Location Badge */}
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#8A8A8A] dark:text-stone-grey-300">
                    <MapPin size={12} className="text-[#FF9933]" />
                    <span>{temple.location}, {temple.district} District</span>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 line-clamp-3 leading-relaxed">
                    {temple.shortDescription}
                  </p>

                  {/* Highlights / Badges */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#525252] dark:text-stone-grey-300">
                      <Clock size={14} className="text-[#1A3A6B] dark:text-gold-400" />
                      <span className="font-semibold">Timings:</span>
                      <span>{temple.timings}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-stone-grey-100 dark:border-white/5 flex items-center justify-between">
                    <Link
                      href={`/temples/${temple.slug}`}
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide',
                        'text-[#005BAC] hover:text-[#0F4C81] dark:text-gold-300 dark:hover:text-gold-200 transition-colors duration-200'
                      )}
                    >
                      <Compass size={14} />
                      <span>Explore Now</span>
                    </Link>
                    <ChevronRight size={16} className="text-[#8A8A8A] group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
