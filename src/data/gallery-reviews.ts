export interface GalleryReviewItem {
  id: string;
  title: string;
  guestName: string;
  guestLocation: string;
  avatarUrl?: string;
  imageUrl: string;
  category: 'gulmarg' | 'dal-lake' | 'pahalgam' | 'houseboat' | 'offbeat';
  categoryLabel: string;
  location: string;
  packageBooked: string;
  rating: number;
  travelDate: string;
  reviewText: string;
  highlightQuote: string;
  verified: boolean;
}

export const galleryCategories = [
  { id: 'all', label: 'All Moments' },
  { id: 'dal-lake', label: 'Dal Lake & Shikara' },
  { id: 'gulmarg', label: 'Gulmarg & Snow' },
  { id: 'pahalgam', label: 'Pahalgam Valleys' },
  { id: 'houseboat', label: 'Houseboat Stays' },
  { id: 'offbeat', label: 'Off-Beat Treks' },
] as const;

export const galleryReviewsData: GalleryReviewItem[] = [
  {
    id: 'gr-1',
    title: 'Sunrise on Dal Lake',
    guestName: 'Sameer & Tanvi',
    guestLocation: 'Bengaluru',
    avatarUrl: '',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    category: 'dal-lake',
    categoryLabel: 'Dal Lake & Shikara',
    location: 'Dal Lake, Srinagar',
    packageBooked: '6D/5N Kashmir Classic',
    rating: 5,
    travelDate: 'Oct 2025',
    highlightQuote: 'Dal Lake at 6 AM is unreal. Most peaceful morning ever.',
    reviewText: 'We woke up early for the sunrise Shikara. The lake was completely quiet and covered in mist. Our boatman made fresh hot tea right on the water. Truly memorable experience.',
    verified: true,
  },
  {
    id: 'gr-2',
    title: 'Snow Day in Gulmarg',
    guestName: 'The Malhotra Family',
    guestLocation: 'Chandigarh',
    avatarUrl: '',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    category: 'gulmarg',
    categoryLabel: 'Gulmarg & Snow',
    location: 'Gulmarg Phase II',
    packageBooked: '5D/4N Winter Gulmarg',
    rating: 5,
    travelDate: 'Jan 2026',
    highlightQuote: 'Snow up to our knees in Gulmarg! The kids did not want to leave.',
    reviewText: 'Gondola phase 2 was unbelievable. Indian Wings booked all tickets beforehand so we skipped the huge lines. Very helpful driver and cozy heated hotel.',
    verified: true,
  },
  {
    id: 'gr-3',
    title: 'Chilling by Lidder River',
    guestName: 'Ananya & Shreya',
    guestLocation: 'Kolkata',
    avatarUrl: '',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    category: 'pahalgam',
    categoryLabel: 'Pahalgam Valleys',
    location: 'Betaab Valley, Pahalgam',
    packageBooked: '7D/6N Valley Retreat',
    rating: 5,
    travelDate: 'Jun 2025',
    highlightQuote: 'Betaab Valley is even prettier in real life. Pure peace.',
    reviewText: 'Sitting by the Lidder river listening to the water was our favorite part. Bashir bhai showed us the quiet spots away from crowds. Felt super safe throughout.',
    verified: true,
  },
  {
    id: 'gr-4',
    title: 'Houseboat Evening',
    guestName: 'Vikram & Radhika',
    guestLocation: 'New Delhi',
    avatarUrl: '',
    imageUrl: '/images/gallery/houseboat-kashmir.jpg',
    category: 'houseboat',
    categoryLabel: 'Houseboat Stays',
    location: 'Nigeen Lake',
    packageBooked: '5D/4N Houseboat Special',
    rating: 5,
    travelDate: 'Sep 2025',
    highlightQuote: 'Evening Kahwa on the houseboat deck. Felt like a dream.',
    reviewText: 'Nigeen Lake is so peaceful compared to the main road. The carved walnut wood houseboat was beautiful and the dinner served was delicious home-cooked Wazwan.',
    verified: true,
  },
  {
    id: 'gr-5',
    title: 'Sonmarg Pony Trek',
    guestName: 'Arjun & Friends',
    guestLocation: 'Pune',
    avatarUrl: '/images/reviews/poster_rohit.jpg',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    category: 'offbeat',
    categoryLabel: 'Off-Beat Treks',
    location: 'Thajiwas Glacier, Sonmarg',
    packageBooked: '6D/5N Glacier Trek',
    rating: 5,
    travelDate: 'Aug 2025',
    highlightQuote: 'Sonmarg pony trek was amazing. Raw mountain views.',
    reviewText: 'We rode ponies up toward Thajiwas Glacier. Snow peaks all around and clear mountain streams. Transparent pricing, no hidden surprises.',
    verified: true,
  },
  {
    id: 'gr-6',
    title: 'Quiet Mountain Day',
    guestName: 'Kabir & Sanyukta',
    guestLocation: 'Mumbai',
    avatarUrl: '/images/reviews/poster_ayesha.jpg',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    category: 'offbeat',
    categoryLabel: 'Off-Beat Treks',
    location: 'Doodhpathri Valley',
    packageBooked: '7D/6N Offbeat Kashmir',
    rating: 5,
    travelDate: 'Nov 2025',
    highlightQuote: 'Doodhpathri had zero crowds. Just vast green meadows.',
    reviewText: 'We asked for one offbeat day and they suggested Doodhpathri. Pine trees, cold mountain air, and friendly locals. Exactly what we needed.',
    verified: true,
  },
];
