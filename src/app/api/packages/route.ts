import { NextRequest, NextResponse } from 'next/server';
import { getAllPackages, getCategories } from '@/lib/packages-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const packages = await getAllPackages(false);
    const categories = await getCategories();

    let filtered = packages;
    if (featured === 'true' || category === 'featured') {
      const explicitFeatured = packages.filter((p) => p.isFeatured && p.isActive);
      filtered = explicitFeatured.length > 0
        ? explicitFeatured
        : packages.filter((p) => p.categorySlug.toLowerCase() === 'featured' && p.isActive);
    } else if (category) {
      filtered = packages.filter((p) => p.categorySlug.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json(
      {
        success: true,
        packages: filtered,
        categories,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[API /api/packages GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
