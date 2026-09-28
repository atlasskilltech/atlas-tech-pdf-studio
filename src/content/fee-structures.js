/* =====================================================================
   ATLAS SkillTech University - Fee Structures 2027-28
   CONTENT.

   Every string below is taken verbatim from the approved 2027-28 fee
   structures. Wording, spelling, punctuation, casing and amounts are
   reproduced exactly as they stand in the source documents - including
   the differences between documents (enrollment / enrolment, the
   straight and typographic apostrophes and quotes, the "incease"
   typo, the doubled space in "Total One -  Time Fee") which are left
   untouched on purpose.

   `school` and `level` place a document in the university's structure -
   which school it belongs to and whether the programme is an
   undergraduate, postgraduate or integrated one. The studio groups its
   document list from those two fields; nothing about the sheet itself
   depends on them.

   This file carries CONTENT only. Nothing here describes layout, size
   or position - that lives in the sheet components and in lib/sheet.js.
   Nothing here repeats the footer either: every document uses the one
   shared footer in lib/footer.js.
   ===================================================================== */

import { FOOTER } from '@/lib/footer';

const NBSP = ' ';
const RSQUO = '’'; // right single quotation mark
const LDQUO = '“';
const RDQUO = '”';

/* ------------------------------------------------------------------
   Terms & Conditions.

   A set is shared only where the source documents match character for
   character; where a document words a term differently, it keeps its
   own text.
   ------------------------------------------------------------------ */

/** ISDI B.Tech and uGDX B.Tech. */
const TERMS_BTECH = [
  'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
  'Application Fee is non-refundable.',
  "Registration & Admission fee is a one-time fee that is payable at the time of enrollment. Refund of Registration & Admission fee will be governed by the University's Fee Refund Policy.",
  "Interest-free Refundable Security Deposit is payable on confirmation of admission. Refund of the Security Deposit will be governed by the University's Fee Refund Policy",
  'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
  'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
  'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.',
];

/** School of Law - the same set, with typographic quotes as in the source. */
const TERMS_LAW = [
  'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
  'Application Fee is non-refundable.',
  `Registration & Admission fee is a one-time fee that is payable at the time of enrollment. Refund of Registration & Admission fee will be governed by the University${RSQUO}s Fee Refund Policy.`,
  `Interest-free Refundable Security Deposit is payable on confirmation of admission. Refund of the Security Deposit will be governed by the University${RSQUO}s Fee Refund Policy`,
  'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
  'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
  `Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on ${LDQUO}Refund of Fees and Non-Retention of Original Certificates${RDQUO}, which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.`,
];

/** ISME postgraduate set. */
const TERMS_ISME_PG = [
  'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
  'Application Fee is non-refundable.',
  "Registration & Admission fee is a one-time fee that is payable at the time of enrolment. Refund of Registration & Admission fee will be governed by the University's Fee Refund Policy.",
  'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
  'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy please click here',
];

const TERMS_HEADING = 'Terms & Conditions';
const NOTE_ANNUAL_INCREASE = '* These fees are subject to an annual increase';

/* ------------------------------------------------------------------
   The seven fee structures.

   Each is one sheet. `title` lines carry an optional `abbr`, the
   programme abbreviation that sets a little smaller alongside the name.
   ------------------------------------------------------------------ */
export const FEE_STRUCTURES = [
  /* ------------------------------- B.Des (ISDI) ------------------------------- */
  {
    id: 'bdes',
    file: 'isdi-bdes-fee-structure-2027-28.pdf',
    school: 'isdi',
    cardName: 'ISDI Undergraduate Degree',
    cardScope: 'B.Des',
    level: 'Undergraduate Degree',
    docTitle: 'Bachelor of Design (B.Des)',
    title: [{ main: 'Bachelor of Design', abbr: '(B.Des)' }],
    subtitle: 'Undergraduate Degree Program 2027-2031',
    blocks: [
      { head: 'Application Fees (Non Refundable)', headAmount: '3500' },
      {
        head: `Total One -${NBSP} Time Fee payable at the Time of Enrolment`,
        rows: [{ label: 'Registration & Admissions Fee', amount: '50,000' }],
      },
      {
        head: 'TUITION FEES - FIRST ACADEMIC YEAR : 2027-2028',
        rows: [
          { label: 'SEMESTER I', amount: '3,67,500' },
          { label: 'SEMESTER II', amount: '3,67,500' },
          { label: 'Total First Year Fee', amount: '7,35,000', total: true },
        ],
      },
    ],
    notes: [NOTE_ANNUAL_INCREASE],
    termsHeading: TERMS_HEADING,
    terms: [
      'Payments of all fees is via an online payment link available on our website on the admissions application page or offer later. It is payable as per the instructions given in the offer letter.',
      'Application fee is non-refundable.',
      "Registration & Admission fee is a one-time fee that is payable at the time of enrollment. Refund of Registration & Admission fee will be governed by the University's Fee Refund Policy. (Click Here)",
      'Interest-free Refundable Security Deposit is payable as per university refund Policy.',
      'The Semester-Wise Tuition Fee is payable at the beginning of every semester as per the notified date. The first-semester tuition fee has to be paid as per the instructions given in the offer letter.',
      'There will be a nominal increase of 5% of Tuition Fee every year.',
      'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
      'Students can apply for refund with an application of admission withdrawal . All refunds will be considered and UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.',
    ],
  },

  /* ------------- ISDI Undergraduate Degree - B.Tech (ISDI lockup) ------------- */
  {
    id: 'isdi-btech',
    file: 'isdi-btech-fee-structure-2027-28.pdf',
    school: 'isdi',
    cardName: 'ISDI Undergraduate Degree',
    cardScope: 'B.Tech',
    level: 'Undergraduate Degree',
    docTitle: 'Bachelor of Technology (B.Tech)',
    title: [{ main: 'Bachelor of Technology', abbr: '(B.Tech)' }],
    subtitle: 'Undergraduate Degree Program 2027-2031',
    blocks: [
      { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
      {
        head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
        rows: [{ label: 'Registration & Admissions Fee', amount: '50,000' }],
      },
      { head: 'ANNUAL TUITION FEE', rows: [{ label: 'YEAR I', amount: '5,11,600' }] },
    ],
    notes: [NOTE_ANNUAL_INCREASE],
    termsHeading: TERMS_HEADING,
    terms: TERMS_BTECH,
  },

  /* ------------------------------- B.Tech (uGDX) ------------------------------- */
  {
    id: 'btech',
    file: 'ugdx-btech-fee-structure-2027-28.pdf',
    school: 'ugdx',
    cardName: 'uGDX Undergraduate Degree',
    cardScope: 'B.Tech',
    level: 'Undergraduate Degree',
    docTitle: 'Bachelor of Technology (B.Tech)',
    title: [{ main: 'Bachelor of Technology', abbr: '(B.Tech)' }],
    subtitle: 'Undergraduate Degree Program 2027-2031',
    blocks: [
      { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
      {
        head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
        rows: [{ label: 'Registration & Admissions Fee', amount: '50,000' }],
      },
      { head: 'ANNUAL TUITION FEE', rows: [{ label: 'YEAR I', amount: '5,11,600' }] },
    ],
    notes: [NOTE_ANNUAL_INCREASE],
    termsHeading: TERMS_HEADING,
    terms: TERMS_BTECH,
  },

  /* --------------------------- BBA / B.Sc (ISME) --------------------------- */
  {
    id: 'bsc-finance',
    file: 'isme-bba-bsc-fee-structure-2027-28.pdf',
    school: 'isme',
    cardName: 'ISME Undergraduate Degree',
    cardScope: 'BBA / BBA (Hons.) & B.Sc / B.Sc (Hons.)',
    level: 'Undergraduate Degree',
    docTitle: 'BBA / B.Sc',
    title: [
      { main: 'Bachelor of Business Administration', abbr: '(BBA / BBA Hons.)' },
      { main: 'Bachelor of Science', abbr: '(B.Sc / B.Sc Hons.)' },
    ],
    subtitle: 'Undergraduate Degree Program 2027-2031',
    blocks: [
      { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
      {
        head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
        rows: [{ label: 'Registration & Admissions Fee', amount: '50,000' }],
      },
      { head: 'ANNUAL TUITION FEES', rows: [{ label: 'YEAR I', amount: '5,25,000/-' }] },
    ],
    // "incease" is the spelling in the approved source document.
    notes: ['* These fees are subject to an annual incease'],
    termsHeading: TERMS_HEADING,
    terms: [
      'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
      'Application Fee is non-refundable.',
      "Registration & Admission fee is a one-time fee that is payable at the time of enrolment. Refund of Registration & Admission fee will be governed by the University's Fee Refund Policy. (Click here)",
      'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
      'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.',
    ],
  },

  /* --------------------------------- MBA (ISME) --------------------------------- */
  {
    id: 'mba',
    file: 'isme-mba-fee-structure-2027-28.pdf',
    school: 'isme',
    cardName: 'ISME Postgraduate Degree',
    cardScope: 'MBA',
    level: 'Postgraduate Degree',
    docTitle: 'Master of Business Administration (MBA)',
    title: [{ main: 'Master of Business Administration', abbr: '(MBA)' }],
    subtitle: 'Postgraduate Degree Program 2027-2029',
    blocks: [
      { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '1,500' },
      { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT', headAmount: '50,000' },
      {
        head: 'ANNUAL TUITION FEES',
        rows: [
          { label: 'YEAR I', amount: '6,06,400' },
          { label: 'YEAR II', amount: '6,06,400' },
        ],
      },
    ],
    notes: [],
    termsHeading: TERMS_HEADING,
    terms: TERMS_ISME_PG,
  },

  /* ----------------------------- M.Des + MBA (ISDI) ----------------------------- */
  {
    id: 'mdes-mba',
    file: 'isdi-mdes-mba-fee-structure-2027-28.pdf',
    school: 'isdi',
    cardName: 'ISDI Postgraduate Degree',
    cardScope: 'M.Des & MBA',
    level: 'Postgraduate Degree',
    docTitle:
      'Masters of Design (M.Des) & Master of Business Administration (MBA)',
    title: [
      { main: 'Masters of Design', abbr: '(M.Des)' },
      { main: 'Master of Business Administration', abbr: '(MBA)' },
    ],
    subtitle: 'Postgraduate Degree Program 2027-29',
    blocks: [
      { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '1,500' },
      {
        head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
        rows: [{ label: `Registration & Admissions${NBSP} Fee`, amount: '50,000' }],
      },
      {
        head: 'ANNUAL TUITION FEES',
        rows: [
          { label: 'YEAR I', amount: '6,06,400' },
          { label: 'YEAR II', amount: '6,06,400' },
        ],
      },
    ],
    notes: [],
    termsHeading: TERMS_HEADING,
    terms: [
      'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
      'Application Fee is non-refundable.',
      `Registration & Admission fee is a one-time fee that is payable at the time of enrolment. Refund of Registration & Admission fee will be governed by the University${RSQUO}s Fee Refund Policy.`,
      'The Year-Wise Tuition Fee is payable at the beginning of every academic year. The first-year tuition fee has to be paid as per the instructions given in the offer letter. The second-year Tuition Fees is payable at the beginning of second year as per the notified date.',
      'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
      `Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on ${LDQUO}Refund of Fees and Non-Retention of Original Certificates${RDQUO}, which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy please click here.`,
    ],
  },

  /* ---------------------- BBA-LLB (Hons.) - School of Law ---------------------- */
  {
    id: 'bba-llb',
    file: 'law-bba-llb-fee-structure-2027-28.pdf',
    school: 'law',
    cardName: 'BBA-LLB (Hons.)',
    cardScope: 'BBA-LLB (Hons.)',
    level: 'Integrated Programs',
    docTitle: 'Five Years Integrated Program BBA-LLB (Hons.)',
    title: [
      { main: 'Five Years Integrated Program' },
      { main: 'BBA-LLB', abbr: '(Hons.)' },
    ],
    subtitle: 'Integrated Degree Program 2027-2032',
    blocks: [
      { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
      {
        head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
        rows: [{ label: 'Registration & Admissions Fee', amount: '50,000' }],
      },
      { head: 'ANNUAL TUITION FEE', rows: [{ label: 'YEAR I', amount: '5,11,600' }] },
    ],
    notes: [NOTE_ANNUAL_INCREASE],
    termsHeading: TERMS_HEADING,
    terms: TERMS_LAW,
  },
].map((doc) => ({
  ...doc,
  kind: 'fee-structure',
  footer: FOOTER,
  // PERMANENT RULE - chrome is declared, never assumed. These are single
  // sheets today, so first/last puts the header and footer on the one
  // page; if a structure ever grows, the extra sheets carry neither.
  chrome: { header: 'first', footer: 'last', pageNumbers: false },
}));
