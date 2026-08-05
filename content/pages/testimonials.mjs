import { img, eyebrow } from "../helpers.mjs";
import { TESTIMONIALS, PRESS_MENTIONS } from "../testimonials-data.mjs";
import { CLIENTS } from "../clients-data.mjs";

export function testimonialsBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Testimonials")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">What People Say</h1>
      <p class="mt-4 text-cream/75">Reviews and press coverage from over a decade of Aurora Theatre productions, workshops and events.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2 md:px-8">
      ${TESTIMONIALS.map(
        (t) => `
      <figure class="rounded-xl bg-white p-8 shadow-md ring-1 ring-ink/5">
        <blockquote class="font-display text-lg italic leading-relaxed text-ink/85">&ldquo;${t.quote}&rdquo;</blockquote>
        <figcaption class="mt-6 text-sm text-ink/60">
          <span class="font-semibold text-ember">${t.source}</span> &mdash; ${t.context}<br>
          <a href="${t.link}" target="_blank" rel="noopener" class="mt-1 inline-block text-ember hover:text-plum">${t.linkText} &rarr;</a>
        </figcaption>
      </figure>`
      ).join("")}
    </div>
  </section>

  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto max-w-4xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("As Featured In")}
        <h2 class="font-display text-2xl font-bold md:text-3xl">Press &amp; Media</h2>
      </div>
      <ul class="space-y-4">
        ${PRESS_MENTIONS.map(
          (p) => `
        <li class="rounded-lg bg-ink/60 p-5 ring-1 ring-cream/10">
          <span class="font-display font-semibold text-gold">${p.outlet}</span>
          <p class="mt-1 text-sm text-cream/80">${p.description}</p>
          <a href="${p.link}" target="_blank" rel="noopener" class="mt-2 inline-block text-sm font-semibold text-ember hover:text-gold-light">Read more &rarr;</a>
        </li>`
        ).join("")}
      </ul>
      <p class="mt-8 text-center text-sm text-cream/60">
        <a href="https://www.facebook.com/auroratheatrehk/reviews" target="_blank" rel="noopener" class="text-ember hover:text-gold-light">See more reviews on Facebook &rarr;</a>
      </p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-5xl px-4 text-center md:px-8">
      ${eyebrow("Our Clients")}
      <h2 class="font-display text-2xl font-bold text-ink md:text-3xl">Organisations We've Worked With</h2>
      <div class="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-6">
        ${CLIENTS.map(
          (c) => `<div class="flex items-center justify-center rounded-lg bg-white p-4 shadow-sm ring-1 ring-ink/5">${img(c.file, c.name, "max-h-16 w-full object-contain")}</div>`
        ).join("")}
      </div>
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
