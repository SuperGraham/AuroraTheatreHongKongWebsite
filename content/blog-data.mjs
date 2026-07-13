import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTRACTED_DIR = path.join(__dirname, "extracted");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(__dirname, "image_manifest.json"), "utf8")
);

const NAV_MARKER = "Aurora Theatre Blog\n";
const DATE_AND_COMMENTS_RE = /(\d{1,2} [A-Z][a-z]{2} \d{4})\n\d+ Comments\n/;
const END_MARKERS = ["Categories:", "Tags:", "Previous Post", "Leave a Reply"];

// Special-case slug override for the one post that only has an ugly
// leftover WordPress numeric slug in its filename.
const SLUG_OVERRIDES = {
  "1844-2": "drama-game-of-the-week-from-a-to-z",
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/['‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripTitleSuffix(title) {
  return title
    .replace(/\s*-\s*Aurora Theatre (Hong Kong|HK)\s*$/i, "")
    .replace(/\s*\|\s*Aurora Theatre (Hong Kong|HK)\s*$/i, "")
    .trim();
}

const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDate(dateStr) {
  const [day, mon, year] = dateStr.split(" ");
  return new Date(Number(year), MONTHS[mon], Number(day));
}

function extractPost(filename) {
  const rawKey = filename.replace(/^blog__/, "").replace(/\.json$/, "");
  const raw = JSON.parse(
    fs.readFileSync(path.join(EXTRACTED_DIR, filename), "utf8")
  );
  const { title, meta_description, body_text } = raw;

  const navIdx = body_text.indexOf(NAV_MARKER);
  if (navIdx === -1) {
    throw new Error(`Nav marker "Aurora Theatre Blog" not found in ${filename}`);
  }
  const rest = body_text.slice(navIdx + NAV_MARKER.length);

  const dateMatch = rest.match(DATE_AND_COMMENTS_RE);
  if (!dateMatch) {
    throw new Error(`Date/comments pattern not found in ${filename}`);
  }
  const dateStr = dateMatch[1];
  const articleStart = dateMatch.index + dateMatch[0].length;

  let articleEnd = -1;
  for (const marker of END_MARKERS) {
    const idx = rest.indexOf(marker, articleStart);
    if (idx !== -1 && (articleEnd === -1 || idx < articleEnd)) {
      articleEnd = idx;
    }
  }
  if (articleEnd === -1) {
    throw new Error(`No end-of-article marker found in ${filename}`);
  }

  const articleText = rest.slice(articleStart, articleEnd);
  const bodyParagraphs = articleText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^[.,:;!?]+$/.test(line));

  const manifestKey = `blog__${rawKey}`;
  const manifestImages = MANIFEST[manifestKey] || [];
  const heroImage = manifestImages.length > 0 ? manifestImages[0].local : null;
  const heroAlt = manifestImages.length > 0 ? manifestImages[0].alt : "";

  const cleanTitle = stripTitleSuffix(title);
  const slug = SLUG_OVERRIDES[rawKey] || slugify(cleanTitle);

  return {
    slug,
    title: cleanTitle,
    description: meta_description,
    date: dateStr,
    dateObj: parseDate(dateStr),
    bodyParagraphs,
    heroImage,
    heroAlt: heroAlt || cleanTitle,
  };
}

function loadAllPosts() {
  const files = fs
    .readdirSync(EXTRACTED_DIR)
    .filter((f) => f.startsWith("blog__") && f !== "blog__blog-index.json");

  const posts = files.map(extractPost);
  posts.sort((a, b) => b.dateObj - a.dateObj);
  return posts;
}

export const BLOG_POSTS = loadAllPosts();
