import { eyebrow } from "../helpers.mjs";

export function notFoundBody() {
  return `
  <section class="flex min-h-[70vh] items-center bg-ink py-24 text-center text-cream">
    <div class="mx-auto max-w-xl px-4 md:px-8">
      ${eyebrow("404")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Scene Not Found</h1>
      <p class="mt-4 text-cream/75">The page you're looking for has left the stage. Let's get you back to the show.</p>
      <a href="/" class="btn-gold mt-8">Back To Home</a>
    </div>
  </section>
  `;
}
