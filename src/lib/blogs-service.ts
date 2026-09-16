import { defaultBlogPosts, BlogPostItem } from '@/data/blogs-data';

export type { BlogPostItem };

export async function getAllBlogs(includeDrafts = false): Promise<BlogPostItem[]> {
  // In future can also read from a database table if added; currently uses authoritative content
  if (includeDrafts) {
    return defaultBlogPosts;
  }
  return defaultBlogPosts.filter((b) => b.isActive);
}

export async function getBlogBySlug(slug: string): Promise<BlogPostItem | null> {
  const blogs = await getAllBlogs(true);
  const found = blogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

export function getAllBlogSlugs(): string[] {
  return defaultBlogPosts.map((b) => b.slug);
}
