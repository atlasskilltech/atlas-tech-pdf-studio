# ATLAS Tech PDF Studio

Next.js (App Router) application that designs, previews and exports the ATLAS
SkillTech University fee-structure and policy PDFs.

## Non-negotiable technology rules

- **JavaScript only.** No TypeScript. No `.ts`, no `.tsx`, ever.
- **Tailwind CSS v4 only.** No `.css`, `.scss`, `.sass` or `.less` file may be
  added to the project. Tailwind is imported from its own package
  (`import 'tailwindcss/index.css'` in `src/app/layout.js`) and
  `postcss.config.mjs` points the scanner at `./src`. Design constants that must
  be inherited are CSS custom properties set inline in `src/app/layout.js`; per
  document they are set on the sheet element. Everything else is a utility class.
- **Mobile-first and fully responsive**, verified from 320px through 2560px.
- No CSS modules, no styled-components, no UI framework, no unnecessary
  dependencies.

---

# PERMANENT PDF RULES

These apply to **every** PDF in this project and are never to be asked about
again. When asked to create or change a PDF, follow them automatically and
change only what was asked — leave every other document and component alone.

## 1. Common header — `src/components/pdf/SheetHeader.js`

Every PDF uses this one header. One structure, one height (26mm), one
alignment, one closing rule, on every sheet of every document.

Only two things change between documents: **the lockup** and **the band
colour behind it**. Never write a new header for a new school.

## 2. Common footer — `src/components/pdf/SheetFooter.js`

Every PDF uses this one footer, and its content comes from the single shared
object in `src/lib/footer.js` — same organisation line, same address, same four
channels, in the same order, everywhere. Never give a document its own footer
content.

The band is always ATLAS indigo. The only document-specific mark is the thin
accent rule above it, which takes `--brand`.

## 3. Common content system — `src/components/pdf/`

Repeated elements are components, never re-implemented markup:

| Element | Component |
|---|---|
| Sheet, chrome, body column | `Sheet.js` |
| Document title + scope + rule | `DocumentTitle.js` |
| Section heading + brand rule | `SectionHeading.js` |
| Fee table card | `FeeTable.js` (`FeeTableGroup` for the stack) |
| Data table (refund schedule, …) | `DataTable.js` |
| Footnotes | `Notes.js` |
| Terms & Conditions | `TermsList.js` |
| Body paragraphs | `BodyText.js` |
| Inline text, links, bold runs | `RichText.js` |
| Social channel icons | `SocialIcon.js` |

## 4. Typography — `src/components/pdf/tokens.js`

Every type role lives there. Similar elements share one size, one weight, one
line-height and one letter-spacing. **Pick a role; never pick a size.** Do not
introduce a new font size in a document file.

Montserrat is the brand's own web stand-in for Gotham (per the brand
guidelines) and carries every display role; Roboto sets body text. Both are
**self-hosted** from `src/fonts/` via `src/lib/fonts.js` — do not switch back to
`next/font/google`, which makes the build depend on a CDN that fails
intermittently. `next/font` only accepts literal values, so the `unicode-range`
strings are written out at each call site rather than shared as constants.

## 5. Tables

All fee tables use `FeeTable`. Header bar, row height, borders, alignment,
typography and spacing are identical in every document; only the colour
changes, and it comes from the sheet theme.

## 6. Logos

Production artwork lives in `public/brand/logos/`, downloaded from the official
brand kit. **Never** redraw, stretch, squash, recolour, rotate or crop a logo,
and never add a shadow, glow, outline or filter. A lockup is always drawn at the
band height with width free, which is what guarantees its true proportions, and
the band is set to the colour the artwork is drawn in so there is no seam.

## 7. School branding — `src/lib/brand.js`

Schools are data. Adding one means adding an entry there plus its lockup — no
new layout, no duplicated document. Every colour is the official brand value;
never approximate and never invent one.

Note the two colours per school:
- `color` — the **official** school colour, for accents, rules and new design work.
- `band` — the colour the **supplied artwork** is actually drawn in, read off
  the file. Used only for the header band so the lockup sits flush.

They differ for uGDX (`#ED1A3B` / artwork `#FF0031`) and School of Law
(`#CC5500` / artwork `#CB5827`); the brand guidelines state the Law case
explicitly.

## 8. Page rules — `src/lib/sheet.js`

Header and footer behaviour is **declared per document**, never assumed:

```js
chrome: { header: 'first', footer: 'last', pageNumbers: true }
// 'first' | 'last' | 'all' | 'none'
```

Do not blindly repeat chrome on every sheet. Where a band is absent it becomes a
plain margin of the same optical depth, so the content column never shifts.

**Page numbers are always derived from the real sheet count.** Never hard-code a
total.

## 9. Fitting — `src/lib/fit.js`

A page can never overflow, clip or run under the footer, and **no document is
ever scaled on its own**. Sheets fit as a *set*: the largest `--u` at which every
sheet in the set fits is applied to all of them. Two documents may differ in how
much blank space is left above the footer — that is just how much approved
content each has — but never in type size or spacing.

## 10. Content is verbatim

`src/content/` carries wording only, as plain JavaScript strings with real
characters. Source spelling, punctuation, casing and inconsistencies are
reproduced **exactly** and deliberately not normalised (e.g. `incease`,
`enrollment`/`enrolment`, the mixed apostrophes and quotes, the doubled space in
`Total One -  Time Fee`). Nothing in `src/content/` describes layout.

## 11. The "Fee Refund Policy" link rule — `src/lib/rich-text.js`

Applied automatically to every fee-structure term; never written by hand:

- wording that already carries a "click here" prompt → **the prompt** is bold and
  linked, the words "Fee Refund Policy" stay plain;
- wording that does not → **"Fee Refund Policy"** is itself bold and linked.

The wording is never changed — a prompt is never added or removed. A document
never links to itself, so the Fee Refund Policy passes `autoLink={false}`.

---

## Flipbook embed (added later; does not change any PDF rule)

`/flipbook/<id>` is a public viewer that renders **the same sheet components**
as the studio and the PDF exporter — it is a viewer, not a second document
system. There is no stored PDF, no PDF.js conversion and no page-image cache;
do not introduce one. A document's id is its registry slug.

- `src/lib/site.js` holds the ONE public-URL value (`NEXT_PUBLIC_SITE_URL`) and
  builds the embed snippet. Embed codes must never contain localhost.
- The book is built with `loadFromImages`, **not** `loadFromHTML`. page-flip's
  HTML renderer transforms real DOM elements and can only draw a flat fold; the
  image renderer draws on a canvas and produces the real curved page curl with
  its gradient and shadows. Page artwork comes from the existing
  `rasterizeSheet()` at `VIEWER_SCALE`, drawn once per document and cached.
  Do not switch this back to `loadFromHTML`.
- **How the book opens is decided by the page count, and only real pages are
  ever shown.** No blank, cover or placeholder page is ever added.
  - 1 page → no flip engine, no page navigation; just the page, zoom, fullscreen.
  - 2 pages → one page at a time at every width (`usePortrait`, no `showCover`).
    A cover-plus-spread would strand page two against an empty half.
  - 3+ pages → `showCover: true`: `[1]`, then `[2|3]`, `[4|5]`, … A lone final
    page on an even count is correct and needs no padding.
- page-flip's canvas renderer repaints the whole book block **solid white**
  every frame (`clear()`), so an empty half - beside the cover, or beside a lone
  final page - looks like a blank sheet. The viewer replaces `render.clear` with
  a transparent `clearRect` so the viewer background shows there instead. Keep
  it; without it those states show a white rectangle the size of a page.
- Sizing is measured from the **stage element** with a `ResizeObserver`, not from
  `window`: inside an iframe the window may never change while the container
  does. `build()` ignores a measurement identical to the one it last built for,
  which stops a scrollbar appearing/disappearing from feeding back into itself.
- Orientation is decided in `FlipbookViewer` and handed to page-flip as
  `usePortrait`; do not rely on the library's own heuristic, which infers it
  from measured widths and disagrees.
- page-flip's `destroy()` removes the element it was given from the document, so
  each build hands it a **fresh** child element. Never reuse one.
- Only `/flipbook/*` may be framed (`frame-ancestors *` in `next.config.mjs`).
  Never add `X-Frame-Options` to that route.

## Asset rule

`ref/` is **reference material only** — the previous static implementation, kept
for studying the designs. Production code must never import from it, link to it
or point a path at it. Production artwork belongs in `public/brand/`.

## Project layout

```
src/app/            routes: the studio (/) and the bare print route (/print/<id>)
src/components/pdf/ the document design system (see the table above)
src/components/documents/  one renderer per kind of document
src/components/studio/     the interface: list, viewer, header, toast
src/content/        verbatim document content, no layout
src/lib/            brand tokens, sheet geometry, fitting, registry, PDF export
public/brand/logos/ official lockups from the brand kit
```

## Checks before finishing

```bash
npm run build     # must succeed
npm run lint      # must be clean
```

Plus: no `.ts`/`.tsx`, no `.css`, no production reference to `ref/`, and the
layout verified from 320px up.
