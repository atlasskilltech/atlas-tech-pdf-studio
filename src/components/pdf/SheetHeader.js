/* =====================================================================
   The common header.

   PERMANENT RULE - every ATLAS PDF in this project uses THIS header.
   One structure, one height, one alignment, one rule, on every sheet of
   every document. What changes between documents is only the lockup and
   the band colour behind it.

   The supplied lockup carries its own backgrounds and its own clear
   space, so it sits flush in the corner of the band - hard against the
   top, left and bottom edges, at the full band height, with the width
   left free. That is what keeps the artwork at its true proportions: it
   is never stretched, squashed, cropped, recoloured, rotated or given
   any shadow, glow or outline, and the band is set to the colour the
   artwork is drawn in so there is no seam.

   The whole block is the link. The anchor carries the position and
   size, so linking it changes nothing about how the header looks.

   The rule closing the band is ATLAS indigo. A document whose band is
   itself indigo - one with no school branding - takes teal instead, so
   the band is always closed by a visible line of the same weight.

   `fit` is how the lockup meets the band. The default, 'height', is the
   rule above: flush in the corner at full band height, width free. A wide
   horizontal lockup that is drawn for a light background cannot follow it -
   at full band height it would run past the page edge - so such a document
   passes fit='contain': the artwork is set to the content-column width and
   centred in the band, left-aligned to the body margin, so its own clear
   space is kept. It is still never stretched, cropped, recoloured or given
   any shadow. No other document's header changes.
   ===================================================================== */
import { ATLAS } from '@/lib/brand';

export default function SheetHeader({
  logo,
  href,
  band,
  rule = ATLAS.indigo,
  fit = 'height',
}) {
  const contain = fit === 'contain';
  return (
    <>
      <div
        className="absolute left-0 top-0 h-[var(--ph-h)] w-[210mm] overflow-hidden"
        style={band ? { background: band } : undefined}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            contain
              ? 'absolute left-[var(--m)] top-0 flex h-[var(--ph-h)] items-center border-0 no-underline outline-none'
              : 'absolute left-0 top-0 block h-[var(--ph-h)] border-0 no-underline outline-none'
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.alt}
            className={
              contain
                ? 'block h-auto w-[calc(210mm_-_2*var(--m))] max-w-[calc(210mm_-_2*var(--m))]'
                : 'block h-full w-auto max-w-none'
            }
          />
        </a>
      </div>
      {/* The rule that closes the band. */}
      <div
        className="absolute left-0 top-[var(--ph-h)] h-[1.4mm] w-[210mm]"
        style={{ background: rule }}
      />
    </>
  );
}
