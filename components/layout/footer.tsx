'use client';

/**
 * @file Footer component
 * @description Official Government of Maharashtra styled footer placeholder.
 *
 * @accessibility
 * - Semantic footer element
 */

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

export function Footer() {
  return (
    <footer className="w-full bg-[#FAFBFC] text-[#374151] border-t border-[#E5E7EB] py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Official Seals & Identification */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-[#E5E7EB] text-base shadow-sm">
            🏛️
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-[#111827]">
              {GOVERNMENT_PORTAL_ENABLED ? 'Government of Maharashtra' : 'Nashik Simhastha Committee'}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#6B7280]">
              {GOVERNMENT_PORTAL_ENABLED ? 'Kumbh Mela Administration Division' : 'Simhastha Crowd Management Board'}
            </span>
          </div>
        </div>

        {/* Center: Legal/Portals Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#374151]">
          <Link href="/privacy" className="hover:text-[#005BAC] transition-colors duration-150">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#005BAC] transition-colors duration-150">Terms of Service</Link>
          <Link href="/help" className="hover:text-[#005BAC] transition-colors duration-150">Help & Support</Link>
          <Link href="/feedback" className="hover:text-[#005BAC] transition-colors duration-150">Feedback</Link>
        </div>

        {/* Right: Copyright */}
        <div className="text-right text-[11px] text-[#6B7280] md:max-w-xs">
          <p>© 2025 {GOVERNMENT_PORTAL_ENABLED ? 'Government of Maharashtra' : 'Nashik Simhastha Committee'}. All rights reserved.</p>
          <p className="mt-0.5">
            {GOVERNMENT_PORTAL_ENABLED 
              ? 'Designed and developed for Smart Crowd Administration.' 
              : 'Designed and developed for Smart Pilgrim Services.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
