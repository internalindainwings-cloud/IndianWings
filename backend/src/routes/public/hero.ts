import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

const DEFAULT_HERO = {
  videoUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
  posterUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
  slides: [],
  trustPills: [],
};

router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'global' }, select: { heroConfig: true } });
    const hero = settings?.heroConfig ?? DEFAULT_HERO;
    res.json({ success: true, hero });
  } catch (err) {
    console.error('[Public/Hero] Error:', err);
    res.json({ success: true, hero: DEFAULT_HERO });
  }
});

export default router;
