/* =====================================================================
   Data table.

   PERMANENT RULE - a tabular block that is not a fee card (the refund
   schedule, for instance) uses THIS table: an ATLAS indigo header row,
   hairline-separated rows banded on the even row, column widths taken
   from the column definition, and per-column alignment.

   Header height, row padding, borders, typography and spacing match the
   fee card, so the two read as one system.
   ===================================================================== */
import {
  DATA_TD,
  DATA_TD_INDEX,
  DATA_TD_TEXT,
  DATA_TD_VALUE,
  DATA_TH,
} from './tokens';

/** One cell role per alignment, each carrying exactly one font face. */
const CELL = {
  center: DATA_TD_INDEX,
  right: DATA_TD_VALUE,
};

export default function DataTable({ columns, rows }) {
  return (
    <table className="mt-[calc(6*var(--u))] w-full table-fixed overflow-hidden rounded-[1.6mm] border-[length:var(--hair)] border-[var(--line)] [border-collapse:collapse]">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} className={DATA_TH} style={{ width: col.width }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r} className={r % 2 === 1 ? 'bg-[#F7FAFB]' : undefined}>
            {row.map((cell, c) => (
              <td
                key={c}
                className={`${DATA_TD} ${CELL[columns[c]?.align] ?? DATA_TD_TEXT}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
