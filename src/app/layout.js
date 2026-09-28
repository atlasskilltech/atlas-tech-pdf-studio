/* =====================================================================
   Root layout.

   Tailwind is imported straight from the package's own stylesheet, so
   the project carries no .css file of its own: every style in the
   application is a Tailwind utility class, and the few design constants
   that must be inherited (the brand palette, the document ink) are CSS
   custom properties declared once here on <html>.

   Typography lives in lib/fonts.js: Montserrat for display, Roboto for
   text, both self-hosted, so the sheets render identically on screen,
   in print and in the exported PDF - and the build never depends on a
   font CDN.
   ===================================================================== */
import 'tailwindcss/index.css';
import { ATLAS, INK } from '@/lib/brand';
import { PRODUCT } from '@/lib/product';
import { fontClassName, fontVars } from '@/lib/fonts';

/** Design constants inherited by the whole application. */
const rootVars = {
  ...fontVars,
  '--atlas-indigo': ATLAS.indigo,
  '--atlas-teal': ATLAS.teal,
  '--atlas-teal-deep': '#2E7F8A',
  '--ink': INK.base,
  '--ink-soft': INK.soft,
  '--muted': INK.muted,
  '--line': INK.line,
  '--line-soft': INK.lineSoft,
};

export const metadata = {
  title: {
    default: PRODUCT.name,
    // Every other page names itself and is placed inside the product,
    // so a document's own title still reads first in a browser tab.
    template: `%s · ${PRODUCT.name}`,
  },
  applicationName: PRODUCT.name,
  description:
    'Design, preview and export the ATLAS SkillTech University fee structures and policy documents as print-ready PDFs and embeddable flipbooks.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: ATLAS.indigo,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={rootVars} className={fontClassName}>
      <body className="bg-slate-100 font-[family-name:var(--font-display)] text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
