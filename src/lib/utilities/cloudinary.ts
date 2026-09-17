/**
 * Cloudinary Optimization Helper
 * Automatically injects f_auto, q_auto transformations into any Cloudinary URL
 * if they are not already present.
 */

export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If not a cloudinary URL, return as is
  if (!trimmed.includes('res.cloudinary.com')) {
    return trimmed;
  }

  // 1. Image URLs
  if (trimmed.includes('/image/upload/')) {
    // If it already has f_auto or q_auto, return
    if (trimmed.includes('f_auto') || trimmed.includes('q_auto')) {
      return trimmed;
    }
    // Inject f_auto,q_auto right after /upload/
    return trimmed.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }

  // 2. Video URLs
  if (trimmed.includes('/video/upload/')) {
    if (trimmed.includes('f_auto') || trimmed.includes('q_auto')) {
      return trimmed;
    }
    return trimmed.replace('/video/upload/', '/video/upload/f_auto,q_auto,ac_none/');
  }

  return trimmed;
}

/**
 * Optimizes an array of Cloudinary URLs (for gallery images)
 */
export function optimizeCloudinaryUrls(urls: (string | null | undefined)[]): string[] {
  if (!Array.isArray(urls)) return [];
  return urls
    .map((u) => optimizeCloudinaryUrl(u))
    .filter((u): u is string => Boolean(u && u.length > 0));
}
