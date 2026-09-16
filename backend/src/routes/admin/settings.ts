import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

const defaultSettings = {
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

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    let setting = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });

    if (!setting) {
      setting = await prisma.siteSetting.create({
        data: defaultSettings,
      });
    }

    res.json({ success: true, settings: setting });
  } catch (err) {
    console.error('[API /api/admin/settings GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
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
        ...(data.announcementEnabled !== undefined && { announcementEnabled: Boolean(data.announcementEnabled) }),
        ...(data.announcementText !== undefined && { announcementText: data.announcementText }),
        ...(data.announcementLink !== undefined && { announcementLink: data.announcementLink }),
      },
      create: {
        ...defaultSettings,
        ...data,
      },
    });

    res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('[API /api/admin/settings POST] Error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
