/**
 * src/redirects.js — legacy WordPress URL redirects (301) for the
 * auroratheatrehk.com domain cutover.
 *
 * REDIRECTS maps exact old auroratheatrehk.com WordPress paths — as
 * actually indexed by Google/Bing per the live site's own
 * sitemap_index.xml on 2026-08-14, plus the Wayback Machine's full crawl
 * history (which surfaces old slugs no longer in the current sitemap) —
 * to their path on this site, so the domain cutover doesn't cost indexed
 * rankings/backlinks. Matched against the RAW incoming pathname (not
 * normalized), so a request for an already-clean new-site path (e.g.
 * /about, no trailing slash) never matches a key here — that's what keeps
 * this from ever redirecting a URL to itself.
 */
export const REDIRECTS = {
  // Core pages: same slug, only WordPress's trailing slash needs 301'ing to
  // the clean URL. (Cloudflare's asset server already does this on its own
  // for these, but with a temporary 307 — this makes it a proper 301.)
  "/about/": "/about",
  "/sponsors/": "/sponsors",
  "/gallery/": "/gallery",
  "/privacy-policy/": "/privacy-policy",
  "/past-productions/": "/past-productions",
  "/current-productions/": "/current-productions",
  "/contact/": "/contact",
  "/coaching/": "/coaching",
  "/classes-and-workshops/": "/classes-and-workshops",

  // Retired WordPress pages with no direct new-site equivalent.
  "/thank-you/": "/contact",
  "/band-details/": "/",
  "/blog-rs/": "/blog",
  "/blog-ls/": "/blog",
  "/home-bk/": "/",

  // Old slug variants confirmed via the live WordPress site's own redirects
  // (it 301s these itself today) and the Wayback Machine's full crawl
  // history, which isn't reflected in the current sitemap since WordPress
  // no longer serves these paths directly.
  "/current-production/": "/current-productions",
  "/current-production": "/current-productions",
  "/old/contact/": "/contact",

  // Production photo galleries: /playbit_gallery/<slug>/ -> /gallery/<slug>
  "/playbit_gallery/": "/gallery",
  "/playbit_gallery/inherit-the-wind/": "/gallery/inherit-the-wind",
  "/playbit_gallery/the-last-5-years/": "/gallery/the-last-5-years",
  "/playbit_gallery/romance/": "/gallery/romance",
  "/playbit_gallery/the-hecklers-2013/": "/gallery/the-hecklers-2013",
  "/playbit_gallery/the-last-days-of-judas-iscariot/": "/gallery/the-last-days-of-judas-iscariot",
  "/playbit_gallery/the-crucible/": "/gallery/the-crucible",
  "/playbit_gallery/the-complete-works-of-william-shakespeare-abridged/": "/gallery/the-complete-works-of-william-shakespeare-abridged",

  // Blog posts: WordPress used flat root-level slugs; the new site nests
  // everything under /blog/. A handful were also retitled during the rebuild
  // (matched against the original crawled post title, not the old slug).
  "/lets-spike-up-the-drama-with-our-new-blog/": "/blog/lets-spike-up-the-drama-with-our-new-blog",
  "/actors-surviving-covid19/": "/blog/how-covid19-is-changing-our-lives-and-what-can-actors-do-to-survive",
  "/five-meisner-acting-tips-actors-should-know/": "/blog/five-meisner-tips-every-actor-around-the-world-should-know",
  "/zoom-lesson-plan-busy-drama-teachers/": "/blog/the-only-lesson-plan-you-need-for-your-online-drama-classes",
  "/seven-ways-to-regain-your-lost-voice/": "/blog/have-you-lost-your-voice-regain-it-with-our-ultimate-guide",
  "/how-to-face-another-hit-of-covid-19/": "/blog/dont-let-covid-19-and-the-pandemic-take-the-best-out-of-you",
  "/drama-game-of-the-week-crazy-alphabet/": "/blog/drama-game-of-the-week-crazy-alphabet",
  "/drama-game-of-the-week-characters-swap/": "/blog/drama-game-of-the-week-characters-swap",
  "/drama-game-of-the-week-delving-into-backstories/": "/blog/drama-game-of-the-week-delving-into-backstories",
  "/drama-game-of-the-week-emotional-relay/": "/blog/drama-game-of-the-week-emotional-relay",
  "/drama-game-of-the-week-conversations-in-the-dark/": "/blog/drama-game-of-the-week-conversations-in-the-dark",
  "/drama-game-of-the-week-mirror-mirror/": "/blog/drama-game-of-the-week-mirror-mirror",
  "/drama-game-of-the-week-soundscapes/": "/blog/drama-game-of-the-week-soundscapes",
  "/drama-game-of-the-week-constrained-improv/": "/blog/drama-game-of-the-week-constrained-improv",
  "/drama-game-of-the-week-freeze/": "/blog/drama-game-of-the-week-freeze",
  "/1844-2/": "/blog/drama-game-of-the-week-from-a-to-z",
  "/the-acting-chronicles-dealing-with-rejection/": "/blog/the-acting-chronicles-dealing-with-rejection",
  "/the-acting-chronicles-work-life-balance-for-actors/": "/blog/the-acting-chronicles-work-life-balance-for-actors",
  "/the-acting-chronicles-thriving-amidst-uncertainty/": "/blog/the-acting-chronicles-thriving-amidst-uncertainty",
  "/the-acting-chronicles-breaking-the-mould-stereotyping-and-typecasting/": "/blog/the-acting-chronicles-breaking-the-mould-stereotyping-and-typecasting",
  "/the-acting-chronicles-mastering-performance-anxiety/": "/blog/the-acting-chronicles-mastering-performance-anxiety",
  "/drama-teachers-challenges/": "/blog/drama-teachers-challenges-and-how-to-overcome-them",
  "/a-parents-guide-balancing-school-and-acting/": "/blog/a-parents-guide-balancing-school-and-acting",
  "/a-parents-guide-how-to-choose-the-perfect-acting-class/": "/blog/a-parents-guide-how-to-choose-the-perfect-acting-class",
  "/a-parents-guide-building-confidence/": "/blog/a-parents-guide-building-confidence",
  "/a-parents-guide-audition-success/": "/blog/a-parents-guide-audition-success",
  "/a-parents-guide-building-resilience-in-young-performers/": "/blog/a-parents-guide-building-resilience-in-young-performers",
  "/a-parents-guide-fostering-creativity/": "/blog/a-parents-guide-fostering-creativity",
  "/a-parents-guide-fostering-connections-in-the-acting-world/": "/blog/a-parents-guide-fostering-connections-in-the-acting-world",
  "/the-acting-chronicles-bonus-content-ai-for-actors/": "/blog/the-acting-chronicles-bonus-content-ai-for-actors",
};

// Leftover WordPress theme-demo taxonomy/archive sections (fake
// playbit_artist/playbit_band/playbit_event entries, auto-generated
// category/tag archives) — never linked from the real site nav, but Yoast
// published them into sitemap_index.xml so Google/Bing may have indexed a
// few. Prefix-matched to a sensible fallback rather than hand-listing
// ~260 individual junk URLs. Every prefix here needs a matching
// "/prefix/*" entry in wrangler.toml's run_worker_first array.
export const REDIRECT_PREFIXES = [
  ["/category/", "/blog"],
  ["/tag/", "/blog"],
  ["/author/", "/"],
  ["/band_categories/", "/"],
  ["/playbit_artist/", "/"],
  ["/playbit_band/", "/"],
  ["/playbit_event/", "/"],
  // A whole second WordPress install once lived at /old/ (explains the
  // /old/wp-admin/ line in the live site's robots.txt) — it 404s at the
  // directory root today, but the Wayback Machine shows individual pages
  // under it (e.g. /old/contact/, redirected explicitly above) were once
  // crawlable. Catch-all for anything else under there.
  ["/old/", "/"],
];
