import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { optimizeCloudinaryUrl, optimizeCloudinaryUrls } from '@/lib/utilities/cloudinary';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim().toLowerCase() }),
        ...(body.region !== undefined && { region: body.region.trim() }),
        ...(body.tagline !== undefined && { tagline: body.tagline.trim() }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.imageUrl !== undefined && { imageUrl: optimizeCloudinaryUrl(body.imageUrl.trim()) }),
        ...(body.gallery !== undefined && { gallery: optimizeCloudinaryUrls(body.gallery) }),
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

    try {
      revalidateTag('destinations', 'max');
      revalidatePath('/destinations');
      if (updated.slug) {
        revalidatePath(`/destinations/${updated.slug}`);
      }
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, destination: updated });
  } catch (err) {
    console.error('[API /api/admin/destinations/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.destination.delete({
      where: { id },
    });

    try {
      revalidateTag('destinations', 'max');
      revalidatePath('/destinations');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/destinations/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}
