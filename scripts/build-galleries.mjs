import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../templates/layout.mjs";
import { galleryDetailBody } from "../content/pages/gallery-detail.mjs";
import { GALLERIES } from "../content/gallery-data.mjs";

const ROOT = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "public");
const OUT_DIR = path.join(ROOT, "gallery");
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const show of GALLERIES) {
  const html = renderPage({
    title: show.title,
    description: `Photo gallery from Aurora Theatre Hong Kong's production of ${show.title}. ${show.credit}.`,
    path: `/gallery/${show.slug}`,
    ogImage: `https://www.auroratheatrehk.com/images/photos/${show.images[0]}`,
    bodyHtml: galleryDetailBody(show),
  });
  fs.writeFileSync(path.join(OUT_DIR, `${show.slug}.html`), html);
  console.log("wrote", `gallery/${show.slug}.html`);
}
