export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

/**
 * Generates an SEO-friendly URL slug from a package title and duration.
 * Safe for both client and server components.
 */
export function generatePackageSlug(title: string, duration?: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  if (!duration) return base;
  const durMatch = duration.match(/(\d+)\s*D(?:ays?)?\s*\/?\s*(\d+)\s*N(?:ights?)?/i);
  if (durMatch) {
    return `${base}-${durMatch[1]}d-${durMatch[2]}n`;
  }
  return base;
}

export function getCategoryLabel(categorySlugOrTag?: string | null): string {
  const cat = (categorySlugOrTag || '').toLowerCase();
  if (cat.includes('honeymoon')) return 'Romantic Honeymoon';
  if (cat.includes('winter') || cat.includes('ski')) return 'Winter Snow & Skiing';
  if (cat.includes('offbeat') || cat.includes('expedition')) return 'Off-Beat Expedition';
  if (cat.includes('family') || cat.includes('heritage')) return 'Family & Classic Heritage';
  return 'Family & Classic Heritage';
}

export function getBestForLabel(categorySlugOrTag?: string | null): string {
  const cat = (categorySlugOrTag || '').toLowerCase();
  if (cat.includes('honeymoon')) return 'Couples & Honeymooners';
  if (cat.includes('winter') || cat.includes('ski')) return 'Snow Lovers, Skiers & Adventure Seekers';
  if (cat.includes('offbeat') || cat.includes('expedition')) return 'Trekkers, Explorers & Nature Enthusiasts';
  return 'Families, Couples & Small Groups';
}
