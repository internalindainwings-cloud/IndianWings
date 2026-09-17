export interface HeroSlide {
  id: string;
  title: string;
  videoSrc: string;
  poster: string;
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
  slides: HeroSlide[];
  trustPills: HeroTrustPill[];
}

export const defaultHeroConfig: HeroHomepageConfig = {
  headline: 'RIWAAYAT-E-KASHMIR',
  subheadline: 'Heritage & Cultural Journeys Begins',
  primaryCtaText: 'Get Free Quote',
  secondaryCtaText: 'Explore Packages',
  secondaryCtaLink: '/packages',
  videoUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/f_auto,q_auto,ac_none/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.mp4',
  posterUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/so_0,f_auto,q_auto/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.jpg',
  slides: [
    {
      id: 'dal-lake',
      title: 'Dal Lake & Houseboats',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/video/upload/f_auto,q_auto,ac_none/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.mp4',
      poster: 'https://res.cloudinary.com/wmwdypan/video/upload/so_0,f_auto,q_auto/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.jpg',
    },
    {
      id: 'gulmarg',
      title: 'Gulmarg Alpine Meadows',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/video/upload/f_auto,q_auto,ac_none/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.mp4',
      poster: 'https://res.cloudinary.com/wmwdypan/video/upload/so_0,f_auto,q_auto/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.jpg',
    },
    {
      id: 'pahalgam',
      title: 'Pahalgam Valley & Lidder River',
      videoSrc: 'https://res.cloudinary.com/wmwdypan/video/upload/f_auto,q_auto,ac_none/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.mp4',
      poster: 'https://res.cloudinary.com/wmwdypan/video/upload/so_0,f_auto,q_auto/v1789663600/indian_wings_vaishnodevi_kashmir_amarnath_ladakh_slideshow_1.jpg',
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
