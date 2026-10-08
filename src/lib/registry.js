/* =====================================================================
   The document registry.

   One list, in the order the studio shows them. Everything the
   interface needs - the name on the card, the scope line, the accent
   swatch, the export filename - is derived here from the content, so a
   new document is added by writing its content and listing it, and the
   interface picks it up unchanged.
   ===================================================================== */
import { FEE_STRUCTURES } from '@/content/fee-structures';
import { REFUND_POLICY } from '@/content/refund-policy';
import { ADMISSIONS_POLICY } from '@/content/admissions-policy';
import { ATLAS, SCHOOLS } from '@/lib/brand';
import { ADMISSIONS_SCALE, POLICY_SCALE, SCALE } from '@/lib/sheet';

/** The scale sets, and the design scale each one aims for. */
export const SCALE_SETS = {
  'fee-structures': SCALE,
  'refund-policy': POLICY_SCALE,
  'admissions-policy': ADMISSIONS_SCALE,
};

export const DOCUMENTS = [
  ...FEE_STRUCTURES.map((doc) => ({
    id: doc.id,
    kind: doc.kind,
    file: doc.file,
    name: doc.cardName,
    scope: doc.cardScope,
    title: doc.docTitle,
    accent: SCHOOLS[doc.school].color,
    school: doc.school,
    // Where it sits in the university's structure, and the programme
    // that names it once the school and level are already on screen.
    group: doc.school,
    level: doc.level,
    programme: doc.cardScope,
    doc,
  })),
  {
    id: REFUND_POLICY.id,
    kind: REFUND_POLICY.kind,
    file: REFUND_POLICY.file,
    name: REFUND_POLICY.cardName,
    scope: REFUND_POLICY.cardScope,
    title: REFUND_POLICY.docTitle,
    accent: ATLAS.indigo,
    school: null,
    // A university-wide policy belongs to no school and sits at no
    // level, so it is listed under ATLAS on its own.
    group: 'atlas',
    level: null,
    programme: REFUND_POLICY.cardName,
    doc: REFUND_POLICY,
  },
  {
    id: ADMISSIONS_POLICY.id,
    kind: ADMISSIONS_POLICY.kind,
    file: ADMISSIONS_POLICY.file,
    name: ADMISSIONS_POLICY.cardName,
    scope: ADMISSIONS_POLICY.cardScope,
    title: ADMISSIONS_POLICY.docTitle,
    accent: ATLAS.indigo,
    school: null,
    // Another university-wide policy, listed under ATLAS beside the
    // Fee Refund Policy.
    group: 'atlas',
    level: null,
    programme: ADMISSIONS_POLICY.cardName,
    doc: ADMISSIONS_POLICY,
  },
];

export const DOCUMENT_IDS = DOCUMENTS.map((d) => d.id);

export function findDocument(id) {
  return DOCUMENTS.find((d) => d.id === id) ?? null;
}

/* ---------------------------------------------------------------------
   The document hierarchy.

   School, then level, then programme - the way the university describes
   its own documents. The studio lists them this way, so a reader looks
   for a sheet where they would expect to find it rather than scanning a
   flat list of eight.

   Both orders are declared rather than derived, because neither is
   alphabetical: ATLAS comes first because it applies to everyone, and a
   degree is read undergraduate-first.
   --------------------------------------------------------------------- */
const GROUP_ORDER = [
  { key: 'atlas', label: 'ATLAS', accent: ATLAS.indigo },
  { key: 'isdi', label: 'ISDI', accent: SCHOOLS.isdi.color },
  { key: 'isme', label: 'ISME', accent: SCHOOLS.isme.color },
  { key: 'ugdx', label: 'uGDX', accent: SCHOOLS.ugdx.color },
  { key: 'law', label: 'LAW', accent: SCHOOLS.law.color },
];

const LEVEL_ORDER = [
  'Undergraduate Degree',
  'Postgraduate Degree',
  'Integrated Programs',
];

/**
 * The registry, grouped for the interface: an ordered list of schools,
 * each an ordered list of levels, each holding its documents in the
 * order they are registered. A group or a level with nothing in it is
 * left out, so adding or removing a document reshapes the list on its
 * own.
 */
export const DOCUMENT_TREE = GROUP_ORDER.map((group) => {
  const inGroup = DOCUMENTS.filter((d) => d.group === group.key);

  // A document with no level - a university-wide policy - is listed
  // directly under its school, with no heading above it.
  const levels = [
    ...(inGroup.some((d) => !d.level)
      ? [{ label: null, documents: inGroup.filter((d) => !d.level) }]
      : []),
    ...LEVEL_ORDER.map((label) => ({
      label,
      documents: inGroup.filter((d) => d.level === label),
    })).filter((level) => level.documents.length > 0),
  ];

  return { ...group, levels };
}).filter((group) => group.levels.length > 0);

/** The file every fee structure is packed into when all are exported. */
export const ZIP_NAME = 'ATLAS-Fee-Structures-2027-28.zip';
