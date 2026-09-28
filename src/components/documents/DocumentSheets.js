/* =====================================================================
   One document's sheets.

   The single place that maps a registry entry to the renderer that
   draws it. Every renderer returns an ARRAY of sheets, so the viewer,
   the fit pass, the print route and the PDF exporter all work on the
   same shape and never need to know which kind of document they are
   looking at.
   ===================================================================== */
import feeStructureSheets from './FeeStructureDocument';
import refundPolicySheets from './RefundPolicyDocument';

const RENDERERS = {
  'fee-structure': feeStructureSheets,
  policy: refundPolicySheets,
};

/** The sheets of one document, as an array of elements. */
export function documentSheets(entry, unit) {
  const render = RENDERERS[entry.kind];
  return render ? render(entry.doc, unit) : [];
}
