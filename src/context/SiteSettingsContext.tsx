'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '@/config/site-config';

interface SiteSettingsState {
  phone: string;
  displayPhone: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  address: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
}

const defaultState: SiteSettingsState = {
  phone: siteConfig.contact.phone,
  displayPhone: siteConfig.contact.displayPhone,
  whatsapp: siteConfig.contact.phone,
  whatsappUrl: siteConfig.contact.whatsappUrl,
  email: siteConfig.contact.email,
  address: 'Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001',
  announcementEnabled: false,
  announcementText: '',
  announcementLink: '/packages',
};

const SiteSettingsContext = createContext<SiteSettingsState>(defaultState);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsState>(defaultState);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.settings && mounted) {
          const s = json.settings;
          const cleanPhone = (s.phone || siteConfig.contact.phone).replace(/[^0-9]/g, '');
          const cleanWhatsapp = (s.whatsapp || s.phone || '919906000000').replace(/[^0-9]/g, '');
          setSettings({
            phone: s.phone || siteConfig.contact.phone,
            displayPhone: s.phone || siteConfig.contact.displayPhone,
            whatsapp: s.whatsapp || siteConfig.contact.phone,
            whatsappUrl: `https://wa.me/${cleanWhatsapp}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20Kashmir%20tour%20packages`,
            email: s.email || siteConfig.contact.email,
            address: s.address || defaultState.address,
            announcementEnabled: Boolean(s.announcementEnabled),
            announcementText: s.announcementText || '',
            announcementLink: s.announcementLink || '/packages',
          });
        }
      } catch {
        // keep fallback
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
