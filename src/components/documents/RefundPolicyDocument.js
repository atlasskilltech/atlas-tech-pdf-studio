/* =====================================================================
   The Fee Refund Policy.

   Two A4 sheets on the same architecture as the fee structures - same
   sheet, same margins, same header and footer bands, same title block,
   same terms list - in ATLAS indigo and teal only. No school branding
   appears anywhere in it.

   PERMANENT RULE at work here: this design specifies a first-page-only
   header and a last-page-only footer, so that is what is drawn. The
   page number on the footer comes from the real number of sheets below,
   never from a hard-coded total.
   ===================================================================== */
import Sheet from '@/components/pdf/Sheet';
import BodyText from '@/components/pdf/BodyText';
import DataTable from '@/components/pdf/DataTable';
import DocumentTitle from '@/components/pdf/DocumentTitle';
import Notes from '@/components/pdf/Notes';
import TermsList from '@/components/pdf/TermsList';
import { ATLAS, ATLAS_LOCKUP, ATLAS_THEME } from '@/lib/brand';
import { pageLabel, showsFooter, showsHeader } from '@/lib/sheet';

export default function refundPolicySheets(doc, unit) {
  const { chrome } = doc;

  /* Sheet 1: title, the policy paragraph, the refund schedule and its
     footnote.  Sheet 2: the full Terms & Conditions. */
  const pages = [
    {
      key: 'schedule',
      content: (
        <>
          <DocumentTitle
            variant="policy"
            marker="accent"
            lines={doc.title}
            subtitle={doc.subtitle}
          />
          <BodyText value={doc.intro} autoLink={false} />
          <BodyText
            value={doc.lastDate}
            lead
            autoLink={false}
            className="mt-[calc(4*var(--u))]"
          />
          <DataTable columns={doc.table.columns} rows={doc.table.rows} />
          <Notes notes={[doc.tableNote]} autoLink={false} />
        </>
      ),
    },
    {
      key: 'terms',
      content: (
        <TermsList
          variant="policy"
          heading={doc.termsHeading}
          terms={doc.terms}
        />
      ),
    },
  ];

  const total = pages.length;

  return pages.map(({ key, content }, index) => (
    <Sheet
      key={key}
      scaleSet="refund-policy"
      unit={unit}
      theme={ATLAS_THEME}
      header={
        showsHeader(chrome.header, index)
          ? {
              logo: ATLAS_LOCKUP,
              href: ATLAS_LOCKUP.url,
              band: ATLAS.indigo,
              rule: ATLAS.teal,
            }
          : null
      }
      footer={
        showsFooter(chrome.footer, index, total)
          ? { footer: doc.footer, accent: ATLAS.teal }
          : null
      }
      pageLabel={chrome.pageNumbers ? pageLabel(index, total) : null}
    >
      {content}
    </Sheet>
  ));
}
