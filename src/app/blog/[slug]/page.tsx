import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Sparkles, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { getBlogBySlug, getAllBlogs } from '@/lib/blogs-service';
import { siteConfig } from '@/config/site-config';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | The Indian Wings Company',
      description: 'The requested travel article could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';
  const canonical = `${siteUrl}/blog/${blog.slug}`;
  const title = blog.metaTitle || `${blog.title} | The Indian Wings Company`;
  const description = blog.metaDescription || blog.excerpt;

  return {
    title,
    description,
    keywords: blog.tags,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'The Indian Wings Company',
      images: [
        {
          url: blog.imageUrl.startsWith('http') ? blog.imageUrl : `${siteUrl}${blog.imageUrl}`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: [blog.author.name],
      tags: blog.tags,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';
  const articleUrl = `${siteUrl}/blog/${blog.slug}`;

  // Schema 1: BlogPosting Schema (Google Search Central)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.imageUrl.startsWith('http') ? blog.imageUrl : `${siteUrl}${blog.imageUrl}`],
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      '@type': 'Person',
      name: blog.author.name,
      jobTitle: blog.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Indian Wings Company',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/client_logo.png`,
      },
    },
    keywords: blog.tags.join(', '),
  };

  // Schema 2: BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Travel Guides & Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="min-h-screen bg-background text-charcoal pb-20">
        {/* Header Breadcrumb & Category */}
        <div className="bg-[#081E23] text-white pt-10 pb-16 px-5 sm:px-8 border-b border-white/10">
          <div className="max-w-4xl mx-auto space-y-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-saffron transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Travel Guides</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-xs font-bold">
                {blog.category}
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-white/70 text-xs flex items-center gap-1">
                <Clock size={12} className="text-saffron" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {blog.title}
            </h1>

            {/* Author Bar */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{blog.author.name}</div>
                <div className="text-[11px] text-white/60">{blog.author.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 -mt-8 relative z-10">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <Image src={blog.imageUrl} alt={blog.title} fill priority className="object-cover" />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 space-y-6">
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-[#1E293B] space-y-5">
            {blog.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={i} className="font-display text-xl font-bold text-midnight mt-8 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const bulletItems = paragraph.split('\n').map((b) => b.replace(/^- \*\*(.*?)\*\*:?/, '$1:'));
                return (
                  <ul key={i} className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
                    {bulletItems.map((b, idx) => (
                      <li key={idx} className="text-sm leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-black/8 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Tagged with:</span>
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* High-Converting Kashmir Tour CTA Banner */}
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#081E23] to-[#0E353D] text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/30 text-saffron text-xs font-bold">
                <Sparkles size={12} />
                <span>Handcrafted Kashmir Holidays</span>
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Turn This Guide Into Your Real Himalayan Journey
              </h3>
              <p className="text-white/70 text-xs sm:text-sm max-w-xl">
                Let our local Srinagar team curate your verified heated houseboat, private Innova cab, and Gondola timing assistance.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/packages"
                  className="px-5 py-2.5 rounded-full bg-saffron text-midnight font-bold text-xs shadow hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
                >
                  <span>Explore All Packages</span>
                  <ArrowRight size={13} />
                </Link>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Call {siteConfig.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
