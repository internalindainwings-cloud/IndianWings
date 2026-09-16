import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/the_indian_wings?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Delete test1
  await prisma.package.deleteMany({
    where: {
      OR: [
        { slug: { contains: 'test1' } },
        { title: { contains: 'test1' } },
        { categorySlug: 'test1' }
      ]
    }
  });
  console.log('Deleted test1 records.');

  // Check remaining count
  const count = await prisma.package.count();
  console.log('Current package count in DB:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
