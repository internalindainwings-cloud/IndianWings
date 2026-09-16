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
        phone: '+91 99060 00000',
        email: 'info@theindianwingscompany.com',
        whatsapp: '+919906000000',
        address: 'Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001',
        announcementEnabled: false,
        announcementText: '',
        announcementLink: '/packages',
      }
    });
  }
}
