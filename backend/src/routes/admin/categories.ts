import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.packageCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, categories });
  } catch (err) {
    console.error('[API /api/admin/categories GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, slug, description, sortOrder } = body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const categorySlug = (slug || name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const newCategory = await prisma.packageCategory.upsert({
      where: { slug: categorySlug },
      update: {
        name: name.trim(),
        description: description?.trim() || null,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
      create: {
        slug: categorySlug,
        name: name.trim(),
        description: description?.trim() || null,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        isActive: true,
      },
    });

    res.json({ success: true, category: newCategory });
  } catch (err) {
    console.error('[API /api/admin/categories POST] Error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

export default router;
