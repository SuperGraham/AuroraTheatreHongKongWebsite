import { eyebrow } from "../helpers.mjs";

export function sponsorsBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Support Us")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Sponsor Aurora Theatre</h1>
      <p class="mt-4 text-cream/75">Aurora Theatre relies on the generosity of sponsors and partners to keep bringing English-language theatre, education and community outreach to Hong Kong.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 md:px-8">
      <div class="rounded-xl bg-white p-8 shadow-md ring-1 ring-ink/5">
        <h2 class="font-display text-xl font-bold text-ink">Festival & Title Sponsors</h2>
        <p class="mt-3 text-sm leading-relaxed text-ink/70">Title and festival sponsorship puts your organisation front and centre across a full production run — programmes, promotional materials and curtain announcements.</p>
      </div>
      <div class="rounded-xl bg-white p-8 shadow-md ring-1 ring-ink/5">
        <h2 class="font-display text-xl font-bold text-ink">In-Kind & Community Support</h2>
        <p class="mt-3 text-sm leading-relaxed text-ink/70">From rehearsal space to printing, catering to costumes — in-kind support keeps our productions and educational workshops running throughout the year.</p>
      </div>
    </div>
  </section>

  <section class="bg-plum py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      ${eyebrow("Become A Sponsor")}
      <h2 class="font-display text-2xl font-bold md:text-3xl">Let's Talk About Partnering</h2>
      <p class="mt-4 text-cream/85">Get in touch to discuss sponsorship packages and how your organisation can support English-language theatre in Hong Kong.</p>
      <a href="/contact" class="btn-gold mt-6">Contact Us</a>
    </div>
  </section>
  `;
}
