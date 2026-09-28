/* =====================================================================
   Fitting sheets to A4.

   PERMANENT RULE - a page can never overflow, clip or run under the
   footer, and no document is ever scaled on its own.

   Sheets fit as a SET. For each set this finds the largest `--u` at
   which EVERY sheet in it still fits, and applies that one value to all
   of them. Two documents in a set can therefore differ in how much
   blank space is left above the footer - which is just how much
   approved content each one has - but never in type size, spacing or
   alignment.

   Nothing here knows what a document contains. It measures the laid-out
   content column against the space available and bisects.
   ===================================================================== */

/** How much room is left in a sheet's content column, in pixels. */
export function slackOf(sheet) {
  const body = sheet.querySelector('[data-sheet-body]');
  if (!body) return Infinity;
  const content = body.querySelector('[data-sheet-content]');
  if (!content) return Infinity;

  const cs = getComputedStyle(body);
  const available =
    body.clientHeight -
    parseFloat(cs.paddingTop) -
    parseFloat(cs.paddingBottom);
  return available - content.getBoundingClientRect().height;
}

function setUnit(sheets, u) {
  for (const sheet of sheets) {
    sheet.style.setProperty('--u', `${u.toFixed(4)}mm`);
  }
}

function allFit(sheets, u) {
  setUnit(sheets, u);
  return sheets.every((sheet) => slackOf(sheet) >= 0.5);
}

/**
 * Fit one set of sheets. Returns the unit applied.
 * The set is only reduced below its design scale if its longest sheet
 * would not otherwise fit, and then every sheet reduces with it.
 */
export function fitSet(sheets, { design, min }) {
  if (!sheets.length) return design;

  if (allFit(sheets, design)) return design;

  let lo = min;
  let hi = design;
  for (let i = 0; i < 10; i += 1) {
    const mid = (lo + hi) / 2;
    if (allFit(sheets, mid)) lo = mid;
    else hi = mid;
  }

  setUnit(sheets, lo);
  if (allFit(sheets, lo)) return lo;

  setUnit(sheets, min);
  console.warn(
    `A sheet still overflows at the smallest allowed scale (${min}mm). ` +
      'Shorten the content or lower the minimum.',
  );
  return min;
}

/**
 * Fit every set inside `root`. Sheets declare their set with
 * `data-scale-set`; `scales` maps a set name to its { design, min }.
 *
 * Returns the unit each set settled on, so the same value can be handed
 * to any other copy of those sheets - the on-screen viewer, say -
 * without measuring them a second time.
 */
export function fitAll(root, scales) {
  if (!root) return {};

  const sheets = Array.from(root.querySelectorAll('[data-sheet]'));
  const bySet = new Map();
  for (const sheet of sheets) {
    const key = sheet.dataset.scaleSet || 'default';
    if (!bySet.has(key)) bySet.set(key, []);
    bySet.get(key).push(sheet);
  }

  const units = {};
  for (const [key, group] of bySet) {
    const scale = scales[key];
    if (!scale) continue;
    units[key] = fitSet(group, scale);
  }

  const report = Object.entries(units)
    .map(([key, u]) => `${key} --u=${u.toFixed(4)}mm`)
    .join(', ');
  if (report) console.info(`Sheets fitted: ${report}`);

  return units;
}

/** Resolves once webfonts are active and every image has settled. */
export function whenRenderable(root) {
  const fonts =
    typeof document !== 'undefined' && document.fonts
      ? document.fonts.ready
      : Promise.resolve();

  return fonts.then(() => {
    if (!root) return undefined;
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
  });
}
