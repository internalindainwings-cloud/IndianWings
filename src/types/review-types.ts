export interface VideoReview {
  id: string;
  quote: string;
  name: string;
  city: string;
  duration: string;
  posterUrl: string;
  videoUrl?: string | null;
  featured?: boolean;
}

export interface WrittenReview {
  id: string;
  name: string;
  city: string;
  review: string;
  rating: number; // e.g., 5
  avatarUrl?: string;
}
