'use client';

/* =====================================================================
   The preview.

   A sheet is a fixed 210mm object; the viewer scales it down to whatever
   width is available and never up past its true size. Each sheet sits in
   a wrapper that is given the scaled size, so a scaled sheet occupies
   exactly the room it looks like it occupies - the column can never
   overflow sideways, at 320px or at 2560px.
   ===================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';

export default function SheetViewer({ sheets }) {
  const frameRef = useRef(null);
  const [scale, setScale] = useState(0);

  const measure = useCallback(() => {
    const frame = frameRef.current;
    const sheet = frame?.querySelector('[data-sheet]');
    if (!frame || !sheet) return;

    const available = frame.clientWidth;
    const natural = sheet.offsetWidth;
    if (!available || !natural) return;

    setScale(Math.min(1, available / natural));
  }, []);

  useEffect(() => {
    measure();
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [measure, sheets]);

  return (
    <div ref={frameRef} className="flex w-full flex-col items-center gap-4 sm:gap-6">
      {sheets.map((sheet, i) => (
        <ScaledSheet key={i} scale={scale} index={i} total={sheets.length}>
          {sheet}
        </ScaledSheet>
      ))}
    </div>
  );
}

function ScaledSheet({ scale, index, total, children }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const sheet = ref.current?.querySelector('[data-sheet]');
    if (!sheet || !scale) return;
    setSize({
      width: Math.round(sheet.offsetWidth * scale),
      height: Math.round(sheet.offsetHeight * scale),
    });
  }, [scale, children]);

  return (
    <div
      role="img"
      aria-label={`Page ${index + 1} of ${total}`}
      className="relative max-w-full overflow-hidden rounded-sm bg-white shadow-[0_10px_30px_rgba(15,23,42,0.18),0_2px_6px_rgba(15,23,42,0.12)]"
      style={size ?? undefined}
    >
      <div
        ref={ref}
        className="origin-top-left"
        style={scale ? { transform: `scale(${scale})` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
