#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Scans a directory of built static HTML files and writes sitemap.xml + robots.txt
 * into that same directory. Run this as the last step of the build, after all HTML
 * files exist in their final output location, so the URL list is accurate.
 *
 * Usage:
 *   SITE_URL=https://example.com node scripts/generate-sitemap.js ./dist
 *
 * If no directory is given, defaults to the current directory (useful for sites
 * with no build step, where the HTML files ARE the deployed output).
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const BUILD_DIR = path.resolve(process.argv[2] || '.');

// Directories/files that should never appear in the sitemap.
const EXCLUDE_DIRS = new Set(['functions', 'node_modules', '.git', '.wrangler']);
const EXCLUDE_FILES = new Set(['404.html', '500.html']);

if (!SITE_URL) {
  console.error('Set SITE_URL env var first, e.g. SITE_URL=https://example.com node scripts/generate-sitemap.js ./dist');
  process.exit(1);
}

function findHtmlFiles(dir, baseDir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      findHtmlFiles(fullPath, baseDir, results);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !EXCLUDE_FILES.has(entry.name)) {
      let rel = path.relative(baseDir, fullPath).split(path.sep).join('/');
      // Clean URLs: index.html -> directory root, page.html -> /page
      if (rel === 'index.html') rel = '';
      else if (rel.endsWith('/index.html')) rel = rel.slice(0, -'index.html'.length);
      else rel = rel.replace(/\.html$/, '');
      results.push(rel);
    }
  }
  return results;
}

function buildSitemap(urls) {
  const today = new Date().toISOString().split('T')[0];
  const entries = urls
    .sort()
    .map((u) => {
      const loc = u ? `${SITE_URL}/${u}` : `${SITE_URL}/`;
      const priority = u === '' ? '1.0' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

// AI-training crawlers refused outright in robots.txt. Cloudflare's managed
// robots.txt list as served on gocloud.consulting on 13 November 2026, minus
// Baiduspider and PetalBot (search engines; blocking them would contradict
// search=yes). Crawlers that fetch a page to answer a user's question
// (ChatGPT-User, OAI-SearchBot, Claude-User, Claude-SearchBot, PerplexityBot,
// Perplexity-User) are deliberately not listed: that would contradict
// ai-input=yes. Keep this list the same on every site (static-site-builder
// SKILL.md section 3).
const AI_TRAINING_CRAWLERS = [
  'Amazonbot', 'Applebot-Extended', 'Bytespider', 'CCBot', 'ClaudeBot',
  'Diffbot', 'Google-Extended', 'GPTBot', 'omgili', 'anthropic-ai',
  'Claude-Web', 'cohere-ai', 'MistralAI-Training', 'meta-externalagent',
  'GoogleOther', 'AwarioSmartBot', 'AwarioRssBot', 'Google-CloudVertexBot',
  'QualifiedBot', 'Cotoyogi', 'ICC-Crawler', 'atlassian-bot', 'FishBot',
  'BorderxBot', 'NavuBot', 'SemrushBot-SWA', 'WARDBot', 'magpie-crawler',
  'KimiBot', 'CitibotSiteCrawler',
];

// Site-specific paths no crawler should fetch (for example '/admin/'); added
// to the first group. Empty by default. Never list a page that carries a
// noindex tag (a crawler that cannot fetch the page cannot read the tag).
const DISALLOW_PATHS = [];

function buildRobotsTxt() {
  // Group 1: the site's terms for everyone (Content Signals, contentsignals.org):
  // search engines may index, AI tools may use pages as live input to an
  // answer, nobody may train models on the content.
  // Group 2: refuses known AI-training crawlers by name, because few crawlers
  // read Content-Signal yet. Several User-agent lines over one Disallow is
  // valid robots.txt (RFC 9309).
  // The matching Cloudflare setting is Training: Disallow, never Block
  // (SKILL.md sections 3 and 6).
  const disallow = DISALLOW_PATHS.map((p) => `Disallow: ${p}\n`).join('');
  const crawlers = AI_TRAINING_CRAWLERS.map((ua) => `User-agent: ${ua}\n`).join('');
  return `User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nAllow: /\n${disallow}\n${crawlers}Disallow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

const urls = findHtmlFiles(BUILD_DIR, BUILD_DIR);
fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), buildSitemap(urls));
fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), buildRobotsTxt());
console.log(`sitemap.xml (${urls.length} URLs) and robots.txt written to ${BUILD_DIR}`);
