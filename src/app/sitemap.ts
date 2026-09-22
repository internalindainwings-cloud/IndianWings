import { MetadataRoute } from 'next';
import { getAllPackages } from '@/lib/packages-service';
import { getAllDestinations } from '@/lib/destinations-service';
import { getAllBlogs } from '@/lib/blogs-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tourpackageskashmir.com';
  const now = new Date();

  // 1. Static Core & Category Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/transport`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/bucket-list/shopping`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bucket-list/things-to-do`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bucket-list/travel-information`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cancellation-refund-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // 2. Dynamic Destination Routes from Database
  let destinationRoutes: MetadataRoute.Sitemap = [];
  try {
    const destinations = await getAllDestinations(false);
    destinationRoutes = destinations.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (err) {
    console.warn('[Sitemap] Could not fetch destinations:', err);
  }

  // 3. Dynamic Package Routes from Database
  let packageRoutes: MetadataRoute.Sitemap = [];
  try {
    const packages = await getAllPackages(false);
    packageRoutes = packages
      .filter((pkg) => !pkg.noIndex)
      .map((pkg) => ({
        url: `${baseUrl}/packages/${pkg.slug}`,
        lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: pkg.isFeatured ? 0.9 : 0.8,
      }));
  } catch (err) {
    console.warn('[Sitemap] Could not fetch packages:', err);
  }

  // 4. Dynamic Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getAllBlogs(false);
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.warn('[Sitemap] Could not fetch blogs:', err);
  }

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes, ...blogRoutes];
}
