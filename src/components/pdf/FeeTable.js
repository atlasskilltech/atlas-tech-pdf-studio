/* =====================================================================
   The fee table.

   PERMANENT RULE - every fee table in every ATLAS PDF is built from
   THIS component. One card: a brand-colour header bar carrying the
   label and, where the block is a single figure, the amount; then
   hairline-separated rows with the label left and a right-aligned
   tabular amount; then, where there is one, a tinted total row closed
   by a brand-colour rule.

   Row height, borders, alignment, typography and spacing are the same
   in every document. Only the colour changes, and it comes from the
   sheet's theme - no school colour appears in this file.
   ===================================================================== */
import {
  ROW_AMOUNT,
  ROW_LABEL,
  SOLO_AMOUNT,
  TABLE_HEAD_AMOUNT,
  TABLE_HEAD_LABEL,
  TOTAL_AMOUNT,
  TOTAL_LABEL,
} from './tokens';

const ROW = 'flex items-baseline px-[calc(4.2*var(--u))]';

function Row({ row }) {
  // A solo row carries an amount with no label, set larger and alone on
  // a tinted band.
  if (row.solo) {
    return (
      <div
        className={`${ROW} justify-end border-t-[length:var(--hair)] border-t-[var(--line-soft)] bg-[var(--t06)] py-[calc(3*var(--u))]`}
      >
        <div className={SOLO_AMOUNT}>{row.amount}</div>
      </div>
    );
  }

  if (row.total) {
    return (
      <div
        className={`${ROW} border-t-[0.4mm] border-t-[var(--brand)] bg-[var(--t10)] py-[calc(2.6*var(--u))]`}
      >
        <div className={TOTAL_LABEL}>{row.label}</div>
        <div className={TOTAL_AMOUNT}>{row.amount}</div>
      </div>
    );
  }

  return (
    <div
      className={`${ROW} border-t-[length:var(--hair)] border-t-[var(--line-soft)] py-[calc(2.6*var(--u))] first:border-t-0`}
    >
      <div className={ROW_LABEL}>{row.label}</div>
      <div className={ROW_AMOUNT}>{row.amount}</div>
    </div>
  );
}

/** The gap between stacked fee tables, applied by the group below. */
export function FeeTableGroup({ children }) {
  return (
    <div className="flex flex-col gap-[calc(3.8*var(--u))]">{children}</div>
  );
}

export default function FeeTable({ head, headAmount, rows = [] }) {
  return (
    <div className="overflow-hidden rounded-[1.6mm] border-[length:var(--hair)] border-[var(--line)] bg-white">
      <div className="flex items-center bg-[var(--deep)] px-[calc(4.2*var(--u))] py-[calc(2.3*var(--u))] text-white">
        <div className={TABLE_HEAD_LABEL}>{head}</div>
        {headAmount ? (
          <div className={TABLE_HEAD_AMOUNT}>{headAmount}</div>
        ) : null}
      </div>
      {rows.map((row, i) => (
        <Row key={i} row={row} />
      ))}
    </div>
  );
}
