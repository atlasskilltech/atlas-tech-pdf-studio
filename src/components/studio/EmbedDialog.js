'use client';

/* =====================================================================
   The embed dialog.

   Hands over the iframe for one document, ready to paste into any
   HTML, PHP or WordPress page. Nothing is generated or stored when this
   opens - the viewer route already exists for every document, so the
   dialog only has to build the snippet.

   It uses the studio's own buttons, indigo and focus ring; it is a
   dialog, not a new visual language.
   ===================================================================== */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { embedCode, flipbookUrl, isLocalOrigin, SITE_URL } from '@/lib/site';

const PRIMARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--atlas-indigo)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--atlas-indigo)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)]';
const SECONDARY =
  'inline-flex h-10 items-center justify-center rounded-md border border-[var(--atlas-indigo)]/30 px-4 text-sm font-semibold text-[var(--atlas-indigo)] transition hover:bg-[var(--atlas-indigo)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)]';

export default function EmbedDialog({ entry, onClose }) {
  const copyRef = useRef(null);
  const [copied, setCopied] = useState(false);

  /* Where the page is actually being served from. It is external state,
     and only knowable in the browser, so it is read through a store
     rather than an effect; a configured NEXT_PUBLIC_SITE_URL always
     wins over it. */
  const servedFrom = useSyncExternalStore(
    subscribeToOrigin,
    readOrigin,
    () => '',
  );
  const origin = SITE_URL || servedFrom;

  const code = useMemo(
    () => embedCode(entry.id, { origin, title: entry.title }),
    [entry.id, entry.title, origin],
  );

  const notPublic = !SITE_URL && isLocalOrigin(origin);

  /* Escape closes; the copy button takes focus when the dialog opens. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    copyRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard access can be refused (an insecure origin, say), so
      // fall back to selecting the text for a manual copy.
      const field = document.getElementById('embed-code-field');
      field?.select?.();
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [code]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="embed-dialog-title"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
      >
        <div className="flex items-start gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2
              id="embed-dialog-title"
              className="text-base font-bold text-[var(--atlas-indigo)] sm:text-lg"
            >
              Flipbook Embed
            </h2>
            <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
              {entry.name} · {entry.scope}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)]"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="m5.5 5.5 9 9m0-9-9 9" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <p className="text-sm leading-relaxed text-slate-600">
            Embed this PDF flipbook on any HTML, PHP, WordPress, or other
            website using the iframe below.
          </p>

          {notPublic ? (
            <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Not ready to paste yet.</strong>{' '}
              This code points at{' '}
              <code className="font-mono">{origin}</code>, which only resolves on
              this machine. Set{' '}
              <code className="font-mono">NEXT_PUBLIC_SITE_URL</code> to the
              public address of this application and the embed code will use it.
            </p>
          ) : null}

          <label htmlFor="embed-code-field" className="sr-only">
            Flipbook embed code
          </label>
          <textarea
            id="embed-code-field"
            readOnly
            rows={8}
            spellCheck="false"
            value={code}
            onFocus={(e) => e.target.select()}
            className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[0.7rem] leading-relaxed text-slate-800 focus:border-[var(--atlas-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--atlas-teal)] sm:text-xs"
          />

          <p className="mt-3 text-xs text-slate-500">
            Viewer URL:{' '}
            <a
              href={flipbookUrl(entry.id, origin)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--atlas-indigo)] underline underline-offset-2 hover:text-[var(--atlas-teal)]"
            >
              {flipbookUrl(entry.id, origin)}
            </a>
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button type="button" onClick={onClose} className={SECONDARY}>
            Close
          </button>
          <button ref={copyRef} type="button" onClick={copy} className={PRIMARY}>
            {copied ? (
              <>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="m4.5 10.5 3.5 3.5 7.5-7.5" />
                </svg>
                Embed code copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <rect x="7" y="7" width="9" height="9" rx="1.6" />
                  <path d="M13 4.5H5.6A1.6 1.6 0 0 0 4 6.1V13" />
                </svg>
                Copy Embed Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/** The origin never changes while the page is open, so there is nothing
    to subscribe to - the store exists only to read it safely. */
function subscribeToOrigin() {
  return () => {};
}

function readOrigin() {
  return window.location.origin;
}
