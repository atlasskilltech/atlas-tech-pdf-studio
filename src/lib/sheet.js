/* =====================================================================
   The sheet: geometry and the one design scale.

   PERMANENT RULE - every ATLAS PDF in this project is built on this
   geometry. One A4 sheet is 210 x 297 mm and everything on it is sized
   from `--u`, a single design constant (1mm by default).

   Because every type size and every vertical space is a multiple of
   `--u`, reducing it scales the whole sheet together. That is how a page
   is fitted to A4: the content is never clipped, never allowed to run
   under the footer and never scaled on its own - the type simply sets a
   little smaller, for every sheet in the set at once, so two documents
   can never end up with different type sizes or spacing.

   Header and footer are fixed furniture. They are sized from `--fu`,
   which never changes, so the bands match on every sheet of every
   document even when a document's body runs at a different `--u`.
   ===================================================================== */

/** A4, in millimetres. */
export const PAGE_W_MM = 210;
export const PAGE_H_MM = 297;

/** Fixed page furniture. */
export const GEOMETRY = {
  margin: '15mm', // left and right margin -> 180mm content column
  headerHeight: '26mm', // header band = lockup height
  headerRule: '1.4mm', // ATLAS indigo rule closing the header
  footerHeight: '22mm', // footer band, accent rule included
  footerAccent: '1.4mm', // school-colour accent above the footer band
  hair: '0.2mm', // hairline rules
  furnitureUnit: '1mm', // --fu: header/footer scale, never reduced
};

/**
 * On a sheet with no header, the band becomes a plain top margin; with no
 * footer, a plain bottom margin. Both come to 16mm, so the content column
 * keeps the same optical inset whichever chrome a page carries.
 */
export const BARE = {
  headerHeight: '14.6mm', // + the 1.4mm rule = 16mm
  footerHeight: '16mm',
};

/**
 * The intended size of the system, and the smallest it may be reduced to.
 * A set is only scaled below `design` if its longest sheet would not
 * otherwise fit.
 */
export const SCALE = { design: 1.0, min: 0.86 };

/** The Fee Refund Policy has fewer blocks per sheet, so it sets larger. */
export const POLICY_SCALE = { design: 1.16, min: 0.86 };

/**
 * The Admissions Policy is dense - a full page of questions and three
 * requirement tables, the tallest with a long numbered list - so it aims
 * for the base scale and is allowed to reduce further if its longest
 * sheet needs it. Every sheet in the set still reduces together.
 */
export const ADMISSIONS_SCALE = { design: 1.0, min: 0.74 };

/**
 * The custom properties that define a sheet. Spread onto the sheet
 * element together with a brand theme.
 */
export function sheetVars({ header = true, footer = true } = {}) {
  return {
    '--u': `${SCALE.design}mm`,
    '--fu': GEOMETRY.furnitureUnit,
    '--m': GEOMETRY.margin,
    '--hair': GEOMETRY.hair,
    '--ph-h': header ? GEOMETRY.headerHeight : BARE.headerHeight,
    '--pf-h': footer ? GEOMETRY.footerHeight : BARE.footerHeight,
  };
}

/* ---------------------------------------------------------------------
   Page chrome.

   PERMANENT RULE - header and footer behaviour is configurable and is
   never assumed. A document declares where its chrome goes; it is not
   repeated on every sheet by default.

     'first'  header on the first sheet only
     'last'   footer on the last sheet only
     'all'    on every sheet
     'none'   never
   --------------------------------------------------------------------- */
export function showsHeader(mode, index) {
  if (mode === 'all') return true;
  if (mode === 'none') return false;
  return index === 0; // 'first'
}

export function showsFooter(mode, index, total) {
  if (mode === 'all') return true;
  if (mode === 'none') return false;
  return index === total - 1; // 'last'
}

/** Page numbers are always derived from the real sheet count. */
export function pageLabel(index, total) {
  const pad = (v) => String(v).padStart(2, '0');
  return `${pad(index + 1)} / ${pad(total)}`;
}
