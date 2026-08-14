import { img, eyebrow } from "../helpers.mjs";

const ITEMS = [
  {
    title: "The Open Couple",
    photo: "2022-12-6fc5722e-5eac-4efb-bf5e-b4e9b7de7230.jpg",
    description:
      "Presented by The Italian Institute of Culture, we were absolutely thrilled to return to the stage with Dario Fo's timeless piece.",
  },
  {
    title: "Waitress On Top",
    photo: "production-waitress-on-top.jpg",
    description:
      "The opera adaptation of La Serva Padrona by Giovanni Pergolesi has toured local schools, exposing students to Commedia Dell'Arte and Italian culture.",
  },
  {
    title: "Educational Workshops",
    photo: "2022-12-15b653aa-ab38-40f8-86f0-ec4cedbdde71.jpg",
    description:
      "Our teachers have been busy bringing dramatic material and performances to schools — seeing students blossom into their characters and performances was a true blessing to witness.",
  },
  {
    title: "Acting Classes for Adults",
    photo: "coaching-session-duo.jpg",
    description:
      "We regularly run acting courses for adults, including complementary trial classes anyone can try before booking a full course.",
  },
  {
    title: "Murder Mystery Dinner Theatre & Quiz Nights",
    photo: "2022-12-IMG_8601.jpg",
    description:
      "We've presented Murder Mystery Dinner Theatre at hotels across Hong Kong, and regularly host Quiz Nights at Grain in Kennedy Town — working in partnership with different clients for a fun night out.",
  },
  {
    title: "Murder Mysteries & Escape Rooms for the Classroom",
    photo: "2022-12-PHOTO-2021-10-29-04-17-53.jpg",
    description:
      "Beyond in-school workshops, we offer a range of interactive programmes to engage students and help them develop creative skills and critical thinking.",
  },
];

export function currentProductionsBody() {
  return `
  <section class="bg-ink py-16 text-cream md:py-24">
    <div class="mx-auto max-w-4xl px-4 text-center md:px-8">
      ${eyebrow("Productions")}
      <h1 class="font-display text-4xl font-bold md:text-5xl">Current & Upcoming</h1>
      <p class="mt-4 text-cream/75">What Aurora Theatre is bringing to the stage, the classroom and the community right now.</p>
    </div>
  </section>

  <section class="bg-cream py-16">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
      ${ITEMS.map(
        (item) => `
      <div class="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ink/5">
        ${item.photo ? img(item.photo, item.title, "h-48 w-full object-cover") : `<div class="flex h-48 w-full items-center justify-center bg-plum-dark"><span class="font-display text-cream/70">Aurora Theatre</span></div>`}
        <div class="p-6">
          <h2 class="font-display text-lg font-bold text-ink">${item.title}</h2>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">${item.description}</p>
        </div>
      </div>`
      ).join("")}
    </div>
  </section>

  <section class="bg-plum py-16 text-center text-cream">
    <div class="mx-auto max-w-2xl px-4 md:px-8">
      <h2 class="font-display text-2xl font-bold md:text-3xl">Want To Bring Us To Your School Or Venue?</h2>
      <p class="mt-4 text-cream/85">Get in touch to discuss workshops, dinner theatre, quiz nights and more.</p>
      <a href="/contact" class="btn-gold mt-6">Contact Us</a>
    </div>
  </section>
  `;
}
