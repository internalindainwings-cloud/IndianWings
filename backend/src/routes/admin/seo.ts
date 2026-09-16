import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          id: 'global',
          siteTitle: 'The Indian Wings Company | Premium Kashmir Travel',
          siteDesc: 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
        },
      });
    }

    const packages = await prisma.package.findMany({
      select: { noIndex: true },
    });
    const totalIndexed = packages.filter((p) => !p.noIndex).length;
    const totalExcluded = packages.filter((p) => p.noIndex).length;

    res.json({
      success: true,
      settings,
      sitemap: {
        totalIndexedPackages: totalIndexed,
        totalExcludedPackages: totalExcluded,
        sitemapUrl: '/sitemap.xml',
        robotsUrl: '/robots.txt',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[API /api/admin/seo GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch SEO settings' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { siteTitle, siteDesc, robotsTxtCustom } = req.body;

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        siteTitle: siteTitle?.trim(),
        siteDesc: siteDesc?.trim(),
        robotsTxtCustom: robotsTxtCustom !== undefined ? robotsTxtCustom : undefined,
      },
      create: {
        id: 'global',
        siteTitle: siteTitle?.trim() || 'The Indian Wings Company | Premium Kashmir Travel',
        siteDesc: siteDesc?.trim() || 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
        robotsTxtCustom: robotsTxtCustom || null,
      },
    });

    res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('[API /api/admin/seo POST] Error:', err);
    res.status(500).json({ error: 'Failed to update SEO settings' });
  }
});

export default router;
