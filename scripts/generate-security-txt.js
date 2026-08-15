#!/usr/bin/env node
/**
 * generate-security-txt.js
 *
 * Generates public/.well-known/security.txt per RFC 9116. The Expires date
 * is computed fresh at every build (today + 1 year) rather than hardcoded
 * in a template — RFC 9116's own guidance warns that a stale Expires date
 * is one of the most common security.txt mistakes, and a hardcoded date in
 * a one-time template is exactly how that happens. As long as a site gets
 * rebuilt/redeployed at least once a year (true for anything actively
 * maintained), this field never goes stale without anyone having to
 * remember it — the same reasoning as sitemap.xml being generated instead
 * of hand-maintained.
 *
 * Usage:
 *   SECURITY_CONTACT=mailto:you@example.com SITE_URL=https://example.com node scripts/generate-security-txt.js ./public
 *
 * SECURITY_CONTACT has no sensible default — set it to the site's contact
 * form owner address if a dedicated security inbox would be overkill for
 * a small site, or a distinct one if the project has it.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const CONTACT = process.env.SECURITY_CONTACT || '';
const BUILD_DIR = path.resolve(process.argv[2] || '.');

if (!SITE_URL) {
  console.error('Set SITE_URL env var first, e.g. SITE_URL=https://example.com node scripts/generate-security-txt.js ./public');
  process.exit(1);
}
if (!CONTACT) {
  console.error('Set SECURITY_CONTACT env var first, e.g. SECURITY_CONTACT=mailto:you@example.com node scripts/generate-security-txt.js ./public');
  process.exit(1);
}

const expires = new Date();
expires.setUTCFullYear(expires.getUTCFullYear() + 1);
const expiresIso = expires.toISOString().replace(/\.\d{3}Z$/, '.000Z');

const contactLines = CONTACT.split(',')
  .map((c) => c.trim())
  .filter(Boolean)
  .map((c) => `Contact: ${c}`)
  .join('\n');

const content = `# Security contact information for ${SITE_URL}
# See https://securitytxt.org for more information

${contactLines}
Expires: ${expiresIso}
Canonical: ${SITE_URL}/.well-known/security.txt
Preferred-Languages: en
`;

const wellKnownDir = path.join(BUILD_DIR, '.well-known');
fs.mkdirSync(wellKnownDir, { recursive: true });
fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), content);
console.log(`.well-known/security.txt written to ${BUILD_DIR}, expires ${expiresIso}`);
