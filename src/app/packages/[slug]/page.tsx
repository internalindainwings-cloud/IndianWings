import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPackageBySlug, getAllPackages } from '@/lib/packages-service';
import { PackageHero } from '@/components/packages/detail/PackageHero';
import { PackageAfterHero } from '@/components/packages/detail/PackageAfterHero';
import { defaultPackageFaqs } from '@/data/package-faqs';

interface PackageDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* ── 1. Dynamic SEO Metadata (Google Search Central Compliant) ── */
export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    return {
      title: 'Package Not Found | The Indian Wings Company',
      description: 'The requested Kashmir tour itinerary could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';
  const canonical = pkg.canonicalUrl || `${siteUrl}/packages/${pkg.slug}`;
  const title = pkg.metaTitle || `${pkg.title} (${pkg.duration}) | The Indian Wings Company`;
  const description =
    pkg.metaDescription ||
    `Book ${pkg.title} for ${pkg.duration} starting at ₹${pkg.startingPrice.toLocaleString('en-IN')}/person. Includes verified stays, private cab, and 24/7 ground assistance.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: pkg.keywords.length > 0 ? pkg.keywords : [pkg.title, 'Kashmir tour package', ...pkg.destinations],
    alternates: {
      canonical,
    },
    robots: pkg.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'The Indian Wings Company',
      images: [
        {
          url: pkg.imageUrl.startsWith('http') ? pkg.imageUrl : `${siteUrl}${pkg.imageUrl}`,
          width: 1200,
          height: 630,
          alt: pkg.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pkg.imageUrl.startsWith('http') ? pkg.imageUrl : `${siteUrl}${pkg.imageUrl}`],
    },
  };
}

/* ── 2. Static Params Pre-generation for fast TTFB ────────────── */
export async function generateStaticParams() {
  const packages = await getAllPackages(false);
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

/* ── 3. Page Component ────────────────────────────────────────── */
export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';
  const pageUrl = `${siteUrl}/packages/${pkg.slug}`;

  /* ── 4. Structured Data Schemas (JSON-LD) ────────────────────── */
  // Schema 1: TouristTrip & Product Schema
  const touristTripSchema = {
    '@context': 'https://schema.org',
    '@type': ['TouristTrip', 'Product'],
    name: pkg.title,
    description: pkg.metaDescription || `Curated Kashmir tour package: ${pkg.title}`,
    image: pkg.imageUrl.startsWith('http') ? pkg.imageUrl : `${siteUrl}${pkg.imageUrl}`,
    touristType: ['Couple', 'Family', 'Adventure'],
    offers: {
      '@type': 'Offer',
      price: pkg.startingPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      validFrom: '2026-01-01',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'The Indian Wings Company',
      url: siteUrl,
    },
    itinerary: (pkg.itinerary || []).map((day: any) => ({
      '@type': 'TouristDestination',
      name: day.title,
      description: day.description,
    })),
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
        name: 'Kashmir Tour Packages',
        item: `${siteUrl}/packages`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pkg.title,
        item: pageUrl,
      },
    ],
  };

  // Schema 3: FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: defaultPackageFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* ── Inject JSON-LD Rich Snippets into <head> ────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-background text-[#0B1F2A] pb-12 sm:pb-16">
        {/* 1. Hero Section (Fulfilling 8-Point Hero Blueprint) */}
        <PackageHero pkg={pkg} />

        {/* 2. After-Hero Content (Matching Hand-Drawn Sketch Strictly) */}
        <PackageAfterHero pkg={pkg} />
      </main>
    </>
  );
}
