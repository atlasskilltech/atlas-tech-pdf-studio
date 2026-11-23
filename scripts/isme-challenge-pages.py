"""Prepare the ISME Challenge artwork for the studio.

The ISME Challenge documents are supplied as finished, designed PDFs and
are shown EXACTLY as supplied - nothing is redrawn. This script turns
each supplied PDF into the two assets the studio serves:

  public/isme-challenge/<id>.pdf           the supplied file, byte for byte
                                           (what "Download PDF" saves)
  public/isme-challenge/<id>/page-NN.jpg   each page at print resolution
                                           (what the preview, the print
                                           route and the flipbook draw)

Usage (PyMuPDF required):

    python scripts/isme-challenge-pages.py <folder with the supplied PDFs>

Re-run it whenever a supplied PDF changes, and keep `pages` in
src/content/isme-challenge.js in step with the page counts it prints.
"""
import shutil
import sys
from pathlib import Path

import fitz  # PyMuPDF

# Supplied filename -> document id (the registry slug, see
# src/content/isme-challenge.js).
SOURCES = {
    'ISME Challenge_Instructions.pdf': 'isme-challenge-instructions',
    'ISME Challenge_BL_Stage1.pdf': 'isme-challenge-stage-1',
    'ISME Challenge_BL_Stage2.pdf': 'isme-challenge-stage-2',
    'ISME Challenge_BL_Stage3.pdf': 'isme-challenge-stage-3',
    'ISME Challenge_BL_Stage4.pdf': 'isme-challenge-stage-4',
}

# 2480 px across an A4 page is 300 dpi - above the ~288 dpi the PDF
# exporter rasterises at, so nothing is ever upscaled.
PAGE_WIDTH_PX = 2480
JPEG_QUALITY = 88


def main(source_dir):
    source_dir = Path(source_dir)
    out_root = Path(__file__).resolve().parent.parent / 'public' / 'isme-challenge'
    out_root.mkdir(parents=True, exist_ok=True)

    for name, doc_id in SOURCES.items():
        src = source_dir / name
        shutil.copyfile(src, out_root / f'{doc_id}.pdf')

        pages_dir = out_root / doc_id
        if pages_dir.exists():
            shutil.rmtree(pages_dir)
        pages_dir.mkdir()

        with fitz.open(src) as pdf:
            for index, page in enumerate(pdf, start=1):
                zoom = PAGE_WIDTH_PX / page.rect.width
                pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
                pix.save(pages_dir / f'page-{index:02d}.jpg', jpg_quality=JPEG_QUALITY)
            print(f'{doc_id}: {pdf.page_count} pages')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
