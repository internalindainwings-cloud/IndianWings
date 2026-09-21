export interface PageHeroConfig {
  id: 'destinations' | 'packages' | 'transport' | 'activities' | 'bucket-list' | string;
  name: string;
  route: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  heading?: string;
  updatedAt?: string;
}

export const DEFAULT_PAGE_HEROES: Record<string, PageHeroConfig> = {
  destinations: {
    id: 'destinations',
    name: 'Destinations',
    route: '/destinations',
    desktopImageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789975327/dest_hero.jpg',
    mobileImageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789975327/dest_hero.jpg',
    heading: 'Explore Iconic Kashmir',
  },
  packages: {
    id: 'packages',
    name: 'Tour Packages',
    route: '/packages',
    desktopImageUrl: '/images/gallery/pahalgam-valley.jpg',
    mobileImageUrl: '/images/gallery/pahalgam-valley.jpg',
    heading: 'Curated Kashmir Packages',
  },
  transport: {
    id: 'transport',
    name: 'Transport & Fleet',
    route: '/transport',
    desktopImageUrl: '/images/gallery/pahalgam-valley.jpg',
    mobileImageUrl: '/images/gallery/pahalgam-valley.jpg',
    heading: 'Verified Mountain Fleet',
  },
  activities: {
    id: 'activities',
    name: 'Adventure & Activities',
    route: '/activities',
    desktopImageUrl: '/images/gallery/gulmarg-snow.jpg',
    mobileImageUrl: '/images/gallery/gulmarg-snow.jpg',
    heading: 'Thrilling Valley Adventures',
  },
  'bucket-list': {
    id: 'bucket-list',
    name: 'Kashmir Bucket List',
    route: '/bucket-list/travel-information',
    desktopImageUrl: '/images/gallery/shikara-dal-lake.jpg',
    mobileImageUrl: '/images/gallery/shikara-dal-lake.jpg',
    heading: 'Essential Kashmir Guide',
  },
};
