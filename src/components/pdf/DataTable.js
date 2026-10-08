/* =====================================================================
   Data table.

   PERMANENT RULE - a tabular block that is not a fee card (the refund
   schedule, the admissions matrices) uses THIS table: an ATLAS indigo
   header row, hairline-separated rows, column widths taken from the
   column definition, and per-column alignment.

   Header height, row padding, borders, typography and spacing match the
   fee card, so the two read as one system.

   A cell is either a plain string - rendered with its column's alignment,
   exactly as the refund schedule has always been - or, for the richer
   admissions matrices, an object:

     { text }                a body-text cell (string or segment list)
     { head }                a bold row-header cell (the Specialisation column)
     { list: [...] }         a numbered list, its numbers generated here
     colSpan / rowSpan       to merge cells, HTML-table style
     align                   'left' | 'center' | 'right', overriding the column

   Two presentation switches, both defaulting to the refund schedule's
   long-standing behaviour so that document is untouched:

     zebra  (default true)   band every even row
     grid   (default false)  draw hairline separators between columns too,
                             which a multi-column matrix needs to stay legible
   ===================================================================== */
import {
  DATA_LIST_NUMBER,
  DATA_TD,
  DATA_TD_HEAD,
  DATA_TD_INDEX,
  DATA_TD_TEXT,
  DATA_TD_TOP,
  DATA_TD_VALUE,
  DATA_TH,
} from './tokens';
import RichText from './RichText';

/** One cell role per alignment, each carrying exactly one font face. */
const CELL = {
  center: DATA_TD_INDEX,
  right: DATA_TD_VALUE,
};

const GRID_DIVIDER = 'border-l-[length:var(--hair)] border-l-[var(--line)]';

/** A numbered list inside a cell. Numbers are generated, never written. */
function CellList({ items }) {
  return (
    <div className="flex flex-col gap-[calc(1.6*var(--u))]">
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline">
          <span className={DATA_LIST_NUMBER}>{i + 1}.</span>
          <span className={`${DATA_TD_TEXT} min-w-0 flex-auto`}>
            <RichText value={item} autoLink={false} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Resolve a cell (string or object) into its className and contents. */
function renderCell(cell, column, colIndex, grid) {
  const divider = grid && colIndex > 0 ? ` ${GRID_DIVIDER}` : '';

  // The original path: a bare string, aligned by its column.
  if (cell == null || typeof cell === 'string') {
    const role = CELL[column?.align] ?? DATA_TD_TEXT;
    return {
      className: `${DATA_TD} ${role}${divider}`,
      span: {},
      body: cell,
    };
  }

  const { text, head, list, colSpan, rowSpan, align } = cell;
  const span = {
    ...(colSpan ? { colSpan } : null),
    ...(rowSpan ? { rowSpan } : null),
  };

  // A list cell tops its content; a short cell stays vertically centred,
  // which matches how the source stacks a tall column beside a short one.
  if (list) {
    return {
      className: `${DATA_TD_TOP}${divider}`,
      span,
      body: <CellList items={list} />,
    };
  }

  if (head != null) {
    const role = align === 'center' ? `${DATA_TD_HEAD} text-center` : DATA_TD_HEAD;
    return { className: `${DATA_TD} ${role}${divider}`, span, body: head };
  }

  const role = CELL[align] ?? DATA_TD_TEXT;
  return {
    className: `${DATA_TD_TOP} ${role}${divider}`,
    span,
    body: <RichText value={text} autoLink={false} />,
  };
}

export default function DataTable({ columns, rows, zebra = true, grid = false }) {
  return (
    <table className="mt-[calc(6*var(--u))] w-full table-fixed overflow-hidden rounded-[1.6mm] border-[length:var(--hair)] border-[var(--line)] [border-collapse:collapse]">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th
              key={i}
              className={`${DATA_TH}${grid && i > 0 ? ` ${GRID_DIVIDER}` : ''}`}
              style={{ width: col.width }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r} className={zebra && r % 2 === 1 ? 'bg-[#F7FAFB]' : undefined}>
            {row.map((cell, c) => {
              const { className, span, body } = renderCell(cell, columns[c], c, grid);
              return (
                <td key={c} className={className} {...span}>
                  {body}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
