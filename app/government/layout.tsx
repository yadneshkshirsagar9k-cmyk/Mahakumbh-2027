import { redirect } from 'next/navigation';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

export const metadata = {
  title: 'Government Operations Portal',
  description: 'Secure Government Gateway for Mahakumbh 2027',
};

export default function GovernmentRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!GOVERNMENT_PORTAL_ENABLED) {
    redirect('/');
  }

  return (
    <div className="bg-[#0a0f18] text-slate-300 font-sans selection:bg-blue-900 selection:text-blue-100 min-h-screen">
      {children}
    </div>
  );
}
