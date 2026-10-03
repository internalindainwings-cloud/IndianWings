'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { EnquiryModalProvider } from '@/context/EnquiryModalContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import type { SiteSettingsData } from '@/lib/settings-service';

const Footer = dynamic(
  () => import('@/components/layout/Footer').then((m) => ({ default: m.Footer })),
  { ssr: true }
);

const FloatingContactActions = dynamic(
  () => import('@/components/common/FloatingContactActions').then((m) => ({ default: m.FloatingContactActions })),
  { ssr: false }
);

const BotpressChatbot = dynamic(
  () => import('@/components/chat/BotpressChatbot').then((m) => ({ default: m.BotpressChatbot })),
  { ssr: false }
);

const EnquiryModal = dynamic(
  () => import('@/components/forms/EnquiryModal').then((m) => ({ default: m.EnquiryModal })),
  { ssr: false }
);

export const PublicShell: React.FC<{
  children: React.ReactNode;
  nonce?: string;
  isAdminOverride?: boolean;
  initialSettings?: Partial<SiteSettingsData> | null;
}> = ({ children, nonce, isAdminOverride, initialSettings }) => {
  const pathname = usePathname();
  const isAdmin = isAdminOverride || (pathname ? pathname.startsWith('/admin') : false);

  useEffect(() => {
    // Ensure clean application of client-chosen original theme: #0F4C54 (High Alpine Cyan) & #F59E0B (Mughal Marigold) on all devices
    try {
      localStorage.removeItem('tiw_accent_color');
      localStorage.removeItem('tiw_nav_color');
      localStorage.removeItem('tiw_theme_id');
      document.documentElement.style.setProperty('--color-saffron', '#F59E0B');
      document.documentElement.style.setProperty('--color-midnight', '#0F4C54');
    } catch {
      // ignore
    }
  }, []);

  // Complete isolation: When accessing admin portal, do not render consumer navigation, footer, or floating buttons
  if (isAdmin) {
    return <main className="min-h-screen w-full bg-[#081E23] text-white">{children}</main>;
  }

  return (
    <SiteSettingsProvider initialSettings={initialSettings || undefined}>
      <EnquiryModalProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContactActions />
        <BotpressChatbot nonce={nonce} />
        <EnquiryModal />
      </EnquiryModalProvider>
    </SiteSettingsProvider>
  );
};
