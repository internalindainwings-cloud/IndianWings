import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, destinations });
  } catch (err) {
    console.error('[Public/Destinations] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch destinations' });
  }
});

export default router;
