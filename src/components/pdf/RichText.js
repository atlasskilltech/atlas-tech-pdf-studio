/* =====================================================================
   Inline text on a sheet.

   Renders a string or a segment list (see lib/rich-text.js). Links on a
   sheet keep the colour of the text they sit in and carry no underline;
   only `tone: 'accent'` departs from that, for the teal links inside the
   policy body. Every anchor here becomes a real clickable annotation in
   the exported PDF.
   ===================================================================== */
import { toSegments } from '@/lib/rich-text';

const LINK = 'text-inherit no-underline';
const ACCENT = 'font-bold text-[var(--atlas-teal)] no-underline';

export default function RichText({ value, autoLink = true }) {
  const segments = toSegments(value, autoLink);

  return segments.map((segment, i) => {
    if (typeof segment === 'string') return segment;

    const { text, href, mailto, bold, tone } = segment;
    const body = bold ? <b className="font-bold">{text}</b> : text;
    const url = mailto ? `mailto:${mailto}` : href;

    if (!url) return <span key={i}>{body}</span>;

    return (
      <a
        key={i}
        href={url}
        className={tone === 'accent' ? ACCENT : LINK}
        target={mailto ? undefined : '_blank'}
        rel={mailto ? undefined : 'noopener noreferrer'}
      >
        {body}
      </a>
    );
  });
}
