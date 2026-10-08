/* =====================================================================
   ATLAS SkillTech University - Admissions Policy (2027-28)
   CONTENT.

   Every word, number, heading, table value, spelling and punctuation
   mark below is reproduced EXACTLY from the approved source artwork,
   ref/pdf/admissions-policy_2026.pdf, and is deliberately NOT normalised.

   The source has no extractable text layer (its type is outlined), so
   the wording here was transcribed from the rendered pages, character by
   character, including its own inconsistencies - all of which are kept:

     - "India(COBSE)"            - no space before the parenthesis
     - "5 ."                     - the space inside the question number
     - "students –ATLAS"         - an en dash, space before and none after
     - "recognises"/"recognised" vs the "recognized" of the questions
     - "Science,B.Sc Finance"    - no space after the comma
     - "Study(IBCP)" / "Baccalaureate(IB)" / "India(COBSE)" - no spaces
     - "03 DP Subjects" (capital S) for B.Tech, "02 DP subjects" elsewhere
     - "GSCE" and "Examinations"/"grades" casing in the B.Sc Cambridge row
     - "Chemistry/ Electronics/ Computers etc." - the spaced slashes
     - the curly quotes in ORDINARY(“O”) / ADVANCED (“A”) against the
       straight quotes in the B.Sc 'O' / 'A' row
     - the trailing periods that are present on some cells and absent on
       others (LAW national board, B.Sc Cambridge, the Q5/Q6 answers)

   "click here" (Q1) and "AIU" (Q7) are styled as links in the source but
   carry NO link target in the file, so no destination is invented here:
   they are marked `emphasis` and the renderer sets them in the brand
   accent without a fabricated href.

   This is an ATLAS SkillTech University document: it carries ATLAS indigo
   and teal only, the common header, and the single shared footer. No one
   school's branding appears anywhere in it.
   ===================================================================== */

import { FOOTER } from '@/lib/footer';

/* ---------------------------------------------------------------------
   The nine questions. The number is part of the verbatim heading text
   (including the "5 ." spacing), so it is kept in the string rather than
   regenerated. Questions 4, 8 and 9 are answered by a table, placed by
   the renderer; they carry no answer bullets.
   --------------------------------------------------------------------- */
export const QUESTIONS = {
  q1: {
    q: '1. Which Indian boards are recognized by ATLAS SkillTech University?',
    a: [
      [
        'ATLAS SkillTech University recognises all boards approved by the Council of Boards of School Education India(COBSE). Please ',
        { text: 'click here', emphasis: true },
        ' to view the complete list of boards recognised by the COBSE.',
      ],
    ],
  },
  q2: {
    q: '2. What if I am still awaiting my final examination (Class 12 Examination Or Equivalent Exam) results?',
    a: [
      'All admissions are provisional subject to the submission of class 12 marksheets and pass certificates prior to the commencement of classes.',
    ],
  },
  q3: {
    q: '3. What do I need to submit if I have already taken my final board (Class 12 Examination Or Equivalent Exam) examinations?',
    a: [
      'Applicants who have appeared for their final board examinations are required to submit the scores of all the subjects they have undertaken as a part of their class XII final board examinations.',
      'If you are a resident of Maharashtra, a domicile certificate is required to be submitted prior to the commencement of classes.',
    ],
  },
  q4: {
    q: '4. What are the minimum marks required in Class 12 Examination Or Equivalent Exam?',
  },
  q5: {
    q: '5 . What should I do if I received only grades and not numeric scores for class XI and/or XII?',
    a: [
      'In case an applicant has received only grades instead of numeric scores in class XI and/or XII, applicants will have to submit a school-approved conversion scale for the Admissions Committee to be able to convert the grades into numeric scores',
    ],
  },
  q6: {
    q: '6. How does ATLAS SkillTech University handle conversion of GPA to numeric scores?',
    a: [
      'ATLAS SkillTech University follows the CBSE-prescribed scale for converting GPA to numeric scores in case of CBSE students –ATLAS SkillTech University follows the COBSE-recommended scale to compare grades/scores across different Indian boards',
    ],
  },
  q7: {
    q: '7. What international qualifications are accepted by ATLAS SkillTech University?',
    a: [
      [
        'ATLAS SkillTech University accepts students from all +2 level qualifications recognized by the Association of Indian Universities ',
        { text: 'AIU', emphasis: true },
        '.',
      ],
    ],
  },
  q8: {
    q: '8. What are the requirements for International Baccalaureate (IB) students?',
  },
  q9: {
    q: '9. What are the requirements for students enrolled in the Cambridge Board?',
  },
};

/* ---------------------------------------------------------------------
   Q4 - National Boards.

   In the source every specialisation shares one requirement across the
   three board columns (CBSE, ISC, State Board), so each row carries one
   requirement that the renderer spans across those three columns.
   --------------------------------------------------------------------- */
export const NATIONAL_BOARDS = {
  label: 'National Boards',
  boards: ['CBSE', 'ISC', 'State Board'],
  rows: [
    {
      spec: 'B.Des',
      req: 'An aggregate of 50% marks in grade XII or equivalent in any discipline.',
    },
    {
      spec: 'BBA',
      req: 'An aggregate of 50% marks in grade XII or equivalent in any discipline.',
    },
    {
      spec: 'B.Sc',
      req: 'An aggregate of 50% marks in grade XII or equivalent in any discipline with Mathematics as compulsory subject.',
    },
    {
      spec: 'B.Tech CS, AI & ML',
      req: 'An aggregate of 50% marks in grade XII or equivalent in any discipline with a major in Physics, Mathematics and Chemistry/ Electronics/ Computers etc.',
    },
    {
      spec: 'LAW',
      req: 'An aggregate of 50% marks in grade XII or equivalent in any discipline',
    },
  ],
};

/** The teal line that closes Q4 in the source. */
export const INTERNATIONAL_NOTE =
  'For international boards, please refer to points 7 - 9 below.';

/* ---------------------------------------------------------------------
   Q8 - International Baccalaureate (IB).

   Each group lists the specialisations that share one set of
   requirements. B.Des and BBA share theirs (two rows, one set of cells);
   the others stand alone. The renderer spans the shared cells and
   decides the page break - it is not described here.
   --------------------------------------------------------------------- */
export const IB = {
  columns: [
    { label: 'Specialisation', width: '16%' },
    { label: 'IB Diploma Programme', width: '22%' },
    { label: 'IB Diploma Course (i.e. Certificate) Programme', width: '22%' },
    { label: 'IB Career Related Study Programme', width: '40%' },
  ],
  groups: [
    {
      specs: ['B.Des', 'BBA'],
      diploma: '3 HL, 3 SL with a minimum of 24 credit points',
      course: '3 HL, 3 SL with a minimum of 24 credit points',
      career: [
        '02 DP subjects with at least 01 subject at HL Level and minimum 3 points in each DP subject.',
        'Career Related Study (CRS) with at least 03 Subjects.',
        'IBCP Equivalence for General Strand (Design, Science,B.Sc Finance): International Baccalaureate Career Related Study(IBCP) qualification with core components requirement awarded by International Baccalaureate(IB)',
      ],
    },
    {
      specs: ['B.Sc'],
      diploma: '3 HL, 3 SL with 24 credit points With Mathematics as a compulsory subject',
      course: '3 HL, 3 SL with 24 credit points With Mathematics as a compulsory subject',
      career: [
        '02 DP subjects (1 must be Mathematics) with at least 01 subject at HL Level and minimum 3 points in each DP subject.',
        'Career Related Study (CRS) with at least 03 Subjects.',
        'IBCP Equivalence for General Strand (Design, Science,B.Sc Finance): International Baccalaureate Career Related Study(IBCP) qualification with core components requirement awarded by International Baccalaureate(IB)',
      ],
    },
    {
      specs: ['B.Tech CS, AI & ML'],
      diploma: '3 HL, 3 SL with 24 credit points With Mathematics & Physics as a compulsory subject',
      course: '3 HL, 3 SL with 24 credit points With Mathematics & Physics as a compulsory subject',
      career: [
        '03 DP Subjects (Mathematics, Physics, Chemistry, Biology or other similar subjects) with at least 01 subject at HL Level and minimum 3 points in each DP subject.',
        'Career Related Study (CRS) with at least 03 Subjects.',
        'IBCP Equivalence for B.Tech Strand: International Baccalaureate Career Related Study(IBCP) qualification with core components requirement awarded by International Baccalaureate(IB)',
      ],
    },
    {
      specs: ['LAW'],
      diploma: '3 HL, 3 SL with a minimum of 24 credit points',
      course: '3 HL, 3 SL with a minimum of 24 credit points',
      career: [
        '02 DP subjects with at least 01 subject at HL Level and minimum 3 points in each DP subject.',
        'Career Related Study (CRS) with at least 03 Subjects.',
        'IBCP Equivalence for General Strand (Design, Science,B.Sc Finance): International Baccalaureate Career Related Study(IBCP) qualification with core components requirement awarded by International Baccalaureate(IB)',
      ],
    },
  ],
};

/* ---------------------------------------------------------------------
   Q9 - Cambridge Board.

   B.Des and BBA share one requirement (two rows, one cell); the others
   stand alone. Punctuation is reproduced exactly, including the curly
   quotes in the first/third/fourth rows against the straight quotes and
   the "GSCE" of the B.Sc row.
   --------------------------------------------------------------------- */
export const CAMBRIDGE = {
  columns: [
    { label: 'Specialisation', width: '28%' },
    { label: 'Cambridge Board', width: '72%' },
  ],
  groups: [
    {
      specs: ['B.Des', 'BBA'],
      req: 'GCSE/IGCSE/GCSE examinations of the approved British Examination Bodies, with Minimum 5 (Five) subjects in A, B, C, D and E Grades including English at ORDINARY(“O”) Level and 2 subjects at ADVANCED (“A”) LEVEL has been equated with +2 stage qualification.',
    },
    {
      specs: ['B.Sc'],
      req: "GSCE/IGCSE Examinations of the approved British Examination Bodies, with minimum 5 (Five) subjects in A, B, C, D and E grades, including English at Ordinary 'O' Level and 2 subjects of which, one subject must be Mathematics at Advanced 'A' Level",
    },
    {
      specs: ['B.Tech CS, AI & ML'],
      req: 'GCSE/IGCSE/GCSE examinations of the approved British Examination Bodies, with Minimum 5 (Five) subjects in A, B, C, D and E Grades including English at ORDINARY(“O”) Level and 2 subjects at ADVANCED (“A”) LEVEL has been equated with +2 stage qualification. Candidates intending to join Professional courses are required to have passed the subjects of Physics & Mathematics in ADVANCED LEVEL & English at AS LEVEL.',
    },
    {
      specs: ['LAW'],
      req: 'GCSE/IGCSE/GCSE examinations of the approved British Examination Bodies, with Minimum 5 (Five) subjects in A, B, C, D and E Grades including English at ORDINARY(“O”) Level and 2 subjects at ADVANCED (“A”) LEVEL has been equated with +2 stage qualification.',
    },
  ],
};

export const ADMISSIONS_POLICY = {
  id: 'admissions-policy',
  kind: 'admissions-policy',
  file: 'atlas-admissions-policy-2027-28.pdf',
  cardName: 'Admissions Policy',
  cardScope: 'ATLAS SkillTech University',
  docTitle: 'Admissions Policy',

  // The verbatim title as it appears on the source sheet (plural), kept
  // distinct from the document's name on the studio card.
  title: 'ADMISSIONS POLICIES',

  questions: QUESTIONS,
  nationalBoards: NATIONAL_BOARDS,
  internationalNote: INTERNATIONAL_NOTE,
  ib: IB,
  cambridge: CAMBRIDGE,

  // The same shared footer as every other ATLAS PDF.
  footer: FOOTER,

  // PERMANENT RULE - first-page-only header, last-page-only footer, and
  // page numbers taken from the real sheet count.
  chrome: { header: 'first', footer: 'last', pageNumbers: true },
};
