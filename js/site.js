document.addEventListener("DOMContentLoaded", () => {
  const protectedEmail = [104, 101, 108, 108, 111, 64, 102, 101, 97, 116, 117, 114, 101, 115, 112, 97, 99, 101, 46, 115, 101]
    .map((code) => String.fromCharCode(code))
    .join("");

  document.querySelectorAll("[data-protected-email]").forEach((link) => {
    const subject = (link.dataset.emailSubject || "").toString().trim();
    const body = (link.dataset.emailBody || "").toString().trim();
    const params = new URLSearchParams();

    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);

    const href = params.toString()
      ? `mailto:${protectedEmail}?${params.toString()}`
      : `mailto:${protectedEmail}`;

    link.setAttribute("href", href);
    link.setAttribute("rel", "nofollow");
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("siteNav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 70}ms`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const form = document.querySelector("[data-mailto-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(form));
    const clean = (value) => (value || "").toString().trim();

    const subject = clean(values.project_type)
      ? `Feature Space inquiry - ${clean(values.project_type)}`
      : "Feature Space inquiry";

    const body = [
      `Name: ${clean(values.name) || "Not provided"}`,
      `Company: ${clean(values.company) || "Not provided"}`,
      `Email: ${clean(values.email) || "Not provided"}`,
      `Project type: ${clean(values.project_type) || "Not specified"}`,
      "",
      "Message:",
      clean(values.message) || "No details shared yet.",
    ].join("\n");

    const mailto = `mailto:${protectedEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
});
