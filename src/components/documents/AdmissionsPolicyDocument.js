/* =====================================================================
   The Admissions Policy.

   Five A4 sheets on the same architecture as every other ATLAS PDF -
   the common sheet, margins, header and footer bands, title block and
   data tables - in ATLAS indigo and teal only. No single school's
   branding appears anywhere in it.

   This file decides only WHERE each piece of the approved content sits
   on the sheet. It invents nothing and reformats no wording: the content
   comes verbatim from src/content/admissions-policy.js. The only layout
   decisions here are the page breaks and the cell merges, which the
   source expresses visually and content must not carry.

   The source runs to five pages, and the content is kept across the same
   five, in the same order: the question-and-answer block, the National
   Boards table, the International Baccalaureate table (whose rows break
   where the source breaks them, between B.Sc and B.Tech), and the
   Cambridge Board table.

   PERMANENT RULE at work here: a first-page-only header and a
   last-page-only footer, with page numbers taken from the real sheet
   count below - never hard-coded.
   ===================================================================== */
import Sheet from '@/components/pdf/Sheet';
import DataTable from '@/components/pdf/DataTable';
import DocumentTitle from '@/components/pdf/DocumentTitle';
import { ATLAS, ATLAS_FOUR_SCHOOLS_LOCKUP, ATLAS_THEME } from '@/lib/brand';
import { pageLabel, showsFooter, showsHeader } from '@/lib/sheet';
import {
  ACCENT_NOTE,
  ANSWER_EMPHASIS,
  ANSWER_TEXT,
  QUESTION,
  TABLE_LABEL,
} from '@/components/pdf/tokens';

/* ---------------------------------------------------------------------
   The question-and-answer blocks.
   --------------------------------------------------------------------- */

/** An answer run: a plain string, or a list mixing strings and the
    emphasised phrases that are styled - but not linked - in the source. */
function AnswerText({ value }) {
  if (typeof value === 'string') return value;
  return value.map((seg, i) =>
    typeof seg === 'string' ? (
      <span key={i}>{seg}</span>
    ) : (
      <span key={i} className={ANSWER_EMPHASIS}>
        {seg.text}
      </span>
    ),
  );
}

/** One answer bullet, on a teal dot. */
function Answers({ list }) {
  if (!list?.length) return null;
  return (
    <div className="mt-[calc(2.8*var(--u))] flex flex-col gap-[calc(2*var(--u))]">
      {list.map((answer, i) => (
        <div key={i} className="flex items-baseline">
          <span className="relative top-[calc(-0.4*var(--u))] mr-[calc(2.8*var(--u))] h-[calc(1.3*var(--u))] w-[calc(1.3*var(--u))] min-w-[calc(1.3*var(--u))] flex-none rounded-full bg-[var(--atlas-teal)]" />
          <span className={`${ANSWER_TEXT} min-w-0 flex-auto`}>
            <AnswerText value={answer} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** A numbered question heading over its answer bullets. The number is
    part of the verbatim heading string, so it is not generated here. */
function Faq({ item, children }) {
  return (
    <div>
      <div className={QUESTION}>{item.q}</div>
      <Answers list={item.a} />
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------
   The three tables, built from the content's logical rows. Cell merges -
   the shared requirement across CBSE/ISC/State Board, and the paired
   B.Des/BBA rows - are layout and so are applied here, not in content.
   --------------------------------------------------------------------- */

function nationalColumns(nb) {
  return [
    { label: 'Specialisation', width: '22%' },
    ...nb.boards.map((label) => ({ label, width: '26%' })),
  ];
}

function nationalRows(nb) {
  // One requirement per specialisation, spanning the three board columns.
  return nb.rows.map((row) => [
    { head: row.spec },
    { text: row.req, colSpan: nb.boards.length },
  ]);
}

/** A group's specialisations become one row each; the shared cells sit on
    the first and span the rest. */
function groupRows(groups, buildShared) {
  return groups.flatMap((group) => {
    const n = group.specs.length;
    return group.specs.map((spec, i) =>
      i === 0
        ? [{ head: spec }, ...buildShared(group, n)]
        : [{ head: spec }],
    );
  });
}

function ibRows(groups) {
  return groupRows(groups, (group, n) => [
    { text: group.diploma, rowSpan: n },
    { text: group.course, rowSpan: n },
    { list: group.career, rowSpan: n },
  ]);
}

function cambridgeRows(groups) {
  return groupRows(groups, (group, n) => [{ text: group.req, rowSpan: n }]);
}

/* ---------------------------------------------------------------------
   The sheets.
   --------------------------------------------------------------------- */
export default function admissionsPolicySheets(doc, unit) {
  const { chrome, questions, nationalBoards, ib, cambridge } = doc;

  // The IB table breaks where the source breaks it: B.Des/BBA and B.Sc on
  // the first sheet, B.Tech and LAW on the next, the column header
  // repeated so the continuation stands on its own.
  const ibFirst = ib.groups.slice(0, 2);
  const ibRest = ib.groups.slice(2);

  const pages = [
    {
      key: 'questions-1',
      content: (
        <>
          <DocumentTitle variant="policy" marker="accent" lines={doc.title} />
          <div className="flex flex-col gap-[calc(6*var(--u))]">
            <Faq item={questions.q1} />
            <Faq item={questions.q2} />
            <Faq item={questions.q3} />
          </div>
        </>
      ),
    },
    {
      key: 'national-boards',
      content: (
        <div className="flex flex-col gap-[calc(6*var(--u))]">
          <Faq item={questions.q4}>
            <div className={`${TABLE_LABEL} mt-[calc(4*var(--u))]`}>
              {nationalBoards.label}
            </div>
            <DataTable
              columns={nationalColumns(nationalBoards)}
              rows={nationalRows(nationalBoards)}
              zebra={false}
              grid
            />
            <div className={`${ACCENT_NOTE} mt-[calc(3.6*var(--u))]`}>
              {doc.internationalNote}
            </div>
          </Faq>
          <Faq item={questions.q5} />
          <Faq item={questions.q6} />
          <Faq item={questions.q7} />
        </div>
      ),
    },
    {
      key: 'ib-1',
      content: (
        <Faq item={questions.q8}>
          <DataTable columns={ib.columns} rows={ibRows(ibFirst)} zebra={false} grid />
        </Faq>
      ),
    },
    {
      key: 'ib-2',
      content: (
        <DataTable columns={ib.columns} rows={ibRows(ibRest)} zebra={false} grid />
      ),
    },
    {
      key: 'cambridge',
      content: (
        <Faq item={questions.q9}>
          <DataTable
            columns={cambridge.columns}
            rows={cambridgeRows(cambridge.groups)}
            zebra={false}
            grid
          />
        </Faq>
      ),
    },
  ];

  const total = pages.length;

  return pages.map(({ key, content }, index) => (
    <Sheet
      key={key}
      scaleSet="admissions-policy"
      unit={unit}
      theme={ATLAS_THEME}
      header={
        showsHeader(chrome.header, index)
          ? {
              // The official four-school horizontal lockup. It is drawn for
              // a light background (indigo wordmark, not reversed), so the
              // band is white and the artwork is fitted to width - see
              // ATLAS_FOUR_SCHOOLS_LOCKUP and SheetHeader's `fit`.
              logo: ATLAS_FOUR_SCHOOLS_LOCKUP,
              href: ATLAS_FOUR_SCHOOLS_LOCKUP.url,
              band: ATLAS.white,
              rule: ATLAS.teal,
              fit: 'contain',
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
