/* =====================================================================
   One A4 sheet.

   Pages are laid out in normal document flow, not at absolute
   coordinates, so the browser preview and the exported PDF come from
   the same layout pass and cannot disagree.

   No ::before / ::after content is used anywhere inside a sheet: the PDF
   exporter clones the page and inlines computed styles, and generated
   content would not survive that. Every mark on the sheet is a real
   element.

   A sheet takes its chrome from the document's page rules, so a header
   or footer is only ever drawn where that document says it should be.
   Where a band is absent it becomes a plain margin of the same optical
   depth, so the content column never shifts.
   ===================================================================== */
import SheetHeader from './SheetHeader';
import SheetFooter from './SheetFooter';
import { sheetVars } from '@/lib/sheet';

export default function Sheet({
  theme,
  header,
  footer,
  pageLabel,
  // Sheets fit as a set: every sheet carrying the same `scaleSet` is
  // given one `--u`, so no document in a set can end up with type or
  // spacing different from the rest.
  scaleSet = 'default',
  // The unit this sheet's set settled on, once it has been fitted. Any
  // other copy of the same sheets is given the value rather than being
  // measured again.
  unit,
  className = '',
  children,
}) {
  const vars = {
    ...sheetVars({ header: Boolean(header), footer: Boolean(footer) }),
    ...theme,
    ...(unit ? { '--u': `${unit.toFixed(4)}mm` } : null),
  };

  return (
    <section
      data-sheet=""
      data-scale-set={scaleSet}
      style={vars}
      className={`relative h-[297mm] w-[210mm] overflow-hidden bg-white font-[family-name:var(--font-text)] font-normal text-[var(--ink)] [text-rendering:geometricPrecision] [font-kerning:normal] ${className}`}
    >
      {header ? <SheetHeader {...header} /> : null}

      <div
        className="absolute left-0 top-[calc(var(--ph-h)_+_1.4mm)] h-[calc(297mm_-_var(--ph-h)_-_1.4mm_-_var(--pf-h))] w-[210mm] px-[var(--m)] pb-[calc(6*var(--u))] pt-[calc(8.5*var(--u))]"
        data-sheet-body=""
      >
        {/* Measured by the fit pass: its height against the column above. */}
        <div data-sheet-content="">{children}</div>
      </div>

      {footer ? (
        <SheetFooter {...footer} pageLabel={pageLabel} />
      ) : null}
    </section>
  );
}
