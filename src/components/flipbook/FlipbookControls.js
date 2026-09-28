'use client';

/* =====================================================================
   The flipbook's control bar.

   ATLAS indigo, the studio's button shapes and focus ring. It is the
   only chrome an embedded viewer shows, so it stays compact: the
   document title is the one thing that drops away on a phone. Zoom
   stays - a full A4 sheet scaled to a phone is exactly where it is
   needed most.

   A single-sheet document is not a book, so it shows no page navigation
   at all: no turn buttons, no counter. Zoom and fullscreen remain.
   ===================================================================== */

const BUTTON =
  'inline-flex h-9 w-9 flex-none items-center justify-center rounded-md text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)] disabled:cursor-not-allowed disabled:opacity-35';

function Icon({ d, label }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[1.1rem] w-[1.1rem]"
      aria-hidden="true"
      role="img"
      aria-label={label}
    >
      {d}
    </svg>
  );
}

export default function FlipbookControls({
  title,
  page,
  total,
  spread,
  zoom,
  zoomSteps,
  fullscreen,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onFullscreen,
}) {
  // page-flip counts from zero and, in a spread, shows two leaves at once.
  // The first sheet stands alone as a cover, so it is never paired.
  const first = total ? page + 1 : 0;
  const pairable = spread > 1 && first > 1;
  const last = pairable ? Math.min(total, first + spread - 1) : first;
  const counter = total
    ? last > first
      ? `${first}–${last} / ${total}`
      : `${first} / ${total}`
    : '…';

  // One sheet is not a book: there is nothing to turn and nothing to count.
  const isBook = total > 1;

  return (
    <div className="flex items-center gap-1 bg-[var(--atlas-indigo)] px-2 py-2 text-white sm:gap-2 sm:px-4">
      <p className="mr-auto hidden min-w-0 truncate text-xs font-semibold sm:block sm:text-sm">
        {title}
      </p>
      {isBook ? null : <span className="mr-auto sm:hidden" />}

      {isBook ? (
        <>
          <button
            type="button"
            className={BUTTON}
            onClick={onPrev}
            disabled={page <= 0}
            aria-label="Previous page"
          >
            <Icon label="" d={<path d="M12.5 4.5 7 10l5.5 5.5" />} />
          </button>

          <span className="min-w-16 text-center text-xs font-semibold tabular-nums sm:min-w-20 sm:text-sm">
            {counter}
          </span>

          <button
            type="button"
            className={BUTTON}
            onClick={onNext}
            disabled={last >= total}
            aria-label="Next page"
          >
            <Icon label="" d={<path d="M7.5 4.5 13 10l-5.5 5.5" />} />
          </button>

          <span className="mx-1 hidden h-5 w-px bg-white/20 sm:block" aria-hidden="true" />
        </>
      ) : null}

      <button
        type="button"
        className={BUTTON}
        onClick={onZoomOut}
        disabled={zoom <= 0}
        aria-label="Zoom out"
      >
        <Icon label="" d={<><circle cx="9" cy="9" r="5" /><path d="m13 13 3.5 3.5M7 9h4" /></>} />
      </button>
      <button
        type="button"
        className={BUTTON}
        onClick={onZoomIn}
        disabled={zoom >= zoomSteps - 1}
        aria-label="Zoom in"
      >
        <Icon label="" d={<><circle cx="9" cy="9" r="5" /><path d="m13 13 3.5 3.5M7 9h4M9 7v4" /></>} />
      </button>

      <button
        type="button"
        className={BUTTON}
        onClick={onFullscreen}
        aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
      >
        <Icon
          label=""
          d={
            fullscreen ? (
              <path d="M8 3v5H3M12 17v-5h5" />
            ) : (
              <path d="M7.5 3h-4v4M12.5 17h4v-4M16.5 7.5v-4h-4M3.5 12.5v4h4" />
            )
          }
        />
      </button>
    </div>
  );
}
