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

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.slug !== undefined) updateData.slug = body.slug.trim().toLowerCase();
    if (body.categorySlug !== undefined) updateData.categorySlug = body.categorySlug;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.duration !== undefined) updateData.duration = body.duration.trim();
    if (body.tag !== undefined) updateData.tag = body.tag;
    if (body.tagColor !== undefined || body.cardAnimation !== undefined) {
      updateData.tagColor = body.cardAnimation || body.tagColor || null;
    }
    if (body.imageUrl !== undefined) updateData.imageUrl = optimizeCloudinaryUrl(body.imageUrl);
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl && body.videoUrl.trim() !== '' ? optimizeCloudinaryUrl(body.videoUrl.trim()) : null;
    if (body.galleryUrls !== undefined) updateData.galleryUrls = Array.isArray(body.galleryUrls) ? optimizeCloudinaryUrls(body.galleryUrls) : [];
    if (body.rating !== undefined) updateData.rating = parseFloat(body.rating);
    if (body.reviewCount !== undefined) updateData.reviewCount = parseInt(body.reviewCount, 10);
    if (body.destinations !== undefined) updateData.destinations = body.destinations;
    if (body.inclusions !== undefined) updateData.inclusions = body.inclusions;
    if (body.exclusions !== undefined) updateData.exclusions = body.exclusions;
    if (body.highlights !== undefined) updateData.highlights = body.highlights;
    if (body.startingPrice !== undefined) updateData.startingPrice = parseInt(body.startingPrice, 10);
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? parseInt(body.originalPrice, 10) : null;
    if (body.priceUnit !== undefined) updateData.priceUnit = body.priceUnit;
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.itinerary !== undefined || body.stays !== undefined || body.transports !== undefined || body.faqs !== undefined || body.cancellationPolicy !== undefined || body.overviewParagraph !== undefined) {
      if (body.itinerary && typeof body.itinerary === 'object' && !Array.isArray(body.itinerary)) {
        updateData.itinerary = {
          days: Array.isArray(body.itinerary.days) ? body.itinerary.days : [],
          overviewParagraph: body.itinerary.overviewParagraph || body.overviewParagraph || null,
          stays: Array.isArray(body.itinerary.stays) ? body.itinerary.stays : (body.stays || []),
          transports: Array.isArray(body.itinerary.transports) ? body.itinerary.transports : (body.transports || []),
          faqs: Array.isArray(body.itinerary.faqs) ? body.itinerary.faqs : (body.faqs || []),
          cancellationPolicy: Array.isArray(body.itinerary.cancellationPolicy) ? body.itinerary.cancellationPolicy : (body.cancellationPolicy || []),
        };
      } else if (body.stays || body.transports || body.faqs || body.cancellationPolicy || body.overviewParagraph) {
        updateData.itinerary = {
          days: Array.isArray(body.itinerary) ? body.itinerary : [],
          overviewParagraph: body.overviewParagraph || null,
          stays: Array.isArray(body.stays) ? body.stays : [],
          transports: Array.isArray(body.transports) ? body.transports : [],
          faqs: Array.isArray(body.faqs) ? body.faqs : [],
          cancellationPolicy: Array.isArray(body.cancellationPolicy) ? body.cancellationPolicy : [],
        };
      } else {
        updateData.itinerary = body.itinerary;
      }
    }
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.keywords !== undefined) updateData.keywords = body.keywords;
    if (body.canonicalUrl !== undefined) updateData.canonicalUrl = body.canonicalUrl;
    if (body.noIndex !== undefined) updateData.noIndex = Boolean(body.noIndex);

    // Update package by id or slug
    const updated = await prisma.package.update({
      where: { id },
      data: updateData,
    });

    try {
      revalidateTag('packages', 'max');
      revalidatePath('/packages');
      if (updated.slug) {
        revalidatePath(`/packages/${updated.slug}`);
      }
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, package: updated });
  } catch (err) {
    console.error('[API /api/admin/packages/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.package.delete({
      where: { id },
    });

    try {
      revalidateTag('packages', 'max');
      revalidatePath('/packages');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    console.error('[API /api/admin/packages/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
