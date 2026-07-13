(function () {
  const grid = document.getElementById("photo-grid");
  if (!grid) return;

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.className = "fixed inset-0 z-[100] hidden items-center justify-center bg-ink/95 p-4";
  overlay.innerHTML =
    '<button id="lightbox-close" aria-label="Close" class="absolute right-5 top-5 text-4xl leading-none text-cream/80 hover:text-gold">&times;</button>' +
    '<img id="lightbox-img" src="" alt="" class="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector("#lightbox-img");
  const closeBtn = overlay.querySelector("#lightbox-close");

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    document.body.style.overflow = "";
  }

  grid.querySelectorAll("[data-full]").forEach((thumb) => {
    thumb.addEventListener("click", () => open(thumb.dataset.full, thumb.dataset.alt));
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
