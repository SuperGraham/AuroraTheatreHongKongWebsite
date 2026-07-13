import { eyebrow } from "../helpers.mjs";

export function privacyBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-20">
    <div class="mx-auto max-w-3xl px-4 text-center md:px-8">
      ${eyebrow("Legal")}
      <h1 class="font-display text-4xl font-bold">Privacy Policy</h1>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="prose prose-neutral mx-auto max-w-3xl px-4 md:px-8">
      <p class="text-ink/80">Your privacy is very important to us. At Aurora Theatre we follow a few fundamental principles:</p>
      <ul class="list-disc space-y-2 pl-6 text-ink/80">
        <li>We don't ask you for personal information unless we truly need it.</li>
        <li>We don't share your personal information with anyone except to comply with the law or protect our rights.</li>
        <li>We don't store personal information longer than necessary for the purpose it was collected for.</li>
      </ul>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Who We Are</h2>
      <p class="text-ink/80">Aurora Theatre and Entertainment Ltd. ("Aurora Theatre", "we", "us") operates the website auroratheatrehk.com. This policy explains what happens when you get in touch with us through this site.</p>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Contact Form</h2>
      <p class="text-ink/80">When you submit our contact form, we collect the name, email address, optional phone number and message you provide. That information is sent by email to Aurora Theatre so we can respond to your enquiry, and you'll receive an automatic confirmation email acknowledging receipt. We don't add you to any mailing list or share this information with third parties, other than the email delivery provider we use to send it.</p>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Cookies & Tracking</h2>
      <p class="text-ink/80">This website does not use tracking cookies, analytics scripts or advertising networks. It is a static website with no visitor accounts, comments or logins.</p>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Hosting</h2>
      <p class="text-ink/80">This site is hosted on Cloudflare's global network. Standard web server logs (such as IP address, browser type and request time) may be retained briefly by our hosting provider for security and reliability purposes.</p>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Business Transfers</h2>
      <p class="text-ink/80">If Aurora Theatre, or substantially all of its assets, were acquired, any information covered by this policy may be among the assets transferred.</p>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Changes To This Policy</h2>
      <p class="text-ink/80">We may update this Privacy Policy from time to time. We encourage visitors to check this page periodically for changes. Your continued use of this site after a change constitutes acceptance of that change.</p>

      <h2 class="mt-8 font-display text-xl font-bold text-ink">Contact Us</h2>
      <p class="text-ink/80">Questions about this policy can be sent to <a href="mailto:info@auroratheatrehk.com" class="text-ember hover:text-plum">info@auroratheatrehk.com</a>.</p>
    </div>
  </section>
  `;
}
