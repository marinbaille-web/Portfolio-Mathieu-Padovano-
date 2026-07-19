"use strict";

/* =========================================================
   PORTFOLIO — MATHIEU PADOVANO
   Interactions principales du site
   ========================================================= */


/* ---------- Éléments du DOM ---------- */

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const navigationLinks = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");


/* ---------- Navigation au défilement ---------- */

function updateHeaderOnScroll() {
  if (!siteHeader) {
    return;
  }

  const hasScrolled = window.scrollY > 20;

  siteHeader.classList.toggle("is-scrolled", hasScrolled);
}

updateHeaderOnScroll();

window.addEventListener("scroll", updateHeaderOnScroll, {
  passive: true
});


/* ---------- Menu mobile ---------- */

function closeMobileMenu() {
  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");

  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function openMobileMenu() {
  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fermer le menu");

  navigation.classList.add("is-open");
  document.body.classList.add("menu-open");
}

function toggleMobileMenu() {
  if (!menuToggle) {
    return;
  }

  const isOpen =
    menuToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", toggleMobileMenu);
}

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});


/* ---------- Fermeture du menu avec la touche Échap ---------- */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});


/* ---------- Réinitialisation au passage sur ordinateur ---------- */

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMobileMenu();
  }
});


/* ---------- Animations au défilement ---------- */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    const delay = Math.min(index * 45, 220);

    element.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(element);
  });
}


/* ---------- Défilement fluide vers les ancres ---------- */

const internalAnchorLinks = document.querySelectorAll(
  'a[href^="#"]:not([href="#"])'
);

internalAnchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId) {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
});
