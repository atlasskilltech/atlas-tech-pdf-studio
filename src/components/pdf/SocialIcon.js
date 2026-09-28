/* =====================================================================
   Social channel icons.

   These are the platforms' own marks, not ATLAS brand assets, so they
   are authored here as inline SVG rather than shipped as files: one
   white disc carrying an ATLAS-indigo glyph, at one size, for all four
   channels. Being inline, they need no network fetch and rasterise
   cleanly into the exported PDF.

   The disc and glyph colours are the only thing shared with the footer;
   nothing here is school-specific. The glyph colour is set as a literal
   rather than a custom property because it is written to SVG `fill`
   presentation attributes, which the PDF exporter rasterises directly.
   ===================================================================== */
import { ATLAS } from '@/lib/brand';

const GLYPH = ATLAS.indigo;

function Instagram() {
  return (
    <g fill="none" stroke={GLYPH} strokeWidth="1.15">
      <rect x="3.3" y="3.3" width="9.4" height="9.4" rx="2.85" />
      <circle cx="8" cy="8" r="2.35" />
      <circle cx="10.95" cy="5.05" r="0.72" fill={GLYPH} stroke="none" />
    </g>
  );
}

function Facebook() {
  return (
    <path
      fill={GLYPH}
      d="M10.18 8.72h-1.64v4.91H6.33V8.72H4.52V6.69h1.81V5.15c0-1.76 1.05-2.74 2.66-2.74.77 0 1.58.14 1.58.14v1.72h-.89c-.87 0-1.14.55-1.14 1.1v1.32h1.95l-.31 2.03Z"
    />
  );
}

function LinkedIn() {
  return (
    <g fill={GLYPH}>
      <rect x="4.15" y="6.45" width="1.79" height="5.72" />
      <circle cx="5.05" cy="4.62" r="1.04" />
      <path d="M7.37 6.45h1.71v.78h.03c.24-.45.82-.93 1.69-.93 1.81 0 2.15 1.19 2.15 2.74v3.13h-1.79V9.4c0-.67-.01-1.53-.93-1.53-.93 0-1.07.73-1.07 1.48v2.82H7.37V6.45Z" />
    </g>
  );
}

function YouTube() {
  return (
    <>
      <rect x="2.68" y="4.5" width="10.64" height="8.96" rx="2.1" fill={GLYPH} />
      <path fill="#fff" d="M6.87 10.82V7.14l3.06 1.84-3.06 1.84Z" />
    </>
  );
}

const GLYPHS = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: LinkedIn,
  youtube: YouTube,
};

export default function SocialIcon({ name, className }) {
  const Glyph = GLYPHS[name];
  if (!Glyph) return null;

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="8" fill="#fff" />
      <Glyph />
    </svg>
  );
}
