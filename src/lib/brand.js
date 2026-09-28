/* =====================================================================
   ATLAS brand tokens.

   Authoritative source: https://atlasuniversity.edu.in/brand-guidelines/
   Every value below is the official brand-guideline value. Nothing here
   is approximated or invented.

   Two colours are recorded per school:

     `color` - the OFFICIAL school colour. Accents, rules, markers and
               any new design work use this.
     `band`  - the colour the supplied lockup artwork is actually drawn
               in. The header band uses it so the lockup sits flush on
               the band with no visible seam. It is read off the artwork,
               never chosen.

   Where the two differ, the brand guidelines say so explicitly - e.g.
   "The Law logo artwork itself is drawn in #CB5827. Use #CC5500 for new
   designs."
   ===================================================================== */

/** Official ATLAS palette. */
export const ATLAS = {
  indigo: '#342B7C', // Primary. Backgrounds, headings, logo lockups.
  teal: '#3CA7B6', // Accent. Buttons, highlights, the logo cube.
  white: '#FFFFFF',
  paper: '#FAFAFA',
  silver: '#DFDFDF',
  graphite: '#5F5F5F',
};

/** Official school colours. */
export const SCHOOL_COLOR = {
  isdi: '#E12A7B', // ISDI Pink   - School of Design & Innovation
  isme: '#009FE0', // ISME Blue   - School of Management & Entrepreneurship
  ugdx: '#ED1A3B', // uGDX Red    - School of Technology
  law: '#CC5500', // Law Orange  - School of Law
};

/* ---------------------------------------------------------------------
   Document ink. Neutrals for body copy and rules on the printed sheet -
   not brand colours, so they are kept apart from the palette above.
   --------------------------------------------------------------------- */
export const INK = {
  base: '#1F2430',
  soft: '#3C4250',
  muted: '#6A7182',
  line: '#DCE0E9',
  lineSoft: '#EDEFF4',
};

/* ---------------------------------------------------------------------
   Schools.

   `deep` is a darker shade of the same official hue, used only where
   white type sits on the colour so the contrast ratio stays at or above
   5:1 in print and on screen. It is a shade of the official colour, not
   a second brand colour.

   `logo` is the official lockup supplied by the brand kit and served
   from /brand/logos. `ratio` is the artwork's own width/height - the
   lockup is always drawn at the band height with width free, so it can
   never be stretched or squashed.
   --------------------------------------------------------------------- */
export const SCHOOLS = {
  isdi: {
    key: 'isdi',
    name: 'ISDI',
    label: 'ISDI · School of Design & Innovation',
    url: 'https://atlasuniversity.edu.in/schools/isdi/',
    color: SCHOOL_COLOR.isdi,
    deep: '#CF2771',
    band: '#E12A7B',
    tint: { t06: '#FDF2F7', t10: '#FCEAF2', t16: '#FADDEA' },
    logo: {
      src: '/brand/logos/isdi-full-stack.svg',
      ratio: 1392.7 / 402.5,
      alt: 'ATLAS SkillTech University | ISDI School of Design & Innovation',
    },
  },
  isme: {
    key: 'isme',
    name: 'ISME',
    label: 'ISME · School of Management & Entrepreneurship',
    url: 'https://atlasuniversity.edu.in/schools/isme/',
    color: SCHOOL_COLOR.isme,
    deep: '#0077A8',
    band: '#009FE0',
    tint: { t06: '#F0F9FD', t10: '#E6F5FC', t16: '#D6F0FA' },
    logo: {
      src: '/brand/logos/isme-full-stack.svg',
      ratio: 3904.9 / 1042.8,
      alt: 'ATLAS SkillTech University | ISME School of Management & Entrepreneurship',
    },
  },
  ugdx: {
    key: 'ugdx',
    name: 'uGDX',
    label: 'uGDX · School of Technology',
    url: 'https://atlasuniversity.edu.in/schools/ugdx/',
    color: SCHOOL_COLOR.ugdx,
    deep: '#DB1837',
    // The supplied uGDX artwork is drawn in #FF0031.
    band: '#FF0031',
    tint: { t06: '#FEF1F3', t10: '#FDE8EB', t16: '#FCDAE0' },
    logo: {
      // The official uGDX SVG sets "School of Technology" as live text in
      // Gotham, which no browser has, so it renders in a substitute face.
      // The supplied PNG of the same lockup carries the type as artwork
      // and is used instead - same official artwork, nothing redrawn.
      src: '/brand/logos/ugdx-full-stack.png',
      ratio: 6988 / 2183,
      alt: 'ATLAS SkillTech University | uGDX School of Technology',
    },
  },
  law: {
    key: 'law',
    name: 'School of Law',
    label: 'School of Law',
    url: 'https://atlasuniversity.edu.in/schools/law/',
    color: SCHOOL_COLOR.law,
    deep: '#B85024',
    // The supplied Law artwork is drawn in #CB5827 (stated in the kit).
    band: '#CB5827',
    tint: { t06: '#FCF5F2', t10: '#FAEEEA', t16: '#F7E4DD' },
    logo: {
      src: '/brand/logos/law-full-stack.svg',
      ratio: 905.83 / 270.32,
      alt: 'ATLAS SkillTech University | School of Law',
    },
  },
};

/** The university mark, for documents that carry no school branding. */
export const ATLAS_LOCKUP = {
  src: '/brand/logos/atlas-skilltech-full-stack.svg',
  ratio: 2003.71 / 1028.82,
  alt: 'ATLAS SkillTech University',
  url: 'https://atlasuniversity.edu.in/',
};

/* ---------------------------------------------------------------------
   Brand theme for a sheet.

   Returns the custom properties every document component reads. A sheet
   is themed by setting these once on the sheet element; no component
   ever hard-codes a school colour.
   --------------------------------------------------------------------- */

/** Theme for a school fee structure. */
export function schoolTheme(schoolKey) {
  const s = SCHOOLS[schoolKey];
  return {
    '--brand': s.color,
    '--deep': s.deep,
    '--band': s.band,
    '--t06': s.tint.t06,
    '--t10': s.tint.t10,
    '--t16': s.tint.t16,
  };
}

/** Theme for an ATLAS-branded document: indigo and teal only. */
export const ATLAS_THEME = {
  '--brand': ATLAS.teal,
  '--deep': ATLAS.indigo,
  '--band': ATLAS.indigo,
  '--t06': '#F3F2F7',
  '--t10': '#EBEAF2',
  '--t16': '#DFDDEA',
};
