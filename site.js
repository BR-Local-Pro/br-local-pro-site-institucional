(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasMotion = !prefersReduced && window.gsap && window.ScrollTrigger;
  const nav = document.querySelector(".site-nav");
  const carousel = document.querySelector(".example-carousel");
  const dotsWrap = document.querySelector(".carousel-dots");
  const prev = document.querySelector(".carousel-arrow.prev");
  const next = document.querySelector(".carousel-arrow.next");
  const mobileWhatsapp = document.querySelector(".mobile-whatsapp");

  const toggleNavState = () => {
    nav?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  toggleNavState();
  window.addEventListener("scroll", toggleNavState, { passive: true });

  document.querySelectorAll(".button, .mini-cta, .nav-action, .carousel-arrow").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      item.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });

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

    const animateSlide = (direction) => {
      if (!hasMotion) return;
      const active = slides[activeIndex];
      const image = active?.querySelector("img");
      if (image) {
        gsap.fromTo(
          image,
          { x: direction * 44, scale: 1.035, opacity: 0.18, filter: "blur(10px) saturate(0.7)" },
          { x: 0, scale: 1, opacity: 1, filter: "blur(0px) saturate(1) contrast(1.04)", duration: 0.72, ease: "power3.out" }
        );
      }
      gsap.fromTo(
        ".showcase-meta > *",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" }
      );
    };

    const setActive = (index, direction = 1) => {
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
      animateSlide(direction);
    };

    const restartAuto = () => {
      window.clearInterval(autoTimer);
      if (prefersReduced) return;
      autoTimer = window.setInterval(() => {
        if (!isPaused && carouselInView) setActive(activeIndex + 1, 1);
      }, 6200);
    };

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ver exemplo " + (index + 1));
      dot.addEventListener("click", () => {
        setActive(index, index > activeIndex ? 1 : -1);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });

    prev?.addEventListener("click", () => {
      setActive(activeIndex - 1, -1);
      restartAuto();
    });

    next?.addEventListener("click", () => {
      setActive(activeIndex + 1, 1);
      restartAuto();
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") setActive(activeIndex - 1, -1);
      if (event.key === "ArrowRight") setActive(activeIndex + 1, 1);
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

  document.querySelectorAll("details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!hasMotion || !detail.open) return;
      const paragraph = detail.querySelector("p");
      if (paragraph) gsap.fromTo(paragraph, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" });
    });
  });

  if (!hasMotion) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.prepend(progress);
  gsap.to(progress, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      scrub: 0.2
    }
  });

  if (finePointer) {
    const cursorLight = document.createElement("div");
    cursorLight.className = "cursor-light";
    document.body.appendChild(cursorLight);

    window.addEventListener(
      "pointermove",
      (event) => {
        gsap.to(cursorLight, {
          x: event.clientX,
          y: event.clientY,
          duration: 0.36,
          ease: "power3.out"
        });
      },
      { passive: true }
    );
  }

  const splitHeadings = gsap.utils.toArray(".hero h1, .problem-copy h2, .process-head h2, .offer-card h2, .section-intro h2, .about-copy h2, .final-action h2");
  splitHeadings.forEach((heading) => {
    const text = heading.textContent.trim().replace(/\s+/g, " ");
    heading.setAttribute("aria-label", text);
    heading.textContent = "";
    text.split(" ").forEach((word, index, words) => {
      const span = document.createElement("span");
      span.className = "motion-word";
      span.textContent = word;
      heading.appendChild(span);
      if (index < words.length - 1) heading.append(" ");
    });
  });

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(".site-nav", { y: -34, opacity: 0, duration: 0.68 }, 0)
    .from(".hero .eyebrow", { y: 16, opacity: 0, duration: 0.42 }, 0.14)
    .from(".hero h1 .motion-word", { y: 44, opacity: 0, rotateX: -24, stagger: 0.026, duration: 0.58 }, 0.22)
    .from(".hero-lede, .hero-offer-line, .hero-proof-list li, .hero-actions, .microcopy, .niche-chips span", {
      y: 28,
      opacity: 0,
      duration: 0.5,
      stagger: 0.04
    }, 0.5)
    .from(".hero-impact-image", {
      scale: 0.94,
      y: 22,
      rotate: 0.7,
      opacity: 0.38,
      filter: "blur(8px)",
      duration: 0.82
    }, 0.26);

  const hero = document.querySelector(".conversion-hero");
  const heroFrame = document.querySelector(".hero-impact-frame");
  if (hero && heroFrame) {
    gsap.to(heroFrame, {
      yPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    if (finePointer) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(heroFrame, {
          x: x * 18,
          y: y * 14,
          rotateY: x * 3.2,
          rotateX: y * -3.2,
          duration: 0.6,
          ease: "power3.out"
        });
      });
      hero.addEventListener("pointerleave", () => {
        gsap.to(heroFrame, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.55)" });
      });
    }
  }

  gsap.utils.toArray(".problem-copy, .section-intro, .offer-copy, .offer-includes, .about-copy, .final-copy").forEach((block) => {
    gsap.from(block, {
      y: 42,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: block,
        start: "top 84%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".problem-copy h2, .process-head h2, .offer-card h2, .section-intro h2, .about-copy h2, .final-action h2").forEach((heading) => {
    gsap.from(heading.querySelectorAll(".motion-word"), {
      y: 34,
      opacity: 0,
      duration: 0.6,
      stagger: 0.025,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 86%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".trust-card, .process-panel, .offer-card, .example-carousel, .plan-card, .company-card, .final-whatsapp-card, .faq-list details").forEach((item) => {
    gsap.from(item, {
      y: 52,
      scale: 0.96,
      opacity: 0,
      duration: 0.86,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        once: true
      }
    });
  });

  gsap.from(".process-step", {
    y: 28,
    opacity: 0,
    stagger: 0.1,
    duration: 0.58,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".process-panel",
      start: "top 76%",
      once: true
    }
  });

  gsap.utils.toArray(".process-step").forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 72%",
      end: "bottom 35%",
      onEnter: () => step.classList.add("is-active"),
      onEnterBack: () => step.classList.add("is-active")
    });
  });

  gsap.to(".trust-arrow span", {
    x: 8,
    repeat: -1,
    yoyo: true,
    duration: 0.72,
    ease: "sine.inOut",
    scrollTrigger: {
      trigger: ".trust-compare",
      start: "top 75%",
      end: "bottom 25%",
      toggleActions: "play pause resume pause"
    }
  });

  gsap.utils.toArray(".hero-impact-image, .trust-card img, .company-card img").forEach((image) => {
    gsap.to(image, {
      scale: 1.055,
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  if (finePointer) {
    gsap.utils.toArray(".trust-card, .process-step, .plan-card, .safety-grid article, details, .final-whatsapp-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
        gsap.to(card, { rotateX: y, rotateY: x, z: 0, duration: 0.32, ease: "power2.out" });
      });

      card.addEventListener("pointerleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.58, ease: "elastic.out(1, 0.55)" });
      });
    });
  }
})();
