(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      const isHidden = mobileNav.classList.contains("hidden");
      mobileNav.classList.toggle("hidden");
      iconOpen.classList.toggle("hidden");
      iconClose.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(isHidden));
    });
  }

  document.querySelectorAll(".dropdown-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const group = btn.closest(".group");
      const isOpen = group.classList.contains("open");
      document.querySelectorAll(".group.open").forEach((g) => g.classList.remove("open"));
      if (!isOpen) group.classList.add("open");
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".group.open").forEach((g) => g.classList.remove("open"));
  });
})();
