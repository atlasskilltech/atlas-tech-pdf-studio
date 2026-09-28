/* =====================================================================
   Framing.

   The flipbook viewer exists to be embedded, so /flipbook/* explicitly
   permits any parent frame. Everything else - the studio itself - is
   restricted to same-origin framing, which it never needs anyway.

   Nothing here sets X-Frame-Options on the viewer: that header has no
   way to express "any site", and its presence would block the embed
   outright in some browsers.
   ===================================================================== */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // The public viewer: embeddable anywhere.
        source: '/flipbook/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
      {
        // Everything else. The negative lookahead keeps this rule off the
        // viewer, so the two can never both apply.
        source: '/((?!flipbook).*)',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ];
  },
};

export default nextConfig;
