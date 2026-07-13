import { img, eyebrow } from "../helpers.mjs";
import { AWARDS } from "../productions-data.mjs";

export function aboutBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("About Us")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">The Best Place to Watch Acting in Hong Kong</h1>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[280px_1fr] md:items-start md:px-8">
      ${img("2017-12-Nicole-photo.jpg", "Nicole Garbellini, founder of Aurora Theatre", "mx-auto w-56 rounded-xl object-cover shadow-lg md:w-full")}
      <div>
        <p class="text-lg leading-relaxed text-ink/80">Aurora Theatre Hong Kong is an independent theatre company that aims to promote English-language shows among the local Hong Kong art scene. Founded by theatre performer and producer <strong>Nicole Garbellini</strong> in 2010, Aurora Theatre Hong Kong has been very active since then and has brought international and original material to the stage. The theatre is the best place to showcase acting in Hong Kong.</p>
        <a href="https://www.youtube.com/watch?v=QQ2c2EuRaA8" target="_blank" rel="noopener" class="mt-4 inline-block font-semibold text-ember hover:text-plum">Watch the Aurora Theatre story: Inherit the Wind and more &rarr;</a>
      </div>
    </div>
  </section>

  <section class="bg-parchment py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:px-8">
      <div>
        ${eyebrow("Our Mission")}
        <p class="text-ink/80 leading-relaxed">Aurora Theatre aims to attract different people, both familiar and unfamiliar with the local English theatre scene, and introduce them to the various shows presented by us — creating a robust, valid, creative and professional art scene in Hong Kong. We aim to give opportunities to those individuals who are passionate about theatre, helping them stimulate and nurture ideas as far as performing and directing are concerned. Aurora Theatre welcomes people interested in learning drama in Hong Kong from every background, ethnicity and dialect. As we usually say, the more the variety, the better!</p>
      </div>
      <div>
        ${eyebrow("Our Charity Involvement")}
        <p class="text-ink/80 leading-relaxed">Aurora Theatre has used its shows for fundraising to support the victims of the Japanese and Italian earthquakes (2011, 2012 and 2016), as well as Cambodian children in need through Angel For Orphans. Through our generous supporters, we've been able to raise a significant amount of funds helping the needy throughout Asia, and we continually look for fundraising associations to support.</p>
      </div>
    </div>
  </section>

  <section class="bg-ink py-16 text-cream">
    <div class="mx-auto max-w-5xl px-4 md:px-8">
      <div class="mb-10 text-center">
        ${eyebrow("Awards & Credits")}
        <h2 class="font-display text-3xl font-bold">Watch the Best Drama in Hong Kong</h2>
        <p class="mt-2 text-cream/70">HKELD Award wins across Aurora Theatre's productions</p>
      </div>
      <ul class="space-y-4">
        ${AWARDS.map(
          (a) => `<li class="rounded-lg bg-charcoal/70 p-5 ring-1 ring-cream/10">${a}</li>`
        ).join("")}
      </ul>
      <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        ${["2017-12-awards1.jpg", "2017-12-awards2.jpg", "2017-12-awards3.jpg", "2017-12-awards4.jpg"]
          .map((f) => img(f, "HKELD Award", "h-32 w-full rounded-lg object-cover"))
          .join("")}
      </div>
      <p class="mt-6 text-center text-sm text-cream/50">Photos by Aaron Michelson @Aaronography</p>
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
