import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AIChatbot } from '@/components/ai-chatbot';

export const metadata: Metadata = {
  title: 'Nashik Mahakumbh Smart Crowd Management & Administration Portal',
  description: 'Official Digital Platform of the Government of Maharashtra for the Nashik Mahakumbh. Advanced GIS tracking, pilgrim registration, emergency coordination, and real-time crowd planning.',
  keywords: [
    'Nashik Mahakumbh',
    'Kumbh Mela 20XX',
    'Crowd Management Maharashtra',
    'Nashik Smart City',
    'Darshan Booking Nashik',
    'Trimbakeshwar pilgrim services'
  ],
  authors: [{ name: 'Government of Maharashtra' }],
  creator: 'Nashik Smart City Development Corporation',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#F26F21', // Saffron brand color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Additional government portal metatags */}
        <meta name="application-name" content="Nashik Mahakumbh Portal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nashik Mahakumbh" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tilecolor" content="#022B5D" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFBFC] text-[#111827]">
        {children}
        <AIChatbot />
      </body>
    </html>
  );
}
