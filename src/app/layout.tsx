import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Berkshire_Swash } from "next/font/google";
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

const berkshireSwash = Berkshire_Swash({
  variable: "--font-berkshire",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';

export const metadata: Metadata = {
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
        url: '/assets/hero.png',
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
    images: ['/assets/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') ?? undefined;

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${berkshireSwash.variable} h-full antialiased`}
      style={{
        ['--color-midnight' as string]: '#0F4C54',
        ['--color-saffron' as string]: '#F59E0B',
      }}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <PublicShell nonce={nonce}>{children}</PublicShell>
        <AnalyticsScripts nonce={nonce} />
        <SecurityScripts />
      </body>
    </html>
  );
}
