import { img, eyebrow } from "../helpers.mjs";
import { SERVICES } from "../services-data.mjs";

export function servicesHubBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Services")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">A Full-Service Creative Company</h1>
      <p class="mt-4 text-cream/75">Theatre, training, storytelling and connection — Aurora Theatre works with schools, businesses, hospitality venues, event organisers, actors, private clients and community organisations.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
      ${SERVICES.map(
        (s) => `
      <a href="/services/${s.slug}" class="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5 transition hover:shadow-xl">
        ${img(s.heroImage, s.heroAlt, "h-48 w-full object-cover transition duration-300 group-hover:scale-105")}
        <div class="flex flex-1 flex-col p-6">
          <h2 class="font-display text-lg font-bold text-ink">${s.navLabel}</h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-ink/70">${s.tagline}</p>
          <span class="mt-4 inline-block text-sm font-semibold text-ember group-hover:text-plum">Learn more &rarr;</span>
        </div>
      </a>`
      ).join("")}
    </div>
  </section>

  <section class="bg-plum py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      <h2 class="font-display text-2xl font-bold md:text-3xl">Let's Create Something Unforgettable Together</h2>
      <a href="/contact" class="btn-gold mt-6">Contact Us</a>
    </div>
  </section>
  `;
}
