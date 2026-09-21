export interface GalleryCategory {
  id: string;
  name: string;
  icon?: string;
  sortOrder?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  posterUrl: string;
  category: string;
  categoryLabel: string;
  location: string;
  duration?: string;
  caption?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: 'all', name: 'All Media', icon: '✨', sortOrder: 1 },
  { id: 'gulmarg', name: 'Gulmarg & Snow', icon: '❄️', sortOrder: 2 },
  { id: 'dal-lake', name: 'Dal Lake & Houseboats', icon: '⛵', sortOrder: 3 },
  { id: 'pahalgam', name: 'Pahalgam Valleys', icon: '🌲', sortOrder: 4 },
  { id: 'sonmarg', name: 'Sonmarg & Glaciers', icon: '🏔️', sortOrder: 5 },
  { id: 'gurez', name: 'Gurez & Offbeat', icon: '🌿', sortOrder: 6 },
  { id: 'pilgrimage', name: 'Pilgrimage & Spiritual', icon: '🕉️', sortOrder: 7 },
  { id: 'ladakh', name: 'Ladakh & High Passes', icon: '🏍️', sortOrder: 8 },
  { id: 'adventure', name: 'Adventure & Sports', icon: '🎿', sortOrder: 9 },
  { id: 'reviews', name: 'Traveller Moments', icon: '🎥', sortOrder: 10 },
];
