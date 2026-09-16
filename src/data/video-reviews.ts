import { VideoReview } from '../types/review-types';

// NOTE: These are development placeholders. 
// "Ayesha Khan, Delhi" etc. are NOT real clients yet.
// When real client videos arrive, replace this data.
// Do not claim these are genuine customer testimonials in the UI.

export const videoReviews: VideoReview[] = [
  {
    id: 'vid-1',
    quote: '"An unforgettable Kashmir experience!"',
    name: 'Ayesha Khan',
    city: 'Delhi',
    duration: '02:14',
    posterUrl: '/images/reviews/poster_ayesha.jpg', 
    videoUrl: '/videos/review_demo.mp4',
    featured: true
  },
  {
    id: 'vid-2',
    quote: '"Perfectly planned and hassle-free trip."',
    name: 'Rohit Mehta',
    city: 'Mumbai',
    duration: '01:38',
    posterUrl: '/images/reviews/poster_rohit.jpg',
    videoUrl: '/videos/review_demo.mp4',
    featured: false
  },
  {
    id: 'vid-3',
    quote: '"Kashmir is even more beautiful than we imagined!"',
    name: 'Sneha & Friends',
    city: 'Bangalore',
    duration: '01:57',
    posterUrl: '/images/reviews/poster_sneha.jpg',
    videoUrl: '/videos/review_demo.mp4',
    featured: false
  }
];
