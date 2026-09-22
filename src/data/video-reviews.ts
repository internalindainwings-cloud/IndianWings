import { VideoReview } from '../types/review-types';

// NOTE: These are development placeholders. 
// "Ayesha Khan, Delhi" etc. are NOT real clients yet.
// When real client videos arrive, replace this data.
// Do not claim these are genuine customer testimonials in the UI.

export const videoReviews: VideoReview[] = [
  {
    id: 'vid-1',
    quote: '"An unforgettable Kashmir experience!"',
    name: 'MLM Group',
    city: 'Delhi',
    duration: '00:16',
    posterUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/so_1,f_auto,q_auto/v1790102607/WhatsApp_Video_2026-09-23_at_12.03.11_AM.jpg', 
    videoUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/v1790102607/WhatsApp_Video_2026-09-23_at_12.03.11_AM.mp4',
    featured: true
  },
  {
    id: 'vid-2',
    quote: '"Perfectly planned and hassle-free trip."',
    name: 'Rohit Mehta',
    city: 'Mumbai',
    duration: '00:22',
    posterUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/so_1,f_auto,q_auto/v1789745343/WhatsApp_Video_2026-09-18_at_2.16.16_AM.jpg',
    videoUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/v1789745343/WhatsApp_Video_2026-09-18_at_2.16.16_AM.mp4',
    featured: false
  },
  {
    id: 'vid-3',
    quote: '"Kashmir is even more beautiful than we imagined!"',
    name: 'Sneha & Friends',
    city: 'Bangalore',
    duration: '01:57',
    posterUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/so_1,f_auto,q_auto/v1790102418/Video_Project_2.jpg',
    videoUrl: 'https://res.cloudinary.com/wmwdypan/video/upload/v1790102418/Video_Project_2.mp4',
    featured: false
  }
];
