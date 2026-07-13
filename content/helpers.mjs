export function img(local, alt, cls = "") {
  return `<img src="/images/photos/${local}" alt="${(alt || "").replace(/"/g, "&quot;")}" loading="lazy" class="${cls}">`;
}

export function eyebrow(text) {
  return `<span class="section-eyebrow">${text}</span>`;
}
