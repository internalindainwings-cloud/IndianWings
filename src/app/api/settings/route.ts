import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings-service';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      settings: {
        phone: settings.phone,
        email: settings.email,
        whatsapp: settings.whatsapp,
        address: settings.address,
        announcementEnabled: settings.announcementEnabled,
        announcementText: settings.announcementText,
        announcementLink: settings.announcementLink,
        siteTitle: settings.siteTitle,
      }
    });
  } catch (err) {
    console.error('[API /api/settings GET] Error:', err);
    return NextResponse.json({
      success: false,
      settings: {
        phone: '+91 98118 08387',
        email: 'info@theindianwingscompany.com',
        whatsapp: '+91 78277 43041',
        address: 'The Indian Wings Travels, Sheikh Palace, 2nd Floor, Kanyar Chowk, Srinagar',
        announcementEnabled: false,
        announcementText: '',
        announcementLink: '/packages',
      }
    });
  }
}
