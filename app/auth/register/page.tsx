'use client';

/**
 * @file Register redirect
 * @description Redirects /auth/register to /auth/login where the registration
 * form is embedded alongside the login form (combined single page).
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);
  return null;
}
