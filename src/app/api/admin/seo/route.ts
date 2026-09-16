import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllPackages } from '@/lib/packages-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get site settings
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          id: 'global',
          siteTitle: 'The Indian Wings Company | Premium Kashmir Travel',
          siteDesc: 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
        },
      });
    }

    // 2. Fetch live sitemap statistics
    const packages = await getAllPackages(false);
    const totalIndexed = packages.filter((p) => !p.noIndex).length;
    const totalExcluded = packages.filter((p) => p.noIndex).length;

    return NextResponse.json({
      success: true,
      settings,
      sitemap: {
        totalIndexedPackages: totalIndexed,
        totalExcludedPackages: totalExcluded,
        sitemapUrl: '/sitemap.xml',
        robotsUrl: '/robots.txt',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[API /api/admin/seo GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { siteTitle, siteDesc, robotsTxtCustom } = body;

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        siteTitle: siteTitle?.trim(),
        siteDesc: siteDesc?.trim(),
        robotsTxtCustom: robotsTxtCustom !== undefined ? robotsTxtCustom : undefined,
      },
      create: {
        id: 'global',
        siteTitle: siteTitle?.trim() || 'The Indian Wings Company | Premium Kashmir Travel',
        siteDesc: siteDesc?.trim() || 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
        robotsTxtCustom: robotsTxtCustom || null,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error('[API /api/admin/seo POST] Error:', err);
    return NextResponse.json({ error: 'Failed to update SEO settings' }, { status: 500 });
  }
}
