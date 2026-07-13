import { img, eyebrow } from "../helpers.mjs";

export function blogPostBody({ title, date, bodyParagraphs, heroImage, heroAlt }) {
  return `
  <section class="bg-ink py-16 text-center text-cream md:py-20">
    <div class="mx-auto max-w-3xl px-4 md:px-8">
      ${eyebrow("Blog")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">${title}</h1>
      <p class="mt-3 text-sm text-cream/60">Aurora Theatre &mdash; ${date}</p>
    </div>
  </section>

  <section class="bg-cream py-12 md:py-16">
    <div class="mx-auto max-w-3xl px-4 md:px-8">
      ${heroImage ? img(heroImage, heroAlt, "mb-10 w-full rounded-xl object-cover shadow-md") : ""}
      <div class="space-y-5 text-base leading-relaxed text-ink/80">
        ${bodyParagraphs.map((p) => `<p>${p}</p>`).join("\n        ")}
      </div>
      <a href="/blog/" class="mt-10 inline-block text-sm font-semibold text-ember hover:text-plum">&larr; Back to Blog</a>
    </div>
  </section>

  <section class="bg-plum py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      ${eyebrow("Keep The Story Going")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">Ready To Take The Stage Yourself?</h2>
      <p class="mt-4 text-cream/85">Join one of our classes or get in touch to talk about coaching, workshops and upcoming productions.</p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
        <a href="/classes-and-workshops" class="btn-gold">Explore Classes</a>
        <a href="/contact" class="btn-outline">Contact Us</a>
      </div>
    </div>
  </section>
  `;
}
