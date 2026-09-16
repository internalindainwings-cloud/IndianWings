import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const [vehicles, routes] = await Promise.all([
      prisma.transportVehicle.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.transportRoute.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    ]);
    res.json({ success: true, vehicles, routes });
  } catch (err) {
    console.error('[Public/Transport] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch transport data' });
  }
});

export default router;
