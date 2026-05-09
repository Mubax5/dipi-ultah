(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js-enabled");

  const particleField = document.querySelector("#particleField");
  const confettiLayer = document.querySelector("#confettiLayer");
  const typeTarget = document.querySelector("[data-typewriter]");
  const signalBoard = document.querySelector("#signalBoard");
  const signalText = document.querySelector("#signalText");
  const cardFeedback = document.querySelector("#cardFeedback");
  const mainCard = document.querySelector("#mainCard");
  const heroFront = document.querySelector("#heroFront");
  const heroMessage = document.querySelector("#heroMessage");
  const openMessage = document.querySelector("#openMessage");
  const closeMessage = document.querySelector("#closeMessage");
  const birthdayTrack = document.querySelector("#birthdayTrack");
  const loadoutCarousel = document.querySelector("#loadoutCarousel");
  const carouselPrev = document.querySelector("#carouselPrev");
  const carouselNext = document.querySelector("#carouselNext");
  const carouselMeter = document.querySelector("#carouselMeter");
  const vibeButton = document.querySelector("#vibeButton");
  const quickIgnite = document.querySelector("#quickIgnite");
  const vibeText = document.querySelector("#vibeText");
  const parallaxItems = document.querySelectorAll("[data-depth]");
  const magneticItems = document.querySelectorAll(
    ".ink-button, .ghost-button, .loadout-card, .flip-trigger, .carousel-arrow"
  );

  const signalMessages = [
    "Still here.",
    "Angkatan 4 tetap ada.",
    "Lo tetap masuk cerita.",
    "Pelan-pelan, tetap maju.",
    "Comeback bisa mulai kapan aja.",
    "Hari ini punya Dipi.",
    "Satu langkah dulu.",
    "New level kebuka.",
  ];

  const confettiColors = ["#f4f1e8", "#d8b35f", "#8fc7ff", "#9c988d"];
  const signalPositions = [
    [9, 24, 2.1],
    [20, 11, 1.9],
    [32, 32, 2.4],
    [47, 16, 1.8],
    [64, 28, 2.2],
    [83, 14, 1.9],
    [92, 38, 2.5],
    [14, 52, 2.4],
    [27, 67, 1.8],
    [42, 50, 2.2],
    [56, 72, 1.9],
    [75, 58, 2.35],
    [88, 79, 1.85],
    [6, 82, 2.2],
    [18, 39, 1.7],
    [36, 86, 2.5],
    [51, 40, 1.75],
    [68, 86, 2.1],
    [80, 32, 1.8],
    [95, 64, 2.3],
    [24, 24, 2],
    [58, 12, 2.35],
    [72, 71, 1.75],
    [40, 9, 2.05],
  ];

  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  let musicStarted = false;

  function startBirthdayTrack() {
    if (!birthdayTrack || musicStarted) return Promise.resolve(false);

    birthdayTrack.volume = 1;
    birthdayTrack.muted = false;

    return birthdayTrack
      .play()
      .then(() => {
        musicStarted = true;
        return true;
      })
      .catch(() => false);
  }

  function setupAutoplayMusic() {
    if (!birthdayTrack) return;

    startBirthdayTrack();

    const unlock = () => {
      startBirthdayTrack().then((started) => {
        if (!started) return;
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      });
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock, { passive: true });
  }

  function setupTypewriter() {
    if (!typeTarget) return;

    const text = typeTarget.textContent.trim();
    typeTarget.textContent = "";

    if (reduceMotion) {
      typeTarget.textContent = text;
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      typeTarget.textContent = text.slice(0, index + 1);
      index += 1;

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 28);
  }

  function buildDust() {
    if (!particleField || reduceMotion) return;

    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 680 ? 28 : 54;

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${randomBetween(0, 100)}%`;
      particle.style.top = `${randomBetween(0, 100)}%`;
      particle.style.setProperty("--w", `${randomBetween(1, 3)}px`);
      particle.style.setProperty("--h", `${randomBetween(8, 26)}px`);
      particle.style.setProperty("--r", `${randomBetween(-18, 18)}deg`);
      particle.style.setProperty("--duration", `${randomBetween(5, 12)}s`);
      particle.style.setProperty("--delay", `${randomBetween(-8, 0)}s`);
      fragment.appendChild(particle);
    }

    particleField.appendChild(fragment);
  }

  function setupScrollReveal() {
    const items = document.querySelectorAll(".reveal-card");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((item) => observer.observe(item));
  }

  function setupParallax() {
    if (reduceMotion) return;

    let pointerX = 0;
    let pointerY = 0;
    let scrollY = window.scrollY;
    let rafId = null;

    function update() {
      root.style.setProperty("--px", `${50 + pointerX * 12}%`);
      root.style.setProperty("--py", `${38 + pointerY * 12}%`);
      root.style.setProperty("--scroll-shift", `${scrollY * -0.035}px`);
      root.style.setProperty("--scroll-shift-rev", `${scrollY * 0.025}px`);

      parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 0.08);
        const x = pointerX * depth * 42;
        const y = pointerY * depth * 34 - scrollY * depth * 0.08;
        item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      rafId = null;
    }

    function requestUpdate() {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    }

    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX = event.clientX / window.innerWidth - 0.5;
        pointerY = event.clientY / window.innerHeight - 0.5;
        requestUpdate();
      },
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      () => {
        scrollY = window.scrollY;
        requestUpdate();
      },
      { passive: true }
    );
  }

  function setupMainCard() {
    if (!mainCard || !openMessage || !closeMessage || !heroMessage || !heroFront) return;

    const setOpen = (open) => {
      mainCard.classList.toggle("is-message-open", open);
      openMessage.setAttribute("aria-expanded", String(open));
      heroMessage.setAttribute("aria-hidden", String(!open));
      heroFront.setAttribute("aria-hidden", String(open));
      closeMessage.tabIndex = open ? 0 : -1;
      openMessage.tabIndex = open ? -1 : 0;
    };

    openMessage.addEventListener("click", () => setOpen(true));
    closeMessage.addEventListener("click", () => setOpen(false));

    mainCard.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    setOpen(false);
  }

  function setupMagneticInk() {
    magneticItems.forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        item.style.setProperty("--mx", `${x}%`);
        item.style.setProperty("--my", `${y}%`);
      });
    });
  }

  function setupCarousel() {
    if (!loadoutCarousel) return;

    const cards = Array.from(loadoutCarousel.querySelectorAll(".loadout-card"));
    const step = () => Math.max(220, loadoutCarousel.clientWidth * 0.84);

    const updateMeter = () => {
      if (!carouselMeter) return;

      const max = loadoutCarousel.scrollWidth - loadoutCarousel.clientWidth;
      const progress = max > 0 ? loadoutCarousel.scrollLeft / max : 0;
      const width = cards.length ? 100 / cards.length : 100;

      carouselMeter.style.width = `${width}%`;
      carouselMeter.style.transform = `translateX(${progress * (cards.length - 1) * 100}%)`;
    };

    if (carouselPrev) {
      carouselPrev.addEventListener("click", () => {
        loadoutCarousel.scrollBy({
          left: -step(),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener("click", () => {
        loadoutCarousel.scrollBy({
          left: step(),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    }

    loadoutCarousel.addEventListener("scroll", updateMeter, { passive: true });
    window.addEventListener("resize", updateMeter, { passive: true });
    updateMeter();
  }

  function setupCards() {
    const cards = document.querySelectorAll(".loadout-card");
    if (!cards.length || !cardFeedback) return;

    const setCardState = (card, open) => {
      card.classList.toggle("is-flipped", open);
      card.classList.toggle("is-active", open);

      card.querySelectorAll(".flip-trigger").forEach((button) => {
        button.setAttribute("aria-expanded", String(open));
      });

      const front = card.querySelector(".card-front");
      const back = card.querySelector(".card-back");
      const frontButton = card.querySelector(".card-front .flip-trigger");
      const backButton = card.querySelector(".card-back .flip-trigger");

      if (front) front.setAttribute("aria-hidden", String(open));
      if (back) back.setAttribute("aria-hidden", String(!open));
      if (frontButton) frontButton.tabIndex = open ? -1 : 0;
      if (backButton) backButton.tabIndex = open ? 0 : -1;
    };

    const toggleCard = (card) => {
      const willOpen = !card.classList.contains("is-flipped");

      cards.forEach((item) => {
        if (item !== card) setCardState(item, false);
      });

      setCardState(card, willOpen);
      cardFeedback.textContent = willOpen
        ? card.dataset.detail || ""
        : "Geser kartunya. Pencet seal di kartu buat buka sisi belakang.";
    };

    cards.forEach((card) => {
      setCardState(card, false);

      card.addEventListener("click", () => {
        toggleCard(card);
      });
    });
  }

  function buildSignals() {
    if (!signalBoard || !signalText) return;

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 24; index += 1) {
      const button = document.createElement("button");
      const message = signalMessages[index % signalMessages.length];
      const [x, y, size] = signalPositions[index] || [
        randomBetween(8, 92),
        randomBetween(10, 88),
        randomBetween(1.8, 2.5),
      ];

      button.type = "button";
      button.className = "signal-dot";
      button.setAttribute("aria-label", `Sinyal ${index + 1}: ${message}`);
      button.style.setProperty("--delay", `${index * -0.09}s`);
      button.style.setProperty("--x", `${x}%`);
      button.style.setProperty("--y", `${y}%`);
      button.style.setProperty("--size", `${size}rem`);
      button.addEventListener("click", () => {
        const nextMessage = signalMessages[(index + Math.floor(Math.random() * signalMessages.length)) % signalMessages.length];
        document.querySelectorAll(".signal-dot").forEach((dot) => dot.classList.remove("is-active"));
        button.classList.add("is-active");
        button.setAttribute("aria-label", `Sinyal ${index + 1}: ${nextMessage}`);
        signalText.textContent = nextMessage;
      });

      fragment.appendChild(button);
    }

    signalBoard.appendChild(fragment);
  }

  function launchConfetti() {
    if (!confettiLayer || reduceMotion) return;

    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 680 ? 26 : 42;

    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.setProperty("--left", `${randomBetween(8, 92)}%`);
      piece.style.setProperty("--fall-x", `${randomBetween(-80, 80)}px`);
      piece.style.setProperty("--rotation", `${randomBetween(160, 540)}deg`);
      piece.style.setProperty("--fall-duration", `${randomBetween(1.25, 2.1)}s`);
      piece.style.setProperty("--fall-delay", `${randomBetween(0, 0.16)}s`);
      piece.style.setProperty("--confetti-color", confettiColors[index % confettiColors.length]);
      piece.style.setProperty("--w", `${randomBetween(2, 5)}px`);
      piece.style.setProperty("--h", `${randomBetween(12, 24)}px`);
      fragment.appendChild(piece);
    }

    confettiLayer.appendChild(fragment);
    window.setTimeout(() => confettiLayer.replaceChildren(), 2400);
  }

  function igniteVibes() {
    document.body.classList.add("vibes-on");
    if (vibeText) vibeText.textContent = "Hari ini buat Dipi. Enjoy the new level.";
    startBirthdayTrack();
    launchConfetti();
  }

  function setupVibeButton() {
    if (!vibeButton) return;

    let holdTimer = 0;
    let triggered = false;
    let pointerStarted = false;

    const startHold = () => {
      triggered = false;
      pointerStarted = true;
      vibeButton.classList.add("is-holding");
      holdTimer = window.setTimeout(() => {
        triggered = true;
        igniteVibes();
      }, 680);
    };

    const endHold = () => {
      window.clearTimeout(holdTimer);
      vibeButton.classList.remove("is-holding");

      if (!triggered) igniteVibes();
      window.setTimeout(() => {
        pointerStarted = false;
      }, 0);
    };

    vibeButton.addEventListener("pointerdown", startHold);
    vibeButton.addEventListener("pointerup", endHold);
    vibeButton.addEventListener("pointercancel", () => {
      window.clearTimeout(holdTimer);
      vibeButton.classList.remove("is-holding");
      pointerStarted = false;
    });
    vibeButton.addEventListener("pointerleave", () => {
      window.clearTimeout(holdTimer);
      vibeButton.classList.remove("is-holding");
    });
    vibeButton.addEventListener("click", () => {
      if (!pointerStarted) igniteVibes();
    });

    if (quickIgnite) {
      quickIgnite.addEventListener("click", igniteVibes);
    }
  }

  setupTypewriter();
  setupAutoplayMusic();
  buildDust();
  setupScrollReveal();
  setupParallax();
  setupMainCard();
  setupMagneticInk();
  setupCarousel();
  setupCards();
  buildSignals();
  setupVibeButton();
})();
