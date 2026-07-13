const SITE_NAME = "Aurora Theatre Hong Kong";
const SITE_URL = "https://www.auroratheatrehk.com";
const OG_IMAGE_DEFAULT = `${SITE_URL}/images/photos/2018-01-the-crucible-1.jpg`;

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Productions",
    children: [
      { label: "Current Productions", href: "/current-productions" },
      { label: "Past Productions", href: "/past-productions" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  {
    label: "Services",
    children: [
      { label: "Classes & Workshops", href: "/classes-and-workshops" },
      { label: "Coaching", href: "/coaching" },
    ],
  },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact" },
];

function escapeAttr(str = "") {
  return String(str).replace(/"/g, "&quot;");
}

function navLinkHtml(item, path) {
  if (item.children) {
    const isActive = item.children.some((c) => c.href === path);
    return `
      <div class="relative group">
        <button type="button" class="dropdown-toggle flex items-center gap-1 py-2 text-sm font-semibold uppercase tracking-wide ${isActive ? "text-gold" : "text-cream"} hover:text-gold transition" aria-expanded="false">
          ${item.label}
          <svg class="h-3 w-3 transition group-[.open]:rotate-180" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <div class="dropdown-menu md:invisible md:absolute md:left-0 md:top-full md:w-56 md:rounded-lg md:bg-charcoal md:opacity-0 md:shadow-xl md:ring-1 md:ring-cream/10 md:transition md:group-[.open]:visible md:group-[.open]:opacity-100">
          ${item.children
            .map(
              (c) => `<a href="${c.href}" class="block px-5 py-3 text-sm text-cream/90 hover:bg-charcoal-light hover:text-gold ${c.href === path ? "text-gold" : ""}">${c.label}</a>`
            )
            .join("")}
        </div>
      </div>`;
  }
  const isActive = item.href === path;
  return `<a href="${item.href}" class="py-2 text-sm font-semibold uppercase tracking-wide ${isActive ? "text-gold" : "text-cream"} hover:text-gold transition">${item.label}</a>`;
}

function headerHtml(path) {
  return `
  <header class="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-cream/10">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
      <a href="/" class="flex items-center gap-3">
        <img src="/images/logo.png" alt="Aurora Theatre Hong Kong logo" class="h-11 w-11">
        <span class="font-display text-lg leading-none text-cream">Aurora <span class="block text-xs font-body font-semibold uppercase tracking-[0.3em] text-gold">Theatre</span></span>
      </a>
      <nav class="hidden md:flex md:items-center md:gap-8" id="primary-nav">
        ${NAV.map((item) => navLinkHtml(item, path)).join("")}
      </nav>
      <button id="menu-toggle" type="button" aria-label="Toggle menu" aria-expanded="false" class="md:hidden text-cream">
        <svg id="menu-icon-open" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg id="menu-icon-close" class="hidden h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div id="mobile-nav" class="hidden md:hidden border-t border-cream/10 px-4 pb-4">
      ${NAV.map((item) => {
        if (item.children) {
          return `<div class="border-b border-cream/10 py-2">
            <p class="py-1 text-sm font-semibold uppercase tracking-wide text-gold">${item.label}</p>
            ${item.children.map((c) => `<a href="${c.href}" class="block py-2 pl-3 text-sm text-cream/90">${c.label}</a>`).join("")}
          </div>`;
        }
        return `<a href="${item.href}" class="block border-b border-cream/10 py-3 text-sm font-semibold uppercase tracking-wide text-cream">${item.label}</a>`;
      }).join("")}
    </div>
  </header>`;
}

function footerHtml() {
  const year = new Date().getFullYear();
  return `
  <footer class="bg-plum-dark text-cream/80">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
      <div>
        <img src="/images/logo-white.png" alt="Aurora Theatre Hong Kong" class="mb-4 h-14 w-14">
        <p class="text-sm leading-relaxed text-cream/70">Aurora Theatre Hong Kong is an independent theatre company promoting English-language shows in the local Hong Kong art scene since 2010.</p>
      </div>
      <div>
        <h3 class="mb-4 font-display text-lg text-gold">Useful Links</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/" class="hover:text-gold">Home</a></li>
          <li><a href="/about" class="hover:text-gold">About</a></li>
          <li><a href="/current-productions" class="hover:text-gold">Productions</a></li>
          <li><a href="/gallery" class="hover:text-gold">Gallery</a></li>
          <li><a href="/classes-and-workshops" class="hover:text-gold">Classes &amp; Workshops</a></li>
          <li><a href="/blog/" class="hover:text-gold">Blog</a></li>
        </ul>
      </div>
      <div>
        <h3 class="mb-4 font-display text-lg text-gold">More</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/coaching" class="hover:text-gold">Coaching</a></li>
          <li><a href="/sponsors" class="hover:text-gold">Sponsors</a></li>
          <li><a href="/contact" class="hover:text-gold">Contact</a></li>
          <li><a href="/privacy-policy" class="hover:text-gold">Privacy Policy</a></li>
        </ul>
      </div>
      <div>
        <h3 class="mb-4 font-display text-lg text-gold">Contact Info</h3>
        <ul class="space-y-2 text-sm text-cream/70">
          <li>Hong Kong</li>
          <li><a href="mailto:info@auroratheatrehk.com" class="hover:text-gold">info@auroratheatrehk.com</a></li>
          <li><a href="https://www.auroratheatrehk.com" class="hover:text-gold">www.auroratheatrehk.com</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
      &copy; ${year} Aurora Theatre and Entertainment Ltd. All rights reserved.
    </div>
  </footer>
  <script src="/js/nav.js"></script>`;
}

export function renderPage({
  title,
  description,
  path,
  ogImage = OG_IMAGE_DEFAULT,
  schemaType = "Organization",
  bodyHtml,
  extraHead = "",
}) {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${fullTitle}</title>
<meta name="description" content="${escapeAttr(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">

<meta property="og:type" content="website">
<meta property="og:title" content="${escapeAttr(fullTitle)}">
<meta property="og:description" content="${escapeAttr(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:site_name" content="${SITE_NAME}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(fullTitle)}">
<meta name="twitter:description" content="${escapeAttr(description)}">
<meta name="twitter:image" content="${ogImage}">

<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${schemaType}",
  "name": "${SITE_NAME}",
  "url": "${SITE_URL}"
}
</script>

<link rel="stylesheet" href="/css/style.css">
${extraHead}
</head>
<body class="bg-cream text-ink">
${headerHtml(path)}
<main>
${bodyHtml}
</main>
${footerHtml()}
</body>
</html>`;
}

export { SITE_NAME, SITE_URL };
