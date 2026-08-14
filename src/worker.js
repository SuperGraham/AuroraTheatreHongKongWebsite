/**
 * Cloudflare Worker serving Aurora Theatre Hong Kong's static site (via the
 * ASSETS binding) and handling POST /contact directly. Sends ONE email via
 * the AWS SES v2 REST API with a hand-rolled SigV4 signature (no AWS SDK —
 * the Workers runtime doesn't support it): addressed to the visitor, with
 * the site owner CC'd, and Reply-To set to the owner so a visitor's reply
 * continues the conversation with Aurora Theatre. The owner sees the same
 * polished confirmation the visitor gets, with the submitted details
 * included, so there's no separate plain-text notification to maintain.
 *
 * Required secrets (set via `wrangler secret put <NAME>`):
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION,
 *   SES_FROM_EMAIL, SES_TO_EMAIL
 *
 * Spam protection is a honeypot field only (no Turnstile) — see contact.mjs.
 */

const SITE_NAME = "Aurora Theatre Hong Kong";
const WELCOME_MESSAGE =
  "Thanks for getting in touch with Aurora Theatre Hong Kong — we've received your message and will get back to you soon.";
// Points at the workers.dev URL since auroratheatrehk.com still resolves to
// the old WordPress site — switch this to https://www.auroratheatrehk.com/...
// once the real domain is cut over to this Worker.
const HEADER_IMAGE_URL = "https://aurora-theatre-hk.gocloudconsulting.workers.dev/images/photos/2018-01-the-crucible-1.jpg";

// ---- Legacy WordPress URL redirects (301) ----
//
// Maps exact old auroratheatrehk.com WordPress paths — as actually indexed by
// Google/Bing per the live site's own sitemap_index.xml on 2026-08-14, always
// WordPress-style with a trailing slash — to their path on this site, so the
// domain cutover doesn't cost indexed rankings/backlinks. Matched against the
// RAW incoming pathname (not normalized), so a request for an already-clean
// new-site path (e.g. /about, no trailing slash) never matches a key here —
// that's what keeps this from ever redirecting a URL to itself.
const REDIRECTS = {
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
// ~260 individual junk URLs.
const REDIRECT_PREFIXES = [
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" || request.method === "HEAD") {
      const target = REDIRECTS[url.pathname];
      if (target) {
        return Response.redirect(new URL(target + url.search, url).toString(), 301);
      }
      const prefixMatch = REDIRECT_PREFIXES.find(([prefix]) => url.pathname.startsWith(prefix));
      if (prefixMatch) {
        return Response.redirect(new URL(prefixMatch[1], url).toString(), 301);
      }
    }

    if (url.pathname === "/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  try {
    const data = await request.json();
    const { name, email, phone, interest, message, website } = data;

    // Honeypot: bots fill every field including hidden ones. Return a fake
    // success so the bot doesn't learn its submission was rejected.
    if (website) {
      return jsonResponse({ success: true }, 200);
    }

    if (!name || !email || !message) {
      return jsonResponse({ success: false, error: "Please fill in all fields." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: "Please enter a valid email address." }, 400);
    }

    const payload = {
      FromEmailAddress: env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [email], CcAddresses: [env.SES_TO_EMAIL] },
      ReplyToAddresses: [env.SES_TO_EMAIL],
      Content: {
        Simple: {
          Subject: { Data: `We've received your message — ${SITE_NAME}`, Charset: "UTF-8" },
          Body: {
            Text: { Data: buildConfirmationText({ name, email, phone, interest, message }), Charset: "UTF-8" },
            Html: { Data: buildConfirmationHtml({ name, email, phone, interest, message }), Charset: "UTF-8" },
          },
        },
      },
    };

    const response = await sendViaSES({
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      payload,
    });

    if (!response.ok) {
      console.error("SES send error:", await response.text());
      return jsonResponse({ success: false, error: "Could not send message. Please try again later." }, 502);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error("Contact form error:", err);
    return jsonResponse({ success: false, error: "Something went wrong. Please try again later." }, 500);
  }
}

// ---- Confirmation email (visitor To, owner CC) ----
//
// Email clients are far less forgiving than browsers: many strip <style>
// blocks (Gmail), and Outlook desktop still renders with Word's HTML engine,
// which has no flexbox/grid support. A single-column table with inline
// styles and a max-width container is the layout that survives across all
// of them, and it already reads fine on mobile without media queries since
// it's fluid up to that max-width.

function buildConfirmationHtml({ name, email, phone, interest, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Message received</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="position:relative;">
              <img src="${HEADER_IMAGE_URL}" alt="${escapeHtml(SITE_NAME)}" width="600" style="width:100%; max-width:600px; height:auto; display:block; border:0;">
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;">
              <p style="margin:20px 0 0; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#c1552c;">${escapeHtml(SITE_NAME)}</p>
              <h1 style="margin:6px 0 16px; font-size:22px; line-height:1.3; color:#15100c; font-family:Georgia,'Times New Roman',serif;">We've received your message</h1>
              <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#374151;">${escapeHtml(WELCOME_MESSAGE)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6ee; border-radius:8px; border:1px solid #ece4d3;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px; font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#5b3a5c;">Submitted details</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0; font-size:13px; color:#9ca3af; width:80px; vertical-align:top;">Name</td>
                        <td style="padding:4px 0; font-size:14px; color:#15100c;">${escapeHtml(name)}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0; font-size:13px; color:#9ca3af; vertical-align:top;">Email</td>
                        <td style="padding:4px 0; font-size:14px; color:#15100c;">${escapeHtml(email)}</td>
                      </tr>
                      ${phone ? `<tr>
                        <td style="padding:4px 0; font-size:13px; color:#9ca3af; vertical-align:top;">Phone</td>
                        <td style="padding:4px 0; font-size:14px; color:#15100c;">${escapeHtml(phone)}</td>
                      </tr>` : ""}
                      ${interest ? `<tr>
                        <td style="padding:4px 0; font-size:13px; color:#9ca3af; vertical-align:top;">Interested in</td>
                        <td style="padding:4px 0; font-size:14px; color:#15100c;">${escapeHtml(interest)}</td>
                      </tr>` : ""}
                    </table>
                    <p style="margin:16px 0 6px; font-size:13px; color:#9ca3af;">Message</p>
                    <p style="margin:0; font-size:14px; line-height:1.6; color:#15100c; white-space:pre-wrap;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px; background-color:#15100c; font-size:12px; color:#9a9088; text-align:center;">
              ${escapeHtml(SITE_NAME)} &middot; Hong Kong
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildConfirmationText({ name, email, phone, interest, message }) {
  return (
    `${WELCOME_MESSAGE}\n\n` +
    `Submitted details:\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    (phone ? `Phone: ${phone}\n` : "") +
    (interest ? `Interested in: ${interest}\n` : "") +
    `\nMessage:\n${message}\n\n` +
    `— ${SITE_NAME}`
  );
}

// ---- AWS SigV4 signing + SES send (no SDK) ----

async function sendViaSES({ accessKeyId, secretAccessKey, region, payload }) {
  const service = "ses";
  const host = `email.${region}.amazonaws.com`;
  const canonicalUri = "/v2/email/outbound-emails";
  const bodyString = JSON.stringify(payload);

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = await sha256Hex(bodyString);
  const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  const canonicalRequest = ["POST", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [algorithm, amzDate, credentialScope, await sha256Hex(canonicalRequest)].join("\n");

  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = await hmacSha256Hex(signingKey, stringToSign);

  const authorizationHeader =
    `${algorithm} Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(`https://${host}${canonicalUri}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Amz-Date": amzDate,
      Authorization: authorizationHeader,
    },
    body: bodyString,
  });
}

async function sha256Hex(message) {
  const buffer = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return toHex(hash);
}

async function hmacSha256(key, message) {
  const keyBuffer = typeof key === "string" ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return new Uint8Array(signature);
}

async function hmacSha256Hex(key, message) {
  return toHex(await hmacSha256(key, message));
}

async function getSignatureKey(secretKey, dateStamp, regionName, serviceName) {
  const kDate = await hmacSha256("AWS4" + secretKey, dateStamp);
  const kRegion = await hmacSha256(kDate, regionName);
  const kService = await hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, "aws4_request");
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
