import { eyebrow } from "../helpers.mjs";

export function galleryDetailBody({ title, credit, images }) {
  return `
  <section class="bg-ink py-16 text-center text-cream md:py-20">
    <div class="mx-auto max-w-3xl px-4 md:px-8">
      ${eyebrow("Gallery")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">${title}</h1>
      <p class="mt-3 text-sm text-cream/60">${credit}</p>
      <a href="/gallery" class="mt-6 inline-block text-sm font-semibold text-gold hover:text-gold-light">&larr; Back To Gallery</a>
    </div>
  </section>

  <section class="bg-cream py-12">
    <div id="photo-grid" class="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4 md:px-8">
      ${images
        .map(
          (local) => `
      <button type="button" data-full="/images/photos/${local}" data-alt="${title}" class="group overflow-hidden rounded-lg shadow-sm">
        <img src="/images/photos/${local}" alt="${title} production photo" loading="lazy" class="h-32 w-full object-cover transition duration-300 group-hover:scale-110 sm:h-40 md:h-44">
      </button>`
        )
        .join("")}
    </div>
  </section>
  <script src="/js/lightbox.js"></script>
  `;
}
