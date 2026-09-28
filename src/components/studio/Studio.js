'use client';

/* =====================================================================
   The studio.

   Every document is rendered once into a store that is parked off-screen
   rather than hidden, so the sheets keep a real layout and can be
   measured, fitted and rasterised. The viewer shows the selected
   document again, at the unit its set settled on, scaled to the width
   available.

   Fitting happens once, after the fonts are active and the lockups have
   loaded, over the whole store - so all seven fee structures share one
   scale and the policy keeps its own.
   ===================================================================== */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { documentSheets } from '@/components/documents/DocumentSheets';
import DocumentCard from './DocumentCard';
import SheetViewer from './SheetViewer';
import Toast from './Toast';
import EmbedDialog from './EmbedDialog';
import StudioHeader from './StudioHeader';
import { fitAll, whenRenderable } from '@/lib/fit';
import {
  DOCUMENTS,
  DOCUMENT_TREE,
  SCALE_SETS,
  ZIP_NAME,
} from '@/lib/registry';
import { buildPdf, saveBlob, zipPdfs } from '@/lib/pdf/export';

export default function Studio() {
  const storeRef = useRef(null);
  const [units, setUnits] = useState({});
  const [pageCounts, setPageCounts] = useState({});
  const [chosenId, setChosenId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  // The document whose embed code is on show, if any.
  const [embedFor, setEmbedFor] = useState(null);

  /* The document on show. The URL fragment is an external source the
     studio subscribes to, so a link straight to #mba opens that
     document and the back button still works; an explicit click takes
     over from there. */
  const hashId = useSyncExternalStore(subscribeToHash, readHash, () => null);
  const selectedId = chosenId ?? hashId ?? DOCUMENTS[0].id;

  const selected = useMemo(
    () => DOCUMENTS.find((d) => d.id === selectedId) ?? DOCUMENTS[0],
    [selectedId],
  );

  /* --- fit every sheet once the page can really be measured --------- */
  useEffect(() => {
    let cancelled = false;
    const store = storeRef.current;

    whenRenderable(store).then(() => {
      if (cancelled || !store) return;
      setUnits(fitAll(store, SCALE_SETS));

      // The card labels report the real number of sheets each document
      // rendered - nothing here is a hard-coded count.
      const counts = {};
      for (const group of store.querySelectorAll('[data-document]')) {
        counts[group.dataset.document] =
          group.querySelectorAll('[data-sheet]').length;
      }
      setPageCounts(counts);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /* --- opening a document ------------------------------------------- */
  const select = useCallback((id) => {
    setChosenId(id);
    history.replaceState(null, '', `#${id}`);
  }, []);

  /* --- export -------------------------------------------------------- */
  const storeGroup = useCallback(
    (id) => storeRef.current?.querySelector(`[data-document="${id}"]`) ?? null,
    [],
  );

  const guard = useCallback(
    async (run) => {
      if (busy) {
        setMessage({ text: 'Please wait — a PDF is still being prepared…', ttl: 2500 });
        return;
      }
      setBusy(true);
      try {
        await run();
      } catch (error) {
        console.error(error);
        setMessage({
          text: `Sorry, the PDF could not be created: ${error?.message ?? error}`,
          ttl: 6000,
        });
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );

  const downloadOne = useCallback(
    (entry) =>
      guard(async () => {
        const group = storeGroup(entry.id);
        if (!group) throw new Error('That document is not ready yet.');

        setMessage({ text: `Preparing ${entry.file}…` });
        const pdf = await buildPdf(group, metaFor(entry));
        saveBlob(pdf.output('blob'), entry.file);
        setMessage({ text: `Downloaded ${entry.file}`, ttl: 3000 });
      }),
    [guard, storeGroup],
  );

  const downloadAll = useCallback(
    () =>
      guard(async () => {
        const feeStructures = DOCUMENTS.filter((d) => d.kind === 'fee-structure');
        const files = [];

        for (let i = 0; i < feeStructures.length; i += 1) {
          const entry = feeStructures[i];
          setMessage({
            text: `Preparing ${i + 1} of ${feeStructures.length}: ${entry.file}…`,
          });
          const group = storeGroup(entry.id);
          if (!group) continue;
          const pdf = await buildPdf(group, metaFor(entry));
          files.push({ name: entry.file, data: pdf.output('arraybuffer') });
        }

        setMessage({ text: `Creating ${ZIP_NAME}…` });
        await zipPdfs(files, ZIP_NAME);
        setMessage({
          text: `Downloaded ${ZIP_NAME} (${files.length} PDFs)`,
          ttl: 4000,
        });
      }),
    [guard, storeGroup],
  );

  const selectedSheets = useMemo(
    () => documentSheets(selected, units[scaleSetOf(selected)]),
    [selected, units],
  );

  const selectedPages = pageCounts[selected.id];

  return (
    <div className="min-h-screen">
      <StudioHeader onDownloadAll={downloadAll} busy={busy} />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
        {/* ---------------------------------------------------------------
            The documents, as the university describes them: school, then
            level, then programme. The tree comes from the registry, so
            this only has to lay it out - a school or a level with nothing
            in it never reaches here.
            --------------------------------------------------------------- */}
        <nav
          aria-label="Documents"
          className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start"
        >
          <h2 className="sr-only">Documents</h2>

          {DOCUMENT_TREE.map((group) => (
            <section key={group.key} aria-labelledby={`group-${group.key}`}>
              <h3
                id={`group-${group.key}`}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--atlas-indigo)]"
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 flex-none rounded-sm"
                  style={{ background: group.accent }}
                />
                {group.label}
              </h3>

              {group.levels.map((level) => (
                <div key={level.label ?? 'none'} className="mt-3">
                  {level.label ? (
                    <h4 className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {level.label}
                    </h4>
                  ) : null}

                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {level.documents.map((entry) => (
                      <DocumentCard
                        key={entry.id}
                        entry={entry}
                        pages={pageCounts[entry.id]}
                        selected={entry.id === selected.id}
                        busy={busy}
                        onView={() => select(entry.id)}
                        onDownload={() => downloadOne(entry)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </nav>

        <section aria-live="polite" className="min-w-0">
          {/* ---------------------------------------------------------
              One action row: the document, what it weighs, and what can
              be done with it.

              The two buttons are one group rather than two more items in
              the row, so they travel together - as siblings the second
              would peel off onto a line of its own the moment the title
              and filename grew. The group holds its size; the title and
              the filename give theirs up first (`min-w-0`) and wrap
              inside themselves rather than being cut off, so the row
              never reaches past the viewport.
              --------------------------------------------------------- */}
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            {/* The title and the filename travel as one flexible block.
                Flexbox decides where to break a line from each item's
                NATURAL width, before any of them shrink, so as separate
                items a long title would push the buttons onto a second
                row while there was still space for them. Given no basis
                of its own (`basis-0`), this block never forces that
                break: it simply takes what is left and wraps inside
                itself. Below `sm` it claims a full line instead, which
                is what moves the buttons under it on a phone. */}
            <div className="flex min-w-0 basis-full flex-wrap items-center gap-x-3 gap-y-1 sm:flex-1 sm:basis-0">
              <h2 className="min-w-0 text-sm font-semibold text-[var(--atlas-indigo)] sm:text-base">
                {selected.title}
              </h2>
              <p className="min-w-0 break-words text-xs text-slate-500 sm:text-sm">
                {selectedPages
                  ? `${selectedPages} ${selectedPages === 1 ? 'page' : 'pages'} · `
                  : null}
                {selected.file}
              </p>
            </div>
            <div className="ml-auto flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={() => downloadOne(selected)}
                disabled={busy}
                /* The transparent border matches the outlined button's
                   1px, so the two come out exactly the same height and
                   sit level. It changes nothing about how this one
                   looks. */
                className="whitespace-nowrap rounded-md border border-transparent bg-[var(--atlas-indigo)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--atlas-indigo)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => setEmbedFor(selected)}
                className="whitespace-nowrap rounded-md border border-[var(--atlas-indigo)]/30 px-3 py-1.5 text-sm font-semibold text-[var(--atlas-indigo)] transition hover:bg-[var(--atlas-indigo)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)]"
              >
                Get Embed Code
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-slate-300/60 p-3 sm:p-4 lg:p-6">
            <SheetViewer sheets={selectedSheets} />
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------
          The document store.

          Parked off-screen rather than hidden, so every sheet keeps a
          real layout: this is what the fit pass measures and what the
          exporter copies from.
          --------------------------------------------------------------- */}
      <div
        ref={storeRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-[-100000px] top-0 w-[210mm]"
      >
        {DOCUMENTS.map((entry) => (
          <div key={entry.id} data-document={entry.id}>
            {documentSheets(entry, units[scaleSetOf(entry)])}
          </div>
        ))}
      </div>

      {embedFor ? (
        <EmbedDialog entry={embedFor} onClose={() => setEmbedFor(null)} />
      ) : null}

      <Toast message={message} onDone={() => setMessage(null)} />
    </div>
  );
}

function subscribeToHash(onChange) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function readHash() {
  const id = window.location.hash.replace('#', '');
  return DOCUMENTS.some((d) => d.id === id) ? id : null;
}

function scaleSetOf(entry) {
  return entry.kind === 'policy' ? 'refund-policy' : 'fee-structures';
}

function metaFor(entry) {
  return entry.kind === 'policy'
    ? {
        title: `${entry.title} — ATLAS SkillTech University`,
        subject: 'Fee Refund Policy, Academic Year 2027-28 (Intake 27)',
      }
    : {
        title: `${entry.title} — Fee Structure 2027-28`,
        subject: 'Fee Structure, Academic Year 2027-28 (Intake 27)',
      };
}
