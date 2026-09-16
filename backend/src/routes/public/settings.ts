import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
    res.json({
      success: true,
      settings: {
        phone: settings?.phone ?? '+91 99060 00000',
        email: settings?.email ?? 'info@theindianwingscompany.com',
        whatsapp: settings?.whatsapp ?? '+919906000000',
        address: settings?.address ?? 'Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001',
        announcementEnabled: settings?.announcementEnabled ?? false,
        announcementText: settings?.announcementText ?? '',
        announcementLink: settings?.announcementLink ?? '/packages',
        siteTitle: settings?.siteTitle ?? 'The Indian Wings Company',
      },
    });
  } catch (err) {
    console.error('[Public/Settings] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

export default router;
