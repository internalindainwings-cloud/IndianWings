import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllPackages, generatePackageSlug } from '@/lib/packages-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packages = await getAllPackages(true); // include drafts
    return NextResponse.json({ success: true, packages });
  } catch (err) {
    console.error('[API /api/admin/packages GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      categorySlug,
      categoryId,
      duration,
      tag,
      tagColor,
      imageUrl,
      videoUrl,
      galleryUrls,
      rating,
      reviewCount,
      destinations,
      inclusions,
      exclusions,
      highlights,
      startingPrice,
      originalPrice,
      isFeatured,
      isActive,
      itinerary,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      noIndex,
    } = body;

    if (!title || !duration || !startingPrice) {
      return NextResponse.json(
        { error: 'Title, duration, and starting price are required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = body.slug ? body.slug.trim().toLowerCase().replace(/[^\w-]/g, '-') : generatePackageSlug(title, duration);
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Build rich itinerary payload
    let itineraryPayload: any = itinerary || [];
    if (itinerary && typeof itinerary === 'object' && !Array.isArray(itinerary)) {
      itineraryPayload = {
        days: Array.isArray(itinerary.days) ? itinerary.days : [],
        overviewParagraph: itinerary.overviewParagraph || body.overviewParagraph || null,
        stays: Array.isArray(itinerary.stays) ? itinerary.stays : (body.stays || []),
        transports: Array.isArray(itinerary.transports) ? itinerary.transports : (body.transports || []),
        faqs: Array.isArray(itinerary.faqs) ? itinerary.faqs : (body.faqs || []),
        cancellationPolicy: Array.isArray(itinerary.cancellationPolicy) ? itinerary.cancellationPolicy : (body.cancellationPolicy || []),
      };
    } else if (body.stays || body.transports || body.faqs || body.cancellationPolicy || body.overviewParagraph) {
      itineraryPayload = {
        days: Array.isArray(itinerary) ? itinerary : [],
        overviewParagraph: body.overviewParagraph || null,
        stays: Array.isArray(body.stays) ? body.stays : [],
        transports: Array.isArray(body.transports) ? body.transports : [],
        faqs: Array.isArray(body.faqs) ? body.faqs : [],
        cancellationPolicy: Array.isArray(body.cancellationPolicy) ? body.cancellationPolicy : [],
      };
    }

    const newPackage = await prisma.package.create({
      data: {
        slug,
        title: title.trim(),
        categorySlug: categorySlug || 'featured',
        categoryId: categoryId || null,
        duration: duration.trim(),
        tag: tag || 'Best Seller',
        tagColor: body.cardAnimation || tagColor || null,
        imageUrl: imageUrl || '/images/gallery/shikara-dal-lake.jpg',
        videoUrl: videoUrl && videoUrl.trim() !== '' ? videoUrl.trim() : null,
        galleryUrls: Array.isArray(galleryUrls) ? galleryUrls : [],
        rating: typeof rating === 'number' ? rating : 4.9,
        reviewCount: typeof reviewCount === 'number' ? reviewCount : 1,
        destinations: Array.isArray(destinations) ? destinations : [],
        inclusions: Array.isArray(inclusions) ? inclusions : [],
        exclusions: Array.isArray(exclusions) ? exclusions : [],
        highlights: Array.isArray(highlights) ? highlights : [],
        startingPrice: parseInt(startingPrice, 10),
        originalPrice: originalPrice ? parseInt(originalPrice, 10) : null,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== false,
        itinerary: itineraryPayload,
        metaTitle: metaTitle || `${title} (${duration}) | The Indian Wings Company`,
        metaDescription: metaDescription || `Book ${title} in Kashmir with verified stays and private cab.`,
        keywords: Array.isArray(keywords) ? keywords : [],
        canonicalUrl: canonicalUrl || `https://theindianwings.com/packages/${slug}`,
        noIndex: Boolean(noIndex),
      },
    });

    return NextResponse.json({ success: true, package: newPackage });
  } catch (err) {
    console.error('[API /api/admin/packages POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
