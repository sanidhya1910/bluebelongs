// Single source of truth for site-wide identity used by metadata, sitemap,
// robots and JSON-LD. Update `url` to the production domain when it changes.
export const siteConfig = {
  name: 'Blue Belong',
  shortName: 'BlueBelong',
  url: 'https://bluebelongs.pages.dev',
  description:
    'Premier SSI-certified diving school in the Andaman Islands — diving courses, underwater adventures, and marine exploration in Havelock.',
  ogImage: '/logo.png',
  locality: 'Havelock Island',
  region: 'Andaman & Nicobar Islands',
  country: 'IN',
} as const;
