/* =====================================================================
   The common footer.

   PERMANENT RULE - every ATLAS PDF in this project uses THIS footer.
   One height, one structure, one set of type sizes, one order of
   channels, one address, on every sheet of every document. The content
   comes from the single shared object in lib/footer.js, so it cannot
   drift between documents.

   The band is always ATLAS indigo. The only school-specific mark is the
   thin accent rule above it, which takes the document's brand colour.

   Every item is a link, and each becomes a real clickable annotation in
   the exported PDF.

   The page number is optional and, when shown, is always derived from
   the real number of sheets - never a hard-coded total.
   ===================================================================== */
import SocialIcon from './SocialIcon';
import {
  FOOTER_ADDRESS,
  FOOTER_HANDLE,
  FOOTER_ORG,
  FOOTER_PAGE_NUMBER,
} from './tokens';

function Channels({ social }) {
  return (
    <div className="flex w-full flex-wrap">
      {social.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-1/2 items-center py-[calc(1.05*var(--fu))] text-white no-underline"
        >
          <SocialIcon
            name={item.icon}
            className="mr-[calc(2.4*var(--fu))] h-[calc(3.9*var(--fu))] w-[calc(3.9*var(--fu))] flex-none"
          />
          <span className={FOOTER_HANDLE}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

export default function SheetFooter({ footer, accent, pageLabel }) {
  return (
    <div className="absolute bottom-0 left-0 h-[var(--pf-h)] w-[210mm]">
      {/* accent rule in the document's brand colour */}
      <div className="absolute left-0 top-0 h-[1.4mm] w-[210mm] bg-[var(--brand)]" />

      <div className="absolute left-0 top-[1.4mm] flex h-[calc(var(--pf-h)_-_1.4mm)] w-[210mm] items-center bg-[var(--atlas-indigo)] px-[var(--m)] text-white">
        {/* left: university name over the address */}
        <div className="min-w-0 flex-auto pr-[calc(6*var(--fu))]">
          <a
            href={footer.orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={FOOTER_ORG}
          >
            {footer.org}
          </a>
          <a
            href={footer.addressUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={FOOTER_ADDRESS}
          >
            {footer.address}
          </a>
        </div>

        {/* right: the four channels, two by two, over an optional page number */}
        <div className="w-[calc(96*var(--fu))] flex-none">
          <Channels social={footer.social} />
          {pageLabel ? (
            <div className="mt-[calc(2*var(--fu))] flex items-baseline justify-end">
              <span className={FOOTER_PAGE_NUMBER}>{pageLabel}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
