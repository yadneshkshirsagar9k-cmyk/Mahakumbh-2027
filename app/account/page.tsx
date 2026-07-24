'use client';

/**
 * @file Account redirect
 * @description Redirects /account to /account/dashboard.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account/dashboard');
  }, [router]);
  return null;
}
