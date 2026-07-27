import { img, eyebrow } from "../helpers.mjs";
import { PAST_PRODUCTIONS } from "../productions-data.mjs";

const GALLERY_SHOWS = PAST_PRODUCTIONS.filter((p) => p.gallerySlug);

export function homeBody() {
  return `
  <section class="relative flex min-h-[80vh] items-center overflow-hidden bg-ink">
    <img src="/images/photos/2018-01-the-crucible-1.jpg" alt="Aurora Theatre production on stage" class="absolute inset-0 h-full w-full object-cover opacity-45">
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"></div>
    <div class="relative mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
      ${eyebrow("Hong Kong Theatre Company")}
      <h1 class="font-display text-4xl font-bold leading-tight text-cream md:text-6xl">Welcome to Aurora Theatre</h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-cream/80 md:text-xl">We inspire. We entertain. We educate.</p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="/classes-and-workshops" class="btn-gold">Join Our Acting Classes</a>
        <a href="/past-productions" class="btn-outline">See Our Past Work</a>
      </div>
    </div>
  </section>

  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[220px_1fr] md:items-center md:px-8">
      ${img("2025-07-E-book-cover-172x300.png", "Connect With Your Character Using Soft Skills e-book cover", "mx-auto w-40 rounded shadow-2xl md:w-full")}
      <div>
        ${eyebrow("New From Aurora")}
        <h2 class="font-display text-2xl font-bold md:text-3xl">Connect With Your Character Using Soft Skills</h2>
        <p class="mt-4 text-cream/80">Written by actor and acting coach Nicole Garbellini, this short, powerful e-book is designed to help you raise empathy, build authentic backstories, and act with emotional truth. Whether you're new to acting or refining your craft, it will help you bridge the gap between technique and genuine connection.</p>
        <a href="https://payhip.com/b/JT0FM" target="_blank" rel="noopener" class="btn-gold mt-6">Start Connecting Today</a>
      </div>
    </div>
  </section>

  <section class="bg-ink py-16 text-cream">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-8">
      <div class="order-2 md:order-1">
        ${eyebrow("Watch")}
        <h2 class="font-display text-2xl font-bold md:text-3xl">Our First Virtual Sitcom: Close Quarters</h2>
        <p class="mt-4 text-cream/80">Written by Ryan King. With Nicole Garbellini and David Ogilvie.</p>
        <a href="https://youtube.com/playlist?list=PLwhWmWJPoEmHqEQek0JGlt2JEeD4eVPIX&si=MEBlDrgbCjc-mzsv" target="_blank" rel="noopener" class="btn-outline mt-6">Watch All The Episodes</a>
      </div>
      <a href="https://youtube.com/playlist?list=PLwhWmWJPoEmHqEQek0JGlt2JEeD4eVPIX&si=MEBlDrgbCjc-mzsv" target="_blank" rel="noopener" class="group order-1 relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-charcoal shadow-2xl md:order-2">
        ${img("close-quarters-title-card.jpg", "Close Quarters — watch on YouTube", "absolute inset-0 h-full w-full object-cover transition group-hover:scale-105")}
        <span class="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 shadow-lg transition group-hover:scale-110">
          <svg class="ml-1 h-6 w-6 text-ink" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </a>
    </div>
  </section>

  <section class="bg-plum py-16 text-cream">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Schools & Teachers Alert")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">Looking for Drama Workshops or Theatre in Education Shows?</h2>
      <p class="mt-4 text-cream/85">We have a selection of brand new plays here at Aurora Theatre Hong Kong to bring right to your school.</p>
      <a href="/contact" class="btn-gold mt-6">Contact Us For More Information</a>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Take A Look At Our Past Work")}
        <h2 class="font-display text-3xl font-bold text-ink md:text-4xl">A Decade of Productions</h2>
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
        <a href="/past-productions" class="btn-outline !border-ink !text-ink hover:!bg-ink hover:!text-cream">View All Past Performances</a>
      </div>
    </div>
  </section>

  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:px-8">
      <div class="rounded-xl bg-ink/60 p-8 ring-1 ring-cream/10">
        ${eyebrow("About Aurora")}
        <h2 class="font-display text-2xl font-bold">Independent. International. Hong Kong.</h2>
        <p class="mt-4 text-cream/80">Aurora Theatre Hong Kong is an independent theatre company that aims to promote English-language shows among the local Hong Kong art scene. Founded by theatre performer and producer Nicole Garbellini in 2010, we've been very active since then, bringing international and original material to the stage.</p>
        <a href="/about" class="mt-6 inline-block font-semibold text-gold hover:text-gold-light">Read our story &rarr;</a>
      </div>
      <div class="rounded-xl bg-ink/60 p-8 ring-1 ring-cream/10">
        ${eyebrow("Book Our Workshops")}
        <h2 class="font-display text-2xl font-bold">Classes & Coaching in Hong Kong</h2>
        <p class="mt-4 text-cream/80">From group acting classes to private one-on-one coaching, we help performers of every level build confidence, creativity and authentic performance.</p>
        <div class="mt-6 flex gap-6">
          <a href="/classes-and-workshops" class="font-semibold text-gold hover:text-gold-light">Classes & Workshops &rarr;</a>
          <a href="/coaching" class="font-semibold text-gold hover:text-gold-light">Coaching &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-ink py-14 text-center text-cream">
    <div class="mx-auto max-w-3xl px-4 md:px-8">
      ${eyebrow("Follow Us")}
      <h2 class="font-display text-2xl font-bold">Stay Close to Aurora Theatre</h2>
      <div class="mt-6 flex justify-center gap-6">
        <a href="https://www.facebook.com/auroratheatrehk" target="_blank" rel="noopener" class="btn-outline">Facebook</a>
        <a href="https://youtube.com/playlist?list=PLwhWmWJPoEmHqEQek0JGlt2JEeD4eVPIX&si=MEBlDrgbCjc-mzsv" target="_blank" rel="noopener" class="btn-outline">YouTube</a>
      </div>
    </div>
  </section>
  `;
}
