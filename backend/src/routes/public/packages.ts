import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const [packages, categories] = await Promise.all([
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { category: true },
      }),
      prisma.packageCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    const filtered = category
      ? packages.filter((p) => p.categorySlug.toLowerCase() === category.toLowerCase())
      : packages;
    res.json({ success: true, packages: filtered, categories });
  } catch (err) {
    console.error('[Public/Packages] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch packages' });
  }
});

export default router;
