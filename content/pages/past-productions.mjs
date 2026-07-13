import { img, eyebrow } from "../helpers.mjs";
import { PAST_PRODUCTIONS } from "../productions-data.mjs";

export function pastProductionsBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Productions")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Past Productions</h1>
      <p class="mt-4 text-cream/75">Since 2010, Aurora Theatre has brought international and original material to stages across Hong Kong.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
      ${PAST_PRODUCTIONS.map((show) => {
        const card = `
        <div class="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5">
          ${show.poster ? img(show.poster, show.title, "h-56 w-full object-cover") : `<div class="flex h-56 w-full items-center justify-center bg-plum-dark"><span class="font-display text-cream/70">Aurora Theatre</span></div>`}
          <div class="p-6">
            <h2 class="font-display text-lg font-bold text-ink">${show.title}</h2>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${show.description}</p>
            ${show.gallerySlug ? `<a href="/gallery/${show.gallerySlug}" class="mt-4 inline-block text-sm font-semibold text-ember hover:text-plum">View Photo Gallery &rarr;</a>` : ""}
          </div>
        </div>`;
        return card;
      }).join("")}
    </div>
  </section>

  <section class="bg-charcoal py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      ${eyebrow("Watch Our Promos")}
      <h2 class="font-display text-2xl font-bold">The Othello Rap, Thinner Than Water & The Crucible</h2>
      <a href="https://www.youtube.com/playlist?list=PLwhWmWJPoEmHqEQek0JGlt2JEeD4eVPIX" target="_blank" rel="noopener" class="btn-gold mt-6">Watch On YouTube</a>
    </div>
  </section>
  `;
}
