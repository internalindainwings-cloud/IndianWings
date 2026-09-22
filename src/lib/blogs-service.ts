import { prisma } from '@/lib/database/prisma';

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
}

function mapPrismaBlog(dbBlog: any): BlogPostItem {
  return {
    id: dbBlog.id,
    slug: dbBlog.slug,
    title: dbBlog.title,
    excerpt: dbBlog.excerpt || '',
    content: dbBlog.content,
    category: dbBlog.category,
    imageUrl: dbBlog.imageUrl,
    author: {
      name: dbBlog.authorName,
      role: 'Contributor',
      avatar: dbBlog.authorAvatar || 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
    },
    publishedAt: dbBlog.publishedAt.toISOString(),
    readTime: dbBlog.readTime,
    tags: [],
    metaTitle: dbBlog.seoTitle || undefined,
    metaDescription: dbBlog.seoDescription || undefined,
    isActive: dbBlog.isPublished,
  };
}

export async function getAllBlogs(includeDrafts = false): Promise<BlogPostItem[]> {
  const blogs = await prisma.blog.findMany({
    where: includeDrafts ? undefined : { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });
  return blogs.map(mapPrismaBlog);
}

export async function getBlogBySlug(slug: string): Promise<BlogPostItem | null> {
  const blog = await prisma.blog.findUnique({
    where: { slug: slug.toLowerCase() },
  });
  if (!blog) return null;
  // If we only want published ones for users
  if (!blog.isPublished) {
    return null;
  }
  return mapPrismaBlog(blog);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return blogs.map((b: { slug: string }) => b.slug);
}
