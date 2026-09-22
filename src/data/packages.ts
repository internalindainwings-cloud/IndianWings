export type PackageCategory = 'family' | 'honeymoon' | 'winter' | 'adventure' | 'classic';

export interface PackageItem {
  id: string;
  title: string;
  duration: string;
  tag: string;
  tagColor?: string | null;
  cardAnimation?: 'none' | 'snow' | 'heart' | null;
  category?: PackageCategory;
  season?: 'winter' | 'spring' | 'summer' | 'autumn';
  imageUrl: string;
  rating: number;
  reviewCount: number;
  destinations: string[];
  inclusions: string[];
  startingPrice: number;
  originalPrice?: number | null;
  priceUnit?: string;
  highlights: string[];
  slug?: string;
  categorySlug?: string;
}

// All active packages are managed in the database via the admin panel.
// No hardcoded dummy packages to prevent flashing on page refresh.
export const featuredPackagesData: PackageItem[] = [];
