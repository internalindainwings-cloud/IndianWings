export type Brand = {
  id: string;
  name: string;
  /** If undefined, renders a text-badge pill using brand name in Playfair Display */
  logoSrc?: string;
  altText: string;
  typeLabel: string;
};

export const partners: Brand[] = [
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    logoSrc: '/images/brands/tripadvisor.svg',
    altText: 'TripAdvisor — Review Platform',
    typeLabel: 'REVIEW PLATFORM',
  },
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    logoSrc: '/images/brands/makemytrip.png',
    altText: 'MakeMyTrip — Booking Partner',
    typeLabel: 'BOOKING PARTNER',
  },
  {
    id: 'holidify',
    name: 'Holidify',
    logoSrc: '/images/brands/holidify.png',
    altText: 'Holidify — Travel Guide',
    typeLabel: 'TRAVEL GUIDE',
  },
];
