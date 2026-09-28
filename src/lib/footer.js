/* =====================================================================
   The common footer.

   PERMANENT RULE - ONE footer object, shared by every ATLAS PDF in this
   project, so the footer cannot drift between documents: same text, same
   links, same order, same icons, everywhere. A document never declares
   its own footer content.

   Only the accent rule above the band takes the document's colour. The
   band itself is always ATLAS indigo.
   ===================================================================== */

export const FOOTER = {
  org: 'ATLAS SKILLTECH UNIVERSITY',
  orgUrl: 'https://atlasuniversity.edu.in/',
  address:
    'Tower 1, Equinox Business Park, Ambedkar Nagar, Kurla West, Kurla, Mumbai, Maharashtra 400070',
  addressUrl: 'https://maps.app.goo.gl/Wf9VaQ4yGfqaXMVR6',
  social: [
    {
      icon: 'instagram',
      label: '@atlasskilltechuniversity',
      url: 'https://www.instagram.com/atlasskilltechuniversity/',
    },
    {
      icon: 'facebook',
      label: 'atlasskilltechuniversity',
      url: 'https://www.facebook.com/atlasskilltechuniversity/',
    },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/school/atlasuniversity',
    },
    {
      icon: 'youtube',
      label: 'YouTube',
      url: 'https://www.youtube.com/@atlasskilltechuniversity',
    },
  ],
};
