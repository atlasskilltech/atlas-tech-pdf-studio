'use client';

/* =====================================================================
   The studio header.

   Interface furniture, not part of any document: this is the product's
   own branding, not the university's. It carries the ATLAS Tech PDF
   Studio lockup at a size that leaves the artwork untouched - fixed
   height, width free - the line describing the collection below it, and
   the one action that applies to the whole collection.

   The lockup already sets the product's name in type, so the <h1>
   beside it would only repeat what the image says; it is kept for
   structure and read by screen readers instead.
   ===================================================================== */
import { PRODUCT } from '@/lib/product';

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
        <h1 className="flex-none">
          <span className="sr-only">{PRODUCT.name}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PRODUCT.logo.src}
            width={PRODUCT.logo.width}
            height={PRODUCT.logo.height}
            alt={PRODUCT.logo.alt}
            className="h-10 w-auto sm:h-12"
          />
        </h1>
        <p className="mr-auto min-w-0 text-[0.7rem] leading-snug text-white/75 sm:text-xs lg:text-sm">
         Create · Manage · Preview & Share Professional PDFs
        </p>
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
