export interface HeroSlide {
  id: string;
  title: string;
  videoSrc: string;
  poster: string;
  mobilePoster?: string;
  mobileVideoSrc?: string;
  location?: string;
}

export interface HeroTrustPill {
  id: string;
  icon: string;
  value: string;
  label: string;
}


export interface HeroHomepageConfig {
  headline: string;
  badgeText?: string;
  subheadline?: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  videoUrl: string;
  posterUrl: string;
  mobilePosterUrl?: string;
  mobileVideoUrl?: string;
  slides: HeroSlide[];
  trustPills: HeroTrustPill[];
  desktopLayoutMode?: 'original' | 'dynamic';
}

export const defaultHeroConfig: HeroHomepageConfig = {
  headline: 'RIWAAYAT-E-KASHMIR',
  subheadline: 'Heritage & Cultural Journeys Begins',
  primaryCtaText: 'Get Free Quote',
  secondaryCtaText: 'Explore Packages',
  secondaryCtaLink: '/packages',
  videoUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
  posterUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
  desktopLayoutMode: 'dynamic',
  slides: [
    {
      id: 'dal-lake',
      title: 'Shree Vaishno Devi Sacred Valley',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
      poster: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
    },
    {
      id: 'gulmarg',
      title: 'Gulmarg Alpine Meadows',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
      poster: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
    },
    {
      id: 'pahalgam',
      title: 'Pahalgam Valley & Lidder River',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
      poster: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
    },
  ],
  trustPills: [
    {
      id: 'pill-1',
      icon: 'users',
      value: '600+',
      label: 'Happy Families',
    },
    {
      id: 'pill-2',
      icon: 'star',
      value: '★ 4.9',
      label: 'Google Reviews',
    },
    {
      id: 'pill-3',
      icon: 'award',
      value: '15+ Years',
      label: 'Valley Experience',
    },
  ],
};
