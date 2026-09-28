/* =====================================================================
   Turning a laid-out sheet into artwork.

   The sheet is copied, every computed style is written onto the copy,
   and the result is drawn inside an SVG <foreignObject> onto a canvas.
   The browser itself lays the page out, so what the PDF carries is
   exactly what the preview shows - there is no second layout engine to
   disagree with the first.

   Because the copy is styled entirely by inline declarations, no
   ::before / ::after content can be used anywhere on a sheet: generated
   content would not survive the copy. Every mark on a sheet is a real
   element.
   ===================================================================== */
import { collectFontCss } from './fonts';

/** ~288 dpi: sharp in print, sensible file size. */
export const RENDER_SCALE = 3;

/**
 * The declarations copied onto the clone. Anything that affects where a
 * box sits, how big it is, or how its text sets.
 */
const STYLE_PROPS = [
  'display', 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'box-sizing',
  'min-width', 'max-width', 'min-height', 'max-height', 'float', 'clear', 'visibility',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'align-content', 'justify-content', 'order',
  'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows', 'grid-auto-flow', 'grid-column', 'grid-row',
  'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-right-radius', 'border-bottom-left-radius',
  'background-image', 'background-size', 'background-position', 'background-repeat',
  'background-clip', 'background-origin',
  'table-layout', 'border-collapse', 'border-spacing', 'empty-cells',
  'list-style-type', 'list-style-position', 'font-variant-numeric', 'text-indent',
  'object-fit', 'object-position', 'transform', 'transform-origin',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'overflow', 'background-color', 'color', 'opacity', 'z-index', 'vertical-align',
  'font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'font-kerning',
  'font-feature-settings', 'font-variant-ligatures', 'line-height', 'letter-spacing', 'word-spacing',
  'white-space', 'text-align', 'text-transform', 'text-rendering', '-webkit-font-smoothing',
  'text-decoration-line', 'text-decoration-color', 'text-decoration-style', 'text-decoration-thickness',
  'text-underline-offset',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
];

function inlineComputedStyles(source, target) {
  if (source.nodeType !== 1) return;

  const cs = getComputedStyle(source);
  let css = '';
  for (const prop of STYLE_PROPS) {
    const value = cs.getPropertyValue(prop);
    if (value !== '') css += `${prop}:${value};`;
  }
  target.setAttribute('style', css);
  target.removeAttribute('class');

  for (let i = 0; i < source.children.length; i += 1) {
    inlineComputedStyles(source.children[i], target.children[i]);
  }
}

/** Resolves once every image inside `root` has loaded or failed. */
export function whenImagesSettled(root) {
  const images = Array.from(root.querySelectorAll('img'));
  return Promise.all(
    images.map((img) =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
    ),
  );
}

/**
 * Inline every <img> on the clone as a data URI.
 *
 * The lockups are served from /brand, so they are same-origin and could
 * be fetched by the page - but the SVG image the sheet is drawn inside
 * is its own isolated document and cannot load them. Inlining is also
 * what keeps the canvas clean, so the artwork can be read back out.
 */
const assetCache = new Map();

async function inlineImages(root) {
  const images = Array.from(root.querySelectorAll('img'));

  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute('src');
      if (!src || src.startsWith('data:')) return;

      if (!assetCache.has(src)) {
        assetCache.set(
          src,
          (async () => {
            const response = await fetch(src);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          })(),
        );
      }

      try {
        img.setAttribute('src', await assetCache.get(src));
      } catch {
        /* leave the original src; the sheet still draws */
      }
    }),
  );
}

/**
 * Draws one laid-out sheet onto a canvas.
 *
 * `scale` defaults to RENDER_SCALE, the ~288 dpi the PDF export needs.
 * The flipbook viewer passes a smaller one: it is drawing to a screen,
 * not to paper, and a print-resolution canvas per page would cost far
 * more memory than it could ever show.
 */
export async function rasterizeSheet(sheet, scale = RENDER_SCALE) {
  const width = sheet.offsetWidth;
  const height = sheet.offsetHeight;

  const copy = sheet.cloneNode(true);
  inlineComputedStyles(sheet, copy);
  copy.style.margin = '0';
  await inlineImages(copy);

  const fontCss = await collectFontCss();
  const markup = new XMLSerializer().serializeToString(copy);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
    '<div xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">' +
    `<style>${fontCss}</style>${markup}` +
    '</div></foreignObject></svg>';

  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Drawn twice: the first pass activates the embedded fonts inside the
  // SVG image, the second draws the page with them in place.
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  await new Promise((resolve) => {
    setTimeout(resolve, 60);
  });
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Throws if the browser tainted the canvas, so the caller learns now
  // rather than producing a blank PDF.
  canvas.toDataURL('image/png', 0);

  return canvas;
}
