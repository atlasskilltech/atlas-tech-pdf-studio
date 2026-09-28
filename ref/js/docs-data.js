/* =====================================================================
   ATLAS SkillTech University - Fee Structures 2027-28
   CONTENT MODEL.

   Every string below is taken verbatim from the approved 2027-28 fee
   structures. Wording, spelling, punctuation, casing and amounts are
   reproduced exactly as they stand in the source documents - including
   the small differences between documents (address wording, social
   handles, "incease", "Total One -  Time Fee ...") which are left
   untouched on purpose.

   Strings are HTML fragments: "&" is written "&amp;" and non-ASCII
   characters are written as \u escapes so the file stays ASCII-safe.

   This file carries CONTENT only. Nothing here describes the layout -
   that lives in css/styles.css and js/render-docs.js.
   ===================================================================== */
(function () {
  'use strict';

  var RSQUO = '’';     // right single quotation mark
  var LDQUO = '“';     // left double quotation mark
  var RDQUO = '”';     // right double quotation mark
  var APOS  = "'";          // straight apostrophe, as in the source files

  /* ------------------------------------------------------------------
     Schools: official lockup, official colour, and the darker shade of
     the same hue used wherever white text sits on the colour (>= 5:1).
     `band` is the colour of the school block inside the lockup file, so
     the lockup sits seamlessly on the header band.
     ------------------------------------------------------------------ */
  window.FS_SCHOOLS = {
    isdi: {
      label: 'ISDI · School of Design &amp; Innovation',
      logo: 'isdi-full-stack',
      logoAlt: 'ATLAS SkillTech University | ISDI School of Design &amp; Innovation',
      logoRatio: 1392.7 / 402.5,
      logoUrl: 'https://atlasuniversity.edu.in/schools/isdi/',
      brand: '#E12A7B', deep: '#CF2771', band: '#E12A7B',
      t06: '#FDF2F7', t10: '#FCEAF2', t16: '#FADDEA'
    },
    isme: {
      label: 'ISME · School of Management &amp; Entrepreneurship',
      logo: 'isme-full-stack',
      logoAlt: 'ATLAS SkillTech University | ISME School of Management &amp; Entrepreneurship',
      logoRatio: 3904.9 / 1042.8,
      logoUrl: 'https://atlasuniversity.edu.in/schools/isme/',
      brand: '#009FE0', deep: '#0077A8', band: '#009FE0',
      t06: '#F0F9FD', t10: '#E6F5FC', t16: '#D6F0FA'
    },
    ugdx: {
      label: 'uGDX · School of Technology',
      logo: 'ugdx-full-stack-outlined',
      logoAlt: 'ATLAS SkillTech University | uGDX School of Technology',
      logoRatio: 2329.2 / 727.05,
      logoUrl: 'https://atlasuniversity.edu.in/schools/ugdx/',
      brand: '#ED1A3B', deep: '#DB1837', band: '#FF0031',
      t06: '#FEF1F3', t10: '#FDE8EB', t16: '#FCDAE0'
    },
    law: {
      label: 'School of Law',
      logo: 'law-full-stack',
      logoAlt: 'ATLAS SkillTech University | School of Law',
      logoRatio: 2718 / 812,
      logoUrl: 'https://atlasuniversity.edu.in/schools/law/',
      brand: '#CD5928', deep: '#B85024', band: '#CD5928',
      t06: '#FCF5F2', t10: '#FAEEEA', t16: '#F7E4DD'
    }
  };

  /* ------------------------------------------------------------------
     Footer.

     ONE object, shared by every document, so the footer cannot drift
     between documents: same text, same links, same order, everywhere.
     ------------------------------------------------------------------ */
  var FOOTER = {
    org: 'ATLAS SKILLTECH UNIVERSITY',
    orgUrl: 'https://atlasuniversity.edu.in/',
    address: 'Tower 1, Equinox Business Park, Ambedkar Nagar, Kurla West, Kurla, Mumbai, Maharashtra 400070',
    addressUrl: 'https://maps.app.goo.gl/Wf9VaQ4yGfqaXMVR6',
    social: [
      { icon: 'instagram-circle', label: '@atlasskilltechuniversity',
        url: 'https://www.instagram.com/atlasskilltechuniversity/' },
      { icon: 'facebook-circle', label: 'atlasskilltechuniversity',
        url: 'https://www.facebook.com/atlasskilltechuniversity/' },
      { icon: 'linkedin-circle', label: 'LinkedIn',
        url: 'https://www.linkedin.com/school/atlasuniversity' },
      { icon: 'youtube-circle', label: 'YouTube',
        url: 'https://www.youtube.com/@atlasskilltechuniversity' }
    ]
  };

  /* ------------------------------------------------------------------
     Terms & Conditions. Each document keeps its own wording; a set is
     shared only where the source documents match character for
     character.
     ------------------------------------------------------------------ */

  // ISDI B.Tech and uGDX B.Tech
  var TERMS_BTECH = [
    'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
    'Application Fee is non-refundable.',
    'Registration &amp; Admission fee is a one-time fee that is payable at the time of enrollment. Refund of Registration &amp; Admission fee will be governed by the University' + APOS + 's Fee Refund Policy.',
    'Interest-free Refundable Security Deposit is payable on confirmation of admission. Refund of the Security Deposit will be governed by the University' + APOS + 's Fee Refund Policy',
    'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
    'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
    'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.'
  ];

  // School of Law - same set, typographic quotes as in the source
  var TERMS_LAW = [
    'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
    'Application Fee is non-refundable.',
    'Registration &amp; Admission fee is a one-time fee that is payable at the time of enrollment. Refund of Registration &amp; Admission fee will be governed by the University' + RSQUO + 's Fee Refund Policy.',
    'Interest-free Refundable Security Deposit is payable on confirmation of admission. Refund of the Security Deposit will be governed by the University' + RSQUO + 's Fee Refund Policy',
    'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
    'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
    'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on ' + LDQUO + 'Refund of Fees and Non-Retention of Original Certificates' + RDQUO + ', which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.'
  ];

  // ISME postgraduate set
  var TERMS_ISME_PG = [
    'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
    'Application Fee is non-refundable.',
    'Registration &amp; Admission fee is a one-time fee that is payable at the time of enrolment. Refund of Registration &amp; Admission fee will be governed by the University' + APOS + 's Fee Refund Policy.',
    'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
    'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy please click here'
  ];

  // Shared with the Fee Refund Policy, so the two can never diverge.
  window.FS_FOOTER = FOOTER;

  /* ------------------------------------------------------------------
     The fee structures.
     ------------------------------------------------------------------ */
  window.FS_DOCS = [

    /* -------------------------------- B.Des (ISDI) -------------------------------- */
    {
      id: 'bdes',
      file: 'B.Des-Fee-Structure-2027-28.pdf',
      school: 'isdi',
      cardName: 'ISDI Undergraduate Degree',
      cardScope: 'B.Des',
      docTitle: 'Bachelor of Design (B.Des)',
      title: ['Bachelor of Design <span class="ab">(B.Des)</span>'],
      subtitle: 'Undergraduate Degree Program 2027-2031',
      blocks: [
        { head: 'Application Fees (Non Refundable)', headAmount: '3500' },
        { head: 'Total One -&nbsp; Time Fee payable at the Time of Enrolment',
          rows: [{ label: 'Registration &amp; Admissions Fee', amount: '50,000' }] },
        { head: 'TUITION FEES - FIRST ACADEMIC YEAR : 2027-2028',
          rows: [
            { label: 'SEMESTER I', amount: '3,67,500' },
            { label: 'SEMESTER II', amount: '3,67,500' },
            { label: 'Total First Year Fee', amount: '7,35,000', total: true }
          ] }
      ],
      notes: ['* These fees are subject to an annual increase'],
      termsHeading: 'Terms &amp; Conditions',
      terms: [
        'Payments of all fees is via an online payment link available on our website on the admissions application page or offer later. It is payable as per the instructions given in the offer letter.',
        'Application fee is non-refundable.',
        'Registration &amp; Admission fee is a one-time fee that is payable at the time of enrollment. Refund of Registration &amp; Admission fee will be governed by the University' + APOS + 's Fee Refund Policy. (Click Here)',
        'Interest-free Refundable Security Deposit is payable as per university refund Policy.',
        'The Semester-Wise Tuition Fee is payable at the beginning of every semester as per the notified date. The first-semester tuition fee has to be paid as per the instructions given in the offer letter.',
        'There will be a nominal increase of 5% of Tuition Fee every year.',
        'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
        'Students can apply for refund with an application of admission withdrawal . All refunds will be considered and UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.'
      ],
      footer: FOOTER
    },

    /* ---------------- ISDI Undergraduate Degree - B.Tech (ISDI lockup) ---------------- */
    {
      id: 'isdi-btech',
      file: 'ISDI-Undergraduate-Degree.pdf',
      school: 'isdi',
      cardName: 'ISDI Undergraduate Degree',
      cardScope: 'B.Tech',
      docTitle: 'Bachelor of Technology (B.Tech)',
      title: ['Bachelor of Technology <span class="ab">(B.Tech)</span>'],
      subtitle: 'Undergraduate Degree Program 2027-2031',
      blocks: [
        { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
        { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
          rows: [{ label: 'Registration &amp; Admissions Fee', amount: '50,000' }] },
        { head: 'ANNUAL TUITION FEE',
          rows: [{ label: 'YEAR I', amount: '5,11,600' }] }
      ],
      notes: ['* These fees are subject to an annual increase'],
      termsHeading: 'Terms &amp; Conditions',
      terms: TERMS_BTECH,
      footer: FOOTER
    },

    /* -------------------------------- B.Tech (uGDX) -------------------------------- */
    {
      id: 'btech',
      file: 'B.Tech-Fee-Structure-2027-28.pdf',
      school: 'ugdx',
      cardName: 'uGDX Undergraduate Degree',
      cardScope: 'B.Tech',
      docTitle: 'Bachelor of Technology (B.Tech)',
      title: ['Bachelor of Technology <span class="ab">(B.Tech)</span>'],
      subtitle: 'Undergraduate Degree Program 2027-2031',
      blocks: [
        { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
        { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
          rows: [{ label: 'Registration &amp; Admissions Fee', amount: '50,000' }] },
        { head: 'ANNUAL TUITION FEE',
          rows: [{ label: 'YEAR I', amount: '5,11,600' }] }
      ],
      notes: ['* These fees are subject to an annual increase'],
      termsHeading: 'Terms &amp; Conditions',
      terms: TERMS_BTECH,
      footer: FOOTER
    },

    /* ------------------------------ B.Sc Finance (ISME) ------------------------------ */
    {
      id: 'bsc-finance',
      file: 'B.Sc-Finance-Fee-Structure-2027-28.pdf',
      school: 'isme',
      cardName: 'ISME Undergraduate Degree',
      cardScope: 'BBA / BBA (Hons.) &amp; B.Sc / B.Sc (Hons.)',
      docTitle: 'B.Sc Finance',
      title: ['Bachelor of Business Administration <span class="ab">(BBA / BBA Hons.)</span>',
              'Bachelor of Science <span class="ab">(B.Sc / B.Sc Hons.)</span>'],
      subtitle: 'Undergraduate Degree Program 2027-2031',
      blocks: [
        { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
        { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
          rows: [{ label: 'Registration &amp; Admissions Fee', amount: '50,000' }] },
        { head: 'ANNUAL TUITION FEES',
          rows: [{ label: 'YEAR I', amount: '5,25,000/-' }] }
      ],
      notes: ['* These fees are subject to an annual incease'],
      termsHeading: 'Terms &amp; Conditions',
      terms: [
        'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
        'Application Fee is non-refundable.',
        'Registration &amp; Admission fee is a one-time fee that is payable at the time of enrolment. Refund of Registration &amp; Admission fee will be governed by the University' + APOS + 's Fee Refund Policy. (Click here)',
        'The Year-Wise Tuition Fee is payable at the beginning of every year as per the notified date. The first-year tuition fee has to be paid as per the instructions given in the offer letter.',
        'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on "Refund of Fees and Non-Retention of Original Certificates", which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy Please click here.'
      ],
      footer: FOOTER
    },

    /* ---------------------------------- MBA (ISME) ---------------------------------- */
    {
      id: 'mba',
      file: 'MBA-Fee-Structure-2027-28.pdf',
      school: 'isme',
      cardName: 'ISME Postgraduate Degree',
      cardScope: 'MBA',
      docTitle: 'Master of Business Administration (MBA)',
      title: ['Master of Business Administration <span class="ab">(MBA)</span>'],
      subtitle: 'Postgraduate Degree Program 2027-2029',
      blocks: [
        { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '1,500' },
        { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT', headAmount: '50,000' },
        { head: 'ANNUAL TUITION FEES',
          rows: [
            { label: 'YEAR I', amount: '6,06,400' },
            { label: 'YEAR II', amount: '6,06,400' }
          ] }
      ],
      notes: [],
      termsHeading: 'Terms &amp; Conditions',
      terms: TERMS_ISME_PG,
      footer: FOOTER
    },

    /* ------------------------------ M.Des + MBA (ISDI) ------------------------------ */
    {
      id: 'mdes-mba',
      file: 'M.Des-MBA-Fee-Structure-2027-28.pdf',
      school: 'isdi',
      cardName: 'ISDI Postgraduate Degree',
      cardScope: 'M.Des &amp; MBA',
      docTitle: 'Masters of Design (M.Des) &amp; Master of Business Administration (MBA)',
      title: ['Masters of Design <span class="ab">(M.Des)</span>',
              'Master of Business Administration <span class="ab">(MBA)</span>'],
      subtitle: 'Postgraduate Degree Program 2027-29',
      blocks: [
        { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '1,500' },
        { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
          rows: [{ label: 'Registration &amp; Admissions&nbsp; Fee', amount: '50,000' }] },
        { head: 'ANNUAL TUITION FEES',
          rows: [
            { label: 'YEAR I', amount: '6,06,400' },
            { label: 'YEAR II', amount: '6,06,400' }
          ] }
      ],
      notes: [],
      termsHeading: 'Terms &amp; Conditions',
      terms: [
        'Payments of all fees is via, an online payment link available on our website on the admissions application page. It is payable as per the instructions given in the offer letter.',
        'Application Fee is non-refundable.',
        'Registration &amp; Admission fee is a one-time fee that is payable at the time of enrolment. Refund of Registration &amp; Admission fee will be governed by the University' + RSQUO + 's Fee Refund Policy.',
        'The Year-Wise Tuition Fee is payable at the beginning of every academic year. The first-year tuition fee has to be paid as per the instructions given in the offer letter. The second-year Tuition Fees is payable at the beginning of second year as per the notified date.',
        'Cost of materials used by students throughout the program is not included in the Tuition Fee.',
        'Students can apply for refund with an application of admission withdrawal. All refunds will be considered and governed as per the ATLAS SkillTech University Fee Refund Policy. This policy is governed by the norms set by the UGC and in accordance with the University Grants Commission (UGC) Notification on ' + LDQUO + 'Refund of Fees and Non-Retention of Original Certificates' + RDQUO + ', which was published on the UGC website on 2nd November 2018. To understand the ATLAS Fee Refund Policy please click here.'
      ],
      footer: FOOTER
    },

    /* --------------------- BBA-LLB (Hons.) - School of Law --------------------- */
    {
      id: 'bba-llb',
      file: 'Law-Integrated-BBA-LLB-Fee-Structure-2027-28.pdf',
      school: 'law',
      cardName: 'BBA-LLB (Hons.)',
      cardScope: 'BBA-LLB (Hons.)',
      docTitle: 'Five Years Integrated Program BBA-LLB (Hons.)',
      title: ['Five Years Integrated Program',
              'BBA-LLB <span class="ab">(Hons.)</span>'],
      subtitle: 'Integrated Degree Program 2027-2032',
      blocks: [
        { head: 'APPLICATION FEES (NON REFUNDABLE)', headAmount: '3,500' },
        { head: 'TOTAL ONE-TIME FEE PAYABLE AT THE TIME OF ENROLMENT',
          rows: [{ label: 'Registration &amp; Admissions Fee', amount: '50,000' }] },
        { head: 'ANNUAL TUITION FEE',
          rows: [{ label: 'YEAR I', amount: '5,11,600' }] }
      ],
      notes: ['* These fees are subject to an annual increase'],
      termsHeading: 'Terms &amp; Conditions',
      terms: TERMS_LAW,
      footer: FOOTER
    }
  ];
})();
