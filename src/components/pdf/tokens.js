/* =====================================================================
   The document type scale.

   PERMANENT RULE - every ATLAS PDF in this project uses these roles.
   Similar elements share one font size, one weight, one line-height and
   one letter-spacing, so type can never drift between documents. A new
   document picks a role; it does not pick a size.

   Every size is a multiple of `--u`, the single design constant that
   lib/sheet.js fits to the sheet, and every colour is a custom property
   set by the sheet's brand theme - so one set of classes serves every
   school without a school colour ever appearing in a component.
   ===================================================================== */

/** The two faces. Montserrat is the brand stand-in for Gotham. */
export const DISPLAY = 'font-[family-name:var(--font-display)]';
export const TEXT = 'font-[family-name:var(--font-text)]';

/** Tabular figures, so columns of amounts align. */
export const TABULAR = '[font-variant-numeric:tabular-nums]';

/* ---------------------------------------------------------------------
   Document title block
   --------------------------------------------------------------------- */
export const TITLE = `${DISPLAY} font-bold text-[calc(7.1*var(--u))] leading-[1.15] tracking-[-0.021em] text-[var(--atlas-indigo)]`;
export const TITLE_ABBR =
  'text-[0.78em] font-semibold tracking-[-0.012em] whitespace-nowrap';
export const SUBTITLE = `${TEXT} mt-[calc(2.6*var(--u))] text-[calc(3.95*var(--u))] leading-[1.3] tracking-[0.004em] text-[var(--muted)]`;

/* A policy sets its title a little smaller and its scope line as a teal
   display label, but on exactly the same block, marker and rule. */
export const POLICY_TITLE = `${DISPLAY} font-bold text-[calc(6.6*var(--u))] leading-[1.15] tracking-[0.005em] text-[var(--atlas-indigo)]`;
export const POLICY_SUBTITLE = `${DISPLAY} mt-[calc(2.6*var(--u))] font-semibold text-[calc(3.6*var(--u))] leading-[1.3] tracking-[0.07em] text-[var(--atlas-teal)]`;

/* ---------------------------------------------------------------------
   Fee table
   --------------------------------------------------------------------- */
export const TABLE_HEAD_LABEL = `${DISPLAY} min-w-0 flex-auto font-bold text-[calc(3.05*var(--u))] leading-[1.3] tracking-[0.052em]`;
export const TABLE_HEAD_AMOUNT = `${DISPLAY} ${TABULAR} flex-none pl-[calc(6*var(--u))] text-right font-bold text-[calc(4.2*var(--u))] leading-[1.1] tracking-[0.012em]`;
export const ROW_LABEL = `${TEXT} min-w-0 flex-auto text-[calc(3.55*var(--u))] leading-[1.3] tracking-[0.002em] text-[var(--ink)]`;
export const ROW_AMOUNT = `${DISPLAY} ${TABULAR} flex-none min-w-[calc(34*var(--u))] pl-[calc(6*var(--u))] text-right font-semibold text-[calc(4*var(--u))] leading-[1.1] tracking-[0.012em] text-[var(--ink)]`;
export const TOTAL_LABEL = `${DISPLAY} min-w-0 flex-auto font-bold text-[calc(3.5*var(--u))] leading-[1.3] text-[var(--ink)]`;
export const TOTAL_AMOUNT = `${DISPLAY} ${TABULAR} flex-none min-w-[calc(34*var(--u))] pl-[calc(6*var(--u))] text-right font-bold text-[calc(4.4*var(--u))] leading-[1.1] tracking-[0.012em] text-[var(--deep)]`;
export const SOLO_AMOUNT = `${DISPLAY} ${TABULAR} flex-none min-w-[calc(34*var(--u))] pl-[calc(6*var(--u))] text-right font-bold text-[calc(5.4*var(--u))] leading-[1.1] tracking-[0.012em] text-[var(--deep)]`;

/* ---------------------------------------------------------------------
   Notes, section headings and terms
   --------------------------------------------------------------------- */
export const NOTE = `${TEXT} text-[calc(3.05*var(--u))] leading-[1.45] tracking-[0.004em] text-[var(--muted)]`;
export const SECTION_HEADING = `${DISPLAY} font-bold text-[calc(5.4*var(--u))] leading-[1.1] tracking-[-0.012em] text-[var(--deep)]`;
export const TERM_NUMBER = `${DISPLAY} ${TABULAR} flex-none w-[calc(6.4*var(--u))] min-w-[calc(6.4*var(--u))] font-semibold text-[calc(3*var(--u))] leading-[1.48] text-[var(--deep)]`;
export const TERM_TEXT = `${TEXT} min-w-0 flex-auto text-[calc(3.05*var(--u))] leading-[1.48] tracking-[0.002em] text-[var(--ink-soft)]`;

/* ---------------------------------------------------------------------
   Body copy (policy documents)
   --------------------------------------------------------------------- */
export const BODY_TEXT = `${TEXT} text-[calc(3.3*var(--u))] leading-[1.62] tracking-[0.002em] text-[var(--ink-soft)]`;
export const BODY_LEAD = 'font-medium text-[var(--ink)]';

/* ---------------------------------------------------------------------
   Data table (policy documents)
   --------------------------------------------------------------------- */
export const DATA_TH = `${DISPLAY} bg-[var(--atlas-indigo)] text-white text-left align-middle font-bold text-[calc(2.95*var(--u))] leading-[1.32] tracking-[0.035em] px-[calc(3*var(--u))] py-[calc(2.8*var(--u))]`;
/* The cell base carries no font-family: each cell role below adds
   exactly one, so a cell can never be given two conflicting faces. */
export const DATA_TD = 'align-middle px-[calc(3*var(--u))] py-[calc(3*var(--u))] border-t-[length:var(--hair)] border-t-[var(--line)]';
export const DATA_TD_TEXT = `${TEXT} text-[calc(3.05*var(--u))] leading-[1.45] text-[var(--ink-soft)]`;
export const DATA_TD_INDEX = `${DISPLAY} text-center font-bold text-[calc(3.4*var(--u))] leading-[1.45] text-[var(--atlas-indigo)]`;
export const DATA_TD_VALUE = `${DISPLAY} ${TABULAR} text-right font-bold text-[calc(4*var(--u))] leading-[1.45] text-[var(--atlas-teal-deep)]`;

/* ---------------------------------------------------------------------
   Footer. Sized from --fu, which never changes, so the band matches on
   every sheet of every document.
   --------------------------------------------------------------------- */
export const FOOTER_ORG = `${DISPLAY} block font-extrabold text-[calc(4.2*var(--fu))] leading-[1.1] tracking-[0.015em] text-white no-underline`;
export const FOOTER_ADDRESS = `${TEXT} block mt-[calc(1.7*var(--fu))] text-[calc(2.9*var(--fu))] leading-[1.42] tracking-[0.004em] text-white/[0.78] no-underline`;
export const FOOTER_HANDLE = `${TEXT} text-[calc(2.9*var(--fu))] leading-[1.1] font-medium tracking-[0.004em] whitespace-nowrap`;
export const FOOTER_PAGE_NUMBER = `${DISPLAY} ${TABULAR} text-[calc(2.9*var(--fu))] leading-[1.1] font-semibold tracking-[0.08em] text-white/70`;
