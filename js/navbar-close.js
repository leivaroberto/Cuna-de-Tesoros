(function () {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  if (!navLinks || navLinks.length === 0) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (!navbarCollapse || !navbarCollapse.classList.contains("show")) return;

      if (window.bootstrap && typeof window.bootstrap.Collapse === "function") {
        const collapse = new window.bootstrap.Collapse(navbarCollapse);
        collapse.hide();
        return;
      }

      navbarCollapse.classList.remove("show");
    });
  });
})();

