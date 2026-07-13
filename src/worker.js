/**
 * Cloudflare Worker serving Aurora Theatre Hong Kong's static site (via the
 * ASSETS binding) and handling POST /contact directly. Sends two emails via
 * the AWS SES v2 REST API with a hand-rolled SigV4 signature (no AWS SDK —
 * the Workers runtime doesn't support it):
 *
 *   1. A plain notification to the site owner, reply-to set to the visitor,
 *      so replying goes straight to them.
 *   2. An HTML confirmation to the visitor, with a header image and a copy
 *      of their message for their records. Best-effort: if only this send
 *      fails, the request still reports success.
 *
 * Required secrets (set via `wrangler secret put <NAME>`):
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SES_FROM_EMAIL
 *
 * Spam protection is a honeypot field only (no Turnstile) — see contact.mjs.
 */

const SITE_NAME = "Aurora Theatre Hong Kong";
const OWNER_EMAIL = "graham_watkins@yahoo.com";
const WELCOME_MESSAGE =
  "Thanks for getting in touch with Aurora Theatre Hong Kong — we've received your message and will get back to you soon.";
const HEADER_IMAGE_URL = "https://www.auroratheatrehk.com/images/photos/2018-01-the-crucible-1.jpg";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  try {
    const data = await request.json();
    const { name, email, phone, message, website } = data;

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

    const awsCreds = {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
    };

    // 1. Notify the site owner — this is the send that matters for
    // follow-up, so a failure here is a real failure of the request.
    const ownerPayload = {
      FromEmailAddress: env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [OWNER_EMAIL] },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Data: `New contact form submission from ${name}`, Charset: "UTF-8" },
          Body: {
            Text: {
              Data: `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}\nMessage:\n${message}`,
              Charset: "UTF-8",
            },
            Html: {
              Data:
                `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
                `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
                (phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : "") +
                `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
              Charset: "UTF-8",
            },
          },
        },
      },
    };

    const ownerResponse = await sendViaSES({ ...awsCreds, payload: ownerPayload });
    if (!ownerResponse.ok) {
      console.error("SES owner notification error:", await ownerResponse.text());
      return jsonResponse({ success: false, error: "Could not send message. Please try again later." }, 502);
    }

    // 2. Confirm receipt to the visitor — best-effort.
    try {
      const visitorPayload = {
        FromEmailAddress: env.SES_FROM_EMAIL,
        Destination: { ToAddresses: [email] },
        ReplyToAddresses: [OWNER_EMAIL],
        Content: {
          Simple: {
            Subject: { Data: `We've received your message — ${SITE_NAME}`, Charset: "UTF-8" },
            Body: {
              Text: { Data: buildConfirmationText({ name, message }), Charset: "UTF-8" },
              Html: { Data: buildConfirmationHtml({ name, message }), Charset: "UTF-8" },
            },
          },
        },
      };
      const visitorResponse = await sendViaSES({ ...awsCreds, payload: visitorPayload });
      if (!visitorResponse.ok) {
        console.error("SES confirmation email error:", await visitorResponse.text());
      }
    } catch (confirmationErr) {
      console.error("Confirmation email error:", confirmationErr);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error("Contact form error:", err);
    return jsonResponse({ success: false, error: "Something went wrong. Please try again later." }, 500);
  }
}

// ---- Visitor confirmation email ----

function buildConfirmationHtml({ name, message }) {
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
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <tr>
            <td>
              <img src="${HEADER_IMAGE_URL}" alt="${escapeHtml(SITE_NAME)}" width="600" style="width:100%; max-width:600px; height:auto; display:block; border:0;">
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <h1 style="margin:0 0 16px; font-size:20px; color:#15100c;">We've received your message</h1>
              <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#374151;">${escapeHtml(WELCOME_MESSAGE)}</p>
              <p style="margin:0 0 8px; font-size:15px; color:#374151;">Hi ${escapeHtml(name)}, here's a copy of what you sent us for your records:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:6px; margin-top:8px;">
                <tr>
                  <td style="padding:16px; font-size:14px; line-height:1.5; color:#4b5563; white-space:pre-wrap;">${escapeHtml(message)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px; background-color:#f9fafb; font-size:12px; color:#9ca3af; text-align:center;">
              ${escapeHtml(SITE_NAME)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildConfirmationText({ name, message }) {
  return `Hi ${name},\n\n${WELCOME_MESSAGE}\n\nHere's a copy of what you sent us:\n\n${message}\n\n— ${SITE_NAME}`;
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
