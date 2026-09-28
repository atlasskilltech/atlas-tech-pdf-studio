'use client';

/* =====================================================================
   A document in the list.

   One fixed card structure for every document: a colour swatch, the
   programme over its page count, then the two actions. The text block
   always reserves its space, so cards stay the same height and the
   buttons line up however long the names run.

   The card names the PROGRAMME and nothing more - the school and the
   level are already the headings it sits under, and repeating them here
   would say the same thing three times.
   ===================================================================== */

export default function DocumentCard({ entry, pages, selected, onView, onDownload, busy }) {
  const pageLabel = pages ? `${pages} ${pages === 1 ? 'page' : 'pages'}` : null;

  return (
    <li
      className={`flex flex-col rounded-lg border bg-white p-4 shadow-sm transition ${
        selected
          ? 'border-[var(--atlas-indigo)] ring-2 ring-[var(--atlas-indigo)]'
          : 'border-slate-200'
      }`}
    >
      <div className="flex min-h-14 items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1.5 h-3 w-3 flex-none rounded-sm"
          style={{ background: entry.accent }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5 text-[var(--atlas-indigo)] sm:text-base sm:leading-6">
            {entry.programme}
          </p>
          {pageLabel ? (
            <p className="text-xs leading-4 text-slate-500">{pageLabel}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onView}
          aria-pressed={selected}
          className="flex h-9 items-center justify-center rounded-md border border-[var(--atlas-indigo)]/30 px-3 text-sm font-semibold text-[var(--atlas-indigo)] transition hover:bg-[var(--atlas-indigo)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)]"
        >
          View
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={busy}
          className="flex h-9 items-center justify-center rounded-md border border-[var(--atlas-indigo)] bg-[var(--atlas-indigo)] px-3 text-sm font-semibold text-white transition hover:bg-[var(--atlas-indigo)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          PDF
        </button>
      </div>
    </li>
  );
}
