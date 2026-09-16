import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

export interface HeroSlide {
  id: string;
  title: string;
  videoSrc: string;
  poster: string;
}

export interface HeroTrustPill {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface HeroHomepageConfig {
  headline: string;
  badgeText?: string;
  subheadline?: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  videoUrl: string;
  posterUrl: string;
  slides: HeroSlide[];
  trustPills: HeroTrustPill[];
}

export const defaultHeroConfig: HeroHomepageConfig = {
  headline: 'Discover the Magic of Kashmir',
  subheadline: 'Curated luxury houseboats, alpine ski resorts, and private chauffeured tours across paradise.',
  primaryCtaText: 'Get Free Quote',
  secondaryCtaText: 'Explore Packages',
  secondaryCtaLink: '/packages',
  videoUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
  posterUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
  slides: [
    {
      id: 'dal-lake',
      title: 'Dal Lake & Houseboats',
      videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
      poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    },
    {
      id: 'gulmarg',
      title: 'Gulmarg Alpine Meadows',
      videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
      poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    },
    {
      id: 'pahalgam',
      title: 'Pahalgam Valley & Lidder River',
      videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
      poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    },
  ],
  trustPills: [
    {
      id: 'pill-1',
      icon: 'users',
      value: '600+',
      label: 'Happy Families',
    },
    {
      id: 'pill-2',
      icon: 'star',
      value: '★ 4.9',
      label: 'Google Reviews',
    },
    {
      id: 'pill-3',
      icon: 'award',
      value: '15+ Years',
      label: 'Valley Experience',
    },
  ],
};

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
      select: { heroConfig: true },
    });

    const stored = settings?.heroConfig as Partial<HeroHomepageConfig> | null;
    const hero: HeroHomepageConfig = stored
      ? {
          ...defaultHeroConfig,
          ...stored,
          slides: Array.isArray(stored.slides) && stored.slides.length > 0 ? stored.slides : defaultHeroConfig.slides,
          trustPills: Array.isArray(stored.trustPills) && stored.trustPills.length > 0 ? stored.trustPills : defaultHeroConfig.trustPills,
        }
      : defaultHeroConfig;

    res.json({ success: true, hero });
  } catch (err) {
    console.error('[API /api/admin/hero GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch hero settings' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<HeroHomepageConfig>;
    
    // Get current
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
      select: { heroConfig: true },
    });
    const current = (settings?.heroConfig as HeroHomepageConfig | null) ?? defaultHeroConfig;

    const updated: HeroHomepageConfig = {
      ...current,
      ...body,
      slides: Array.isArray(body.slides) ? body.slides : current.slides,
      trustPills: Array.isArray(body.trustPills) ? body.trustPills : current.trustPills,
    };

    await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: { heroConfig: updated as object },
      create: { id: 'global', heroConfig: updated as object },
    });

    res.json({ success: true, hero: updated });
  } catch (err) {
    console.error('[API /api/admin/hero PUT] Error:', err);
    res.status(500).json({ error: 'Failed to update hero settings' });
  }
});

export default router;
