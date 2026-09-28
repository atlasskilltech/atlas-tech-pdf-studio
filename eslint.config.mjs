import coreWebVitals from 'eslint-config-next/core-web-vitals';

/** Flat config: Next.js recommended rules plus Core Web Vitals. */
const config = [
  { ignores: ['.next/**', 'node_modules/**', 'ref/**', 'public/**'] },
  ...coreWebVitals,
];

export default config;
