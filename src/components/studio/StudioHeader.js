'use client';

/* =====================================================================
   The studio header.

   Interface furniture, not part of any document. It carries the ATLAS
   lockup at a size that leaves the artwork untouched - fixed height,
   width free - and the one action that applies to the whole collection.
   ===================================================================== */
import { ATLAS_LOCKUP } from '@/lib/brand';

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a1 1 0 011 1v8.59l2.3-2.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.42l2.3 2.3V3a1 1 0 011-1zM3 15a1 1 0 011 1v1h12v-1a1 1 0 112 0v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z" />
    </svg>
  );
}

export default function StudioHeader({ onDownloadAll, busy }) {
  return (
    <header className="bg-[var(--atlas-indigo)] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ATLAS_LOCKUP.src}
          alt={ATLAS_LOCKUP.alt}
          className="h-10 w-auto sm:h-12"
        />
        <div className="mr-auto min-w-0">
          <h1 className="text-base font-bold leading-tight sm:text-lg lg:text-xl">
            Fee Structures 2027&ndash;28
          </h1>
          <p className="text-[0.7rem] leading-snug text-white/75 sm:text-xs lg:text-sm">
            Academic Year 2027&ndash;28 · Intake 27 · Approved by the Fee
            Fixation Committee, 22 September 2026
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadAll}
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[var(--atlas-indigo)] shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <DownloadIcon />
          <span className="sm:hidden">Download all</span>
          <span className="hidden sm:inline">Download All Fee Structures</span>
        </button>
      </div>
    </header>
  );
}
