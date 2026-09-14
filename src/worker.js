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
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, TURNSTILE_SECRET_KEY
 *
 * Spam protection is honeypot + Cloudflare Turnstile. Turnstile matters here
 * beyond ordinary spam: this handler takes the recipient address straight from
 * the submitted payload, so without a real bot check anyone can POST JSON
 * directly and drive SES into sending mail from this verified domain to any
 * address they choose. SES bounce/complaint rates are tracked per AWS account,
 * shared with other projects, so abuse here wouldn't stay contained.
 */

import { REDIRECTS, REDIRECT_PREFIXES } from "./redirects.js";

const SITE_NAME = "Aurora Theatre Hong Kong";
const WELCOME_MESSAGE =
  "Thanks for getting in touch with Aurora Theatre Hong Kong — we've received your message and will get back to you soon.";
// Must be a public absolute HTTPS URL — email clients can't load relative
// paths. Points at the real domain rather than a workers.dev hostname: the
// contact form can't send at all until SES verifies the domain identity,
// which only happens once DNS is live on Cloudflare, so by the time any
// email goes out this URL resolves.
const HEADER_IMAGE_URL = "https://www.auroratheatrehk.com/images/photos/2018-01-the-crucible-1.jpg";

// ---- Security headers ----
//
// public/_headers applies this same set to every static asset response
// automatically — but ONLY for requests that never reach this Worker. Every
// path this Worker handles (every entry in wrangler.toml's run_worker_first)
// bypasses that pipeline entirely, and Cloudflare documents that _headers
// rules don't apply to Worker-generated responses even when the path
// matches a rule — confirmed empirically with wrangler dev: /contact and
// every redirected path came back with none of the _headers-defined headers
// until applied here explicitly. Every response this fetch handler returns
// goes through withSecurityHeaders() for that reason. Keep this object in
// sync with public/_headers if either changes — same values, two
// enforcement points.
//
// Strict-Transport-Security is deliberately NOT set here or in
// public/_headers — enable it via Cloudflare dashboard > SSL/TLS > Edge
// Certificates > HSTS instead; setting it in both places produces a literal
// duplicate header, and the dashboard setting covers the HTTP->HTTPS
// redirect Cloudflare's "Always Use HTTPS" issues at the edge, which never
// executes this Worker's code at all.
//
// challenges.cloudflare.com is allowed in script-src (Turnstile's api.js) and
// frame-src (the widget renders in an iframe). Nothing else cross-origin
// loads on this site. Cross-Origin-Embedder-Policy below is deliberately
// 'credentialless' rather than 'require-corp' for the same reason: Turnstile's
// api.js doesn't send a Cross-Origin-Resource-Policy header, so require-corp
// blocks it outright and silently kills the spam protection.
const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; " +
    "frame-src https://challenges.cloudflare.com; style-src 'self'; img-src 'self' data:; " +
    "font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; " +
    "frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "credentialless",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-DNS-Prefetch-Control": "off",
  "Origin-Agent-Cluster": "?1",
};

function withSecurityHeaders(response) {
  const newResponse = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    newResponse.headers.set(name, value);
  }
  return newResponse;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" || request.method === "HEAD") {
      const target = REDIRECTS[url.pathname];
      if (target) {
        return withSecurityHeaders(Response.redirect(new URL(target + url.search, url).toString(), 301));
      }
      const prefixMatch = REDIRECT_PREFIXES.find(([prefix]) => url.pathname.startsWith(prefix));
      if (prefixMatch) {
        return withSecurityHeaders(Response.redirect(new URL(prefixMatch[1], url).toString(), 301));
      }
    }

    if (url.pathname === "/contact" && request.method === "POST") {
      return withSecurityHeaders(await handleContact(request, env));
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};

async function handleContact(request, env) {
  try {
    const data = await request.json();
    const { name, email, phone, interest, message, website, turnstileToken } = data;

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

    // Verified before the SES call, never after — this is what stops the
    // recipient address below being attacker-controlled.
    if (!turnstileToken) {
      return jsonResponse({ success: false, error: "Verification failed. Please try again." }, 400);
    }
    const verified = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get("CF-Connecting-IP")
    );
    if (!verified) {
      return jsonResponse({ success: false, error: "Verification failed. Please try again." }, 403);
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

// ---- Turnstile ----

async function verifyTurnstile(token, secretKey, remoteIp) {
  const body = new FormData();
  body.append("secret", secretKey);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const outcome = await res.json();
  return outcome.success === true;
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
