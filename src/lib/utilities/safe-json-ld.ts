/**
 * Safely serializes an object into a JSON string suitable for inclusion
 * inside an HTML <script type="application/ld+json"> tag.
 *
 * Replaces '<', '>', '&', and line separators with unicode escapes to prevent
 * HTML parser breakouts (such as `</script>`) without corrupting valid JSON.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
