# Aurora Theatre Hong Kong — Static Site

A from-scratch static rebuild of [auroratheatrehk.com](https://www.auroratheatrehk.com), previously a WordPress site. Real content (productions, about, classes, coaching, blog, photo galleries) was crawled from the live site and ported into hand-built, responsive Tailwind CSS pages — no WordPress, no PHP, no CMS.

## Project layout

```
content/            Source content (data modules + extracted JSON) — not deployed
  extracted/         Raw crawled text/images per page, used to author content
  pages/             Page body templates (one .mjs per page/page-type)
  *-data.mjs         Structured data (productions, galleries, blog posts)
templates/
  layout.mjs         Shared HTML shell: nav, footer, SEO meta, fonts
scripts/
  build-pages.mjs     Builds the 10 core pages -> public/
  build-galleries.mjs Builds the 7 production photo galleries -> public/gallery/
  build-blog.mjs      Builds the blog index + posts -> public/blog/
  generate-sitemap.js Walks public/ and writes sitemap.xml + robots.txt
src/worker.js         Cloudflare Worker: serves public/ as static assets,
                      handles POST /contact (AWS SES email sending)
public/               Build OUTPUT — this is what actually gets deployed
wrangler.toml          Cloudflare Workers config (static assets + Worker)
```

Only `public/` (plus the Worker script) is deployed. Everything else is source material used to generate it — if you edit a page, edit its `content/pages/*.mjs` file and re-run the build, don't hand-edit files under `public/`.

## Local development

```bash
npm install
npm run build       # builds all pages, compiles Tailwind, regenerates sitemap
```

To preview:
- **Static preview only** (no contact form): `python3 -m http.server 8792 --directory public`, then visit http://localhost:8792
- **Full preview with the contact form working**: `npx wrangler dev` — this runs the real Worker locally, serving `public/` and handling `POST /contact` exactly as production will (minus real AWS credentials — see below).

While actively editing styles: `npm run dev` runs Tailwind in watch mode.

## Contact form — required setup before it can send email

The contact form (`/contact`) is handled entirely by `src/worker.js`, which sends a single HTML email via a hand-signed AWS SES v2 API call (no AWS SDK, since the Workers runtime doesn't support it) — addressed to the visitor, with the site owner (`SES_TO_EMAIL`) CC'd and set as reply-to. It includes a "submitted details" block (name/email/phone/message) so the owner has everything needed to follow up without a second email.

Spam protection is a honeypot field only (no CAPTCHA/Turnstile) — sufficient for a low-traffic site, revisit if spam becomes a problem.

**Before this will actually send mail, you need to:**

1. **Verify a sending identity in AWS SES** — an email address or domain (e.g. `noreply@auroratheatrehk.com` or `info@auroratheatrehk.com`) in the AWS SES console, in your chosen region (this project defaults to **eu-west-2 / London**, per your earlier preference).
2. **Move SES out of sandbox mode** if you want to send to arbitrary visitor addresses (not just pre-verified ones) — request production access in the SES console.
3. **Create an IAM user** scoped to only `ses:SendEmail` / `ses:SendRawEmail`, and generate an access key for it.
4. **Set the Secret Access Key as a Cloudflare Worker secret** — this is the only value here that's actually sensitive (never commit it — set it yourself so it never appears in chat, a repo, or my hands):
   ```bash
   npx wrangler secret put AWS_SECRET_ACCESS_KEY
   ```
   Prompts you interactively for the value.
5. **Everything else is a plain-text `[vars]` entry in `wrangler.toml`** — access key ID, region, and the to/from email addresses aren't sensitive on their own (an access key ID without its secret is useless; the emails are just routing addresses), so they live visibly in the repo like any other config:
   ```toml
   [vars]
   SES_TO_EMAIL = "graham_watkins@yahoo.com"
   SES_FROM_EMAIL = "auroratheatrehongkong@alerts.gocloud.zone"
   AWS_ACCESS_KEY_ID = "..."
   AWS_REGION = "eu-west-2"
   ```
   Edit any of these directly and `npx wrangler deploy` to change them — no secret rotation needed. `SES_FROM_EMAIL` must be a verified SES identity in the region above.

Until these are set, the form will fail gracefully (visitor sees "Could not send message, please try again later"; nothing crashes).

## Deploying

```bash
npm run build
npx wrangler deploy
```

This deploys the Worker + static assets as a Cloudflare Workers project named `aurora-theatre-hk` (see `wrangler.toml`). First deploy will need `npx wrangler login` if you haven't authenticated this machine with Cloudflare before.

To use the real domain (auroratheatrehk.com) instead of the default `*.workers.dev` URL, add a custom domain route to the Worker from the Cloudflare dashboard (Workers & Pages → aurora-theatre-hk → Settings → Domains & Routes) once you're ready to cut over.

## Updating content later

- **Core pages** (home, about, productions, etc.): edit the relevant file in `content/pages/*.mjs`, then `npm run build:pages && npm run build:css`.
- **Blog posts**: edit `content/blog-data.mjs` (or the post's source in `content/extracted/`) and re-run `node scripts/build-blog.mjs`.
- **New photos**: add the file under `public/images/photos/`, reference it via the `img()` helper in `content/helpers.mjs`.
- Always finish with `npm run build:sitemap` (or just `npm run build`) so `sitemap.xml` stays in sync with whatever pages exist.
