'use client';

/* =====================================================================
   Progress toast.

   Exporting a set of PDFs takes a few seconds per sheet, so the studio
   says what it is doing. A message with a `ttl` clears itself; one
   without stays until the next message replaces it.
   ===================================================================== */
import { useEffect } from 'react';

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message?.ttl) return undefined;
    const timer = setTimeout(onDone, message.ttl);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-4 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2 text-center text-sm text-white shadow-lg"
    >
      {message.text}
    </div>
  );
}
