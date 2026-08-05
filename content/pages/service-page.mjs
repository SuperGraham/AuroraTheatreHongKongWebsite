import { img, eyebrow } from "../helpers.mjs";
import { SERVICES } from "../services-data.mjs";

export function servicePageBody(service) {
  return `
  <section class="relative flex min-h-[50vh] items-center overflow-hidden bg-ink">
    ${img(service.heroImage, service.heroAlt, "absolute inset-0 h-full w-full object-cover opacity-40")}
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40"></div>
    <div class="relative mx-auto max-w-4xl px-4 py-20 text-center md:px-8">
      ${eyebrow("Services")}
      <h1 class="font-display text-4xl font-bold text-cream md:text-5xl">${service.title}</h1>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-cream/80">${service.tagline}</p>
      <a href="/contact" class="btn-gold mt-8">Get In Touch</a>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:px-8">
      <div>
        ${eyebrow("What We Offer")}
        <ul class="space-y-2">
          ${service.offers
            .map(
              (o) => `<li class="flex gap-2 text-ink/80"><span class="mt-1 text-ember">&#9679;</span><span>${o}</span></li>`
            )
            .join("")}
        </ul>
      </div>
      <div class="rounded-xl bg-parchment p-6 ring-1 ring-ink/10">
        <h2 class="font-display text-lg font-bold text-ink">Perfect For</h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${service.perfectFor
            .map((p) => `<li class="rounded-full bg-white px-4 py-1.5 text-sm text-ink/75 ring-1 ring-ink/10">${p}</li>`)
            .join("")}
        </ul>
        ${
          service.benefits
            ? `<h2 class="mt-8 font-display text-lg font-bold text-ink">Benefits</h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${service.benefits
            .map((b) => `<li class="rounded-full bg-gold/20 px-4 py-1.5 text-sm font-medium text-ink ring-1 ring-gold/40">${b}</li>`)
            .join("")}
        </ul>`
            : ""
        }
        ${
          service.extraLinks
            ? `<div class="mt-8 space-y-2 border-t border-ink/10 pt-6">
          ${service.extraLinks
            .map((l) => `<a href="${l.href}" class="block font-semibold text-ember hover:text-plum">${l.label} &rarr;</a>`)
            .join("")}
        </div>`
            : ""
        }
      </div>
    </div>
  </section>

  ${
    service.extraSection
      ? `
  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Approach")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">${service.extraSection.heading}</h2>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        ${service.extraSection.items
          .map((i) => `<span class="rounded-full bg-ink/60 px-5 py-2 text-sm ring-1 ring-cream/10">${i}</span>`)
          .join("")}
      </div>
    </div>
  </section>`
      : ""
  }

  ${
    service.featured
      ? `
  <section class="bg-plum py-16 text-cream">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Featured Collaboration")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">${service.featured.heading}</h2>
      <p class="mt-4 text-cream/85">${service.featured.body}</p>
      <a href="${service.featured.link}" target="_blank" rel="noopener" class="mt-6 inline-block font-semibold text-gold hover:text-gold-light">${service.featured.linkText} &rarr;</a>
    </div>
  </section>`
      : ""
  }

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Gallery")}
        <h2 class="font-display text-3xl font-bold text-ink">See It In Action</h2>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        ${service.gallery
          .map((g) => img(g.file, g.alt, "h-40 w-full rounded-lg object-cover sm:h-48"))
          .join("")}
      </div>
    </div>
  </section>

  <section class="bg-ink py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      <h2 class="font-display text-2xl font-bold md:text-3xl">Let's Create Something Unforgettable Together</h2>
      <p class="mt-4 text-cream/75">Tell us about your event, school, team or production and we'll get back to you.</p>
      <a href="/contact" class="btn-gold mt-6">Contact Us</a>
    </div>
  </section>

  <section class="bg-charcoal py-10 text-center text-cream">
    <div class="mx-auto max-w-4xl px-4 md:px-8">
      <p class="text-sm text-cream/60">Explore our other services</p>
      <div class="mt-4 flex flex-wrap justify-center gap-3">
        ${SERVICES.filter((s) => s.slug !== service.slug)
          .map((s) => `<a href="/services/${s.slug}" class="rounded-full border border-cream/20 px-4 py-1.5 text-sm text-cream/80 hover:border-gold hover:text-gold">${s.navLabel}</a>`)
          .join("")}
      </div>
    </div>
  </section>
  `;
}
