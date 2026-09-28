/* =====================================================================
   The two invisible layers written over the artwork.

   TEXT - the picture is what the reader sees; this walks the same
   laid-out sheet and records every line of text with its position, so
   the PDF also carries real, selectable, searchable text. Nothing here
   is drawn visibly.

   LINKS - every <a href> on the sheet becomes a real link annotation
   positioned over the artwork, so the header lockup, the footer
   channels, the address and every "Fee Refund Policy" link are
   clickable in any PDF reader. A link that wraps onto a second line
   reports one rectangle per line and gets one annotation per line.
   ===================================================================== */
import { PAGE_W_MM } from '@/lib/sheet';

/** Lines of text with their position on the sheet, in millimetres. */
export function extractLines(root) {
  const mmPerPx = PAGE_W_MM / root.offsetWidth;
  const base = root.getBoundingClientRect();
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const lines = [];

  let node = walker.nextNode();
  while (node) {
    const text = node.nodeValue;
    if (text && /\S/.test(text)) {
      const cs = getComputedStyle(node.parentNode);
      const fontPx = parseFloat(cs.fontSize) || 0;
      const hidden =
        cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0';

      if (fontPx && !hidden) {
        const n = text.length;
        let i = 0;
        while (i < n) {
          while (i < n && !/\S/.test(text.charAt(i))) i += 1;
          if (i >= n) break;

          // Walk forward while the characters stay on the same line.
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const top = range.getBoundingClientRect().top;

          let j = i + 1;
          while (j < n) {
            range.setStart(node, j);
            range.setEnd(node, j + 1);
            const r = range.getBoundingClientRect();
            if ((r.width || r.height) && Math.abs(r.top - top) > 0.6) break;
            j += 1;
          }

          range.setStart(node, i);
          range.setEnd(node, j);
          const box = range.getBoundingClientRect();

          // Trailing whitespace collapses to a single space rather than
          // being dropped: it keeps words apart where a sentence is
          // split across inline runs, e.g. "the University's " followed
          // by a bold "Fee Refund Policy".
          const raw = text.slice(i, j);
          let str = raw.replace(/\s+$/, '');
          if (str && str !== raw) str += ' ';

          if (str && box.width > 0) {
            lines.push({
              text: str,
              x: (box.left - base.left) * mmPerPx,
              y: (box.bottom - base.top) * mmPerPx - fontPx * mmPerPx * 0.2,
              size: (fontPx * mmPerPx * 72) / 25.4,
            });
          }
          i = j;
        }
      }
    }
    node = walker.nextNode();
  }

  return lines;
}

/** Link rectangles on the sheet, in millimetres. */
export function extractLinks(root) {
  const mmPerPx = PAGE_W_MM / root.offsetWidth;
  const base = root.getBoundingClientRect();
  const out = [];

  for (const anchor of root.querySelectorAll('a[href]')) {
    const url = anchor.getAttribute('href');
    if (!url || url.startsWith('#')) continue;

    for (const r of anchor.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      out.push({
        url,
        x: (r.left - base.left) * mmPerPx,
        y: (r.top - base.top) * mmPerPx,
        w: r.width * mmPerPx,
        h: r.height * mmPerPx,
      });
    }
  }

  return out;
}

/*
   jsPDF's built-in faces cannot carry typographic quotes and dashes, so
   the invisible layer uses their ASCII equivalents. The visible page is
   the artwork above it and keeps the original characters.
*/
const ASCII = {
  '‘': "'", '’': "'", '‚': "'", '‛': "'",
  '“': '"', '”': '"', '„': '"',
  '–': '-', '—': '-', '−': '-',
  '…': '...', ' ': ' ', '•': '-', '·': '-',
};

export function forTextLayer(str) {
  return str.replace(
    /[ ·–—‘-„•…−]/g,
    (c) => ASCII[c] ?? ' ',
  );
}

export function addTextLayer(pdf, lines) {
  pdf.setFont('helvetica', 'normal');
  for (const line of lines) {
    if (!(line.size > 0)) continue;
    pdf.setFontSize(line.size);
    pdf.text(forTextLayer(line.text), line.x, line.y, {
      renderingMode: 'invisible',
      baseline: 'alphabetic',
    });
  }
}

export function addLinks(pdf, links) {
  for (const link of links) {
    pdf.link(link.x, link.y, link.w, link.h, { url: link.url });
  }
}
