import { img, eyebrow } from "../helpers.mjs";

export function blogIndexBody(posts) {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Blog")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Aurora Theatre Blog</h1>
      <p class="mt-4 text-cream/75">Acting tips, drama games, and stories from Aurora Theatre Hong Kong.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
      ${posts
        .map(
          (post) => `
      <a href="/blog/${post.slug}" class="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5 transition hover:shadow-xl">
        ${
          post.heroImage
            ? img(post.heroImage, post.heroAlt, "h-48 w-full object-cover transition duration-300 group-hover:scale-105")
            : `<div class="flex h-48 w-full items-center justify-center bg-plum-dark"><span class="font-display text-cream/70">Aurora Theatre</span></div>`
        }
        <div class="p-6">
          <p class="text-xs font-semibold uppercase tracking-wide text-ember">${post.date}</p>
          <h2 class="mt-2 font-display text-lg font-bold text-ink">${post.title}</h2>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">${post.description}</p>
        </div>
      </a>`
        )
        .join("")}
    </div>
  </section>
  `;
}
