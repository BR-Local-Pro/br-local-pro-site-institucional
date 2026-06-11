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
  const languageSwitch = document.querySelector(".language-switch");
  const languageButtons = Array.from(document.querySelectorAll(".language-option"));
  const metaDescription = document.querySelector('meta[name="description"]');

  let ticking = false;
  let currentLanguage = "pt";

  const whatsappBase = "https://wa.me/5511978746031?text=";
  const whatsappMessages = {
    pt: decodeURIComponent("Ol%C3%A1%2C%20tenho%20interesse%20e%20quero%20mais%20informa%C3%A7%C3%B5es."),
    en: "Hello, I am interested and would like more information."
  };

  const originalPage = {
    title: document.title,
    description: metaDescription?.getAttribute("content") || ""
  };

  const englishCopy = {
    title: "BR Local Pro | Free website preview for Brazilian businesses in the USA",
    description: "Your local business in the USA needs to look trustworthy online. Get a free website preview in up to 24h and only pay if you approve it for publishing.",
    text: [
      { selector: ".brand small", value: "For Brazilians in the USA" },
      { selector: ".site-nav nav a", values: ["How it works", "Offer", "Examples", "Questions"] },
      { selector: ".nav-action", value: "Free preview" },
      { selector: ".hero-copy > .eyebrow", value: "For Brazilian-owned local businesses in the USA" },
      { selector: ".conversion-hero h1", value: "Look professional before clients call." },
      { selector: ".hero-proof-list li", values: [
        "A professional website to send with every estimate",
        "Services, photos, service area and contact in one place",
        "Built for cleaning, painting, handyman, aesthetics, construction and local services",
        "Intro price of US$97 for the first 3 clients"
      ] },
      { selector: ".niche-chips span", values: ["Cleaning", "Painting", "Handyman", "Aesthetics", "Construction", "Landscaping"] },
      { selector: ".hero-actions .button.whatsapp", value: "I want my free preview on WhatsApp" },
      { selector: ".hero-actions .button.secondary", value: "See what is included" },
      { selector: ".hero-copy .microcopy", value: "You see the preview before paying. If you do not approve it, you pay nothing." },
      { selector: "#problema .eyebrow", value: "Clients decide fast" },
      { selector: "#problema h2", value: "Trust comes before the estimate." },
      { selector: "#problema .problem-copy > p:last-child", value: "A scattered profile creates doubt. A professional website shows services, photos, service area and WhatsApp in one place." },
      { selector: "#problema .trust-card.weak span", value: "No website" },
      { selector: "#problema .trust-card.weak h3", value: "Scattered profile" },
      { selector: "#problema .trust-card.weak li", values: ["Loose photos", "Unclear services", "WhatsApp hard to find"] },
      { selector: "#problema .trust-card.strong span", value: "With BR Local Pro" },
      { selector: "#problema .trust-card.strong h3", value: "A website that builds trust" },
      { selector: "#problema .trust-card.strong li", values: ["Clear services", "Photos and service area", "WhatsApp highlighted"] },
      { selector: ".problem-cta strong", value: "Show professionalism before the client contacts you." },
      { selector: ".problem-cta .button", value: "I want my free preview" },
      { selector: "#como-funciona .eyebrow", value: "How it works" },
      { selector: "#como-funciona h2", value: "From conversation to finished website, without overcomplicating it." },
      { selector: "#como-funciona .process-head p:not(.eyebrow)", value: "You see the preview before deciding to publish. If it does not make sense, you do not pay." },
      { selector: "#como-funciona .button", value: "Message on WhatsApp" },
      { selector: ".process-step strong", values: ["Message on WhatsApp", "Receive the preview", "Approve if you like it", "Use the website"] },
      { selector: ".process-step p", values: [
        "You tell me what you do, where you serve and which services you want to present.",
        "BR Local Pro builds an initial version of the website with your business identity.",
        "You only pay to publish if the preview makes sense for your business.",
        "After approval, the website is ready to send with estimates, social media and client conversations."
      ] },
      { selector: "#oferta .eyebrow", value: "Low-risk entry point" },
      { selector: "#oferta h2", value: "Site Express 24h" },
      { selector: "#oferta .offer-copy > p:not(.eyebrow):not(.microcopy)", value: "A professional website so you stop depending on a scattered profile and present your business with more trust." },
      { selector: ".offer-price span", value: "Publishing for the first 3 clients" },
      { selector: "#oferta .button", value: "Request a free preview" },
      { selector: "#oferta .microcopy", value: "The preview is free. Payment only happens if you approve it for publishing." },
      { selector: ".includes-head span", value: "Included in Site Express" },
      { selector: ".includes-head h3", value: "The essentials to publish fast, look professional and make estimate requests easier." },
      { selector: ".include-grid strong", values: [
        "One-page website",
        "Mobile first",
        "WhatsApp highlighted",
        "Organized services",
        "Simple copy",
        "Publishing and edits"
      ] },
      { selector: ".include-grid span", values: [
        "A clear page with presentation, services and a call to request an estimate.",
        "A layout designed for people arriving on mobile and ready to contact you fast.",
        "WhatsApp, call or estimate button placed where it should be.",
        "Photos, service area and main services without scattered information.",
        "Portuguese, English or both, with direct language for local clients.",
        "Publishing after approval and 7 days of simple edits."
      ] },
      { selector: "#exemplos .section-intro .eyebrow", value: "See before you pay" },
      { selector: "#exemplos .section-intro h2", value: "Each service needs to build trust in the right way." },
      { selector: "#exemplos .section-intro p:not(.eyebrow)", value: "The examples below are visual models. Your real preview is created with your business information, photos and services." },
      { selector: ".showcase-meta strong", value: "Cleaning Services" },
      { selector: ".showcase-meta p", value: "A direct website to build trust before the visit or estimate." },
      { selector: "#exemplos > .button", value: "I want a preview for my niche" },
      { selector: "#planos .eyebrow", value: "Choose your starting point" },
      { selector: "#planos .section-intro h2", value: "Start with the website. Upgrade when it makes sense." },
      { selector: "#planos .section-intro p:not(.eyebrow)", value: "Site Express solves the presentation problem. If you want a stronger base, you can add tracking and local presence from day one." },
      { selector: ".plan-card > span", values: ["Direct entry", "Tracking base", "Most recommended"] },
      { selector: ".plan-card h3", values: ["Site Express", "Site + Tracking", "Local Presence Pro"] },
      { selector: ".plan-card > p", values: [
        "For getting a professional website and stopping the dependence on Instagram, Facebook or scattered messages.",
        "For those who want the website plus an initial base to measure visits, clicks and contacts.",
        "For launching with a real company image: website, tracking and a more organized local presence from the start."
      ] },
      { selector: ".plan-card:nth-child(1) li", values: [
        "One-page website to send with estimates",
        "Services, photos and service area",
        "WhatsApp and call buttons",
        "Simple edits after approval"
      ] },
      { selector: ".plan-card:nth-child(2) li", values: [
        "Everything in Site Express",
        "Google Analytics and Search Console",
        "Initial Meta Pixel",
        "Measured WhatsApp and call clicks"
      ] },
      { selector: ".plan-card:nth-child(3) li", values: [
        "Everything in Site + Tracking",
        "Initial base for Google Business Profile",
        "Services and service areas organized",
        "Guidance for consistent local presence"
      ] },
      { selector: ".plan-card small", value: "Approval, verification and ranking depend on Google's rules." },
      { selector: ".plan-card .mini-cta", values: ["I want Site Express", "I want Site + Tracking", "I want the recommended plan"] },
      { selector: ".company-card figcaption span", value: "BR Local Pro" },
      { selector: ".company-card figcaption strong", value: "Websites and local presence" },
      { selector: "#empresa .eyebrow", value: "Who BR Local Pro is" },
      { selector: "#empresa h2", value: "Professional online presence for Brazilians serving clients in the USA." },
      { selector: "#empresa .about-copy > p:not(.eyebrow)", values: [
        "BR Local Pro helps Brazilian-owned local businesses in the USA move away from improvised profiles and present a clear, polished website ready to send with estimates.",
        "The focus is simple: organize services, photos, service area and contact into a website that builds trust fast, especially for people arriving on mobile."
      ] },
      { selector: "#empresa li", values: [
        "Specialized in Brazilian-owned local businesses in the USA",
        "Free preview before any payment",
        "Websites built for estimates, WhatsApp and calls",
        "Direct delivery, no long contract to start"
      ] },
      { selector: "#empresa .button", value: "Talk on WhatsApp" },
      { selector: "#faq .eyebrow", value: "Honest questions" },
      { selector: "#faq h2", value: "Before messaging, remove the fear." },
      { selector: "#faq details summary", values: [
        "Do I need to pay upfront?",
        "What if I do not like the preview?",
        "Is the preview ready in 24h?",
        "I already have Instagram or Facebook. Do I still need a website?",
        "Does the website guarantee clients?",
        "Does it include domain and hosting?",
        "Can the website be in English?",
        "My English is not good. Is that a problem?",
        "Which businesses does this work for?"
      ] },
      { selector: "#faq details p", values: [
        "No. You receive a free preview. You only pay if you approve it for publishing.",
        "You pay nothing. The idea is for you to see it before deciding, with no pressure and no long contract.",
        "Yes, after you send the necessary business information.",
        "Instagram and Facebook help, but they do not replace a page with services, photos, service area and an estimate button in one place.",
        "No. The website improves your online presence, organizes your information and makes contact easier, but it does not guarantee sales, estimate requests or Google ranking.",
        "No. Domain and hosting are paid separately if needed. I can guide you to the best option.",
        "Yes. It can be in Portuguese, English or both.",
        "No. You can send the information in Portuguese. I organize the text for the audience you want to serve.",
        "Cleaning, painting, handyman, construction, aesthetics, landscaping, residential services, commercial services and other local businesses."
      ] },
      { selector: "#proximo-passo .eyebrow", value: "Next step" },
      { selector: "#proximo-passo h2", value: "Want to see how your business website would look?" },
      { selector: "#proximo-passo .final-copy p:not(.eyebrow)", value: "Message me on WhatsApp. The conversation is direct, and I will tell you which path makes the most sense: Site Express, Tracking or Local Presence Pro." },
      { selector: ".final-whatsapp-card span", value: "WhatsApp" },
      { selector: ".final-whatsapp-card strong", value: "Quick conversation. No commitment." },
      { selector: ".final-whatsapp-card p", value: "You message me, explain your service and I reply with the simplest next step." },
      { selector: ".final-whatsapp-card .button", value: "Message on WhatsApp" },
      { selector: ".footer-brand span", value: "Professional online presence for Brazilian-owned local businesses in the USA." },
      { selector: ".footer nav a", values: ["How it works", "Plans", "Examples", "FAQ", "WhatsApp"] },
      { selector: ".footer-disclaimer", value: "We do not guarantee sales, estimate requests, Google Business Profile approval or Google ranking. Results depend on the market, offer, service, competition and budget." },
      { selector: ".mobile-whatsapp", value: "WhatsApp" }
    ],
    html: [
      { selector: ".hero-lede", value: "Get a free preview of your website in up to <strong>24h</strong>. Only pay if you approve it for publishing." },
      { selector: ".hero-offer-line span", values: [
        "Preview in <strong>24h</strong>",
        "Publishing for <strong>US$97</strong>",
        "Only pay if you approve"
      ] }
    ],
    attrs: [
      { selector: ".site-nav", attr: "aria-label", value: "Main navigation" },
      { selector: ".language-switch", attr: "aria-label", value: "Select language" },
      { selector: ".conversion-hero", attr: "aria-label", value: "Free website preview in up to 24h" },
      { selector: ".hero-mobile-visual, .hero-impact-frame", attr: "aria-label", value: "Example of a professional English website for a local service business" },
      { selector: ".hero-mobile-visual img, .hero-impact-image", attr: "alt", value: "Example of a professional English website for a cleaning service business." },
      { selector: ".hero-mobile-visual img, .hero-impact-image", attr: "src", value: "assets/examples/cleaner.webp" },
      { selector: ".hero-mobile-visual img, .hero-impact-image", attr: "srcset", value: "assets/examples/cleaner.webp 1792w" },
      { selector: ".hero-mobile-visual img, .hero-impact-image", attr: "sizes", value: "(max-width: 760px) 96vw, 54vw" },
      { selector: ".hero-mobile-visual img, .hero-impact-image", attr: "width", value: "1792" },
      { selector: ".hero-mobile-visual img, .hero-impact-image", attr: "height", value: "1024" },
      { selector: ".hero-proof-list", attr: "aria-label", value: "Main benefits" },
      { selector: ".niche-chips", attr: "aria-label", value: "Served niches" },
      { selector: ".trust-compare", attr: "aria-label", value: "Comparison between improvised online presence and professional website" },
      { selector: ".trust-card.weak img", attr: "alt", value: "Improvised online presence with scattered profile and information." },
      { selector: ".trust-card.strong img", attr: "alt", value: "Professional website organized on laptop and phone for a local business." },
      { selector: ".carousel-arrow.prev", attr: "aria-label", value: "Previous example" },
      { selector: ".carousel-arrow.next", attr: "aria-label", value: "Next example" },
      { selector: ".carousel-dots", attr: "aria-label", value: "Examples navigation" },
      { selector: ".example-slide", attr: "data-title", values: ["Cleaning Services", "Painting", "Handyman", "Landscaping", "Construction", "Aesthetics"] },
      { selector: ".example-slide", attr: "data-caption", values: [
        "A direct website to build trust before the visit or estimate.",
        "Strong visuals, clear services and an estimate button always visible.",
        "Shows trust, services and fast contact for people who need help at home.",
        "Clean visuals to sell care, service area and estimate requests.",
        "A solid presentation for construction, remodeling and higher-ticket services.",
        "Premium presentation for beauty services, treatments and scheduling."
      ] },
      { selector: ".example-slide img", attr: "alt", values: [
        "Example website for a cleaning company.",
        "Example website for a painting company.",
        "Example website for handyman services.",
        "Example website for landscaping and lawn care.",
        "Example website for construction and remodeling.",
        "Example website for an aesthetics studio."
      ] },
      { selector: ".company-card", attr: "aria-label", value: "BR Local Pro digital operation" },
      { selector: ".company-card img", attr: "alt", value: "Laptop and phone showing a professional website for a local business" }
    ]
  };

  const originalValues = new Map();

  const getEntryValue = (entry, index) => {
    if (Array.isArray(entry.values)) return entry.values[index] ?? entry.values[entry.values.length - 1] ?? "";
    return entry.value ?? "";
  };

  const rememberOriginal = (element, key, value) => {
    if (!originalValues.has(element)) originalValues.set(element, {});
    const bucket = originalValues.get(element);
    if (!(key in bucket)) bucket[key] = value;
  };

  const forEachEntryElement = (entry, callback) => {
    document.querySelectorAll(entry.selector).forEach((element, index) => {
      callback(element, getEntryValue(entry, index), index);
    });
  };

  const captureOriginals = () => {
    englishCopy.text.forEach((entry) => {
      forEachEntryElement(entry, (element) => rememberOriginal(element, "text", element.textContent));
    });
    englishCopy.html.forEach((entry) => {
      forEachEntryElement(entry, (element) => rememberOriginal(element, "html", element.innerHTML));
    });
    englishCopy.attrs.forEach((entry) => {
      forEachEntryElement(entry, (element) => rememberOriginal(element, `attr:${entry.attr}`, element.getAttribute(entry.attr) || ""));
    });
  };

  const restoreOriginals = () => {
    englishCopy.text.forEach((entry) => {
      forEachEntryElement(entry, (element) => {
        const original = originalValues.get(element)?.text;
        if (typeof original === "string") element.textContent = original;
      });
    });
    englishCopy.html.forEach((entry) => {
      forEachEntryElement(entry, (element) => {
        const original = originalValues.get(element)?.html;
        if (typeof original === "string") element.innerHTML = original;
      });
    });
    englishCopy.attrs.forEach((entry) => {
      forEachEntryElement(entry, (element) => {
        const original = originalValues.get(element)?.[`attr:${entry.attr}`];
        if (typeof original === "string") element.setAttribute(entry.attr, original);
      });
    });
  };

  const getStoredLanguage = () => {
    try {
      return window.localStorage.getItem("brlp-language") === "en" ? "en" : "pt";
    } catch {
      return "pt";
    }
  };

  const getCarouselDotLabel = (index) => currentLanguage === "en" ? `View example ${index + 1}` : `Ver exemplo ${index + 1}`;

  const refreshCarouselMeta = () => {
    const active = document.querySelector(".example-slide.is-active");
    const metaTitle = document.querySelector(".showcase-meta strong");
    const metaText = document.querySelector(".showcase-meta p");
    if (active && metaTitle) metaTitle.textContent = active.dataset.title || "";
    if (active && metaText) metaText.textContent = active.dataset.caption || "";
    dotsWrap?.querySelectorAll("button").forEach((dot, index) => {
      dot.setAttribute("aria-label", getCarouselDotLabel(index));
    });
  };

  const updateWhatsappLinks = () => {
    const message = encodeURIComponent(whatsappMessages[currentLanguage] || whatsappMessages.pt);
    document.querySelectorAll(".wa-link").forEach((link) => {
      link.href = `${whatsappBase}${message}`;
    });
  };

  const applyLanguage = (language, options = {}) => {
    currentLanguage = language === "en" ? "en" : "pt";
    document.documentElement.lang = currentLanguage === "en" ? "en-US" : "pt-BR";

    if (currentLanguage === "en") {
      document.title = englishCopy.title;
      metaDescription?.setAttribute("content", englishCopy.description);
      englishCopy.text.forEach((entry) => {
        forEachEntryElement(entry, (element, value) => {
          element.textContent = value;
        });
      });
      englishCopy.html.forEach((entry) => {
        forEachEntryElement(entry, (element, value) => {
          element.innerHTML = value;
        });
      });
      englishCopy.attrs.forEach((entry) => {
        forEachEntryElement(entry, (element, value) => {
          element.setAttribute(entry.attr, value);
        });
      });
    } else {
      document.title = originalPage.title;
      metaDescription?.setAttribute("content", originalPage.description);
      restoreOriginals();
    }

    languageSwitch?.setAttribute("aria-label", currentLanguage === "en" ? "Select language" : "Selecionar idioma");
    languageButtons.forEach((button) => {
      const isActive = button.dataset.lang === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    updateWhatsappLinks();
    refreshCarouselMeta();

    if (options.persist !== false) {
      try {
        window.localStorage.setItem("brlp-language", currentLanguage);
      } catch {
        /* localStorage can be unavailable in strict privacy modes. */
      }
    }
  };

  captureOriginals();
  currentLanguage = getStoredLanguage();
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });
  applyLanguage(currentLanguage, { persist: false });

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

  document.querySelectorAll(".button, .mini-cta, .nav-action, .language-option, .carousel-arrow").forEach((item) => {
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
      dot.setAttribute("aria-label", getCarouselDotLabel(index));
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
