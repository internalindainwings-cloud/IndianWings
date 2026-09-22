import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';

export async function GET(request: NextRequest) {
  try {
    const brands = await prisma.partnerBrand.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error('[API /api/admin/brands GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logoUrl, altText, typeLabel, isActive, sortOrder } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newBrand = await prisma.partnerBrand.create({
      data: {
        name,
        logoUrl: logoUrl || null,
        altText: altText || name,
        typeLabel: typeLabel || 'HOSPITALITY PARTNER',
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0
      }
    });

    return NextResponse.json({ success: true, brand: newBrand });
  } catch (error) {
    console.error('[API /api/admin/brands POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, logoUrl, altText, typeLabel, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedBrand = await prisma.partnerBrand.update({
      where: { id },
      data: {
        name,
        logoUrl,
        altText,
        typeLabel,
        isActive,
        sortOrder
      }
    });

    return NextResponse.json({ success: true, brand: updatedBrand });
  } catch (error) {
    console.error('[API /api/admin/brands PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.partnerBrand.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /api/admin/brands DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
