(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js-enabled");

  const particleField = document.querySelector("#particleField");
  const lightsGrid = document.querySelector("#lightsGrid");
  const vibeButton = document.querySelector("#vibeButton");
  const vibeText = document.querySelector("#vibeText");
  const confettiLayer = document.querySelector("#confettiLayer");
  const liquidButtons = document.querySelectorAll(".liquid-button");
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  const typeTarget = document.querySelector("[data-typewriter]");

  const microTexts = [
    "Still here",
    "One squad",
    "Keep going",
    "New chapter",
    "You got this",
    "Angkatan 4",
  ];

  const confettiColors = ["#ffd58a", "#54c2ff", "#8d7dff", "#77f3ff", "#f7f8ff"];

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
    }, 32);
  }

  function buildParticles() {
    if (!particleField || reduceMotion) return;

    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 640 ? 34 : 64;

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${randomBetween(0, 100)}%`;
      particle.style.top = `${randomBetween(0, 100)}%`;
      particle.style.setProperty("--duration", `${randomBetween(6, 13)}s`);
      particle.style.setProperty("--delay", `${randomBetween(-9, 0)}s`);
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
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
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

  function setupLiquidButtons() {
    liquidButtons.forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        button.style.setProperty("--mx", `${x}%`);
        button.style.setProperty("--my", `${y}%`);
      });
    });
  }

  function buildLights() {
    if (!lightsGrid) return;

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 21; index += 1) {
      const button = document.createElement("button");
      const core = document.createElement("span");
      const label = document.createElement("span");
      const text = microTexts[index % microTexts.length];

      button.type = "button";
      button.className = "light-orb";
      button.setAttribute("aria-label", `Light ${index + 1}: ${text}`);
      button.style.setProperty("--delay", `${index * -0.13}s`);

      core.className = "light-core";
      label.className = "orb-label";
      label.textContent = text;

      button.append(core, label);

      button.addEventListener("pointerenter", () => setLightMessage(button, label, index));
      button.addEventListener("focus", () => setLightMessage(button, label, index));
      button.addEventListener("click", () => {
        setLightMessage(button, label, index);
        pulseActive(button);
      });

      fragment.appendChild(button);
    }

    lightsGrid.appendChild(fragment);
  }

  function setLightMessage(button, label, index) {
    const text = microTexts[(index + Math.floor(Math.random() * microTexts.length)) % microTexts.length];
    label.textContent = text;
    button.setAttribute("aria-label", `Light ${index + 1}: ${text}`);
  }

  function pulseActive(button) {
    button.classList.add("is-active");
    window.setTimeout(() => button.classList.remove("is-active"), 900);
  }

  function setupParallax() {
    if (!parallaxItems.length || reduceMotion) return;

    let pointerX = 0;
    let pointerY = 0;
    let rafId = null;

    function update() {
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax || 0.12);
        item.style.translate = `${pointerX * speed}px ${pointerY * speed}px`;
      });
      rafId = null;
    }

    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 28;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 28;

        if (!rafId) rafId = window.requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  function launchConfetti() {
    if (!confettiLayer || reduceMotion) return;

    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 640 ? 28 : 46;

    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("span");
      const color = confettiColors[index % confettiColors.length];
      const width = randomBetween(5, 8);
      const height = randomBetween(8, 16);

      piece.className = "confetti-piece";
      piece.style.setProperty("--left", `${randomBetween(6, 94)}%`);
      piece.style.setProperty("--fall-x", `${randomBetween(-90, 90)}px`);
      piece.style.setProperty("--rotation", `${randomBetween(160, 560)}deg`);
      piece.style.setProperty("--fall-duration", `${randomBetween(1.35, 2.25)}s`);
      piece.style.setProperty("--fall-delay", `${randomBetween(0, 0.18)}s`);
      piece.style.setProperty("--confetti-color", color);
      piece.style.setProperty("--w", `${width}px`);
      piece.style.setProperty("--h", `${height}px`);
      fragment.appendChild(piece);
    }

    confettiLayer.appendChild(fragment);

    window.setTimeout(() => {
      confettiLayer.replaceChildren();
    }, 2600);
  }

  function setupVibes() {
    if (!vibeButton || !vibeText) return;

    vibeButton.addEventListener("click", () => {
      document.body.classList.add("vibes-on");
      vibeText.textContent = "Hari ini buat Dipi. Enjoy the new level.";
      launchConfetti();
    });
  }

  setupTypewriter();
  buildParticles();
  setupScrollReveal();
  setupSmoothScroll();
  setupLiquidButtons();
  buildLights();
  setupParallax();
  setupVibes();
})();
