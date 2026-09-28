/* =====================================================================
   Terms & Conditions.

   PERMANENT RULE - terms are numbered the same way in every ATLAS PDF:
   a fixed-width tabular number in the brand colour, the text beside it
   in the body face, one gap between items. Numbers are always generated
   from the list, never written into the content.

   A term may carry a sub-list - the indented, dotted items used for the
   admissions addresses in the Fee Refund Policy.

   The wording is rendered through <RichText>, which applies the
   permanent "Fee Refund Policy" linking rule automatically. Those links
   are never written by hand.
   ===================================================================== */
import RichText from './RichText';
import SectionHeading from './SectionHeading';
import { TERM_NUMBER, TERM_TEXT } from './tokens';

function SubList({ items }) {
  return (
    <div className="mt-[calc(2.4*var(--u))] flex flex-col gap-[calc(1.5*var(--u))]">
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline">
          <span className="relative top-[calc(-0.7*var(--u))] mr-[calc(2.6*var(--u))] h-[calc(1.3*var(--u))] w-[calc(1.3*var(--u))] min-w-[calc(1.3*var(--u))] flex-none rounded-full bg-[var(--atlas-teal)]" />
          <span className="min-w-0 flex-auto">
            {item.label}
            <a href={`mailto:${item.mailto}`} className="text-inherit no-underline">
              <b className="font-bold">{item.email}</b>
            </a>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TermsList({ heading, terms = [], variant = 'default' }) {
  if (!terms.length) return null;

  const policy = variant === 'policy';
  // A policy places its terms at the top of its own sheet, so it needs
  // no leading gap; it also breathes a little more between items.
  const wrapper = policy ? '' : 'mt-[calc(6*var(--u))]';
  const gap = policy ? 'gap-[calc(3.2*var(--u))]' : 'gap-[calc(2.2*var(--u))]';
  const number = policy
    ? `${TERM_NUMBER} text-[var(--atlas-teal)]`
    : TERM_NUMBER;

  return (
    <div className={wrapper}>
      <SectionHeading size={policy ? 'policy' : 'default'}>
        {heading}
      </SectionHeading>

      <div className={`mt-[calc(3.8*var(--u))] flex flex-col ${gap}`}>
        {terms.map((term, i) => {
          const value = typeof term === 'string' ? term : term.text;
          const list = typeof term === 'string' ? null : term.list;

          return (
            <div key={i} className="flex items-baseline">
              <div className={number}>{i + 1}.</div>
              <div className={TERM_TEXT}>
                <RichText value={value} autoLink={!policy} />
                {list ? <SubList items={list} /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
