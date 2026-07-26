import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TEMPLES_DATA } from '@/constants/temples-data';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  TempleHero,
  TempleFacts,
  TempleSection,
  TempleNavigationCard,
  TempleSidebar,
} from '@/components/temples/reusable-components';
import { HelpCircle, ChevronRight, Compass } from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================
// DYNAMIC STATIC ROUTE GENERATION
// ============================================================

export async function generateStaticParams() {
  return TEMPLES_DATA.map((temple) => ({
    slug: temple.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================
// SERVER PAGE COMPONENT
// ============================================================

export default async function TempleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const temple = TEMPLES_DATA.find((t) => t.slug === resolvedParams.slug);

  if (!temple) {
    notFound();
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAFAF8] dark:bg-[#0A1621]">
      {/* Premium Sticky Navbar */}
      <Navbar />

      {/* Main Details Wrapper */}
      <main className="flex-grow pt-[80px]">
        {/* Banner with Title */}
        <TempleHero title={temple.title} subtitle={temple.subtitle} heroImage={temple.heroImage} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A8A8A] mb-8 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#FF9933] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/temples" className="hover:text-[#FF9933] transition-colors">Temples</Link>
            <ChevronRight size={12} />
            <span className="text-[#1A3A6B] dark:text-gold-300">{temple.title}</span>
          </div>

          {/* Quick Facts Section */}
          <TempleFacts facts={temple.facts} className="mb-8" />

          {/* Core Layout Grid: Left Content, Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Descriptions, History, Routes */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* About section */}
              <TempleSection title={`About ${temple.title}`} icon={<HelpCircle size={20} />}>
                <p>{temple.longDescription}</p>
              </TempleSection>

              {/* History section */}
              <TempleSection title="Historical Importance">
                <p>{temple.historicalImportance}</p>
              </TempleSection>

              {/* Significance section */}
              <TempleSection title="Religious Significance">
                <p>{temple.religiousSignificance}</p>
              </TempleSection>

              {/* How to Reach section */}
              <TempleSection title="How to Reach">
                <TempleNavigationCard howToReach={temple.howToReach} />
              </TempleSection>

              {/* FAQ */}
              <TempleSection title="Frequently Asked Questions (FAQ)">
                <div className="space-y-4">
                  {temple.faqs.map((faq) => (
                    <div key={faq.question} className="p-4 rounded-xl bg-white dark:bg-[#122846] border border-stone-grey-100 dark:border-white/5">
                      <h4 className="font-bold text-sm text-[#1A3A6B] dark:text-gold-300">{faq.question}</h4>
                      <p className="text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300 mt-2 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </TempleSection>

              {/* Guidelines */}
              <TempleSection title="Important Guidelines">
                <ul className="space-y-2">
                  {temple.guidelines.map((guideline, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#525252] dark:text-stone-grey-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-2 flex-shrink-0" />
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </TempleSection>

              {/* Footer CTA */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1A3A6B] to-[#225888] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-lg font-bold font-[var(--font-heading)] text-gold-300">Ready to plan your Darshan?</h3>
                  <p className="text-xs sm:text-sm text-[#FAF0E1]/80 max-w-md">Register online to get your digital pass and bypass crowd checkpoints seamlessly.</p>
                </div>
                <Link
                  href="/auth/login"
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3.5 rounded-xl',
                    'text-sm font-bold tracking-wide uppercase bg-[#FF9933] hover:bg-[#E6801A] text-white transition-colors duration-200'
                  )}
                >
                  <Compass size={16} />
                  <span>Register for Pass</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Sticky Metadata Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-[96px] space-y-6">
              <TempleSidebar
                timings={temple.timings}
                medical={temple.medicalInfo}
                police={temple.policeInfo}
                helpCentre={temple.helpCentreInfo}
                weather={temple.weatherPlaceholder}
              />
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
