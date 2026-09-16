import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    res.json({ success: true, activities });
  } catch (err) {
    console.error('[API /api/admin/activities GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const {
      name,
      slug,
      location,
      category = 'Snow & Winter',
      duration = '2-4 hrs',
      difficulty = 'Beginner to Pro',
      season = 'All Year',
      imageUrl = '/images/gallery/gulmarg-snow.jpg',
      tags = [],
      badge = null,
      priceFrom = 1500,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const created = await prisma.activity.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        location: location ? location.trim() : 'Kashmir Valley',
        category,
        duration: duration ? duration.trim() : '2-4 hrs',
        difficulty: difficulty ? difficulty.trim() : 'Moderate',
        season: season ? season.trim() : 'All Year',
        imageUrl: imageUrl ? imageUrl.trim() : '/images/gallery/gulmarg-snow.jpg',
        tags: Array.isArray(tags) ? tags : [],
        badge: badge ? badge.trim() : null,
        priceFrom: Number(priceFrom) || 1500,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    res.json({ success: true, activity: created });
  } catch (err) {
    console.error('[API /api/admin/activities POST] Error:', err);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim().toLowerCase() }),
        ...(body.location !== undefined && { location: body.location.trim() }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.duration !== undefined && { duration: body.duration.trim() }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty.trim() }),
        ...(body.season !== undefined && { season: body.season.trim() }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.badge !== undefined && { badge: body.badge ? body.badge.trim() : null }),
        ...(body.priceFrom !== undefined && { priceFrom: Number(body.priceFrom) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });

    res.json({ success: true, activity: updated });
  } catch (err) {
    console.error('[API /api/admin/activities/:id PUT] Error:', err);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.activity.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/activities/:id DELETE] Error:', err);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
