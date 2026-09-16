import { NextRequest, NextResponse } from 'next/server';
import { getAllPackages, getCategories } from '@/lib/packages-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const packages = await getAllPackages(false);
    const categories = await getCategories();

    const filtered = category
      ? packages.filter((p) => p.categorySlug.toLowerCase() === category.toLowerCase())
      : packages;

    return NextResponse.json({
      success: true,
      packages: filtered,
      categories,
    });
  } catch (err) {
    console.error('[API /api/packages GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
