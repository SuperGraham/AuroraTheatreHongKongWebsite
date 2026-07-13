import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../templates/layout.mjs";
import { blogPostBody } from "../content/pages/blog-post.mjs";
import { blogIndexBody } from "../content/pages/blog-index.mjs";
import { BLOG_POSTS } from "../content/blog-data.mjs";

const ROOT = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "public");
const OUT_DIR = path.join(ROOT, "blog");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Blog index page
const indexHtml = renderPage({
  title: "Blog",
  description: "Acting tips, drama games, and stories from Aurora Theatre Hong Kong.",
  path: "/blog/",
  bodyHtml: blogIndexBody(BLOG_POSTS),
});
fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml);
console.log("wrote", "blog/index.html");

// Individual post pages
for (const post of BLOG_POSTS) {
  const html = renderPage({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogImage: post.heroImage
      ? `https://www.auroratheatrehk.com/images/photos/${post.heroImage}`
      : undefined,
    schemaType: "Article",
    bodyHtml: blogPostBody(post),
  });
  fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.html`), html);
  console.log("wrote", `blog/${post.slug}.html`);
}
