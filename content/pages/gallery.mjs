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

const CATEGORIES = [
  {
    name: "Schools",
    images: [
      { file: "school-workshop-group-1.jpg", alt: "Aurora Theatre school workshop" },
      { file: "school-drama-session.jpg", alt: "Drama in education session" },
      { file: "school-trip-hkarts-centre.jpg", alt: "School visit to Hong Kong Arts Centre" },
      { file: "school-performance-sherlock.jpg", alt: "Student performance" },
      { file: "school-workshop-group-2.jpg", alt: "Aurora Theatre school workshop" },
      { file: "school-theatre-audience.jpg", alt: "Students watching a theatre performance" },
    ],
  },
  {
    name: "Corporate Events",
    images: [
      { file: "corporate-nicole-soft-skills.jpg", alt: "Corporate soft skills training" },
      { file: "corporate-roleplay.jpg", alt: "Corporate training role-play exercise" },
      { file: "corporate-circle-workshop.jpg", alt: "Corporate communication workshop" },
      { file: "corporate-hallway-discussion.jpg", alt: "Corporate training discussion" },
      { file: "corporate-group-datm.jpg", alt: "Corporate training group session" },
    ],
  },
  {
    name: "Hospitality",
    images: [
      { file: "hospitality-restaurant-discussion.jpg", alt: "Hospitality entertainment planning" },
      { file: "hospitality-restaurant-wide.jpg", alt: "Immersive hospitality entertainment event" },
      { file: "hospitality-quiz-night.jpg", alt: "Quiz night entertainment" },
      { file: "hospitality-quiz-night-2.jpg", alt: "Quiz night entertainment at a restaurant" },
      { file: "hospitality-dinner-speech.jpg", alt: "Corporate dinner entertainment" },
    ],
  },
  {
    name: "Workshops & Coaching",
    images: [
      { file: "coaching-session-duo.jpg", alt: "Acting coaching session" },
      { file: "coaching-rehearsal.jpg", alt: "Rehearsal coaching session" },
      { file: "coaching-1to1.jpg", alt: "One-to-one acting coaching session" },
      { file: "writers-workshop.jpg", alt: "Writers workshop" },
      { file: "writers-workshop-presentation.jpg", alt: "Writers workshop presentation" },
    ],
  },
  {
    name: "Behind The Scenes",
    images: [
      { file: "theatre-behind-scenes-monitor.jpg", alt: "Behind the scenes of an Aurora Theatre production" },
      { file: "entertainment-green-screen-shoot.jpg", alt: "Behind the scenes of an entertainment video shoot" },
      { file: "aurora-way-directing.jpg", alt: "Directing a rehearsal" },
    ],
  },
];

export function galleryBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Showcase")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Gallery</h1>
      <p class="mt-4 text-cream/75">Photos and videos from Aurora Theatre productions, school workshops, corporate training and hospitality events over the years.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-8 text-center">
        ${eyebrow("Productions")}
        <h2 class="font-display text-2xl font-bold text-ink">Photo Galleries By Show</h2>
      </div>
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        ${GALLERY_SHOWS.map(
          (show) => `
        <a href="/gallery/${show.gallerySlug}" class="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5 transition hover:shadow-xl">
          ${show.poster ? img(show.poster, show.title, "h-56 w-full object-cover transition duration-300 group-hover:scale-105") : `<div class="flex h-56 w-full items-center justify-center bg-plum-dark"><span class="font-display text-cream/70">Aurora Theatre</span></div>`}
          <div class="p-6">
            <h3 class="font-display text-lg font-bold text-ink">${show.title}</h3>
            <p class="mt-1 text-sm text-ink/60">${PHOTO_COUNTS[show.gallerySlug] || ""} Photos</p>
          </div>
        </a>`
        ).join("")}
      </div>
    </div>
  </section>

  ${CATEGORIES.map(
    (cat, i) => `
  <section class="${i % 2 === 0 ? "bg-parchment" : "bg-cream"} py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-8 text-center">
        ${eyebrow(cat.name)}
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        ${cat.images.map((im) => img(im.file, im.alt, "h-32 w-full rounded-lg object-cover sm:h-36")).join("")}
      </div>
    </div>
  </section>`
  ).join("")}

  <section class="bg-ink py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      ${eyebrow("Videos")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">Watch On YouTube</h2>
      <a href="https://youtube.com/playlist?list=PLwhWmWJPoEmHqEQek0JGlt2JEeD4eVPIX&si=MEBlDrgbCjc-mzsv" target="_blank" rel="noopener" class="btn-gold mt-6">Watch Our Videos</a>
    </div>
  </section>
  `;
}
