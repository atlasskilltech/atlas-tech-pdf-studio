/* =====================================================================
   ATLAS SkillTech University - Fee Refund Policy (2027-28)
   CONTENT.

   Wording, spelling, punctuation, numbering, table headings, categories
   and percentages are reproduced exactly from the approved source -
   including "15 days or more before the formally notified last date of
   Admission" on rows 1-3 and the space inside "sdt. admissions@..." -
   and are deliberately not normalised.

   The ONLY edits to the source text are the academic-year updates:
     (2026-27)           -> (2027-28)
     INCOMING CLASS 2026 -> INCOMING CLASS 2027
     17th July 2026      -> 17th July 2027
     the 2026 admission-cycle dates in the table and in terms 2 and 8
                         -> 2027
   The UGC references "Fee Refund Policy 2024-2025" and "12th June 2024"
   are historical and are left untouched.

   This document carries ATLAS indigo and teal only. No school branding
   appears anywhere in it.
   ===================================================================== */

import { FOOTER } from '@/lib/footer';

const UGC_URL =
  'https://www.ugc.gov.in/pdfnews/1654477_Fee-Refund-Policy-2024-25.pdf';

export const REFUND_POLICY = {
  id: 'refund-policy',
  kind: 'policy',
  file: 'ATLAS-Fee-Refund-Policy-2027-28.pdf',
  cardName: 'Fee Refund Policy',
  cardScope: 'ATLAS SkillTech University',
  docTitle: 'Fee Refund Policy (2027-28)',

  title: 'FEE REFUND POLICY (2027-28)',
  subtitle: 'INCOMING CLASS 2027',

  // Only the words "please click here" are bold and linked; the rest of
  // the sentence is untouched.
  intro: [
    'The ATLAS SkillTech University Fee Refund Policy is in conformance with the norms set by the University Grants Commission (UGC) and is in accordance with the UGC Notification on "Fee Refund Policy 2024-2025", which was published on the UGC website on 12th June 2024. To refer to this, ',
    { text: 'please click here', href: UGC_URL, bold: true, tone: 'accent' },
    '. The below table provides details of the University Refund Policy',
  ],

  lastDate:
    'The tentative notified last date of admissions for the upcoming academic year: 17th July 2027.',

  table: {
    columns: [
      { label: 'Sr. No.', width: '9%', align: 'center' },
      { label: 'Date of Withdrawal Request', width: '35%' },
      { label: 'University will Refund if the request received', width: '34%' },
      { label: 'Percentage of Refund of Fees', width: '22%', align: 'right' },
    ],
    rows: [
      [
        '1',
        '15 days or more before the formally notified last date of Admission',
        'On or before 2nd July 2027',
        '100%',
      ],
      [
        '2',
        '15 days or more before the formally notified last date of Admission',
        'Between 3rd July - 17th July 2027 (both dates included)',
        '90%',
      ],
      [
        '3',
        '15 days or more before the formally notified last date of Admission',
        'Between 18th July - 1st August 2027 (both dates included)',
        '80%',
      ],
      [
        '4',
        'Between 16 days and 30 days after the formally notified last date of Admission',
        'Between 2nd August - 16th August 2027 (both dates included)',
        '50%',
      ],
      [
        '5',
        'More than 30 days after the formally notified last date of Admission',
        'On or after 17th August 2027',
        '0%',
      ],
    ],
  },

  tableNote:
    '* In case of (1) in the above table, an amount of 5% of the fees paid by the student, subject to a maximum of Rs. 5,000/-, will be deducted from the refundable amount towards processing charges before making the refund wherever applicable.',

  termsHeading: 'TERMS & CONDITIONS',
  terms: [
    { text: 'Application Fee is Non-Refundable' },
    { text: 'The one - time enrolment fee refundable until 17th August 2027.' },
    {
      text: 'Fees shall be refunded to eligible students as per the table enclosed above, within fifteen days from the date of receiving a written application from them in this regard. Requests for refund should be made to the Office of Admission at the following IDs based on the program:',
      // `label` is the untouched source text and `email` the address
      // exactly as the source prints it; `mailto` is the address the
      // link actually opens.
      list: [
        {
          label: 'Bachelor of Design (B. Des.): ',
          email: 'design.admissions@atlasuniversity.edu.in',
          mailto: 'design.admissions@atlasuniversity.edu.in',
        },
        {
          label: 'Bachelor of Business Administration (BBA): ',
          email: 'management.admissions@atlasuniversity.edu.in',
          mailto: 'management.admissions@atlasuniversity.edu.in',
        },
        {
          label: 'Master of Business Administration (MBA): ',
          email: 'pgadmissions@atlasuniversity.edu.in',
          mailto: 'pgadmissions@atlasuniversity.edu.in',
        },
        {
          // The source prints a space inside this address. The printed
          // text is left as it is and the link opens the valid address.
          label: 'Bachelor of Science (B.Sc. Hons) ',
          email: 'sdt. admissions@atlasuniversity.edu.in',
          mailto: 'sdt.admissions@atlasuniversity.edu.in',
        },
        {
          label: 'Bachelors of LAW (BBA LLB Hons) - ',
          email: 'law@atlasuniversity.edu.in',
          mailto: 'law@atlasuniversity.edu.in',
        },
      ],
    },
    {
      text: 'Refund in case of candidates who have been offered scholarship will be processed on the basis of net fee received by the University from the student.',
    },
    {
      text: 'No refund request shall be admissible in case the admission is cancelled/withdrawn due to non-submission of mandatory documents by the prescribed last date or if the admission has been secured on the basis of fictitious information and/or forged documents.',
    },
    {
      text: 'In the event that an offer of admission is withdrawn by the University, all such fees are fully refundable, unless the offer is being withdrawn on the basis of incorrect or incomplete information supplied by the student.',
    },
    {
      text: 'In the event that an offer of admission is withdrawn by the University given that the University is unable to provide the program, all such fees are fully refundable.',
    },
    { text: 'The one - time enrolment is fully fee refundable until 17th August 2027.' },
  ],

  // The same shared footer as every fee structure, so the two can never
  // diverge. Only the page number is additional.
  footer: FOOTER,

  // PERMANENT RULE - this design specifies a first-page-only header and a
  // last-page-only footer, and that is what is built. Page numbers come
  // from the real sheet count, never a hard-coded total.
  chrome: { header: 'first', footer: 'last', pageNumbers: true },
};
