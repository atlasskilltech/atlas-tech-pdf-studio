/* =====================================================================
   This application's own identity.

   Deliberately separate from lib/brand.js. That file holds ATLAS
   SkillTech University's brand - the marks, colours and lockups that
   belong on the DOCUMENTS - and it is governed by the university's brand
   guidelines. What follows is the branding of the tool that makes them,
   and it belongs only to the application's own chrome.

   Keeping the two apart is what stops the product logo ever appearing on
   a fee structure, or a school lockup ever standing in for the product.
   ===================================================================== */

export const PRODUCT = {
  name: 'ATLAS Tech PDF Studio',

  /**
   * The full lockup - the mark and the wordmark together, so the header
   * needs no separate name beside it.
   *
   * The supplied artwork comes in two versions, and this is the
   * transparent one - a reversed lockup, its wordmark set light, which
   * is what lets it sit straight on the indigo header band. The
   * white-background version is the dark wordmark, for light surfaces;
   * the application's chrome has none, so only this one is shipped.
   *
   * Intrinsic size is declared so the header reserves the right space
   * before the image arrives and nothing shifts as it loads. It is
   * derived from the file, so the two cannot drift apart.
   */
  logo: {
    src: '/brand/atlas-tech-pdf-studio.png',
    width: 744,
    height: 240,
    alt: 'ATLAS Tech PDF Studio',
  },
};
