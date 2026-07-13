import { img, eyebrow } from "../helpers.mjs";
import { PAST_PRODUCTIONS } from "../productions-data.mjs";

const GALLERY_SHOWS = PAST_PRODUCTIONS.filter((p) => p.gallerySlug);

const PHOTO_COUNTS = {
  "the-hecklers-2013": 7,
  "the-last-days-of-judas-iscariot": 12,
  romance: 5,
  "inherit-the-wind": 17,
  "the-last-5-years": 5,
  "the-crucible": 24,
  "the-complete-works-of-william-shakespeare-abridged": 6,
};

export function galleryBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Showcase")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Gallery</h1>
      <p class="mt-4 text-cream/75">Photographs from Aurora Theatre productions over the years.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
      ${GALLERY_SHOWS.map(
        (show) => `
      <a href="/gallery/${show.gallerySlug}" class="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5 transition hover:shadow-xl">
        ${show.poster ? img(show.poster, show.title, "h-56 w-full object-cover transition duration-300 group-hover:scale-105") : `<div class="flex h-56 w-full items-center justify-center bg-plum-dark"><span class="font-display text-cream/70">Aurora Theatre</span></div>`}
        <div class="p-6">
          <h2 class="font-display text-lg font-bold text-ink">${show.title}</h2>
          <p class="mt-1 text-sm text-ink/60">${PHOTO_COUNTS[show.gallerySlug] || ""} Photos</p>
        </div>
      </a>`
      ).join("")}
    </div>
  </section>
  `;
}
