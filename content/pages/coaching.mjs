import { img, eyebrow } from "../helpers.mjs";

const REVIEWS = [
  {
    quote:
      "A great way to brush up on your acting skills or even jumping into acting for the first time. This crew of lovely and friendly people welcomes anyone who wants to do some acting. We laugh, we play, we perform scenes, we do improv and have a good time.",
    author: "Emilie B.",
  },
  {
    quote:
      "I've been taking acting classes with Aurora for a year or so now, and have learned almost everything I know from there. The classes are a great mix of vocal and body warm-up exercises, improv (my personal favorite), and script work. Highly recommended.",
    author: "Ryan K.",
  },
  {
    quote:
      "I am learning a lot about what it takes to be an actor — exploring scenes, character motivations and objectives, and evoking the emotion and tone of the scenes we were given. My stage presence has improved as well.",
    author: "Aaron M.",
  },
  {
    quote:
      "Awesome theatre group with a strong sense of community. It's a great intro to drama although the classes also include working actors, so it's for everyone regardless of experience level. Nicole is our fearless leader.",
    author: "Carlo G.",
  },
  {
    quote:
      "I just wanted to reconnect with the arts, I had never acted before, and as a non-native English speaker I was a bit scared I'd never keep up. But Nicole helped me build up my confidence, and taught me everything there's to know about acting.",
    author: "Audrey G.",
  },
];

export function coachingBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Private Coaching")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">One-on-One Acting Coaching</h1>
      <p class="mx-auto mt-4 max-w-2xl text-cream/75">We're offering private online one-on-one acting coaching. Get in touch for timing and prices.</p>
      <a href="/contact" class="btn-gold mt-8">Book A Session</a>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:px-8">
      <div>
        <p class="text-ink/80 leading-relaxed">Whether you are a seasoned actor looking to polish up your craft or you've just embarked on your acting journey, coaching is crucial to give you the tools that you need. Acting is not easy — it doesn't come immediately naturally to everyone. One must be dedicated and committed to embark on the journey with an open heart, and a great coach too.</p>
        <p class="mt-4 text-ink/80 leading-relaxed">Self-taping is now a fact of auditioning life, and as you master the art of auditioning on video, you'll inevitably train for this during your private sessions.</p>
      </div>
      <div class="rounded-xl bg-parchment p-6 ring-1 ring-ink/10">
        <h2 class="font-display text-lg font-bold text-ink">How It Works</h2>
        <ol class="mt-4 space-y-3 text-sm text-ink/75">
          <li><span class="font-semibold text-ember">1.</span> Book your session via our contact form.</li>
          <li><span class="font-semibold text-ember">2.</span> You'll receive a confirmation email.</li>
          <li><span class="font-semibold text-ember">3.</span> Reply with your acting résumé, headshots, and anything you'd like to focus on (we provide scripts).</li>
          <li><span class="font-semibold text-ember">4.</span> We'll be in touch about timing and links &mdash; sessions run on Zoom, FaceTime or Skype.</li>
        </ol>
        <p class="mt-4 text-xs text-ink/50">Consider starting with one session and see if it works out for you.</p>
      </div>
    </div>
  </section>

  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[220px_1fr] md:items-center md:px-8">
      ${img("2020-09-Better-Call-Nicole-300x212.jpg", "Nicole Garbellini, acting coach", "mx-auto w-48 rounded-xl object-cover shadow-lg md:w-full")}
      <div>
        ${eyebrow("About The Coach")}
        <p class="text-cream/80 leading-relaxed">A theatre actress, director and producer, Nicole Garbellini has been in the theatre world for over 20 years. She was recently seen in <em>Mussolini's Mistresses</em>, as well as <em>Silent Sky</em>, <em>The Complete Works of William Shakespeare (Abridged)</em> and <em>Love Pings</em>. Her directing credits include <em>The 39 Steps</em>, <em>Inherit The Wind</em>, <em>The Crucible</em>, <em>Dial "M" For Murder</em> and <em>Love Pings</em>. Originally from Italy, she has worked and performed as an artist in Italy, Australia, Mainland China, Hong Kong, Macau and Singapore.</p>
        <p class="mt-4 font-display text-xl text-gold">You want to be a better actor? Better Call Nicole!</p>
      </div>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-5xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Reviews")}
        <h2 class="font-display text-3xl font-bold text-ink">What Our Students Say</h2>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        ${REVIEWS.map(
          (r) => `
        <figure class="rounded-xl bg-white p-6 shadow-md ring-1 ring-ink/5">
          <blockquote class="text-sm italic leading-relaxed text-ink/75">&ldquo;${r.quote}&rdquo;</blockquote>
          <figcaption class="mt-4 font-display font-semibold text-ember">&mdash; ${r.author}</figcaption>
        </figure>`
        ).join("")}
      </div>
    </div>
  </section>
  `;
}
