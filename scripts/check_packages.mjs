import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pkgs = await prisma.package.findMany({
    select: { id: true, slug: true, title: true, categorySlug: true, duration: true, startingPrice: true, isActive: true }
  });
  console.log('Database Packages:', JSON.stringify(pkgs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
