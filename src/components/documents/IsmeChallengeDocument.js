/* =====================================================================
   The ISME Challenge documents.

   Each page is the supplied artwork, shown exactly as designed - see
   src/content/isme-challenge.js. One ArtworkSheet per page, in order.
   ===================================================================== */
import ArtworkSheet from '@/components/pdf/ArtworkSheet';

export default function ismeChallengeSheets(doc) {
  const total = doc.pages.length;
  return doc.pages.map((src, index) => (
    <ArtworkSheet
      key={src}
      src={src}
      alt={`${doc.docTitle} — page ${index + 1} of ${total}`}
    />
  ));
}
