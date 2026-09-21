import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getCategories } from '@/lib/packages-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error('[API /api/admin/categories GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, sortOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
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

    try {
      revalidateTag('packages', 'max');
      revalidatePath('/packages');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err) {
    console.error('[API /api/admin/categories POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
