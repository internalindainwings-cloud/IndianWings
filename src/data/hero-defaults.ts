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
  headline: 'Discover the Magic of Kashmir',
  subheadline: 'Curated luxury houseboats, alpine ski resorts, and private chauffeured tours across paradise.',
  primaryCtaText: 'Get Free Quote',
  secondaryCtaText: 'Explore Packages',
  secondaryCtaLink: '/packages',
  videoUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
  posterUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
  slides: [
    {
      id: 'dal-lake',
      title: 'Dal Lake & Houseboats',
      videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
      poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    },
    {
      id: 'gulmarg',
      title: 'Gulmarg Alpine Meadows',
      videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
      poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    },
    {
      id: 'pahalgam',
      title: 'Pahalgam Valley & Lidder River',
      videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
      poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
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
