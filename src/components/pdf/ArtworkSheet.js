/* =====================================================================
   One A4 sheet that IS supplied artwork.

   For documents that arrive finished and designed (the ISME Challenge
   packs): the page image fills the sheet edge to edge, at its own A4
   proportions, so nothing is cropped, stretched or overlaid. It is still
   a real `data-sheet`, so the viewer, the print route and the flipbook
   treat it exactly like every other sheet.

   It declares its own scale set, which has no entry in SCALE_SETS, so
   the fit pass leaves it alone - there is no flowing content to fit.
   ===================================================================== */

export default function ArtworkSheet({ src, alt }) {
  return (
    <section
      data-sheet=""
      data-scale-set="artwork"
      className="relative h-[297mm] w-[210mm] overflow-hidden bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block h-full w-full select-none"
      />
    </section>
  );
}
