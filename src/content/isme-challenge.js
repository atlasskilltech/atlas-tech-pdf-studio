/* =====================================================================
   The ATLAS | ISME Challenge - case documents.
   CONTENT.

   These five documents are supplied as finished, designed PDFs: the
   Instructions sheet and the four stage packs (the Nexus letters and the
   guide books, research notes and budget sheets that go with them). They
   are reproduced EXACTLY as supplied - every page is the supplied
   artwork, drawn at print resolution, and "Download PDF" saves the
   supplied file itself. Nothing in them is retyped, redrawn or restyled,
   so they carry their own design and none of the common sheet chrome.

   The page artwork and the original PDFs are produced from the supplied
   files by scripts/isme-challenge-pages.py, into public/isme-challenge/.
   `pages` must match the page count that script reports.

   The names below are this studio's labels for the documents; the
   wording ON the pages is the artwork's own.
   ===================================================================== */

/** Where the supplied artwork is served from. */
const ROOT = '/isme-challenge';

function challengeDoc({ id, file, cardName, docTitle, pages }) {
  return {
    id,
    kind: 'isme-challenge',
    file,
    cardName,
    cardScope: 'ISME Challenge',
    docTitle,
    // The supplied PDF, saved as-is by "Download PDF".
    source: `${ROOT}/${id}.pdf`,
    // One image per page, in page order.
    pages: Array.from(
      { length: pages },
      (_, i) => `${ROOT}/${id}/page-${String(i + 1).padStart(2, '0')}.jpg`,
    ),
  };
}

export const ISME_CHALLENGE = [
  challengeDoc({
    id: 'isme-challenge-instructions',
    file: 'isme-challenge-instructions.pdf',
    cardName: 'ISME Challenge Instructions',
    docTitle: 'ISME Challenge — Instructions',
    pages: 1,
  }),
  challengeDoc({
    id: 'isme-challenge-stage-1',
    file: 'isme-challenge-stage-1.pdf',
    cardName: 'Stage 1',
    docTitle: 'ISME Challenge — Stage 1: Startup Conceptualisation',
    pages: 12,
  }),
  challengeDoc({
    id: 'isme-challenge-stage-2',
    file: 'isme-challenge-stage-2.pdf',
    cardName: 'Stage 2',
    docTitle: 'ISME Challenge — Stage 2: Platform Budgeting',
    pages: 4,
  }),
  challengeDoc({
    id: 'isme-challenge-stage-3',
    file: 'isme-challenge-stage-3.pdf',
    cardName: 'Stage 3',
    docTitle: 'ISME Challenge — Stage 3: Digital Go-to-Market Strategy',
    pages: 3,
  }),
  challengeDoc({
    id: 'isme-challenge-stage-4',
    file: 'isme-challenge-stage-4.pdf',
    cardName: 'Stage 4',
    docTitle: 'ISME Challenge — Stage 4: A New Competitor',
    pages: 2,
  }),
];
