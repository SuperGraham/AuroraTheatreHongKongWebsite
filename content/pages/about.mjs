import { img, eyebrow } from "../helpers.mjs";
import { AWARDS } from "../productions-data.mjs";

const TIMELINE = [
  { year: "2010", label: "First productions" },
  { year: "2014", label: "Hospitality" },
  { year: "2015", label: "Schools" },
  { year: "2017", label: "Corporate" },
  { year: "—", label: "Casting agency" },
  { year: "Today", label: "Acting, communication & soft skills coaching" },
];

const BELIEFS = [
  {
    title: "Stories connect people.",
    body: "We believe stories help us understand ourselves and one another. They build empathy, inspire action and create lasting memories.",
    image: "aurora-way-storytelling-event.jpg",
  },
  {
    title: "Learning should be experienced.",
    body: "People remember what they do, not just what they hear. That's why every Aurora workshop is practical, engaging and interactive.",
    image: "school-drama-session.jpg",
  },
  {
    title: "Confidence grows through practice.",
    body: "Whether on stage, in a classroom or in a boardroom, confidence isn't something people are born with. It's something they build through experience.",
    image: "aurora-way-teaching.jpg",
  },
  {
    title: "Creativity belongs everywhere.",
    body: "Drama isn't only for actors. Creative thinking, adaptability and communication are essential skills in education, business and everyday life.",
    image: "corporate-circle-workshop.jpg",
  },
];

export function aboutBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("About Us")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">A Creative Partner, Not Just A Theatre Company</h1>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[280px_1fr] md:items-start md:px-8">
      ${img("2017-12-Nicole-photo.jpg", "Nicole Garbellini, founder of Aurora Theatre", "mx-auto w-56 rounded-xl object-cover shadow-lg md:w-full")}
      <div>
        <p class="text-lg leading-relaxed text-ink/80">Aurora Theatre was founded in Hong Kong in 2010 by <strong>Nicole Garbellini</strong> with a vision of using theatre to bring people together.</p>
        <p class="mt-4 text-ink/80 leading-relaxed">Over the years Aurora has expanded from producing stage performances into delivering educational programmes, immersive entertainment, corporate training and communication coaching.</p>
        <p class="mt-4 text-ink/80 leading-relaxed">Today Aurora collaborates with schools, businesses, hospitality venues and community organisations to create memorable experiences through storytelling.</p>
        <a href="https://www.youtube.com/watch?v=QQ2c2EuRaA8" target="_blank" rel="noopener" class="mt-4 inline-block font-semibold text-ember hover:text-plum">Watch the Aurora Theatre story: Inherit the Wind and more &rarr;</a>
      </div>
    </div>
  </section>

  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto max-w-5xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Our Story")}
        <h2 class="font-display text-3xl font-bold">A Decade Of Growth</h2>
      </div>
      <div class="flex flex-wrap items-stretch justify-center gap-3">
        ${TIMELINE.map(
          (t, i) => `
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-ink/50 px-5 py-4 text-center ring-1 ring-cream/10">
            <p class="font-display text-lg font-bold text-gold">${t.year}</p>
            <p class="mt-1 max-w-[10rem] text-xs text-cream/75">${t.label}</p>
          </div>
          ${i < TIMELINE.length - 1 ? '<span class="hidden text-cream/30 sm:inline">&rarr;</span>' : ""}
        </div>`
        ).join("")}
      </div>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("The Aurora Way")}
      <h2 class="font-display text-2xl font-bold text-ink md:text-3xl">Theatre Has Never Been The End Goal. It's The Tool.</h2>
      <p class="mt-6 text-left text-ink/80 leading-relaxed md:text-center">At Aurora Theatre, we believe that every meaningful interaction begins with a story. Whether we're directing a play, coaching a nervous presenter, training teachers, or designing an immersive dinner experience, we aren't simply creating performances. We are creating connection.</p>
      <p class="mt-4 text-left text-ink/80 leading-relaxed md:text-center">We use the principles of theatre — storytelling, empathy, collaboration, creativity and communication — to help people engage with one another in meaningful ways. For some, that means standing on a stage for the very first time. For others, it means leading a board meeting with confidence, inspiring a classroom of students, or creating an unforgettable evening for restaurant guests. The context changes, but the principles don't.</p>
    </div>
  </section>

  <section class="bg-parchment py-16">
    <div class="mx-auto max-w-6xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("What We Believe")}
      </div>
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        ${BELIEFS.map(
          (b) => `
        <div class="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5">
          ${img(b.image, b.title, "h-36 w-full object-cover")}
          <div class="p-5">
            <h3 class="font-display text-base font-bold text-ink">${b.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${b.body}</p>
          </div>
        </div>`
        ).join("")}
      </div>
      <p class="mx-auto mt-10 max-w-2xl text-center font-display text-lg text-ink/85">Every production we stage, every workshop we deliver and every event we create begins with the same question: <strong>how can we create an experience that people will remember?</strong></p>
    </div>
  </section>

  <section class="bg-ink py-16 text-cream">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:px-8">
      <div>
        ${eyebrow("Our Mission")}
        <p class="text-cream/80 leading-relaxed">Aurora Theatre aims to attract different people, both familiar and unfamiliar with the local English theatre scene, and introduce them to the various shows presented by us — creating a robust, valid, creative and professional art scene in Hong Kong. We welcome people interested in learning drama in Hong Kong from every background, ethnicity and dialect. As we usually say, the more the variety, the better!</p>
      </div>
      <div>
        ${eyebrow("Our Charity Involvement")}
        <p class="text-cream/80 leading-relaxed">Aurora Theatre has used its shows for fundraising to support the victims of the Japanese and Italian earthquakes (2011, 2012 and 2016), as well as Cambodian children in need through Angel For Orphans. We continually look for fundraising associations to support.</p>
      </div>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-5xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Awards & Credits")}
        <h2 class="font-display text-3xl font-bold text-ink">Watch the Best Drama in Hong Kong</h2>
        <p class="mt-2 text-ink/60">HKELD Award wins across Aurora Theatre's productions</p>
      </div>
      <ul class="space-y-4">
        ${AWARDS.map(
          (a) => `<li class="rounded-lg bg-parchment p-5 text-ink/80 ring-1 ring-ink/10">${a}</li>`
        ).join("")}
      </ul>
      <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        ${["2017-12-awards1.jpg", "2017-12-awards2.jpg", "2017-12-awards3.jpg", "2017-12-awards4.jpg"]
          .map((f) => img(f, "HKELD Award", "h-32 w-full rounded-lg object-cover"))
          .join("")}
      </div>
      <p class="mt-6 text-center text-sm text-ink/50">Photos by Aaron Michelson @Aaronography</p>
    </div>
  </section>

  <section class="bg-plum py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      <h2 class="font-display text-2xl font-bold md:text-3xl">Want To Be Part Of Our Story?</h2>
      <p class="mt-4 text-cream/85">Whether you want to act, coach, sponsor or simply watch — we'd love to hear from you.</p>
      <a href="/contact" class="btn-gold mt-6">Get In Touch</a>
    </div>
  </section>
  `;
}
