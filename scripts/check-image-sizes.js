#!/usr/bin/env node
/**
 * Warns about images that are heavier or larger than they need to be.
 * Never fails the build: it always exits 0 and only prints warnings.
 *
 * Checks (rules in SKILL.md section 7):
 *   1. Any image file in the directory over 100 KB.
 *   2. Any <img> in a page without numeric width and height attributes.
 *      They are required: the check below depends on them, and without them
 *      the page jumps as the image loads.
 *   3. Any <img> whose file is more than 2.5 times the size the page shows it
 *      at (pixel width or height compared with the width/height attributes).
 *
 * Image dimensions are read from the file header for PNG, JPEG, GIF and WebP.
 * No image library is needed. SVG is vector, so check 3 does not apply to it.
 * Only src is checked; srcset candidates are not.
 *
 * Usage: node scripts/check-image-sizes.js ./public
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || './public');
const MAX_BYTES = 100 * 1024;
const MAX_RATIO = 2.5;
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function dimensions(file) {
  let b;
  try { b = fs.readFileSync(file); } catch { return null; }
  if (b.length < 30) return null;
  // PNG: IHDR width/height at bytes 16-23
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  // GIF: logical screen width/height, little endian
  if (b.toString('ascii', 0, 3) === 'GIF') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  // WebP
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const v = b.readUInt32LE(21);
      return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 };
    }
    return null;
  }
  // JPEG: walk markers to a start-of-frame segment
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[2] ?? m[3] ?? m[4]) : null;
}

const kb = (n) => `${Math.round(n / 1024)} KB`;
const rel = (p) => '/' + path.relative(ROOT, p).split(path.sep).join('/');
const warnings = new Map(); // one line per image and problem, with the pages it appears on
function warn(key, text, page) {
  if (!warnings.has(key)) warnings.set(key, { text, pages: new Set() });
  if (page) warnings.get(key).pages.add(page);
}

if (!fs.existsSync(ROOT)) {
  console.log(`check-image-sizes: ${ROOT} not found, skipped`);
  process.exit(0);
}

const files = walk(ROOT);

// 1. Heavy image files, wherever they are
for (const f of files) {
  if (!IMAGE_EXT.has(path.extname(f).toLowerCase())) continue;
  const size = fs.statSync(f).size;
  if (size > MAX_BYTES) warn(`heavy:${f}`, `${rel(f)} is ${kb(size)} (over ${kb(MAX_BYTES)})`);
}

// 2 and 3. <img> tags in pages
for (const page of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(page, 'utf8');
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const src = attr(tag, 'src');
    if (!src || /^(https?:)?\/\//i.test(src) || src.startsWith('data:') || src.includes('${')) continue;
    const clean = decodeURIComponent(src.split(/[?#]/)[0]);
    const file = clean.startsWith('/') ? path.join(ROOT, clean) : path.join(path.dirname(page), clean);
    const w = Number(attr(tag, 'width'));
    const h = Number(attr(tag, 'height'));
    if (!(w > 0) || !(h > 0)) {
      warn(`noattr:${clean}`, `<img src="${src}"> has no numeric width and height attributes`, rel(page));
      continue;
    }
    if (path.extname(file).toLowerCase() === '.svg') continue;
    const d = dimensions(file);
    if (!d) continue;
    const ratio = Math.max(d.w / w, d.h / h);
    if (ratio > MAX_RATIO) {
      warn(`big:${clean}:${w}x${h}`,
        `${clean} is ${d.w}x${d.h}px but shown at ${w}x${h} (${ratio.toFixed(2)}x, limit ${MAX_RATIO}x)`, rel(page));
    }
  }
}

if (warnings.size === 0) {
  console.log('check-image-sizes: no warnings');
} else {
  console.log(`check-image-sizes: ${warnings.size} warning(s), build not stopped`);
  for (const { text, pages } of warnings.values()) {
    const list = [...pages];
    const where = list.length === 0 ? '' : list.length <= 3 ? ` (${list.join(', ')})` : ` (${list.slice(0, 3).join(', ')} and ${list.length - 3} more pages)`;
    console.log(`  WARN ${text}${where}`);
  }
}
process.exit(0);
