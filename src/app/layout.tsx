import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { SecurityScripts } from "@/components/security/SecurityScripts";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  display: "swap",
});



const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tourpackageskashmir.com';

import { getSiteSettings } from '@/lib/settings-service';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const heroImage = settings.heroImageUrl || 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'The Indian Wings Company | Premium Kashmir Travel & Tour Packages',
      template: '%s | The Indian Wings Company',
    },
    description: 'Experience breathtaking landscapes, luxury houseboats, and authentic Kashmir hospitality. Handcrafted itineraries with verified private chauffeurs.',
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: siteUrl,
      siteName: 'The Indian Wings Company',
      title: 'The Indian Wings Company | Premium Kashmir Travel & Tour Packages',
      description: 'Experience breathtaking landscapes, luxury houseboats, and authentic Kashmir hospitality. Handcrafted itineraries with verified private chauffeurs.',
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: 'The Indian Wings Company - Premium Kashmir Travel',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'The Indian Wings Company | Premium Kashmir Travel',
      description: 'Handcrafted Kashmir tour packages with verified stays and 24/7 ground assistance.',
      images: [heroImage],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') ?? undefined;
  const isAdmin = headersList.get('x-is-admin') === 'true';

  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
      style={{
        ['--color-midnight' as string]: '#0F4C54',
        ['--color-saffron' as string]: '#F59E0B',
      }}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <PublicShell nonce={nonce} isAdminOverride={isAdmin}>{children}</PublicShell>
        <AnalyticsScripts nonce={nonce} />
        <SecurityScripts />
      </body>
    </html>
  );
}
