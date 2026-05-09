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
  const vibeButton = document.querySelector("#vibeButton");
  const quickIgnite = document.querySelector("#quickIgnite");
  const vibeText = document.querySelector("#vibeText");
  const parallaxItems = document.querySelectorAll("[data-depth]");
  const magneticItems = document.querySelectorAll(".ink-button, .loadout-card");

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

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

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

  function setupSmoothScroll() {
    document.querySelectorAll("[data-scroll]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });
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

  function setupCards() {
    const cards = document.querySelectorAll(".loadout-card");
    if (!cards.length || !cardFeedback) return;

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((item) => item.classList.remove("is-active"));
        card.classList.add("is-active");
        cardFeedback.textContent = card.dataset.detail || "";
      });
    });
  }

  function buildSignals() {
    if (!signalBoard || !signalText) return;

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 24; index += 1) {
      const button = document.createElement("button");
      const message = signalMessages[index % signalMessages.length];

      button.type = "button";
      button.className = "signal-dot";
      button.setAttribute("aria-label", `Sinyal ${index + 1}: ${message}`);
      button.style.setProperty("--delay", `${index * -0.09}s`);
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
  buildDust();
  setupScrollReveal();
  setupSmoothScroll();
  setupParallax();
  setupMagneticInk();
  setupCards();
  buildSignals();
  setupVibeButton();
})();
