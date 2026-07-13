import { eyebrow } from "../helpers.mjs";

export function contactBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Get In Touch")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Contact Aurora Theatre</h1>
      <p class="mt-4 text-cream/75">Questions about classes, coaching, productions, workshops or sponsorship &mdash; we'd love to hear from you.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[1fr_1.4fr] md:px-8">
      <div>
        <h2 class="font-display text-xl font-bold text-ink">Aurora Theatre</h2>
        <dl class="mt-4 space-y-3 text-ink/75">
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-ember">Location</dt><dd>Hong Kong</dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-ember">Email</dt><dd><a href="mailto:info@auroratheatrehk.com" class="hover:text-plum">info@auroratheatrehk.com</a></dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-ember">Web</dt><dd><a href="https://www.auroratheatrehk.com" class="hover:text-plum">www.auroratheatrehk.com</a></dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-ember">Follow</dt><dd><a href="https://www.facebook.com/auroratheatrehk" target="_blank" rel="noopener" class="hover:text-plum">Facebook</a></dd></div>
        </dl>
      </div>

      <form id="contact-form" novalidate class="rounded-xl bg-white p-6 shadow-md ring-1 ring-ink/5 sm:p-8">
        <div class="mb-5">
          <label for="name" class="mb-1 block text-sm font-semibold text-ink">Name</label>
          <input type="text" id="name" name="name" required autocomplete="name" class="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember">
        </div>
        <div class="mb-5">
          <label for="email" class="mb-1 block text-sm font-semibold text-ink">Email</label>
          <input type="email" id="email" name="email" required autocomplete="email" class="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember">
        </div>
        <div class="mb-5">
          <label for="phone" class="mb-1 block text-sm font-semibold text-ink">Phone <span class="font-normal text-ink/40">(optional)</span></label>
          <input type="tel" id="phone" name="phone" autocomplete="tel" class="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember">
        </div>
        <div class="mb-5">
          <label for="message" class="mb-1 block text-sm font-semibold text-ink">Message</label>
          <textarea id="message" name="message" rows="5" required class="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"></textarea>
        </div>

        <div class="mb-5" style="position:absolute; left:-9999px;" aria-hidden="true">
          <label for="website">Website</label>
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>

        <button type="submit" class="btn-gold w-full sm:w-auto">Send Message</button>
        <p id="form-status" role="status" aria-live="polite" class="mt-4 text-sm text-ink/70"></p>
      </form>
    </div>
  </section>
  <script src="/js/contact-form.js"></script>
  `;
}
