# ATLAS Tech PDF Studio

Design, preview and export the ATLAS SkillTech University fee structures and the
Fee Refund Policy as print-ready A4 PDFs.

Next.js (App Router) · JavaScript · Tailwind CSS v4 · no stylesheet files.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## What it does

- **Preview** — every document is shown exactly as the printed A4 sheet, scaled
  to the width available.
- **Download PDF** — one PDF per document, pages exactly 210 × 297 mm. The
  artwork is drawn by the browser at ~288 dpi, a real selectable and searchable
  text layer sits behind it, and every link on the sheet becomes a clickable PDF
  annotation.
- **Download All Fee Structures** — all seven, packed into one ZIP.
- **Get Embed Code** — hands over an iframe that embeds the document as a
  flipbook on any external site. See **Flipbook embed** below.
- **`/print/<id>`** — the bare sheets, for printing (Ctrl+P, margins "None") or
  for checking a design. `/print/all` shows the whole collection. Ids: `bdes`,
  `isdi-btech`, `btech`, `bsc-finance`, `mba`, `mdes-mba`, `bba-llb`,
  `refund-policy`.
- A URL fragment opens a document directly, e.g. `/#mba`.

## The documents

| Document | School | Sheets |
|---|---|---|
| ISDI Undergraduate Degree — B.Des | ISDI | 1 |
| ISDI Undergraduate Degree — B.Tech | ISDI | 1 |
| uGDX Undergraduate Degree — B.Tech | uGDX | 1 |
| ISME Undergraduate Degree — BBA / B.Sc | ISME | 1 |
| ISME Postgraduate Degree — MBA | ISME | 1 |
| ISDI Postgraduate Degree — M.Des & MBA | ISDI | 1 |
| BBA-LLB (Hons.) | School of Law | 1 |
| Fee Refund Policy | ATLAS (no school branding) | 2 |

## Flipbook embed

`/flipbook/<id>` is a public, page-turning viewer for one document, built to be
embedded in someone else's website. **Get Embed Code** in the studio produces
the iframe to paste:

```html
<iframe
  src="https://pdf.atlasuniversity.edu.in/flipbook/mba"
  width="100%"
  height="700"
  style="border:0;"
  allowfullscreen
  loading="lazy">
</iframe>
```

Set the public origin once, per deployment (see `.env.example`):

```
NEXT_PUBLIC_SITE_URL=https://pdf.atlasuniversity.edu.in
```

Until it is set the embed dialog says so plainly rather than handing out a
localhost URL that would not work anywhere else.

**Nothing is stored or converted.** The viewer draws the very same sheet
components the studio previews and the PDF exporter rasterises, fitted by the
same pass and drawn by the same rasteriser — so a flipbook can never drift from
the PDF it represents, and there is no generated file to keep, expire or clean
up. The document id is the registry slug already in use (`mba`,
`refund-policy`, …), so an embed pasted into another site keeps working.

Pages turn like paper: a curved page curl in 3-D with its gradient shading and
inner, outer and book shadows. That comes from page-flip's canvas renderer, so
each sheet is drawn once to a page image (at screen resolution, not print
resolution) and cached; resizing, zooming and turning all reuse it. The
trade-off is that the text in the flipbook is artwork — the selectable,
searchable text and the clickable links live in the downloadable PDF.

Turn a page by clicking, dragging its corner, swiping, using the arrow keys or
the toolbar buttons. The first sheet stands alone as a cover, so a two-page
document has a real page to turn; longer documents then read as spreads
(1, 2–3, 4–5, …). A **single-sheet document is not a book**: it shows the page
with no flip animation and no page navigation, just zoom and fullscreen.

The viewer shows a two-page spread where each page stays readable and a single
page otherwise — every phone, a tablet held upright, a narrow embed.

Only `/flipbook/*` is embeddable: it sends `Content-Security-Policy:
frame-ancestors *`, while the studio sends `X-Frame-Options: SAMEORIGIN`.

## The design system

One A4 sheet, one scale, one set of components. Everything on a sheet is sized
from `--u`, a single design constant, so a set of documents shares one type
scale exactly — same heading size, same row height, same terms typography, same
footer, same 15mm horizontal grid. If the longest document would not fit,
`--u` is reduced for the whole set at once, never for one document alone.

Fixed furniture on every sheet: 26mm header + 1.4mm rule, 15mm left and right
margins (a 180mm content column), 1.4mm accent + 20.6mm footer band. Header and
footer are sized from `--fu`, which never changes, so the bands match even when
a document's body runs at a different `--u`.

Header and footer placement is declared per document — first-page-only header
and last-page-only footer for the policy — and page numbers always come from the
real sheet count.

### Colour

Official values from <https://atlasuniversity.edu.in/brand-guidelines/>.

| | Official colour | Artwork band | Lockup |
|---|---|---|---|
| ATLAS | `#342B7C` indigo, `#3CA7B6` teal | `#342B7C` | `atlas-skilltech-full-stack.svg` |
| ISDI — Design & Innovation | `#E12A7B` | `#E12A7B` | `isdi-full-stack.svg` |
| ISME — Management & Entrepreneurship | `#009FE0` | `#009FE0` | `isme-full-stack.svg` |
| uGDX — Technology | `#ED1A3B` | `#FF0031` | `ugdx-full-stack.png` |
| School of Law | `#CC5500` | `#CB5827` | `law-full-stack.svg` |

Where the two differ, the band takes the colour the supplied artwork is drawn in
so the lockup sits on it without a seam; the official colour is used for every
accent and rule. The brand kit states the Law case explicitly.

Text sitting on a school colour uses a slightly deeper shade of the same hue, so
white type keeps at least a 5:1 contrast ratio in print and on screen.

### Typography

Montserrat carries every display role — it is the brand's own web stand-in for
Gotham, as the brand guidelines state. Roboto sets the body text.

Both are **self-hosted from `src/fonts/`** (the official Google Fonts `latin` and
`latin-ext` subsets, byte for byte), wired up in `src/lib/fonts.js` via
`next/font/local`. Fetching them from Google at build time made the build depend
on a third-party CDN — which failed intermittently in practice — and would let
the binaries behind the artwork change without notice. Each family is declared
once per subset with that subset's own `unicode-range`, exactly the split Google
serves, so ordinary copy loads only the small latin file.

### Logos

`public/brand/logos/` holds the official lockups from the brand kit. A lockup is
always drawn at the band height with its width free, so it is never stretched,
squashed or cropped, and it is never recoloured or given a shadow, glow or
outline.

uGDX uses the supplied PNG rather than the SVG: the official uGDX SVG sets
"School of Technology" as live text in Gotham, which no browser has, so it would
render in a substitute face. The PNG carries that type as artwork.

## Editing content

All wording lives in `src/content/`. Change the string; the layout follows.
Strings are plain JavaScript with real characters — no HTML, no entities — and
nothing in those files describes position or size.

The wording is reproduced verbatim from the approved documents, including the
inconsistencies between them; they are deliberately not normalised.

Do not write "Fee Refund Policy" links or their bold by hand. Keep the wording
plain and the rule in `src/lib/rich-text.js` applies everywhere at once.

To add a school: add an entry to `SCHOOLS` in `src/lib/brand.js` and its lockup
to `public/brand/logos/`. No layout changes are needed.

## Project layout

| Path | Purpose |
|---|---|
| `src/app/` | Routes: the studio (`/`) and the bare print route (`/print/<id>`) |
| `src/components/pdf/` | The document design system: sheet, header, footer, title, tables, terms |
| `src/components/pdf/tokens.js` | The type scale — every repeated role, in one place |
| `src/components/documents/` | One renderer per kind of document |
| `src/components/studio/` | The interface: list, viewer, header, toast |
| `src/content/` | Verbatim document content, no layout |
| `src/lib/brand.js` | Official palette, schools, lockups |
| `src/lib/fonts.js` | Self-hosted typography (`next/font/local`) |
| `src/fonts/` | Official Montserrat and Roboto subsets |
| `src/lib/sheet.js` | Sheet geometry, design scale, page rules |
| `src/lib/fit.js` | Fitting sheets to A4, one scale per set |
| `src/lib/rich-text.js` | Inline text model and the refund-policy link rule |
| `src/lib/pdf/` | Export: rasterising, text layer, link annotations, ZIP |
| `src/lib/site.js` | The one public-URL value, and the embed snippet |
| `src/components/flipbook/` | The public flipbook viewer and its controls |
| `public/brand/logos/` | Official lockups |
| `ref/` | Reference material only — never imported by production code |

`CLAUDE.md` records the permanent PDF rules this project is built on.

## Notes

- There is no `.css` file in the project. Tailwind is imported from its own
  package in `src/app/layout.js`, and `postcss.config.mjs` points the class
  scanner at `./src`. Design constants are CSS custom properties, set inline on
  `<html>` and on each sheet.
- No `::before` / `::after` content is used inside a sheet: the PDF exporter
  clones the page and inlines computed styles, and generated content would not
  survive that. Every mark on a sheet is a real element.
- `jspdf` and `jszip` are loaded on demand, so they stay out of the first load.
