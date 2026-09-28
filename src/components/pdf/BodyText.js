/* =====================================================================
   Body copy.

   PERMANENT RULE - running paragraphs on an ATLAS sheet use this one
   role: one size, one line-height, one colour, one gap between
   paragraphs. `lead` sets a paragraph a shade heavier and darker; it
   changes nothing else.
   ===================================================================== */
import RichText from './RichText';
import { BODY_LEAD, BODY_TEXT } from './tokens';

export default function BodyText({ value, lead = false, autoLink = true, className = '' }) {
  return (
    <p className={`${BODY_TEXT} ${lead ? BODY_LEAD : ''} ${className}`}>
      <RichText value={value} autoLink={autoLink} />
    </p>
  );
}
