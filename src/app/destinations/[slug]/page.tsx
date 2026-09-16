import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDestinationBySlug, getAllDestinationSlugs } from '@/data/destinations';
import { getDestinationContentBySlug } from '@/data/destination-content';
import { DestinationDetailHero } from '@/components/destinations/DestinationDetailHero';
import { DestinationSubNavigation } from '@/components/destinations/DestinationSubNavigation';
import { ThingsToSeeDoSection } from '@/components/destinations/ThingsToSeeDoSection';
import { BestTimeToVisitSection } from '@/components/destinations/BestTimeToVisitSection';

interface DestinationDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllDestinationSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';

export async function generateMetadata({ params }: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return {
      title: 'Destination Not Found | The Indian Wings Company',
    };
  }

  const pageUrl = `${siteUrl}/destinations/${destination.slug}`;
  const title = `${destination.name}, Kashmir — Travel Guide & Tour Packages | The Indian Wings Company`;
  const description = `${destination.description} Explore ${destination.name} with handcrafted itineraries, verified stays, and private chauffeurs by The Indian Wings Company.`;
  const image = destination.imageUrl.startsWith('http') ? destination.imageUrl : `${siteUrl}${destination.imageUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${destination.slug}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'The Indian Wings Company',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${destination.name} - Kashmir Travel Guide`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const content = getDestinationContentBySlug(slug, destination.name);
  const pageUrl = `${siteUrl}/destinations/${destination.slug}`;
  const image = destination.imageUrl.startsWith('http') ? destination.imageUrl : `${siteUrl}${destination.imageUrl}`;

  // Structured Data: BreadcrumbList and TouristDestination
  const destinationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
            name: 'Destinations',
            item: `${siteUrl}/destinations`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: destination.name,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'TouristDestination',
        name: `${destination.name}, Kashmir`,
        description: destination.description,
        url: pageUrl,
        image,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: destination.region,
        },
        touristType: ['Couple', 'Family', 'Nature Lover', 'Adventure Enthusiast'],
        includesAttraction: destination.highlights.map((h) => ({
          '@type': 'TouristAttraction',
          name: h,
        })),
      },
    ],
  };

  return (
    <main className="flex-1 w-full bg-background text-charcoal">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd) }}
      />

      {/* 1. Destination Detail Hero Section (LOCKED & UNTOUCHED) */}
      <DestinationDetailHero destination={destination} />

      {/* 2. Destination Sticky Sub-Navigation */}
      <DestinationSubNavigation destinationName={destination.name} />

      {/* 3. Things To See & Do Section */}
      <ThingsToSeeDoSection destination={destination} content={content} />

      {/* 4. Best Time To Visit Section */}
      <BestTimeToVisitSection destination={destination} content={content} />
    </main>
  );
}
