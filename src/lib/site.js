/* =====================================================================
   The public address of this application.

   ONE configuration value. Embed codes are handed to people to paste
   into other websites, so they must carry a real public origin - never
   localhost, never a development port, never a filesystem path.

   Set it once, per deployment:

     NEXT_PUBLIC_SITE_URL=https://pdf.atlasuniversity.edu.in

   Until it is set, the studio falls back to the origin the page is being
   served from, and the embed dialog says plainly that the code is not
   ready to paste elsewhere yet.
   ===================================================================== */

/** The configured public origin, trimmed of any trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '')
  .trim()
  .replace(/\/+$/, '');

/** True for an origin that only resolves on the machine serving it. */
export function isLocalOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(
    origin || '',
  );
}

/**
 * The origin to build an embed code from: the configured value if there
 * is one, otherwise whatever origin the studio is open on.
 */
export function resolveOrigin() {
  if (SITE_URL) return SITE_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** The public viewer path for a document. */
export function flipbookPath(docId) {
  return `/flipbook/${docId}`;
}

/** The full public viewer URL for a document. */
export function flipbookUrl(docId, origin = resolveOrigin()) {
  return `${origin}${flipbookPath(docId)}`;
}

/**
 * The iframe an external site pastes in.
 *
 * `width="100%"` so it fills whatever container it lands in - a page
 * template, a WordPress block, a PHP include - and a fixed height,
 * because an iframe cannot size itself to its content across origins.
 */
export function embedCode(docId, { origin = resolveOrigin(), height = 700 } = {}) {
  return [
    '<iframe',
    `  src="${flipbookUrl(docId, origin)}"`,
    '  width="100%"',
    `  height="${height}"`,
    '  style="border:0;"',
    '  allowfullscreen',
    '  loading="lazy">',
    '</iframe>',
  ].join('\n');
}
