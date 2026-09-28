/* =====================================================================
   Footnotes.

   PERMANENT RULE - the small print under a table sets the same way in
   every ATLAS PDF: one size, one line-height, one colour, one gap.
   ===================================================================== */
import RichText from './RichText';
import { NOTE } from './tokens';

export default function Notes({ notes = [], autoLink = true }) {
  if (!notes.length) return null;

  return (
    <div className="mt-[calc(3.2*var(--u))] flex flex-col gap-[calc(1.1*var(--u))]">
      {notes.map((note, i) => (
        <div key={i} className={NOTE}>
          <RichText value={note} autoLink={autoLink} />
        </div>
      ))}
    </div>
  );
}
