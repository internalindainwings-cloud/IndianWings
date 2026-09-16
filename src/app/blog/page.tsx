import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';
import { getAllBlogs } from '@/lib/blogs-service';

export const metadata: Metadata = {
  title: 'Kashmir Travel Guides, Itinerary Tips & Expert Advice | The Indian Wings Company',
  description: 'Authoritative Kashmir travel blog and insider guides. Month-by-month weather, Gulmarg gondola booking rules, winter packing checklists, and off-beat route discoveries.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Kashmir Travel Guides & Holiday Advice | The Indian Wings Company',
    description: 'Expert local tips on visiting Srinagar, Gulmarg, Pahalgam, Sonmarg, and hidden Himalayan valleys.',
    images: ['/images/gallery/gulmarg-snow.jpg'],
  },
};

export default async function BlogListingPage() {
  const blogs = await getAllBlogs(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kashmir Travel Guides & Blog | The Indian Wings Company',
    description: 'Curated articles and travel advice for Jammu & Kashmir holidays.',
    url: `${siteUrl}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogs.map((blog, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${siteUrl}/blog/${blog.slug}`,
        name: blog.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <main className="w-full min-h-screen bg-background text-charcoal pb-16">
        {/* Hero Section */}
        <section className="relative w-full bg-[#081E23] text-white py-14 sm:py-20 px-5 sm:px-8 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-radial from-saffron/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron text-xs font-bold uppercase tracking-wider">
              <BookOpen size={12} />
              <span>Local Srinagar Insights</span>
            </span>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Kashmir Travel Guides & <span className="text-saffron">Insider Advice</span>
            </h1>
            <p className="text-white/70 text-xs sm:text-sm max-w-2xl mx-auto">
              Authored by local Kashmiri travel specialists. Verified advice on snow seasons, cable car booking slots, thermal packing, and off-beat Himalayan discoveries.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col rounded-2xl bg-white border border-black/8 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <Link href={`/blog/${blog.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 block">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-midnight/80 backdrop-blur-md text-white text-[10.5px] font-bold tracking-wide border border-white/15">
                    {blog.category}
                  </span>
                </Link>

                {/* Content Body */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-saffron" />
                        {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-saffron" />
                        {blog.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${blog.slug}`} className="block">
                      <h2 className="font-display text-lg font-bold text-midnight group-hover:text-saffron transition-colors leading-snug line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Footer & Read CTA */}
                  <div className="pt-3 border-t border-black/6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                        <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
                      </div>
                      <span className="text-[11px] font-bold text-midnight truncate max-w-[120px]">
                        {blog.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-saffron group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Guide</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
