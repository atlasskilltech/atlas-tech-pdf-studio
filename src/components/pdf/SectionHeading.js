/* =====================================================================
   Section heading.

   PERMANENT RULE - every section on an ATLAS sheet is announced the
   same way: the heading in the display face over a short brand-colour
   rule. One size, one weight, one rule length, in every document.
   ===================================================================== */
import { SECTION_HEADING } from './tokens';

export default function SectionHeading({ children, size = 'default' }) {
  // A policy sets its heading a shade larger and in indigo; everything
  // else about the block is identical.
  const heading =
    size === 'policy'
      ? `${SECTION_HEADING} text-[calc(6*var(--u))] tracking-[0.01em] text-[var(--atlas-indigo)]`
      : SECTION_HEADING;

  return (
    <>
      <div className={heading}>{children}</div>
      <div className="mt-[calc(2.2*var(--u))] h-[0.7mm] w-[calc(13*var(--u))] rounded-[0.5mm] bg-[var(--brand)]" />
    </>
  );
}
