/* =====================================================================
   ATLAS SkillTech University - Fee Refund Policy (2027-28)
   CONTENT MODEL.

   Transcribed from ref/refund-policy/1.png and 2.png. Wording, spelling,
   punctuation, numbering, table headings, categories and percentages are
   reproduced exactly - including "15 days or more before the formally
   notified last date of Admission" on rows 1-3 and the spacing in
   "(B.Sc. Hons) sdt. admissions@..." - and are deliberately not
   normalised.

   The ONLY edits to the source text are the academic-year updates:
     (2026-27)          -> (2027-28)
     INCOMING CLASS 2026 -> INCOMING CLASS 2027
     17th July 2026      -> 17th July 2027     (upcoming academic year)
     all 2026 admission-cycle dates in the table and in terms 2 and 8
                         -> 2027
   The UGC references "Fee Refund Policy 2024-2025" and "12th June 2024"
   are historical and are left untouched.

   Links: the UGC notification and the five admissions addresses. Only
   the linked words are bold; the labels around them are unchanged.
   ===================================================================== */
(function () {
  'use strict';

  var UGC_URL = 'https://www.ugc.gov.in/pdfnews/1654477_Fee-Refund-Policy-2024-25.pdf';

  // Only the words "please click here" are bold and clickable; the rest
  // of the sentence is untouched.
  function ugcLink(text) {
    return '<a class="rplink" href="' + UGC_URL + '" target="_blank" rel="noopener">' +
           '<b>' + text + '</b></a>';
  }

  window.FS_REFUND = {
    id: 'refund-policy',
    file: 'ATLAS-Fee-Refund-Policy-2027-28.pdf',
    cardName: 'Fee Refund Policy',
    cardScope: 'ATLAS SkillTech University',
    docTitle: 'Fee Refund Policy (2027-28)',

    brand: {
      indigo: '#342B7C',
      teal: '#3CA7B6',
      tealDeep: '#2E7F8A',
      tint: '#EEF6F7',
      logo: 'atlas-skilltech-full-stack',
      logoSrc: 'assets/logos/atlas-skilltech-full-stack.png',
      logoAlt: 'ATLAS SkillTech University'
    },

    title: 'FEE REFUND POLICY (2027-28)',
    subtitle: 'INCOMING CLASS 2027',

    // Protected paragraph - reproduced exactly, only the click-here text
    // is marked as a pending link.
    intro: 'The ATLAS SkillTech University Fee Refund Policy is in conformance with the norms ' +
           'set by the University Grants Commission (UGC) and is in accordance with the UGC ' +
           'Notification on "Fee Refund Policy 2024-2025", which was published on the UGC ' +
           'website on 12th June 2024. To refer to this, ' + ugcLink('please click here') +
           '. The below table provides details of the University Refund Policy',

    lastDate: 'The tentative notified last date of admissions for the upcoming academic year: 17th July 2027.',

    table: {
      cols: ['Sr. No.', 'Date of Withdrawal Request',
             'University will Refund if the request received', 'Percentage of Refund of Fees'],
      widths: [9, 35, 34, 22],
      rows: [
        ['1', '15 days or more before the formally notified last date of Admission',
         'On or before 2nd July 2027', '100%'],
        ['2', '15 days or more before the formally notified last date of Admission',
         'Between 3rd July - 17th July 2027 (both dates included)', '90%'],
        ['3', '15 days or more before the formally notified last date of Admission',
         'Between 18th July - 1st August 2027 (both dates included)', '80%'],
        ['4', 'Between 16 days and 30 days after the formally notified last date of Admission',
         'Between 2nd August - 16th August 2027 (both dates included)', '50%'],
        ['5', 'More than 30 days after the formally notified last date of Admission',
         'On or after 17th August 2027', '0%']
      ]
    },

    tableNote: '* In case of (1) in the above table, an amount of 5% of the fees paid by the ' +
               'student, subject to a maximum of Rs. 5,000/-, will be deducted from the ' +
               'refundable amount towards processing charges before making the refund wherever applicable.',

    termsHeading: 'TERMS &amp; CONDITIONS',
    terms: [
      { text: 'Application Fee is Non-Refundable' },
      { text: 'The one - time enrolment fee refundable until 17th August 2027.' },
      { text: 'Fees shall be refunded to eligible students as per the table enclosed above, ' +
              'within fifteen days from the date of receiving a written application from them ' +
              'in this regard. Requests for refund should be made to the Office of Admission ' +
              'at the following IDs based on the program:',
        // label = untouched source text; email = the address exactly as the
        // source prints it; mailto = the address the link actually opens.
        list: [
          { label: 'Bachelor of Design (B. Des.): ',
            email: 'design.admissions@atlasuniversity.edu.in',
            mailto: 'design.admissions@atlasuniversity.edu.in' },
          { label: 'Bachelor of Business Administration (BBA): ',
            email: 'management.admissions@atlasuniversity.edu.in',
            mailto: 'management.admissions@atlasuniversity.edu.in' },
          { label: 'Master of Business Administration (MBA): ',
            email: 'pgadmissions@atlasuniversity.edu.in',
            mailto: 'pgadmissions@atlasuniversity.edu.in' },
          // The source prints a space inside this address; the printed
          // text is left as it is and the link opens the valid address.
          { label: 'Bachelor of Science (B.Sc. Hons) ',
            email: 'sdt. admissions@atlasuniversity.edu.in',
            mailto: 'sdt.admissions@atlasuniversity.edu.in' },
          { label: 'Bachelors of LAW (BBA LLB Hons) - ',
            email: 'law@atlasuniversity.edu.in',
            mailto: 'law@atlasuniversity.edu.in' }
        ] },
      { text: 'Refund in case of candidates who have been offered scholarship will be processed ' +
              'on the basis of net fee received by the University from the student.' },
      { text: 'No refund request shall be admissible in case the admission is cancelled/withdrawn ' +
              'due to non-submission of mandatory documents by the prescribed last date or if the ' +
              'admission has been secured on the basis of fictitious information and/or forged documents.' },
      { text: 'In the event that an offer of admission is withdrawn by the University, all such ' +
              'fees are fully refundable, unless the offer is being withdrawn on the basis of ' +
              'incorrect or incomplete information supplied by the student.' },
      { text: 'In the event that an offer of admission is withdrawn by the University given that ' +
              'the University is unable to provide the program, all such fees are fully refundable.' },
      { text: 'The one - time enrolment is fully fee refundable until 17th August 2027.' }
    ],

    // The organisation name, address and the four social channels come
    // from the shared footer (window.FS_FOOTER), so this document uses the
    // very same footer as the fee structures. Only the page number is
    // additional.
    footer: {}
  };
})();
