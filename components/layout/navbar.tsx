'use client';

/**
 * @file Navbar component
 * @description Premium sticky navigation bar with glassmorphic style, responsive
 * menu, bookings dropdown, and a call-to-action auth button.
 *
 * @accessibility
 * - Aria role="navigation"
 * - Keyboard navigable links and dropdown buttons
 * - Focus-visible outline rings
 * - Aria-expanded and aria-haspopup attributes for dropdowns/drawers
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, ShieldAlert, LogOut, LayoutDashboard, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motionVariants, motionTransitions } from '@/lib/animations';
import { useAuthStore } from '@/store/auth-store';


import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';
// We still import GlobalSearch to keep code intact, but conditionalize its render
import { GlobalSearch } from './global-search';

// ============================================================
// TYPES & DATA DEFINITIONS
// ============================================================

export interface DropdownItem {
  label: string;
  href: string;
}

export interface MenuItem {
  label: string;
  href: string;
  dropdownItems?: DropdownItem[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Bookings',
    href: '#',
    dropdownItems: [
      { label: 'Vehicle Registration', href: '/bookings/vehicle' },
      { label: 'Tour Packages', href: '/bookings/packages' },
      { label: 'Pilgrim Services', href: '/bookings/pilgrim' },
    ],
  },
  { label: 'Health Advisory', href: '/health-registration' },
  { label: 'Emergency', href: '/emergency' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Weather', href: '/weather' },
];

// ============================================================
// COMPONENT
// ============================================================

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll logic for sticky glass shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[400] w-full h-[80px]',
        'transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-white shadow-sm border-b border-[#E5E7EB]'
          : 'bg-white border-b border-[#E5E7EB]'
      )}
    >
      <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Logo & Portal Identity */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC] rounded-lg p-1"
        >
          {/* Reusable Government Logo SVG */}
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border border-[#E5E7EB] shadow-sm shrink-0 bg-white">
            <img src="/assets/images/logo.svg" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-[#111827] font-[var(--font-heading)] leading-tight max-w-[200px] sm:max-w-none">
              Integrated Smart Pilgrim Management Platform
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase text-[#F26F21] leading-none mt-0.5">
              NTKMA • Government of Maharashtra
            </span>
          </div>
        </Link>
 
        {/* Center Navigation Menu (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
          {MENU_ITEMS.map((item) => {
            const hasDropdown = !!item.dropdownItems;
            const isDropdownActive = activeDropdown === item.label;
 
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
              >
                {hasDropdown ? (
                  <button
                    aria-expanded={isDropdownActive}
                    aria-haspopup="true"
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-2 text-sm font-bold transition-colors duration-200 rounded-lg select-none cursor-pointer whitespace-nowrap',
                      'text-[#1F2937] hover:text-[#005BAC]',
                      isDropdownActive && 'text-[#005BAC]'
                    )}
                  >
                    {item.label}
                    <ChevronDown size={14} className={cn('transition-transform duration-200', isDropdownActive && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-bold transition-colors duration-200 rounded-lg whitespace-nowrap',
                      'text-[#1F2937] hover:text-[#005BAC]',
                      (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) && 'text-[#005BAC]'
                    )}
                  >
                    {item.label}
                    {/* Animated Underline for Active Menu Item */}
                    {pathname === item.href && (
                      <motion.span
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#005BAC]"
                        layoutId="navUnderline"
                        transition={motionTransitions.fast}
                      />
                    )}
                  </Link>
                )}

                {/* Dropdown Menu Overlay */}
                {hasDropdown && item.dropdownItems && (
                  <AnimatePresence>
                    {isDropdownActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn(
                          'absolute top-full left-0 w-56 mt-1 rounded-xl',
                          'bg-white',
                          'border border-[#E5E7EB]',
                          'shadow-sm',
                          'p-2 flex flex-col gap-1'
                        )}
                      >
                        {item.dropdownItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={cn(
                              'px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left',
                              'text-[#374151] hover:text-[#111827]',
                              'hover:bg-[#F5F7FA]'
                            )}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Side: Global Search, Auth, and Mobile Menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          {GOVERNMENT_PORTAL_ENABLED && <GlobalSearch />}
          
          <div className="hidden lg:flex items-center">
            {mounted && isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setAccountMenuOpen(true)}
                onMouseLeave={() => setAccountMenuOpen(false)}
              >
                <button
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
                    'text-sm font-semibold tracking-wide cursor-pointer',
                    'bg-[#005BAC] hover:bg-[#0F4C81]',
                    'text-white transition-all duration-200'
                  )}
                >
                  <User size={16} />
                  <span>My Account</span>
                  <ChevronDown size={14} className={cn('transition-transform duration-200', accountMenuOpen && 'rotate-180')} />
                </button>
                
                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={cn(
                        'absolute right-0 w-48 mt-1 rounded-xl',
                        'bg-white',
                        'border border-[#E5E7EB]',
                        'shadow-sm',
                        'p-2 flex flex-col gap-1 z-[450]'
                      )}
                    >
                      <Link
                        href="/account/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F5F7FA]"
                      >
                        <LayoutDashboard size={14} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/account/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F5F7FA]"
                      >
                        <User size={14} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/account/notifications"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F5F7FA]"
                      >
                        <ShieldAlert size={14} />
                        <span>Notifications</span>
                      </Link>
                      <Link
                        href="/account/dashboard#downloads"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F5F7FA]"
                      >
                        <Download size={14} />
                        <span>Downloads</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
                  'text-sm font-semibold tracking-wide',
                  'bg-[#005BAC] hover:bg-[#0F4C81]',
                  'text-white',
                  'shadow-sm hover:-translate-y-0.5',
                  'active:scale-[0.98] transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC] focus-visible:ring-offset-2'
                )}
              >
                <User size={16} />
                <span>Register / Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className={cn(
              'lg:hidden p-2 rounded-lg',
              'text-[#1F2937]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC]'
            )}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Responsive Drawer Menu (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[80px] bg-black/30 z-[380] lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed top-[80px] right-0 bottom-0 w-80 max-w-full z-[390]',
                'bg-white',
                'border-l border-[#E5E7EB]',
                'shadow-sm',
                'p-6 flex flex-col justify-between overflow-y-auto lg:hidden'
              )}
            >
              <div className="flex flex-col gap-1">
                {MENU_ITEMS.map((item) => {
                  const hasDropdown = !!item.dropdownItems;
                  const isDropdownActive = activeDropdown === item.label;

                  return (
                    <div key={item.label} className="border-b border-[#E5E7EB] py-2">
                      {hasDropdown ? (
                        <>
                          <button
                            onClick={() => setActiveDropdown(isDropdownActive ? null : item.label)}
                            className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1F2937] hover:text-[#005BAC]"
                          >
                            <span>{item.label}</span>
                            <ChevronDown size={18} className={cn('transition-transform duration-200', isDropdownActive && 'rotate-180')} />
                          </button>
                          
                          <motion.div
                            initial={false}
                            animate={isDropdownActive ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 flex flex-col gap-2 mt-1"
                          >
                            {item.dropdownItems?.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={() => setIsOpen(false)}
                                className="py-1 text-sm font-medium text-[#374151] hover:text-[#005BAC]"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'block py-2 text-base font-semibold transition-colors duration-150',
                            pathname === item.href
                              ? 'text-[#005BAC]'
                              : 'text-[#1F2937] hover:text-[#005BAC]'
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Login/Register or My Account Links in Mobile Drawer */}
              <div className="mt-8">
                {mounted && isAuthenticated ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider px-1">My Account Menu</p>
                    <Link
                      href="/account/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold text-[#1F2937] hover:text-[#005BAC] hover:bg-[#F5F7FA]"
                    >
                      <LayoutDashboard size={16} className="text-[#005BAC]" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/account/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold text-[#1F2937] hover:text-[#005BAC] hover:bg-[#F5F7FA]"
                    >
                      <User size={16} className="text-[#005BAC]" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/account/notifications"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold text-[#1F2937] hover:text-[#005BAC] hover:bg-[#F5F7FA]"
                    >
                      <ShieldAlert size={16} className="text-[#005BAC]" />
                      <span>Notifications</span>
                    </Link>
                    <Link
                      href="/account/dashboard#downloads"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold text-[#1F2937] hover:text-[#005BAC] hover:bg-[#F5F7FA]"
                    >
                      <Download size={16} className="text-[#005BAC]" />
                      <span>Downloads</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                        router.push('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl',
                      'text-sm font-semibold tracking-wide',
                      'bg-[#005BAC] hover:bg-[#0F4C81]',
                      'text-white shadow-sm',
                      'active:scale-[0.98] transition-all duration-200'
                    )}
                  >
                    <User size={16} />
                    <span>Register / Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
