'use client';

/* =====================================================================
   The public flipbook viewer.

   This is a VIEWER, not a second document system. It shows the very
   same sheets the studio previews and the PDF exporter rasterises - the
   components in components/pdf, fitted by the same pass in lib/fit -
   so a flipbook can never drift from the PDF it represents. Nothing
   here knows what a fee structure is.

   How the pages reach the flip engine:

     React renders the document's sheets once, off-screen. The fit pass
     measures them. Each finished sheet is then drawn to an image by the
     SAME rasteriser the PDF exporter uses (lib/pdf/rasterize), at screen
     resolution rather than print resolution, and the book is loaded from
     those images.

   Images rather than the live DOM, on purpose: page-flip renders an HTML
   book by transforming real elements, which can only produce a flat
   fold, while an image book is drawn on a canvas and gets the real
   thing - a curved page curl with the gradient shading and the inner,
   outer and book shadows of a page physically turning. That is the
   whole point of this viewer, and it costs one trade-off: the text in
   the flipbook is artwork, while the selectable text and the clickable
   links live in the downloadable PDF.

   The pages are drawn ONCE per document and cached. Resizing, zooming
   and turning all reuse them.
   ===================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';
import 'page-flip/src/Style/stPageFlip.css';
import { documentSheets } from '@/components/documents/DocumentSheets';
import { fitAll, whenRenderable } from '@/lib/fit';
import { rasterizeSheet } from '@/lib/pdf/rasterize';
import { SCALE_SETS } from '@/lib/registry';
import { PAGE_H_MM, PAGE_W_MM } from '@/lib/sheet';
import FlipbookControls from './FlipbookControls';

const SHEET_RATIO = PAGE_H_MM / PAGE_W_MM;
const ZOOM_STEPS = [1, 1.35, 1.75];

/** Narrower than this and a page of a spread is too small to read, so the
    book shows one page at a time instead: every phone, and a tablet held
    upright. */
const MIN_SPREAD_PAGE = 380;

/** Room to leave around the spread, so a page never touches the frame.
    Narrow screens get less of it: every pixel of width is a bigger sheet. */
const GUTTER = { wide: { x: 24, y: 16 }, narrow: { x: 10, y: 8 } };

/**
 * Page artwork is drawn at twice the sheet's natural size: sharp on the
 * largest screen and through the zoom steps, without carrying a
 * print-resolution canvas per page. JPEG because a sheet is white paper
 * with type on it, which is what JPEG is good at - the same choice the
 * PDF exporter makes.
 */
const VIEWER_SCALE = 2;
const VIEWER_QUALITY = 0.92;

/** A4 width at CSS resolution: the size the sheets actually lay out at. */
const NATURAL_W = PAGE_W_MM * (96 / 25.4);

/**
 * How large a page may be drawn. The artwork is rendered at VIEWER_SCALE,
 * so this is the point past which it would be upscaled and go soft; below
 * it the book is free to use whatever room a tall window or a tall iframe
 * gives it, rather than stopping at the sheet's nominal size and leaving
 * the space empty.
 */
const MAX_PAGE_W = NATURAL_W * VIEWER_SCALE;

export default function FlipbookViewer({ entry }) {
  const sourceRef = useRef(null); // off-screen React sheets
  const stageRef = useRef(null); // the measured area
  const hostRef = useRef(null); // stable; React owns this one
  const flipRef = useRef(null);
  const builtForRef = useRef(null); // the measurement the book was built for
  // Where the reader has got to. Kept apart from the flip instance
  // because a rebuild tears that instance down - and on a zoom change
  // React runs the effect cleanup, which destroys it, before the rebuild
  // gets a chance to ask it anything.
  const openAtRef = useRef(0);

  const [unit, setUnit] = useState(undefined);
  const [pages, setPages] = useState(null); // page artwork, once drawn
  const [zoom, setZoom] = useState(0);
  const [page, setPage] = useState(0);
  const [spread, setSpread] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  // How many pages the book has is simply how many were drawn, so it is
  // derived rather than stored - nothing has to keep the two in step.
  const total = pages?.length ?? 0;

  /* --- 1. fit the sheets, exactly as the studio does ----------------- */
  useEffect(() => {
    let cancelled = false;
    const source = sourceRef.current;

    whenRenderable(source).then(() => {
      if (cancelled || !source) return;
      const units = fitAll(source, SCALE_SETS);
      setUnit(units[scaleSetOf(entry)]);
    });

    return () => {
      cancelled = true;
    };
  }, [entry]);

  /* --- 2. draw each fitted sheet to a page image, once --------------- */
  useEffect(() => {
    if (unit === undefined) return undefined;
    let cancelled = false;

    // A frame after the fitted unit paints, so each sheet is drawn at the
    // size the fit pass settled on.
    const handle = requestAnimationFrame(() => {
      const source = sourceRef.current;
      if (!source) return;
      const sheets = Array.from(source.querySelectorAll('[data-sheet]'));

      (async () => {
        const urls = [];
        for (const sheet of sheets) {
          // Sequential: each sheet is a full-page canvas, and drawing
          // them all at once would spike memory for no gain.
          const canvas = await rasterizeSheet(sheet, VIEWER_SCALE);
          if (cancelled) return;
          urls.push(canvas.toDataURL('image/jpeg', VIEWER_QUALITY));
        }
        if (!cancelled) setPages(urls);
      })().catch((error) => {
        console.error('The flipbook pages could not be drawn:', error);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(handle);
    };
  }, [unit]);

  /* --- 3. build the book from those page images ---------------------- */
  const build = useCallback(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host || !pages?.length) return;

    // Building the book changes what sits inside the stage, which can
    // move a scrollbar and so report the stage as resized again. Ignoring
    // a measurement that has not really changed stops that feeding back
    // on itself, and stops a stray observation throwing away the reader's
    // place in the book.
    const measured = `${stage.clientWidth}x${stage.clientHeight}x${zoom}x${pages.length}`;
    if (measured === builtForRef.current) return;
    builtForRef.current = measured;

    if (flipRef.current) {
      try {
        flipRef.current.destroy();
      } catch {
        /* already gone */
      }
      flipRef.current = null;
    }

    // page-flip's destroy() removes the element it was given from the
    // document, so it never gets the same one twice: each build hands it
    // a fresh, disposable child of the host React owns. Rebuilding on
    // zoom or resize is then always a clean start.
    host.replaceChildren();
    const mount = document.createElement('div');
    mount.className = 'shrink-0';
    host.appendChild(mount);

    const gutter = stage.clientWidth < 640 ? GUTTER.narrow : GUTTER.wide;
    const availableW = Math.max(240, stage.clientWidth - gutter.x * 2);
    const availableH = Math.max(320, stage.clientHeight - gutter.y * 2);
    const scale = ZOOM_STEPS[zoom] ?? 1;

    /* --------------------------------------------------------------
       How the book opens.

       Only a document of three pages or more is a book with a cover:
       page one stands alone, then the pages pair off (2-3, 4-5, ...),
       as a real one does.

       TWO pages are not a book. Given a cover and a spread, page two
       would sit alone against an empty half, which reads as a missing
       page. So a two-page document turns one page at a time at every
       width: page 1, turn, page 2. Nothing is invented to pad it out
       and nothing empty is ever shown.

       A spread also has to earn its place: below a readable page width
       the book gives the whole stage to one page, which is what every
       phone and every narrow embed gets.

       The decision is made here and handed to page-flip as
       `usePortrait`, rather than left to its own heuristic, which infers
       orientation from the measured block width and disagrees.
       -------------------------------------------------------------- */
    const isBook = pages.length > 2;
    const spreadWanted = isBook && availableW / 2 >= MIN_SPREAD_PAGE;
    const columns = spreadWanted ? 2 : 1;

    let pageW = Math.min(MAX_PAGE_W, availableW / columns);
    let pageH = pageW * SHEET_RATIO;
    if (pageH > availableH) {
      pageH = availableH;
      pageW = pageH / SHEET_RATIO;
    }
    pageW = Math.floor(pageW * scale);
    pageH = Math.floor(pageW * SHEET_RATIO);

    mount.style.width = `${pageW * columns}px`;
    mount.style.height = `${pageH}px`;

    /* ----------------------------------------------------------------
       A single sheet is not a book.

       No flip engine and no page turns; the control bar drops its page
       navigation too, leaving the zoom and fullscreen the viewer always
       offers.
       ---------------------------------------------------------------- */
    if (pages.length === 1) {
      const only = document.createElement('img');
      only.src = pages[0];
      only.alt = entry.title;
      only.className = 'block h-full w-full bg-white shadow-lg';
      mount.appendChild(only);
      return;
    }

    let loaded = false;
    // Loaded on demand: the flip engine is only needed once the pages are
    // drawn, and never at all by the studio.
    import('page-flip')
      .then(({ PageFlip }) => {
        const flip = new PageFlip(mount, {
          width: pageW,
          height: pageH,
          size: 'fixed',
          // Reopen where the reader was, not at the beginning: a rebuild
          // is a new book, and resizing should not cost them their place.
          startPage: Math.min(Math.max(openAtRef.current, 0), pages.length - 1),

          // The turn itself: a soft page carrying its own shadow, at a
          // speed that reads as paper rather than as a transition.
          drawShadow: true,
          maxShadowOpacity: 0.6,
          flippingTime: 800,

          usePortrait: !spreadWanted,

          // The first sheet stands alone, as the cover of a book does.
          // Only a real book has one: with two pages it would strand
          // page two against an empty half.
          showCover: isBook,
          autoSize: false,

          // Every way of turning a page: the buttons, a click, a drag of
          // the corner, a swipe.
          useMouseEvents: true,
          showPageCorners: true,
          disableFlipByClick: false,
          mobileScrollSupport: true,
          swipeDistance: 30,
        });

        flip.loadFromImages(pages);
        flipRef.current = flip;
        loaded = true;

        /* ------------------------------------------------------------
           Nothing empty may look like a page.

           page-flip's canvas renderer repaints the whole book area
           solid white on every frame and then draws the pages over it.
           Where a book legitimately shows one page and not two - beside
           the cover, and beside a final page when the count is even -
           that leaves a page-sized white rectangle, which reads as a
           blank sheet that is not in the document.

           Clearing to transparent instead lets the viewer's own
           background show through in those places, so the only things
           that look like pages are the real ones. No page is invented
           and none is hidden; this only changes what is behind them.
           ------------------------------------------------------------ */
        try {
          const render = flip.getRender?.();
          const canvas = flip.getUI?.()?.getCanvas?.();
          const ctx = canvas?.getContext('2d');
          if (render && ctx && canvas) {
            render.clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        } catch {
          /* a future page-flip may not expose this; the book still works */
        }

        openAtRef.current = flip.getCurrentPageIndex();
        setPage(openAtRef.current);
        setSpread(spreadWanted ? 2 : 1);

        flip.on('flip', (e) => {
          openAtRef.current = e.data;
          setPage(e.data);
        });
        flip.on('changeOrientation', (e) =>
          setSpread(e.data === 'portrait' ? 1 : 2),
        );
      })
      .catch((error) => {
        console.error('The flipbook engine could not be loaded:', error);
        if (!loaded) mount.replaceChildren();
      });
  }, [pages, zoom, entry.title]);

  /* --- 4. build once the pages exist, and rebuild when the room does - */
  useEffect(() => {
    if (!pages?.length) return undefined;
    build();

    let timer;
    const rebuild = () => {
      clearTimeout(timer);
      timer = setTimeout(build, 180);
    };

    /* --------------------------------------------------------------
       The book is sized from the STAGE, not from the window.

       Embedded in someone else's page, the window may never change
       while the iframe around this viewer does - a responsive column,
       a sidebar opening, a container transition. A ResizeObserver on
       the stage catches all of those, and the iframe being resized
       too, so the one signal covers every case.

       It is watched rather than polled, and the rebuild is debounced,
       because building the book changes what is inside the stage and a
       scrollbar appearing or leaving would otherwise feed straight back
       in. `build` itself only acts on a real change in the measured
       size, which closes that loop.
       -------------------------------------------------------------- */
    const stage = stageRef.current;
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(rebuild) : null;
    if (observer && stage) observer.observe(stage);
    else window.addEventListener('resize', rebuild);

    window.addEventListener('orientationchange', rebuild);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener('resize', rebuild);
      window.removeEventListener('orientationchange', rebuild);
      if (flipRef.current) {
        try {
          flipRef.current.destroy();
        } catch {
          /* already gone */
        }
        flipRef.current = null;
      }
    };
  }, [pages, build]);

  /* --- controls ------------------------------------------------------ */
  // flipPrev/flipNext animate the turn, and the buttons, the keyboard and
  // the swipe handler all go through them - so every route to the next
  // page turns the page rather than replacing it.
  const flipPrev = useCallback(() => flipRef.current?.flipPrev(), []);
  const flipNext = useCallback(() => flipRef.current?.flipNext(), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') flipPrev();
      if (e.key === 'ArrowRight') flipNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipPrev, flipNext]);

  const toggleFullscreen = useCallback(() => {
    const root = stageRef.current?.closest('[data-flipbook-root]');
    if (!document.fullscreenElement) root?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return (
    /* ------------------------------------------------------------------
       The viewer is exactly as tall as the room it is given and no
       taller, so that embedded in an iframe it never makes the host page
       scroll: the control bar takes its own height, the stage takes what
       is left (`flex-1` over `min-h-0`, or a tall book would push the
       bar out of view), and nothing overflows the whole.

       `h-screen` is the 100vh fallback; the inline 100dvh overrides it
       where dynamic viewport units exist, so the height follows a mobile
       browser's address bar sliding in and out. A browser that cannot
       parse dvh drops that declaration and keeps the class.
       ------------------------------------------------------------------ */
    <div
      data-flipbook-root=""
      style={{ height: '100dvh' }}
      className="flex h-screen w-full flex-col overflow-hidden bg-slate-200"
    >
      <div
        ref={stageRef}
        /* At its natural size the book is measured to fit, so the stage
           has nothing to scroll. Zoomed in it deliberately does, which is
           how the reader pans around an enlarged page - inside the
           viewer, never on the page hosting it. */
        className={`relative flex min-h-0 flex-1 items-center justify-center p-1.5 sm:p-4 ${
          zoom > 0 ? 'overflow-auto' : 'overflow-hidden'
        }`}
      >
        <div ref={hostRef} className="shrink-0" />
        {pages ? null : (
          <p className="absolute text-sm font-semibold text-[var(--atlas-indigo)]/70">
            Preparing the flipbook&hellip;
          </p>
        )}
      </div>

      <FlipbookControls
        title={entry.title}
        page={page}
        total={total}
        spread={spread}
        zoom={zoom}
        zoomSteps={ZOOM_STEPS.length}
        fullscreen={fullscreen}
        onPrev={flipPrev}
        onNext={flipNext}
        onZoomIn={() => setZoom((z) => Math.min(ZOOM_STEPS.length - 1, z + 1))}
        onZoomOut={() => setZoom((z) => Math.max(0, z - 1))}
        onFullscreen={toggleFullscreen}
      />

      {/* ---------------------------------------------------------------
          The source sheets.

          Parked off-screen rather than hidden, so they keep a real
          layout and can be measured and drawn - the same arrangement
          the studio uses for its document store.
          --------------------------------------------------------------- */}
      <div
        ref={sourceRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-[-100000px] top-0 w-[210mm]"
      >
        {documentSheets(entry, unit)}
      </div>
    </div>
  );
}

function scaleSetOf(entry) {
  return entry.kind === 'policy' ? 'refund-policy' : 'fee-structures';
}
