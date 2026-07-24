'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore } from '@/store/journey-store';

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { journey } = useJourneyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock bookings if no journey exists
  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (!journey) {
        alert('Features Locked: You must register a Mahakumbh Journey before accessing booking features.');
        router.replace('/account/dashboard');
      }
    }
  }, [mounted, isAuthenticated, journey, router]);

  if (!mounted || !isAuthenticated || !journey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-[#005BAC] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#374151] font-semibold tracking-widest uppercase">Checking Authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
