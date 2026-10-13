/**
 * Clean package titles for the paid ads landing page:
 * Strips long secondary poetic names (e.g. Darbar-e-Khaas, Jashn-e-Umr, Kam Kharch, Mehfil-e-Parivar, etc.)
 * leaving concise, high-converting English package titles.
 */
export function cleanPackageTitle(rawTitle: string): string {
  const title = (rawTitle || '').trim();

  if (/corporate/i.test(title)) return 'Corporate Tour Package';
  if (/senior citizen|senior citizan|ashn-e-umr/i.test(title)) return 'Senior Citizen Group Tour';
  if (/pocket-friendly|kam kharch/i.test(title)) return 'Pocket-Friendly Tour Package';
  if (/small family|deewan-e-khaas/i.test(title)) return 'Small Family Tour Package';
  if (/big family|jashn-e-khandaan/i.test(title)) return 'Big Family Tour Package';
  if (/family tour|mehfil-e-parivar/i.test(title)) return 'Family Tour Package';
  if (/friends group|mehfil-e-yaaran/i.test(title)) return 'Friends Group Tour Package';
  if (/honeymoon|shalimar specia/i.test(title)) return 'Honeymoon Special Package';
  if (/gurez valley/i.test(title)) return 'Gurez Valley Tour';
  if (/winter escape/i.test(title)) return 'Kashmir Winter Escape';
  if (/vaishno devi/i.test(title)) return 'Vaishno Devi Tour Package';

  // Fallback: cut off any trailing hyphen, dash, or colon
  const parts = title.split(/[-—–:]/);
  if (parts.length > 1 && parts[0].trim().length > 3) {
    return parts[0].trim();
  }

  return title;
}

export const DEFAULT_PACKAGE_OPTIONS = [
  'Family Tour Package',
  'Honeymoon Special Package',
  'Pocket-Friendly Tour Package',
  'Small Family Tour Package',
  'Big Family Tour Package',
  'Senior Citizen Group Tour',
  'Friends Group Tour Package',
  'Corporate Tour Package',
  'Gurez Valley Tour',
  'Kashmir Winter Escape',
  'Vaishno Devi Tour Package',
  'Customized Itinerary',
];

