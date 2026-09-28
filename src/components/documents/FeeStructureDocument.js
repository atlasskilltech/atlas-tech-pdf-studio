/* =====================================================================
   A fee structure.

   This decides only where each piece of the approved content is placed
   on the sheet. It invents nothing, reorders nothing and reformats
   nothing - and it carries no school-specific markup at all: the school
   arrives as a theme and a lockup, so one renderer serves every school
   and adding another needs no new layout.

   Returns an ARRAY of sheets, as every document renderer does, so the
   viewer, the print route and the exporter can treat all documents
   alike however many sheets they run to.
   ===================================================================== */
import Sheet from '@/components/pdf/Sheet';
import DocumentTitle from '@/components/pdf/DocumentTitle';
import FeeTable, { FeeTableGroup } from '@/components/pdf/FeeTable';
import Notes from '@/components/pdf/Notes';
import TermsList from '@/components/pdf/TermsList';
import { SCHOOLS, schoolTheme } from '@/lib/brand';
import { pageLabel, showsFooter, showsHeader } from '@/lib/sheet';

export default function feeStructureSheets(doc, unit) {
  const school = SCHOOLS[doc.school];
  const { chrome } = doc;

  /* A fee structure is one sheet: the title block, the fee tables, the
     footnotes and the terms. */
  const pages = [
    {
      key: 'fees',
      content: (
        <>
          <DocumentTitle lines={doc.title} subtitle={doc.subtitle} />

          <FeeTableGroup>
            {doc.blocks.map((block, i) => (
              <FeeTable key={i} {...block} />
            ))}
          </FeeTableGroup>

          <Notes notes={doc.notes} />

          <TermsList heading={doc.termsHeading} terms={doc.terms} />
        </>
      ),
    },
  ];

  const total = pages.length;

  return pages.map(({ key, content }, index) => (
    <Sheet
      key={key}
      scaleSet="fee-structures"
      unit={unit}
      theme={schoolTheme(doc.school)}
      header={
        showsHeader(chrome.header, index)
          ? { logo: school.logo, href: school.url, band: school.band }
          : null
      }
      footer={
        showsFooter(chrome.footer, index, total)
          ? { footer: doc.footer, accent: school.color }
          : null
      }
      pageLabel={chrome.pageNumbers ? pageLabel(index, total) : null}
    >
      {content}
    </Sheet>
  ));
}
