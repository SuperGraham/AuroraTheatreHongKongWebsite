import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../templates/layout.mjs";
import { servicesHubBody } from "../content/pages/services-hub.mjs";
import { servicePageBody } from "../content/pages/service-page.mjs";
import { SERVICES } from "../content/services-data.mjs";

const ROOT = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "public");
const OUT_DIR = path.join(ROOT, "services");
fs.mkdirSync(OUT_DIR, { recursive: true });

const hubHtml = renderPage({
  title: "Services",
  description: "Aurora Theatre Hong Kong's services: theatre productions, drama in education, corporate training, hospitality & entertainment, workshops & coaching, and casting.",
  path: "/services",
  bodyHtml: servicesHubBody(),
});
fs.writeFileSync(path.join(ROOT, "services.html"), hubHtml);
console.log("wrote services.html");

for (const service of SERVICES) {
  const html = renderPage({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
    ogImage: `https://www.auroratheatrehk.com/images/photos/${service.heroImage}`,
    bodyHtml: servicePageBody(service),
  });
  fs.writeFileSync(path.join(OUT_DIR, `${service.slug}.html`), html);
  console.log("wrote", `services/${service.slug}.html`);
}
