# ATLAS SkillTech University — Fee Structures 2027-28 (Intake 27)

Static HTML + Tailwind CSS + vanilla JavaScript. No Node, npm or build step.

**Open `index.html` in Chrome or Edge** (double-click works; no server needed).

- **View**: shows a document exactly as the printed A4 sheet.
- **Download PDF**: creates one PDF (210 × 297 mm pages) containing every page of that
  document. The artwork is drawn at 288 dpi, a real selectable and searchable text layer is
  written behind it, and every link on the sheet becomes a clickable PDF annotation.
- **Download All Fee Structures**: creates `ATLAS-Fee-Structures-2027-28.zip` with all seven PDFs.
- Ready-made copies of every PDF and the ZIP are in `pdf/`.
- The last document in the list is the two-page **Fee Refund Policy**, in ATLAS branding.

## Design

The seven fee structures were redesigned in September 2026. The content is unchanged — every
programme name, amount, note, term and footer line is reproduced exactly, including the
wording differences between documents — but the layout is new:

- Full-bleed school-colour header; the official lockup sits flush in the top-left corner at
  the full height of the band and links to that school's page. Closed by an ATLAS indigo rule.
- Programme title in Montserrat over a school-colour marker; body text in Roboto.
- Fee tables as bordered cards: school-colour header bar, hairline-separated rows,
  right-aligned tabular amounts, tinted total rows.
- ATLAS indigo footer band under a thin school-colour accent: university name over the
  address on the left, the four channels two-by-two on the right. Every item is a link,
  and the PDF export writes them as real hyperlink annotations.

## One scale for the whole collection

Every sheet is built from a single design constant, `--u` (1 mm), declared once on `.page`
in `css/styles.css`. Every type size and every vertical space is a multiple of it, so the
seven documents share one scale exactly — same heading size, same row height, same terms
typography, same footer, same 15 mm horizontal grid.

`render-docs.js` never scales a sheet on its own. If the longest document would not fit,
it reduces `--u` **for the whole collection at once**, so the documents can differ in how
much blank space is left above the footer — which is just how much approved content each
programme has — but never in type size, spacing or alignment. The browser console reports
the scale in use and how much room the tightest page has left.

Fixed page furniture, identical on every sheet: 26 mm header (`--ph-h`, which also sets the
lockup height) + 1.4 mm rule, 15 mm left and right margins (180 mm content column),
1.4 mm accent + 20.6 mm footer band.

Colour: each school's official colour is used for the header band, accents and rules. Text
that sits on the colour uses a slightly deeper shade of the same hue so white type keeps at
least a 5:1 contrast ratio in print and on screen.

| School | Colour | Deeper shade | Lockup |
|---|---|---|---|
| ISDI — Design & Innovation | `#E12A7B` | `#CF2771` | `isdi-full-stack.svg` |
| ISME — Management & Entrepreneurship | `#009FE0` | `#0077A8` | `isme-full-stack.svg` |
| uGDX — Technology | `#ED1A3B` (band `#FF0031`) | `#DB1837` | `ugdx-full-stack-outlined.svg` |
| School of Law | `#CD5928` | `#B85024` | `law-full-stack.png` |

## Files
| Path | Purpose |
|---|---|
| `index.html` | Interface. The documents themselves are generated into `#documents` at load |
| `js/docs-data.js` | **Content** of the seven fee structures — verbatim strings, no layout |
| `js/render-docs.js` | Builds the sheets from that content, and fits each page to A4 |
| `css/styles.css` | The document design: page, header, title, fee cards, terms, footer |
| `css/fonts.css`, `assets/fonts/` | Self-hosted fonts (Montserrat = brand web fallback for Gotham) |
| `js/app.js` | Viewer, PDF and ZIP export |
| `js/assets-data.js`, `js/fonts-data.js` | Logos/icons and fonts embedded for PDF export from disk |
| `js/vendor/` | Tailwind (browser build), jsPDF, JSZip, html2canvas (fallback) |
| `assets/logos/` | Official lockups from atlasuniversity.edu.in/brand-guidelines |
| `js/refund-policy-data.js` | **Content** of the Fee Refund Policy - verbatim, no layout |
| `js/render-refund-policy.js` | Appends its two sheets after the fee structures, and fits them |
| `ref/` | Original reference documents and the approved-fees email |

## Fee Refund Policy

The Fee Refund Policy is the last document in the same list on `index.html`, with the same
View and Download PDF buttons. It is two A4 sheets and uses the same sheet architecture and
the same export pipeline as the fee structures, but ATLAS indigo and teal only - no school
branding. Content comes from `ref/refund-policy/`, reproduced verbatim apart from the
academic-year updates to 2027-28.

Each document keeps its own type scale: the fee structures share `--u` 1.0mm, the policy
runs at 1.16mm. `render-refund-policy.js` chains onto `render-docs.js`, so app.js's single
`FS_RENDER.fitAll()` fits both sets, each against its own sheets.

Text awaiting a URL is marked `#...` in bold teal by `placeholder()` in
`js/refund-policy-data.js`. Replace that call with a real `<a href>` once the URL is known;
the PDF exporter turns any anchor into a clickable annotation automatically.

## Editing a value

All text lives in `js/docs-data.js`. Change the string; the layout follows. Strings are HTML fragments, so write `&amp;` for "&" and use
`\u` escapes for typographic quotes. `<b>…</b>` marks the emphasised runs.

`render-docs.js` owns the formatting of the phrase "Fee Refund Policy": where the wording
already carries a "click here" prompt, that prompt is set bold and linked to the refund
policy; where it does not, "Fee Refund Policy" itself is. Never write those links or the
bold by hand - keep the wording plain and the rule applies everywhere at once.

Nothing in that file describes position or size. If a document grows, `render-docs.js`
trims that page's master unit (`--u`) until it fits the sheet, so a page can never overflow,
clip or run under the footer — the type simply sets a little smaller.

If you replace a logo SVG, also update its entry in `js/assets-data.js` (base64 of the file)
so PDF export picks it up.

`index.html?render=<id>` (e.g. `?render=mba`, or `?render=all`) shows just the pages of one
document, for printing (Ctrl+P, margins "None") or visual checks. Document ids:
`bdes`, `isdi-btech`, `btech`, `bsc-finance`, `mba`, `mdes-mba`, `bba-llb`.
