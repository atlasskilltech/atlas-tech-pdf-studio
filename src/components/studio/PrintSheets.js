'use client';

/* =====================================================================
   Bare sheets, for printing.

   The sheets are fitted exactly as they are in the studio - one scale
   per set - then laid out one per printed page. `data-rendered` is set
   on the document element once everything has settled, so an automated
   check knows when the sheets are final.

   Print behaviour is declared on the sheets themselves via Tailwind's
   print variant, so no stylesheet is needed: each sheet breaks after
   itself except the last, and colours are printed as they are shown.
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { documentSheets } from '@/components/documents/DocumentSheets';
import { fitAll, whenRenderable } from '@/lib/fit';
import { SCALE_SETS } from '@/lib/registry';

export default function PrintSheets({ entries }) {
  const rootRef = useRef(null);
  const [units, setUnits] = useState({});

  useEffect(() => {
    let cancelled = false;
    const root = rootRef.current;

    whenRenderable(root).then(() => {
      if (cancelled || !root) return;
      setUnits(fitAll(root, SCALE_SETS));
      // Give the fitted values one frame to paint before flagging done.
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('data-rendered', 'true');
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center bg-white [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:block"
    >
      {entries.map((entry) =>
        documentSheets(entry, units[scaleSetOf(entry)]).map((sheet, i) => (
          <div
            key={`${entry.id}-${i}`}
            className="print:break-after-page last:print:break-after-auto"
          >
            {sheet}
          </div>
        )),
      )}
    </div>
  );
}

function scaleSetOf(entry) {
  return entry.kind === 'policy' ? 'refund-policy' : 'fee-structures';
}
