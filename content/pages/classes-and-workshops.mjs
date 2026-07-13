import { img, eyebrow } from "../helpers.mjs";

export function classesBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Storytelling • Improv • Script Work")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Join Our Acting Classes in Hong Kong</h1>
      <p class="mx-auto mt-4 max-w-2xl text-cream/75">Join actress, director, playwright and acting coach Nicole Garbellini for a series of practical, engaging acting classes designed to build confidence, creativity and authentic performance.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-8">
      ${img("2026-06-C2424024-5492-4C21-BE3A-D3E3E4FA5A5C.png", "Aurora Theatre acting classes flyer", "w-full rounded-xl shadow-xl")}
      <div>
        <p class="text-ink/80 leading-relaxed">Fresh from developing and producing her original play <em>Unspoken: Permission Not Granted</em> in Riyadh, Nicole returns to Hong Kong with a renewed focus on the craft that sits at the heart of every great performance: storytelling.</p>
        <p class="mt-4 text-ink/80 leading-relaxed">Whether you're completely new to acting or looking to deepen your skills, these classes will help you:</p>
        <ul class="mt-3 space-y-2 text-ink/80">
          <li class="flex gap-2"><span class="text-ember">&#9679;</span> Develop confidence on stage and in everyday life</li>
          <li class="flex gap-2"><span class="text-ember">&#9679;</span> Strengthen creativity and spontaneity through improvisation</li>
          <li class="flex gap-2"><span class="text-ember">&#9679;</span> Explore character and scene work through scripts</li>
          <li class="flex gap-2"><span class="text-ember">&#9679;</span> Improve listening, communication and collaboration</li>
          <li class="flex gap-2"><span class="text-ember">&#9679;</span> Connect with a supportive community of actors and storytellers</li>
        </ul>

        <div class="mt-8 rounded-xl bg-parchment p-6 ring-1 ring-ink/10">
          <h2 class="font-display text-lg font-bold text-ink">Class Details</h2>
          <dl class="mt-3 space-y-1 text-sm text-ink/75">
            <div class="flex gap-2"><dt class="font-semibold">When:</dt><dd>July 6, 9, 13, 15 &amp; 16</dd></div>
            <div class="flex gap-2"><dt class="font-semibold">Time:</dt><dd>7:00 PM &ndash; 9:00 PM</dd></div>
            <div class="flex gap-2"><dt class="font-semibold">Where:</dt><dd>Visual Arts Centre, Hong Kong Park</dd></div>
            <div class="flex gap-2"><dt class="font-semibold">Class fee:</dt><dd>HKD 300 per class</dd></div>
            <div class="flex gap-2"><dt class="font-semibold">Special offer:</dt><dd>Book all 5 classes for HKD 1,250</dd></div>
          </dl>
        </div>
        <a href="mailto:info@auroratheatrehk.com" class="btn-gold mt-6">Email Us To Book Your Spot</a>
        <p class="mt-3 text-xs text-ink/50">Classes are non-refundable and non-transferable. No previous acting experience required — complete beginners welcome.</p>
      </div>
    </div>
  </section>

  <section class="bg-charcoal py-16 text-cream">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-8">
      <div>
        ${eyebrow("Online")}
        <h2 class="font-display text-2xl font-bold md:text-3xl">Camera Acting Classes</h2>
        <p class="mt-4 text-cream/80">The perfect opportunity to gain confidence and experience the world of screen acting — all from the comfort of your home. Whether you want to nail your next audition or just start building your on-screen presence, this course is designed to make you shine on camera.</p>
        <ul class="mt-4 space-y-2 text-cream/80">
          <li class="flex gap-2"><span class="text-gold">&#9679;</span> Learn the nuances of acting specifically for the camera</li>
          <li class="flex gap-2"><span class="text-gold">&#9679;</span> Dive deep into character work and bring your roles to life</li>
          <li class="flex gap-2"><span class="text-gold">&#9679;</span> Perfect your self-taping technique for professional auditions</li>
        </ul>
        <a href="mailto:info@auroratheatrehk.com" class="btn-outline mt-6">Email Us To Book Your Spot</a>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${["2020-02-6-300x200.jpg", "2020-02-4-225x300.jpg", "2020-02-2-300x200.jpg", "2020-02-1-300x200.jpg"]
          .map((f) => img(f, "Aurora Theatre acting class", "h-32 w-full rounded-lg object-cover sm:h-40"))
          .join("")}
      </div>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto max-w-4xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("About Nicole")}
        <h2 class="font-display text-2xl font-bold text-ink md:text-3xl">Founder & Artistic Director</h2>
      </div>
      <p class="text-center text-ink/80 leading-relaxed">Nicole Garbellini is the founder and Artistic Director of Aurora Theatre. She is an actress, director, playwright and acting coach who has worked internationally across theatre, film, education and creative development. Her work combines professional acting techniques with soft-skills training, helping students become more confident, creative and connected performers.</p>
    </div>
  </section>

  <section class="bg-plum py-16 text-cream">
    <div class="mx-auto max-w-5xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("From The Archive")}
        <h2 class="font-display text-2xl font-bold md:text-3xl">Community & School Workshops</h2>
      </div>
      <div class="grid gap-6 sm:grid-cols-3">
        <div class="rounded-xl bg-ink/30 p-6 ring-1 ring-cream/10">
          ${img("2018-01-Shake-Shake-Shakespeare-400x400.jpg", "Shake Shake Shakespeare", "mb-4 h-40 w-full rounded-lg object-cover")}
          <p class="text-sm text-cream/80">In 2016 we presented the children's workshop and performance of <em>Shake, Shake, Shakespeare!</em> in collaboration with local publisher Paddifield, culminating in a performance at Hong Kong Book Fair.</p>
        </div>
        <div class="rounded-xl bg-ink/30 p-6 ring-1 ring-cream/10">
          ${img("2018-01-Love-Pings.png", "Love Pings", "mb-4 h-40 w-full rounded-lg object-cover")}
          <p class="text-sm text-cream/80">In 2017, we collaborated with I AM for <em>Love Pings</em>, a spicy and sexy comedy written by Kate March and directed by Nicole Garbellini, presented in Singapore and Hong Kong.</p>
        </div>
        <div class="rounded-xl bg-ink/30 p-6 ring-1 ring-cream/10">
          ${img("2018-01-The-Rock-Foundation.jpg", "The Rock Foundation talent show", "mb-4 h-40 w-full rounded-lg object-cover")}
          <p class="text-sm text-cream/80">We've helped local charity The Rock Foundation produce and present their talent show, showcasing the talent of its students and volunteers alongside local actors and performers.</p>
        </div>
      </div>
    </div>
  </section>
  `;
}
