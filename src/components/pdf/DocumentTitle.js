/* =====================================================================
   The document title block.

   PERMANENT RULE - every ATLAS PDF opens this way: the programme or
   document name in the display face over a marker in the document's
   brand colour, the scope line beneath it, and a hairline rule closing
   the block. One block, one marker, one rule, one spacing, in every
   document.

   A title may run to several lines - one per programme - and each line
   may carry an abbreviation that sets a little smaller alongside the
   name.

   The `policy` variant changes only the two type roles (a slightly
   smaller title and a teal display scope line). The structure, marker,
   spacing and rule are the same.
   ===================================================================== */
import {
  POLICY_SUBTITLE,
  POLICY_TITLE,
  SUBTITLE,
  TITLE,
  TITLE_ABBR,
} from './tokens';

export default function DocumentTitle({
  lines,
  subtitle,
  variant = 'programme',
  marker = 'brand',
}) {
  const rows = Array.isArray(lines) ? lines : [{ main: lines }];
  const policy = variant === 'policy';
  const titleClass = policy ? POLICY_TITLE : TITLE;
  const subtitleClass = policy ? POLICY_SUBTITLE : SUBTITLE;
  const markerColor = marker === 'accent' ? 'var(--atlas-teal)' : 'var(--brand)';

  return (
    <>
      <div className="flex items-stretch">
        {/* the brand-colour marker */}
        <div
          className="mr-[calc(5*var(--u))] w-[calc(1.5*var(--u))] min-w-[calc(1.5*var(--u))] flex-none rounded-[0.8mm]"
          style={{ background: markerColor }}
        />
        <div className="min-w-0 flex-auto pt-[calc(0.4*var(--u))]">
          {rows.map((line, i) => (
            <div key={i} className={titleClass}>
              {line.main}
              {line.abbr ? (
                <>
                  {' '}
                  <span className={TITLE_ABBR}>{line.abbr}</span>
                </>
              ) : null}
            </div>
          ))}
          {subtitle ? <div className={subtitleClass}>{subtitle}</div> : null}
        </div>
      </div>
      <div className="my-[calc(5.5*var(--u))] h-[var(--hair)] bg-[var(--line)]" />
    </>
  );
}
