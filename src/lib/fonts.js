/* =====================================================================
   Typography.

   Montserrat carries every display role - it is the brand's own free web
   stand-in for Gotham, as the ATLAS brand guidelines state - and Roboto
   sets the body text.

   The font files are SELF-HOSTED, in src/fonts. Fetching them from
   Google at build time made the build depend on a third-party CDN, and
   that dependency fails intermittently; worse, for a project whose whole
   purpose is print fidelity, it would let the binaries behind the
   artwork change without notice. These are the official Google Fonts
   latin and latin-ext subsets, byte for byte.

   Each family is declared twice, once per subset, sharing one
   `font-family` and carrying the subset's own `unicode-range` - exactly
   the split Google serves. The browser then loads the small latin file
   for ordinary copy and only reaches for latin-ext when a document
   actually needs it.

   `next/font/local` writes the @font-face rules, so this costs the
   project no stylesheet.
   ===================================================================== */
import localFont from 'next/font/local';

/*
   The unicode ranges below are Google's own latin and latin-ext splits,
   written out at each call site because next/font only accepts literal
   values - it reads these at build time, before any constant exists.
*/
/* ---------------------------------------------------------------------
   Display: Montserrat 500 / 600 / 700 / 800
   --------------------------------------------------------------------- */
const displayLatin = localFont({
  src: [
    { path: '../fonts/Montserrat-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Montserrat-600-latin.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Montserrat-700-latin.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Montserrat-800-latin.woff2', weight: '800', style: 'normal' },
  ],
  display: 'block',
  declarations: [
    { prop: 'font-family', value: 'AtlasDisplay' },
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
});

const displayLatinExt = localFont({
  src: [
    { path: '../fonts/Montserrat-500-latin-ext.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Montserrat-600-latin-ext.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Montserrat-700-latin-ext.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Montserrat-800-latin-ext.woff2', weight: '800', style: 'normal' },
  ],
  display: 'block',
  declarations: [
    { prop: 'font-family', value: 'AtlasDisplay' },
    {
      prop: 'unicode-range',
      value:
        'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
    },
  ],
});

/* ---------------------------------------------------------------------
   Text: Roboto 400 / 500 / 700
   --------------------------------------------------------------------- */
const textLatin = localFont({
  src: [
    { path: '../fonts/Roboto-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Roboto-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Roboto-700-latin.woff2', weight: '700', style: 'normal' },
  ],
  display: 'block',
  declarations: [
    { prop: 'font-family', value: 'AtlasText' },
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
});

const textLatinExt = localFont({
  src: [
    { path: '../fonts/Roboto-400-latin-ext.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Roboto-500-latin-ext.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Roboto-700-latin-ext.woff2', weight: '700', style: 'normal' },
  ],
  display: 'block',
  declarations: [
    { prop: 'font-family', value: 'AtlasText' },
    {
      prop: 'unicode-range',
      value:
        'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
    },
  ],
});

/**
 * Loading every face, and the two custom properties the sheets read.
 * The families are named in the declarations above, so the properties
 * are set here rather than taken from a generated class.
 */
export const fontClassName = [
  displayLatin.className,
  displayLatinExt.className,
  textLatin.className,
  textLatinExt.className,
].join(' ');

export const fontVars = {
  '--font-display': "AtlasDisplay, 'Segoe UI', Arial, sans-serif",
  '--font-text': "AtlasText, 'Segoe UI', Arial, sans-serif",
};
