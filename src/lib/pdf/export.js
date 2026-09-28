/* =====================================================================
   PDF export.

   One document becomes ONE PDF whose pages are exactly 210 x 297 mm,
   carrying, for every sheet in order:

     * the artwork, drawn at ~288 dpi by the browser itself;
     * a real, selectable and searchable text layer behind it;
     * a clickable link annotation for every link on the sheet.

   "Download all" builds each fee structure in turn and packs them into
   a single ZIP, so the browser only has to save one file.

   jsPDF and JSZip are loaded on demand: they are only needed when
   something is actually exported, so they stay out of the first load.
   ===================================================================== */
import { PAGE_H_MM, PAGE_W_MM } from '@/lib/sheet';
import { rasterizeSheet, whenImagesSettled } from './rasterize';
import { addLinks, addTextLayer, extractLines, extractLinks } from './overlays';

const JPEG_QUALITY = 0.92;

/**
 * Sheets are rasterised from a copy parked off-screen, so the preview on
 * screen is never disturbed and a sheet that is currently scaled to fit
 * the viewer still exports at its true size.
 */
function renderHost() {
  let host = document.getElementById('pdf-render-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'pdf-render-host';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText =
      'position:fixed;left:-100000px;top:0;width:210mm;pointer-events:none';
    document.body.appendChild(host);
  }
  return host;
}

async function renderSheet(sheet) {
  const host = renderHost();
  const clone = sheet.cloneNode(true);
  clone.style.transform = 'none';
  host.appendChild(clone);

  try {
    await whenImagesSettled(clone);

    let lines = [];
    let links = [];
    try {
      lines = extractLines(clone);
    } catch (error) {
      console.warn('Text layer skipped for this page:', error);
    }
    try {
      links = extractLinks(clone);
    } catch (error) {
      console.warn('Link layer skipped for this page:', error);
    }

    const canvas = await rasterizeSheet(clone);
    return { canvas, lines, links };
  } finally {
    clone.remove();
  }
}

/**
 * Build one PDF from an element containing this document's sheets.
 * `onProgress(done, total)` is called as each sheet finishes.
 */
export async function buildPdf(root, meta, onProgress) {
  const { jsPDF } = await import('jspdf');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [PAGE_W_MM, PAGE_H_MM],
    compress: true,
  });

  pdf.setProperties({
    title: meta.title,
    subject: meta.subject,
    author: 'ATLAS SkillTech University',
    creator: 'ATLAS SkillTech University',
  });

  const sheets = Array.from(root.querySelectorAll('[data-sheet]'));

  for (let i = 0; i < sheets.length; i += 1) {
    // Sequential on purpose: each sheet is a full-page canvas, and
    // rasterising them all at once would spike memory for no gain.
    const { canvas, lines, links } = await renderSheet(sheets[i]);

    if (i > 0) pdf.addPage([PAGE_W_MM, PAGE_H_MM], 'portrait');
    pdf.addImage(
      canvas.toDataURL('image/jpeg', JPEG_QUALITY),
      'JPEG',
      0,
      0,
      PAGE_W_MM,
      PAGE_H_MM,
      undefined,
      'FAST',
    );

    try {
      addTextLayer(pdf, lines);
    } catch (error) {
      console.warn('Text layer skipped for this page:', error);
    }
    try {
      addLinks(pdf, links);
    } catch (error) {
      console.warn('Link annotations skipped for this page:', error);
    }

    onProgress?.(i + 1, sheets.length);
  }

  return pdf;
}

export function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 4000);
}

export async function zipPdfs(entries, zipName) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  for (const entry of entries) zip.file(entry.name, entry.data);
  const blob = await zip.generateAsync({ type: 'blob' });
  saveBlob(blob, zipName);
}
