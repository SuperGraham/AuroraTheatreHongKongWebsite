import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../templates/layout.mjs";
import { homeBody } from "../content/pages/home.mjs";
import { aboutBody } from "../content/pages/about.mjs";
import { currentProductionsBody } from "../content/pages/current-productions.mjs";
import { pastProductionsBody } from "../content/pages/past-productions.mjs";
import { galleryBody } from "../content/pages/gallery.mjs";
import { classesBody } from "../content/pages/classes-and-workshops.mjs";
import { coachingBody } from "../content/pages/coaching.mjs";
import { sponsorsBody } from "../content/pages/sponsors.mjs";
import { contactBody } from "../content/pages/contact.mjs";
import { privacyBody } from "../content/pages/privacy-policy.mjs";
import { notFoundBody } from "../content/pages/not-found.mjs";
import { testimonialsBody } from "../content/pages/testimonials.mjs";

const ROOT = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "public");

const PAGES = [
  {
    file: "index.html",
    title: "Hong Kong Theatre Company",
    description:
      "Aurora Theatre Hong Kong is an independent theatre company promoting English-language shows in Hong Kong since 2010 — productions, acting classes, coaching and workshops.",
    path: "/",
    bodyHtml: homeBody(),
  },
  {
    file: "about.html",
    title: "About Us",
    description:
      "Aurora Theatre Hong Kong is an independent theatre company founded by Nicole Garbellini in 2010, promoting English-language shows in the local Hong Kong art scene.",
    path: "/about",
    bodyHtml: aboutBody(),
    schemaType: "AboutPage",
  },
  {
    file: "current-productions.html",
    title: "Current & Upcoming Productions",
    description: "What Aurora Theatre Hong Kong is bringing to the stage, the classroom and the community right now.",
    path: "/current-productions",
    bodyHtml: currentProductionsBody(),
  },
  {
    file: "past-productions.html",
    title: "Past Productions",
    description: "Explore Aurora Theatre Hong Kong's past productions, from Dial 'M' For Murder to The Crucible and beyond.",
    path: "/past-productions",
    bodyHtml: pastProductionsBody(),
  },
  {
    file: "gallery.html",
    title: "Gallery",
    description: "Photographs from Aurora Theatre Hong Kong productions over the years.",
    path: "/gallery",
    bodyHtml: galleryBody(),
  },
  {
    file: "classes-and-workshops.html",
    title: "Acting Classes & Workshops in Hong Kong",
    description: "Join Aurora Theatre's acting classes in Hong Kong — storytelling, improv and script work for all levels, led by Nicole Garbellini.",
    path: "/classes-and-workshops",
    bodyHtml: classesBody(),
  },
  {
    file: "coaching.html",
    title: "Private Acting Coaching",
    description: "Private one-on-one acting coaching with Nicole Garbellini — online sessions for actors of every level.",
    path: "/coaching",
    bodyHtml: coachingBody(),
  },
  {
    file: "sponsors.html",
    title: "Sponsors",
    description: "Support Aurora Theatre Hong Kong — festival sponsorship, title sponsorship and in-kind support opportunities.",
    path: "/sponsors",
    bodyHtml: sponsorsBody(),
  },
  {
    file: "contact.html",
    title: "Contact",
    description: "Get in touch with Aurora Theatre Hong Kong about classes, coaching, productions, workshops or sponsorship.",
    path: "/contact",
    bodyHtml: contactBody(),
    schemaType: "ContactPage",
  },
  {
    file: "testimonials.html",
    title: "Testimonials",
    description: "Reviews and press coverage of Aurora Theatre Hong Kong's productions, workshops and events.",
    path: "/testimonials",
    bodyHtml: testimonialsBody(),
  },
  {
    file: "privacy-policy.html",
    title: "Privacy Policy",
    description: "Aurora Theatre Hong Kong's privacy policy.",
    path: "/privacy-policy",
    bodyHtml: privacyBody(),
  },
  {
    file: "404.html",
    title: "Page Not Found",
    description: "The page you're looking for could not be found.",
    path: "/404",
    bodyHtml: notFoundBody(),
  },
];

for (const page of PAGES) {
  const html = renderPage(page);
  fs.writeFileSync(path.join(ROOT, page.file), html);
  console.log("wrote", page.file);
}
