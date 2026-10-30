#!/usr/bin/env node
/**
 * generate-early-hints.js
 *
 * Writes the per-page Early Hints rules into public/_headers on every build,
 * so every HTML page carries `Link: </css/style.css>; rel=preload; as=style`
 * — the header Cloudflare's Early Hints feature replays as a 103 response.
 * A page without a Link header gets no Early Hints at all, silently, so
 * hand-maintaining one block per page means every page added later is
 * missed. Run it after build:pages (it reads the built HTML).
 *
 * Only HTML pages get the hint, never CSS/JS/images/downloads: a preload
 * hint on a response that doesn't use the stylesheet shows up in Chrome as
 * an unused preload. So it is never put in the /* block.
 *
 * Cloudflare allows at most 100 rules in _headers. A top-level folder that
 * contains nothing but .html files (at any depth) gets ONE splat rule
 * (/blog/*) covering all its pages; every other page gets its own rule (/x
 * for x.html, /dir/ for dir/index.html). If a non-HTML file is ever added to
 * such a folder, it falls back to per-page rules automatically, so the hint
 * can never land on an asset. The script refuses to write a file that would
 * go over the limit.
 *
 * Only the section between the BEGIN/END markers in public/_headers is
 * replaced; every other block (security headers, CORP exceptions, etc.) is
 * left exactly as it is. The markers must already be in the file.
 *
 * Usage: node scripts/generate-early-hints.js ./public
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(process.argv[2] || 'public');
const HEADERS_FILE = path.join(PUBLIC_DIR, '_headers');
const BEGIN = '# BEGIN generated early-hints';
const END = '# END generated early-hints';
const LINK = 'Link: </css/style.css>; rel=preload; as=style';
const SKIP = new Set(['404.html', '500.html']);
const MAX_RULES = 100;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** /index.html -> /, /de/index.html -> /de/, /why.html -> /why */
function routeFor(relPath) {
  const p = '/' + relPath.split(path.sep).join('/');
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length);
  return p.slice(0, -'.html'.length);
}

function buildRules() {
  const rules = [];
  for (const entry of fs.readdirSync(PUBLIC_DIR, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(PUBLIC_DIR, entry.name);
    if (entry.isFile()) {
      if (entry.name.endsWith('.html') && !SKIP.has(entry.name)) rules.push(routeFor(entry.name));
      continue;
    }
    if (!entry.isDirectory()) continue;
    const files = walk(full);
    const pages = files.filter((f) => f.endsWith('.html') && !SKIP.has(path.basename(f)));
    if (!pages.length) continue;
    if (pages.length === files.length) {
      rules.push(`/${entry.name}/*`); // HTML-only folder: one rule covers every page in it
    } else {
      for (const f of pages.sort()) rules.push(routeFor(path.relative(PUBLIC_DIR, f)));
    }
  }
  return rules;
}

function countRules(text) {
  // A rule is a non-blank, non-comment line that starts at column 0.
  return text.split('\n').filter((l) => l.length && !/^\s/.test(l) && !l.startsWith('#')).length;
}

const original = fs.readFileSync(HEADERS_FILE, 'utf8');
const b = original.indexOf(BEGIN);
const e = original.indexOf(END);
if (b === -1 || e === -1 || e < b) {
  console.error(`generate-early-hints: ${HEADERS_FILE} is missing the "${BEGIN}" / "${END}" markers`);
  process.exit(1);
}

const rules = buildRules();
const section = [
  BEGIN,
  '# Written by scripts/generate-early-hints.js on every build — edit the script, not these lines.',
  ...rules.map((r) => `${r}\n  ${LINK}\n`),
  END,
].join('\n');

const updated = original.slice(0, b) + section + original.slice(e + END.length);
const total = countRules(updated);
if (total > MAX_RULES) {
  console.error(`generate-early-hints: would write ${total} rules; Cloudflare allows ${MAX_RULES}. _headers left unchanged.`);
  process.exit(1);
}

fs.writeFileSync(HEADERS_FILE, updated);
console.log(`_headers: ${rules.length} early-hints rules written (${total} rules in total, limit ${MAX_RULES})`);
