import { prisma } from '@/lib/database/prisma';

export interface SiteSettingsData {
  id: string;
  siteTitle: string;
  siteDesc: string;
  robotsTxtCustom: string | null;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
}

export const defaultSettings: SiteSettingsData = {
  id: 'global',
  siteTitle: 'The Indian Wings Company | Premium Kashmir Travel',
  siteDesc: 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
  robotsTxtCustom: null,
  phone: '+91 99060 00000',
  email: 'info@theindianwingscompany.com',
  whatsapp: '+919906000000',
  address: 'Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001',
  announcementEnabled: false,
  announcementText: 'Special Seasonal Offer: Enjoy exclusive discounts on advance Kashmir holiday bookings!',
  announcementLink: '/packages',
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });

    if (setting) {
      return {
        id: setting.id,
        siteTitle: setting.siteTitle,
        siteDesc: setting.siteDesc,
        robotsTxtCustom: setting.robotsTxtCustom,
        phone: setting.phone,
        email: setting.email,
        whatsapp: setting.whatsapp,
        address: setting.address,
        announcementEnabled: setting.announcementEnabled,
        announcementText: setting.announcementText,
        announcementLink: setting.announcementLink,
      };
    }

    // Seed default if not existing
    const created = await prisma.siteSetting.create({
      data: defaultSettings,
    });
    return created;
  } catch (err) {
    console.warn('[SettingsService] Using default fallback settings:', err);
    return defaultSettings;
  }
}

export async function updateSiteSettings(data: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
  try {
    const updated = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        ...(data.siteTitle !== undefined && { siteTitle: data.siteTitle }),
        ...(data.siteDesc !== undefined && { siteDesc: data.siteDesc }),
        ...(data.robotsTxtCustom !== undefined && { robotsTxtCustom: data.robotsTxtCustom }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.announcementEnabled !== undefined && { announcementEnabled: data.announcementEnabled }),
        ...(data.announcementText !== undefined && { announcementText: data.announcementText }),
        ...(data.announcementLink !== undefined && { announcementLink: data.announcementLink }),
      },
      create: {
        ...defaultSettings,
        ...data,
      },
    });
    return updated;
  } catch (err) {
    console.error('[SettingsService] Failed to update settings in DB:', err);
    throw err;
  }
}
