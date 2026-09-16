import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, activities });
  } catch (err) {
    console.error('[Public/Activities] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch activities' });
  }
});

export default router;
