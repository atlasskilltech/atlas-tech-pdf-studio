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
import { DOCUMENTS, SCALE_SETS, ZIP_NAME } from '@/lib/registry';
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
        <nav aria-label="Documents" className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="sr-only">Documents</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {DOCUMENTS.map((entry) => (
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
        </nav>

        <section aria-live="polite" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="mr-auto min-w-0 text-sm font-semibold text-[var(--atlas-indigo)] sm:text-base">
              {selected.title}
            </h2>
            <span className="text-xs text-slate-500 sm:text-sm">
              {selectedPages
                ? `${selectedPages} ${selectedPages === 1 ? 'page' : 'pages'} · `
                : null}
              {selected.file}
            </span>
            <button
              type="button"
              onClick={() => downloadOne(selected)}
              disabled={busy}
              className="rounded-md bg-[var(--atlas-indigo)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--atlas-indigo)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => setEmbedFor(selected)}
              className="rounded-md border border-[var(--atlas-indigo)]/30 px-3 py-1.5 text-sm font-semibold text-[var(--atlas-indigo)] transition hover:bg-[var(--atlas-indigo)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)]"
            >
              Get Embed Code
            </button>
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
