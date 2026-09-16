import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    res.json({ success: true, destinations });
  } catch (err) {
    console.error('[API /api/admin/destinations GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const {
      name,
      slug,
      region = 'Jammu & Kashmir',
      tagline,
      category = 'Iconic',
      imageUrl,
      gallery = [],
      elevation = '1,585 m',
      bestSeason = 'All Year Round',
      distanceFromSrinagar = '0 km',
      highlights = [],
      description,
      packageCount = 0,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const created = await prisma.destination.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        region: region.trim(),
        tagline: tagline ? tagline.trim() : '',
        category,
        imageUrl: imageUrl ? imageUrl.trim() : '/images/gallery/shikara-dal-lake.jpg',
        gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [imageUrl || '/images/gallery/shikara-dal-lake.jpg'],
        elevation: elevation ? elevation.trim() : '1,585 m',
        bestSeason: bestSeason ? bestSeason.trim() : 'All Year Round',
        distanceFromSrinagar: distanceFromSrinagar ? distanceFromSrinagar.trim() : '0 km',
        highlights: Array.isArray(highlights) ? highlights : [],
        description: description ? description.trim() : '',
        packageCount: Number(packageCount) || 0,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    res.json({ success: true, destination: created });
  } catch (err) {
    console.error('[API /api/admin/destinations POST] Error:', err);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim().toLowerCase() }),
        ...(body.region !== undefined && { region: body.region.trim() }),
        ...(body.tagline !== undefined && { tagline: body.tagline.trim() }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.gallery !== undefined && { gallery: body.gallery }),
        ...(body.elevation !== undefined && { elevation: body.elevation.trim() }),
        ...(body.bestSeason !== undefined && { bestSeason: body.bestSeason.trim() }),
        ...(body.distanceFromSrinagar !== undefined && { distanceFromSrinagar: body.distanceFromSrinagar.trim() }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.packageCount !== undefined && { packageCount: Number(body.packageCount) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });

    res.json({ success: true, destination: updated });
  } catch (err) {
    console.error('[API /api/admin/destinations/:id PUT] Error:', err);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.destination.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/destinations/:id DELETE] Error:', err);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

export default router;
