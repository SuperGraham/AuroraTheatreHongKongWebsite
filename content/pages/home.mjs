import { img, eyebrow } from "../helpers.mjs";
import { PAST_PRODUCTIONS } from "../productions-data.mjs";
import { SERVICES } from "../services-data.mjs";
import { TESTIMONIALS } from "../testimonials-data.mjs";
import { CLIENTS } from "../clients-data.mjs";

const GALLERY_SHOWS = PAST_PRODUCTIONS.filter((p) => p.gallerySlug);

const WHO_WE_WORK_WITH = ["Schools", "Businesses", "Hospitality", "Community Organisations", "Individuals"];

export function homeBody() {
  return `
  <section class="relative flex min-h-[80vh] items-center overflow-hidden bg-ink">
    <img src="/images/photos/2018-01-the-crucible-1.jpg" alt="Aurora Theatre production on stage" class="absolute inset-0 h-full w-full object-cover opacity-45">
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"></div>
    <div class="relative mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
      ${eyebrow("Theatre. Training. Storytelling. Connection.")}
      <h1 class="font-display text-4xl font-bold leading-tight text-cream md:text-6xl">Stories That Connect. Experiences That Inspire.</h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-cream/80 md:text-xl">Aurora Theatre creates theatre, develops confident communicators and delivers unforgettable experiences for schools, businesses and audiences.</p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="/services" class="btn-gold">Explore Our Services</a>
        <a href="/contact" class="btn-outline">Get In Touch</a>
      </div>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("What We Do")}
        <h2 class="font-display text-3xl font-bold text-ink md:text-4xl">A Full-Service Creative Company</h2>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        ${SERVICES.filter((s) =>
          ["theatre-productions", "drama-in-education", "corporate-training", "hospitality-entertainment"].includes(s.slug)
        )
          .map(
            (s) => `
        <a href="/services/${s.slug}" class="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5 transition hover:shadow-xl">
          ${img(s.heroImage, s.heroAlt, "h-36 w-full object-cover transition duration-300 group-hover:scale-105")}
          <div class="p-5">
            <h3 class="font-display text-base font-bold text-ink">${s.navLabel}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${s.tagline}</p>
          </div>
        </a>`
          )
          .join("")}
      </div>
      <div class="mt-8 text-center">
        <a href="/services" class="btn-outline !border-ink !text-ink hover:!bg-ink hover:!text-cream">View All Services</a>
      </div>
    </div>
  </section>

  <section class="bg-charcoal py-14 text-cream">
    <div class="mx-auto max-w-5xl px-4 text-center md:px-8">
      ${eyebrow("Who We Work With")}
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        ${WHO_WE_WORK_WITH.map((w) => `<span class="rounded-full bg-ink/50 px-6 py-2 text-sm font-medium ring-1 ring-cream/10">${w}</span>`).join("")}
      </div>
    </div>
  </section>

  <section class="bg-plum py-16 text-cream">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Why Aurora")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">Stories Change People</h2>
      <p class="mt-4 text-cream/85">Whether we are producing a play, coaching a CEO, training teachers or creating an immersive dinner experience, our goal remains the same: to create meaningful human connection through storytelling.</p>
      <a href="/about" class="mt-6 inline-block font-semibold text-gold hover:text-gold-light">Read The Aurora Way &rarr;</a>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("From Aurora")}
        <h2 class="font-display text-3xl font-bold text-ink md:text-4xl">Latest &amp; Featured</h2>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <div class="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5">
          ${img("2025-07-E-book-cover-172x300.png", "Connect With Your Character Using Soft Skills e-book cover", "h-44 w-full object-cover")}
          <div class="p-6">
            <p class="section-eyebrow">New E-Book</p>
            <h3 class="font-display text-lg font-bold text-ink">Connect With Your Character Using Soft Skills</h3>
            <a href="https://payhip.com/b/JT0FM" target="_blank" rel="noopener" class="mt-3 inline-block text-sm font-semibold text-ember hover:text-plum">Get the e-book &rarr;</a>
          </div>
        </div>
        <div class="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5">
          ${img("2026-06-C2424024-5492-4C21-BE3A-D3E3E4FA5A5C.png", "Aurora Theatre acting classes flyer", "h-44 w-full object-cover")}
          <div class="p-6">
            <p class="section-eyebrow">Latest Workshop</p>
            <h3 class="font-display text-lg font-bold text-ink">Acting Classes in Hong Kong</h3>
            <a href="/classes-and-workshops" class="mt-3 inline-block text-sm font-semibold text-ember hover:text-plum">See class schedule &rarr;</a>
          </div>
        </div>
        <a href="https://youtube.com/playlist?list=PLwhWmWJPoEmHqEQek0JGlt2JEeD4eVPIX&si=MEBlDrgbCjc-mzsv" target="_blank" rel="noopener" class="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5">
          <div class="relative h-44">
            ${img("close-quarters-title-card.jpg", "Close Quarters — watch on YouTube", "h-full w-full object-cover")}
            <span class="absolute inset-0 flex items-center justify-center bg-ink/20 transition group-hover:bg-ink/30">
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 shadow-lg"><svg class="ml-0.5 h-5 w-5 text-ink" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
            </span>
          </div>
          <div class="p-6">
            <p class="section-eyebrow">Latest Event</p>
            <h3 class="font-display text-lg font-bold text-ink">Close Quarters — Our First Virtual Sitcom</h3>
            <span class="mt-3 inline-block text-sm font-semibold text-ember group-hover:text-plum">Watch all the episodes &rarr;</span>
          </div>
        </a>
      </div>
    </div>
  </section>

  <section class="bg-ink py-16 text-cream">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Take A Look At Our Past Work")}
        <h2 class="font-display text-3xl font-bold md:text-4xl">A Decade of Productions</h2>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        ${GALLERY_SHOWS.map(
          (show) => `
        <a href="/gallery/${show.gallerySlug}" class="group relative block overflow-hidden rounded-lg shadow-md">
          ${
            show.poster
              ? img(show.poster, show.title, "h-40 w-full object-cover transition duration-300 group-hover:scale-110 sm:h-48")
              : `<div class="flex h-40 w-full items-center justify-center bg-plum-dark sm:h-48"><span class="font-display text-cream/70">Aurora Theatre</span></div>`
          }
          <div class="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/10 to-transparent p-3">
            <span class="font-display text-sm font-semibold text-cream">${show.title}</span>
          </div>
        </a>`
        ).join("")}
      </div>
      <div class="mt-10 text-center">
        <a href="/past-productions" class="btn-outline">View All Past Performances</a>
      </div>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-5xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Testimonials")}
        <h2 class="font-display text-3xl font-bold text-ink md:text-4xl">What People Say</h2>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        ${TESTIMONIALS.map(
          (t) => `
        <figure class="rounded-xl bg-white p-6 shadow-md ring-1 ring-ink/5">
          <blockquote class="font-display text-base italic leading-relaxed text-ink/85">&ldquo;${t.quote}&rdquo;</blockquote>
          <figcaption class="mt-4 text-sm text-ink/60"><span class="font-semibold text-ember">${t.source}</span> &mdash; ${t.context}</figcaption>
        </figure>`
        ).join("")}
      </div>
      <div class="mt-8 text-center">
        <a href="/testimonials" class="text-sm font-semibold text-ember hover:text-plum">Read more testimonials &amp; press &rarr;</a>
      </div>
    </div>
  </section>

  <section class="bg-parchment py-14">
    <div class="mx-auto max-w-5xl px-4 text-center md:px-8">
      ${eyebrow("Our Clients")}
      <div class="mt-8 grid grid-cols-3 items-center gap-6 md:grid-cols-6">
        ${CLIENTS.map((c) => `<div class="flex items-center justify-center">${img(c.file, c.name, "max-h-14 w-full object-contain")}</div>`).join("")}
      </div>
    </div>
  </section>

  <section class="bg-plum py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      <h2 class="font-display text-2xl font-bold md:text-3xl">Let's Create Something Unforgettable Together</h2>
      <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="/contact" class="btn-gold">Contact Us</a>
        <a href="https://www.facebook.com/auroratheatrehk" target="_blank" rel="noopener" class="btn-outline">Facebook</a>
      </div>
    </div>
  </section>
  `;
}
