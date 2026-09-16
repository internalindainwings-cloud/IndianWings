'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactActions } from '@/components/common/FloatingContactActions';
import { EnquiryModalProvider } from '@/context/EnquiryModalContext';
import { EnquiryModal } from '@/components/forms/EnquiryModal';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

export const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname ? pathname.startsWith('/admin') : false;

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
    <SiteSettingsProvider>
      <EnquiryModalProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContactActions />
        <EnquiryModal />
      </EnquiryModalProvider>
    </SiteSettingsProvider>
  );
};
