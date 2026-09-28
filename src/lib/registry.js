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
import { ATLAS, SCHOOLS } from '@/lib/brand';
import { POLICY_SCALE, SCALE } from '@/lib/sheet';

/** The scale sets, and the design scale each one aims for. */
export const SCALE_SETS = {
  'fee-structures': SCALE,
  'refund-policy': POLICY_SCALE,
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
    doc: REFUND_POLICY,
  },
];

export const DOCUMENT_IDS = DOCUMENTS.map((d) => d.id);

export function findDocument(id) {
  return DOCUMENTS.find((d) => d.id === id) ?? null;
}

/** The file every fee structure is packed into when all are exported. */
export const ZIP_NAME = 'ATLAS-Fee-Structures-2027-28.zip';
