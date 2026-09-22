import prisma from '@/lib/database/prisma';

export async function getActiveBrands() {
  try {
    return await prisma.partnerBrand.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
  } catch (error) {
    console.error('Failed to fetch active brands:', error);
    return [];
  }
}
