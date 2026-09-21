import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import type { GalleryItem } from '@/lib/gallery-service';
import { getAllGalleryItems } from '@/lib/gallery-service';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'gallery-items.json');

interface CloudinaryConfig {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  authHeader: string;
}

function getCloudinaryConfig(): CloudinaryConfig | null {
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Fallback: extract credentials from CLOUDINARY_URL if separate variables are not set
  if ((!apiKey || !apiSecret || !cloudName) && process.env.CLOUDINARY_URL) {
    try {
      const sanitizedUrl = process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://');
      const parsed = new URL(sanitizedUrl);
      if (!apiKey && parsed.username) {
        apiKey = decodeURIComponent(parsed.username).replace(/^[<]+|[>]+$/g, '');
      }
      if (!apiSecret && parsed.password) {
        apiSecret = decodeURIComponent(parsed.password).replace(/^[<]+|[>]+$/g, '');
      }
      if (!cloudName && parsed.hostname) {
        cloudName = parsed.hostname;
      }
    } catch {
      // Ignore parse failure; validation below will flag missing parameters
    }
  }

  if (!apiKey || !apiSecret || !cloudName) {
    return null;
  }

  return {
    apiKey,
    apiSecret,
    cloudName,
    authHeader: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
  };
}

function fetchCloudinary(type: 'image' | 'video', config: CloudinaryConfig): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${config.cloudName}/resources/${type}?max_results=100`,
      method: 'GET',
      headers: { Authorization: config.authHeader },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.resources || []);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function optimizeUrl(url: string, isVideo = false) {
  if (!url) return '';
  if (isVideo) {
    if (url.includes('/video/upload/')) {
      if (url.includes('f_auto') || url.includes('q_auto')) return url;
      return url.replace('/video/upload/', '/video/upload/f_auto,q_auto,ac_none/');
    }
  } else {
    if (url.includes('/image/upload/')) {
      if (url.includes('f_auto') || url.includes('q_auto')) return url;
      return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
    }
  }
  return url;
}

function detectMeta(publicId: string, isVideo = false) {
  const lower = publicId.toLowerCase();

  if (lower.includes('amarnath') || lower.includes('amartnath')) {
    return {
      title: 'Holy Cave Shrine & Amarnath Yatra',
      category: 'pilgrimage',
      categoryLabel: 'Pilgrimage & Spiritual',
      location: 'Amarnath Valley',
    };
  }
  if (lower.includes('temple') || lower.includes('vishnav') || lower.includes('vaishno')) {
    return {
      title: 'Mata Vaishno Devi Bhawan & Trikuta Hills',
      category: 'pilgrimage',
      categoryLabel: 'Pilgrimage & Spiritual',
      location: 'Katra, Jammu',
    };
  }
  if (lower.includes('ladakh')) {
    return {
      title: 'Ladakh High Altitude Mountain Passes',
      category: 'ladakh',
      categoryLabel: 'Ladakh & High Passes',
      location: 'Ladakh, Himalayas',
    };
  }
  if (lower.includes('shikaar') || lower.includes('shikara') || lower.includes('sunset') || lower.includes('dal_lake')) {
    return {
      title: 'Golden Shikara at Himalayan Sunrise',
      category: 'dal-lake',
      categoryLabel: 'Dal Lake & Houseboats',
      location: 'Dal Lake, Srinagar',
    };
  }
  if (lower.includes('gulmarg') || lower.includes('snow') || lower.includes('pk1')) {
    return {
      title: 'Gulmarg Gondola & Snow Peaks',
      category: 'gulmarg',
      categoryLabel: 'Gulmarg & Snow',
      location: 'Gulmarg Valley',
    };
  }
  if (lower.includes('pahalgam')) {
    return {
      title: 'Pahalgam Pine Valley & Lidder River',
      category: 'pahalgam',
      categoryLabel: 'Pahalgam Valleys',
      location: 'Pahalgam',
    };
  }
  if (lower.includes('gurez')) {
    return {
      title: 'Habba Khatoon Peak & Gurez Valley',
      category: 'gurez',
      categoryLabel: 'Gurez & Offbeat',
      location: 'Gurez Valley',
    };
  }
  if (lower.includes('adv') || lower.includes('transport')) {
    return {
      title: lower.includes('adv') ? 'Mountain Adventure Activities' : 'Kashmir Scenic Highway Fleet',
      category: 'adventure',
      categoryLabel: 'Adventure & Sports',
      location: 'Kashmir Valley',
    };
  }
  if (lower.includes('bucket') || lower.includes('dest_hero') || lower.includes('kashmir') || lower.includes('pk_hero')) {
    return {
      title: 'Majestic Kashmir Valley Landscape',
      category: 'dal-lake',
      categoryLabel: 'Dal Lake & Houseboats',
      location: 'Srinagar, Kashmir',
    };
  }
  if (isVideo || lower.includes('video') || lower.includes('testimonial')) {
    return {
      title: lower.includes('testimonial') ? 'Guest Video Testimonial' : 'Kashmir Traveller Reel',
      category: 'reviews',
      categoryLabel: 'Traveller Moments',
      location: 'Kashmir',
    };
  }
  return {
    title: publicId.replace(/[_-]+/g, ' ').replace(/(chatgpt image|whatsapp image|sep 18 2026|pm|am)/gi, '').trim() || 'Kashmir Valley Capture',
    category: 'gulmarg',
    categoryLabel: 'Gulmarg & Snow',
    location: 'Kashmir, India',
  };
}

export async function POST() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Guard: filesystem writes are not persistent in serverless/production environments.
    // Vercel and Cloud Run mount the build artifact as a read-only layer — writes
    // succeed locally but are silently lost on the next cold start.
    // Migrate gallery data to the database (Prisma) to enable this feature in production.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error:
            'sync-cloudinary uses a local JSON filesystem write that is not persistent in production. ' +
            'Migrate gallery items to the PostgreSQL database to use this feature in production.',
        },
        { status: 501 }
      );
    }

    const config = getCloudinaryConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'Cloudinary server configuration is missing. Set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and CLOUDINARY_CLOUD_NAME (or CLOUDINARY_URL).' },
        { status: 500 }
      );
    }

    const [images, videos] = await Promise.all([
      fetchCloudinary('image', config),
      fetchCloudinary('video', config),
    ]);

    const existingItems = await getAllGalleryItems();
    const existingIds = new Set(existingItems.map((i) => i.id));
    const newItems: GalleryItem[] = [];

    // Filter out demo samples like samples/waves or cld-sample
    const filteredImages = images.filter(
      (img: any) => !img.public_id.startsWith('samples/') && !img.public_id.startsWith('cld-sample')
    );
    const filteredVideos = videos.filter((vid: any) => !vid.public_id.startsWith('samples/'));

    // Process Videos
    for (const v of filteredVideos) {
      const id = `cld-v-${v.public_id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      if (!existingIds.has(id)) {
        const meta = detectMeta(v.public_id, true);
        const poster = v.secure_url
          .replace('/video/upload/', '/video/upload/so_1,f_auto,q_auto/')
          .replace(/\.[^/.]+$/, '.jpg');

        newItems.push({
          id,
          title: meta.title,
          type: 'video',
          url: optimizeUrl(v.secure_url, true),
          posterUrl: optimizeUrl(poster, false),
          category: meta.category,
          categoryLabel: meta.categoryLabel,
          location: meta.location,
          duration: '0:25',
          caption: 'Real mountain moment captured by our guests.',
          isFeatured: true,
          isActive: true,
          createdAt: v.created_at || new Date().toISOString(),
        });
      }
    }

    // Process Images
    for (const img of filteredImages) {
      const id = `cld-i-${img.public_id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      if (!existingIds.has(id)) {
        const meta = detectMeta(img.public_id, false);
        newItems.push({
          id,
          title: meta.title,
          type: 'image',
          url: optimizeUrl(img.secure_url, false),
          posterUrl: optimizeUrl(img.secure_url, false),
          category: meta.category,
          categoryLabel: meta.categoryLabel,
          location: meta.location,
          caption: 'Spectacular scenery and authentic hospitality in Kashmir.',
          isFeatured: false,
          isActive: true,
          createdAt: img.created_at || new Date().toISOString(),
        });
      }
    }

    const merged = [...newItems, ...existingItems];
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');

    try {
      revalidateTag('gallery', 'max');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({
      success: true,
      addedCount: newItems.length,
      totalCount: merged.length,
    });
  } catch (err) {
    console.error('[API /api/admin/gallery/sync-cloudinary POST] Error:', err);
    return NextResponse.json({ error: 'Failed to sync Cloudinary media' }, { status: 500 });
  }
}
