/* =====================================================================
   Inline text model.

   Document content is stored as plain JavaScript strings - real
   characters, no HTML, no entities - so the wording in src/content is
   readable and diffable and can never carry layout with it.

   A run of text is either:
     * a string, or
     * a segment object { text, href?, bold?, mailto? }

   `toSegments()` normalises either form into a flat segment list that
   <RichText> renders.
   ===================================================================== */

export const REFUND_POLICY_URL = 'https://atlasuniversity.edu.in/refundpolicy/';

const PHRASE = 'Fee Refund Policy';

/**
 * "Fee Refund Policy" + optional punctuation + a click-here prompt.
 * Case-insensitive because the source documents vary between
 * "Please click here", "please click here" and "(Click Here)".
 */
const WITH_PROMPT =
  /(Fee Refund Policy)([.,]?\s*)(\(?\s*(?:please\s+)?click\s+here\s*[.)]*)/gi;

/* ---------------------------------------------------------------------
   PERMANENT RULE - how "Fee Refund Policy" is linked.

   Applied automatically to every term in every fee structure, so the
   treatment can never drift between documents and is never written by
   hand:

     * where the wording already carries a "click here" prompt, that
       prompt is set bold and linked and the words "Fee Refund Policy"
       stay plain;
     * where it does not, "Fee Refund Policy" is itself bold and linked.

   The wording itself is never touched - a prompt is never added, removed
   or reworded.
   --------------------------------------------------------------------- */
export function refundPolicySegments(text) {
  /** Ranges to link, and the phrase ranges a prompt has already spoken for. */
  const links = [];
  const claimed = [];

  WITH_PROMPT.lastIndex = 0;
  let m;
  while ((m = WITH_PROMPT.exec(text)) !== null) {
    const phraseStart = m.index;
    const promptStart = phraseStart + m[1].length + m[2].length;
    claimed.push([phraseStart, phraseStart + m[1].length]);
    links.push([promptStart, promptStart + m[3].length]);
  }

  // Any remaining bare occurrence of the phrase links itself.
  let at = text.indexOf(PHRASE);
  while (at !== -1) {
    const isClaimed = claimed.some(([s]) => s === at);
    if (!isClaimed) links.push([at, at + PHRASE.length]);
    at = text.indexOf(PHRASE, at + PHRASE.length);
  }

  links.sort((a, b) => a[0] - b[0]);

  const out = [];
  let cursor = 0;
  for (const [start, end] of links) {
    if (start < cursor) continue; // overlapping match, already emitted
    if (start > cursor) out.push(text.slice(cursor, start));
    out.push({ text: text.slice(start, end), href: REFUND_POLICY_URL, bold: true });
    cursor = end;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

/**
 * Normalise a value into a segment list.
 *
 * A bare string has the refund-policy rule applied to it. An authored
 * segment list is taken exactly as written - declaring the links by hand
 * is how a passage opts out of the rule.
 *
 * `autoLink: false` turns the rule off entirely. The Fee Refund Policy
 * itself uses that: a document never links to itself, so its own title
 * and the UGC's similarly named notification stay plain, exactly as they
 * do in the approved artwork.
 */
export function toSegments(value, autoLink = true) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return autoLink ? refundPolicySegments(value) : [value];
}
