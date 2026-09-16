import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const reviews = await prisma.customerReview.findMany({
      where: { isActive: true, ...(type ? { type } : {}) },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('[Public/Reviews] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

export default router;
