import type { MetadataRoute } from 'next';

/**
 * There was no robots.txt at all, which is not neutral — a crawler asking for
 * one got the 404 page, and nothing pointed at the sitemap.
 *
 * Everything is allowed except the API routes. Those return JSON for the app's
 * own use, they are rate-limited, and a crawler walking them spends the quota
 * that readings need. `/api/` is disallowed rather than hidden: robots.txt is a
 * request, not a lock, and the routes are guarded on their own account.
 *
 * AI crawlers are allowed deliberately. slow garden's problem is that nobody
 * can find it — a person who asks an assistant "what is slow garden" should get
 * the app rather than a plant nursery. See `public/llms.txt`, which is the file
 * that actually gives them something to say.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://slowww.garden/sitemap.xml',
    host: 'https://slowww.garden',
  };
}
