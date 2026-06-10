// Shared interactivity for DSA pattern notes pages.

document.addEventListener("DOMContentLoaded", () => {
  // --- Tabs ---
  document.querySelectorAll(".tabs").forEach((tabGroup) => {
    const buttons = tabGroup.querySelectorAll(".tab-btn");
    const panels = tabGroup.querySelectorAll(".tab-panel");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const target = tabGroup.querySelector(
          `.tab-panel[data-panel="${btn.dataset.tab}"]`
        );
        if (target) target.classList.add("active");
      });
    });
  });

  // --- Sidebar active-section highlighting ---
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".sidebar .toc a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = document.querySelector(
              `.sidebar .toc a[href="#${entry.target.id}"]`
            );
            if (link) {
              navLinks.forEach((l) => l.classList.remove("active"));
              link.classList.add("active");
            }
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
