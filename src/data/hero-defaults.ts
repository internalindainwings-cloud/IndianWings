export interface HeroSlide {
  id: string;
  title: string;
  location?: string;
  videoSrc: string;
  poster: string;
  mobilePoster?: string;
  mobileVideoSrc?: string;
}

export interface HeroTrustPill {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export type HeroTransitionType = 'fade' | 'ken-burns' | 'slide' | 'blur-fade';

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
  transitionType?: HeroTransitionType;
  transitionDuration?: number;
  slides: HeroSlide[];
  trustPills: HeroTrustPill[];
}

export const defaultHeroConfig: HeroHomepageConfig = {
  headline: 'RIWAAYAT-E-KASHMIR',
  subheadline: 'Heritage & Cultural Journeys Begins',
  primaryCtaText: 'Get Free Quote',
  secondaryCtaText: 'Explore Packages',
  secondaryCtaLink: '/packages',
  videoUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
  posterUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
  transitionType: 'fade',
  transitionDuration: 5500,
  slides: [
    {
      id: 'dal-lake',
      title: 'Shree Vaishno Devi Sacred Valley',
      location: 'Shree Mata Vaishno Devi, Katra',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
      poster: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
    },
    {
      id: 'gulmarg',
      title: 'Gulmarg Alpine Meadows',
      location: 'Gulmarg Meadow of Flowers, Kashmir',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
      poster: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png',
    },
    {
      id: 'pahalgam',
      title: 'Pahalgam Valley & Lidder River',
      location: 'Pahalgam Valley & Betaab Valley, Kashmir',
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
