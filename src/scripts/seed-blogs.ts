import { prisma } from '../lib/database/prisma';
import { defaultBlogPosts } from '../data/blogs-data';

async function main() {
  console.log("Seeding blogs from static data...");

  for (const blog of defaultBlogPosts) {
    const existing = await prisma.blog.findUnique({
      where: { slug: blog.slug }
    });

    if (!existing) {
      await prisma.blog.create({
        data: {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          imageUrl: blog.imageUrl,
          category: blog.category,
          authorName: blog.author?.name || 'The Indian Wings',
          authorAvatar: blog.author?.avatar,
          readTime: blog.readTime,
          publishedAt: new Date(blog.publishedAt),
          isPublished: blog.isActive,
          seoTitle: `${blog.title} | The Indian Wings`,
          seoDescription: blog.excerpt
        }
      });
      console.log(`Created blog: ${blog.title}`);
    } else {
      console.log(`Blog already exists: ${blog.title}`);
    }
  }

  console.log("Seeding complete.");
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
