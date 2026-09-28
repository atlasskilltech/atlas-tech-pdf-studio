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
/** Escape a string for use inside a double-quoted HTML attribute. */
function attr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The iframe an external site pastes in.
 *
 * It has to stand on its own: dropped into an otherwise empty .html or
 * .php file, with no wrapper, no stylesheet and no script, it should
 * give a full-viewport flipbook and raise no scrollbars. Every rule it
 * needs therefore travels in the tag itself.
 *
 *   display:block  an iframe is inline by default, and the line box
 *                  under it adds about 4px - enough on its own to start
 *                  the page scrolling.
 *
 *   width:100%     fills whatever it lands in: a bare body, a WordPress
 *                  block, a responsive column.
 *
 *   height:calc(100dvh - 16px)
 *                  the viewport, less the 8px top and bottom margin
 *                  every browser puts on <body> by default. Without that
 *                  subtraction a 100dvh frame is 16px taller than the
 *                  room it has, and the host page scrolls. A site that
 *                  resets its margins simply gets a frame 16px short of
 *                  the viewport, which also raises no scrollbar.
 *                  `dvh` rather than `vh` so it tracks a mobile
 *                  browser's address bar sliding in and out; the `vh`
 *                  line before it is the fallback for anything that does
 *                  not know dynamic viewport units, which drops the
 *                  declaration it cannot parse and keeps the one it can.
 */
export function embedCode(
  docId,
  { origin = resolveOrigin(), title = '' } = {},
) {
  return [
    '<iframe',
    `  src="${flipbookUrl(docId, origin)}"`,
    ...(title ? [`  title="${attr(title)}"`] : []),
    '  width="100%"',
    '  style="display:block;width:100%;height:calc(100vh - 16px);height:calc(100dvh - 16px);border:0"',
    '  allow="fullscreen"',
    '  allowfullscreen',
    '  loading="lazy">',
    '</iframe>',
  ].join('\n');
}
