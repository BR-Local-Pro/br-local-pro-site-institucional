(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const nav = document.querySelector(".site-nav");
  const hero = document.querySelector(".conversion-hero");
  const heroFrame = document.querySelector(".hero-impact-frame");
  const carousel = document.querySelector(".example-carousel");
  const dotsWrap = document.querySelector(".carousel-dots");
  const prev = document.querySelector(".carousel-arrow.prev");
  const next = document.querySelector(".carousel-arrow.next");
  const mobileWhatsapp = document.querySelector(".mobile-whatsapp");

  let ticking = false;

  const updateNav = () => {
    nav?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const updateProgress = () => {
    const progress = document.querySelector(".scroll-progress");
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateNav();
      updateProgress();
      ticking = false;
    });
  };

  updateNav();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelectorAll(".button, .mini-cta, .nav-action, .carousel-arrow").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      item.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });

  document.querySelectorAll(".trust-card, .process-step, .include-grid li, .plan-card, details, .final-whatsapp-card, .company-card").forEach((item, index) => {
    item.classList.add("living-card");
    item.style.setProperty("--card-delay", `${(index % 7) * -0.38}s`);
    item.style.setProperty("--card-speed", `${6.5 + (index % 5) * 0.55}s`);
    item.style.setProperty("--card-glow", index % 3 === 0 ? "rgba(244, 196, 48, 0.18)" : "rgba(37, 211, 102, 0.15)");
  });

  if (hero && finePointer) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty("--orbit-x", `${x * 26}px`);
      hero.style.setProperty("--orbit-y", `${y * 22}px`);
      hero.style.setProperty("--hero-glow-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--hero-glow-y", `${event.clientY - rect.top}px`);
      if (heroFrame) {
        heroFrame.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0) rotateX(${y * -2.4}deg) rotateY(${x * 2.4}deg)`;
      }
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--orbit-x", "0px");
      hero.style.setProperty("--orbit-y", "0px");
      hero.style.setProperty("--hero-glow-x", "64%");
      hero.style.setProperty("--hero-glow-y", "44%");
      if (heroFrame) heroFrame.style.transform = "";
    });
  }

  if (mobileWhatsapp) {
    const stickyBlockers = Array.from(document.querySelectorAll(".problem-section, .process-section, .examples-section, .offer-card, .plans-section, .about-section, .final-action"));
    const toggleMobileWhatsapp = () => {
      const overlapsCtaSection = stickyBlockers.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight - 80 && rect.bottom > 90;
      });
      mobileWhatsapp.classList.toggle("is-visible", window.scrollY > 640 && !overlapsCtaSection);
    };
    toggleMobileWhatsapp();
    window.addEventListener("scroll", toggleMobileWhatsapp, { passive: true });
    window.addEventListener("resize", toggleMobileWhatsapp);
  }

  if (carousel && dotsWrap) {
    const slides = Array.from(carousel.querySelectorAll(".example-slide"));
    const metaTitle = document.querySelector(".showcase-meta strong");
    const metaText = document.querySelector(".showcase-meta p");
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let autoTimer = null;
    let isPaused = false;
    let carouselInView = true;

    const setActive = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dotsWrap.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
      const active = slides[activeIndex];
      if (metaTitle) metaTitle.textContent = active.dataset.title || "";
      if (metaText) metaText.textContent = active.dataset.caption || "";
      carousel.dataset.accent = active.dataset.accent || "green";
    };

    const restartAuto = () => {
      window.clearInterval(autoTimer);
      if (prefersReduced) return;
      autoTimer = window.setInterval(() => {
        if (!isPaused && carouselInView) setActive(activeIndex + 1);
      }, 6200);
    };

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ver exemplo " + (index + 1));
      dot.addEventListener("click", () => {
        setActive(index);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });

    prev?.addEventListener("click", () => {
      setActive(activeIndex - 1);
      restartAuto();
    });

    next?.addEventListener("click", () => {
      setActive(activeIndex + 1);
      restartAuto();
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") setActive(activeIndex - 1);
      if (event.key === "ArrowRight") setActive(activeIndex + 1);
      restartAuto();
    });

    carousel.addEventListener("pointerenter", () => {
      isPaused = true;
    });
    carousel.addEventListener("pointerleave", () => {
      isPaused = false;
    });
    carousel.addEventListener("focusin", () => {
      isPaused = true;
    });
    carousel.addEventListener("focusout", () => {
      isPaused = false;
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          carouselInView = entry.isIntersecting;
        },
        { threshold: 0.2 }
      ).observe(carousel);
    }

    setActive(activeIndex);
    restartAuto();
  }

  if (!prefersReduced) {
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.prepend(progress);
    updateProgress();

    if (finePointer) {
      const cursorLight = document.createElement("div");
      cursorLight.className = "cursor-light";
      document.body.appendChild(cursorLight);

      window.addEventListener(
        "pointermove",
        (event) => {
          cursorLight.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        },
        { passive: true }
      );
    }

    const revealItems = document.querySelectorAll(".problem-copy, .trust-card, .problem-cta, .process-panel, .offer-card, .example-carousel, .showcase-meta, .plan-card, .company-card, .about-copy, .faq-list details, .final-action, .footer");
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 70, 210)}ms`);
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealItems.forEach((item) => revealObserver.observe(item));

      const processObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("is-active");
          });
        },
        { threshold: 0.45 }
      );
      document.querySelectorAll(".process-step").forEach((step) => processObserver.observe(step));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      document.querySelectorAll(".process-step").forEach((step) => step.classList.add("is-active"));
    }
  }
})();
