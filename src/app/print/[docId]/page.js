/* =====================================================================
   The print route.

   /print/<id> shows just the sheets of one document - no interface - for
   printing straight from the browser (Ctrl+P, margins "None") or for
   checking a design against the approved artwork. /print/all shows the
   whole collection.

   The sheets are the very same components the studio previews and the
   exporter rasterises, so there is no second version of a document that
   could drift from the first.
   ===================================================================== */
import { notFound } from 'next/navigation';
import PrintSheets from '@/components/studio/PrintSheets';
import { DOCUMENTS, findDocument } from '@/lib/registry';

export function generateStaticParams() {
  return [{ docId: 'all' }, ...DOCUMENTS.map((d) => ({ docId: d.id }))];
}

export async function generateMetadata({ params }) {
  const { docId } = await params;
  if (docId === 'all') return { title: 'Fee Structures 2027-28' };
  const entry = findDocument(docId);
  return { title: entry ? entry.file.replace(/\.pdf$/, '') : 'Not found' };
}

export default async function PrintPage({ params }) {
  const { docId } = await params;
  const entries = docId === 'all' ? DOCUMENTS : [findDocument(docId)];

  if (entries.some((entry) => !entry)) notFound();

  return <PrintSheets entries={entries} />;
}
