"use strict";

const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");
const music = document.getElementById("bg-music");
const musicButton = document.getElementById("music-toggle");
const muteButton = document.getElementById("music-mute");
const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeButton) {
    themeButton.innerHTML = theme === "dark"
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
}
const storedTheme = localStorage.getItem("theme");
const initialTheme = storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme);
themeButton?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

const nameElement = document.getElementById("scramble-name");
if (nameElement && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const original = nameElement.dataset.text || nameElement.textContent;
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  let timer;
  let running = false;
  function scramble() {
    if (running) return;
    running = true;
    let frame = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      nameElement.textContent = original.split("").map((char, index) =>
        index < frame / 2 ? char : characters[Math.floor(Math.random() * characters.length)]
      ).join("");
      frame++;
      if (frame > original.length * 2) {
        clearInterval(timer);
        nameElement.textContent = original;
        running = false;
      }
    }, 38);
  }
  window.addEventListener("load", () => window.setTimeout(scramble, 350), { once:true });
  nameElement.addEventListener("mouseenter", scramble);
  nameElement.addEventListener("focus", scramble);
}

if (music && musicButton && muteButton) {
  const updateMusicControls = () => {
    musicButton.innerHTML = music.paused
      ? '<i class="fa-solid fa-play" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
    muteButton.innerHTML = music.muted
      ? '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>';
    musicButton.setAttribute("aria-label", music.paused ? "Play background music" : "Pause background music");
    muteButton.setAttribute("aria-label", music.muted ? "Unmute background music" : "Mute background music");
  };
  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try { await music.play(); } catch (error) { console.warn("Audio playback requires a user gesture.", error); }
    } else music.pause();
    updateMusicControls();
  });
  muteButton.addEventListener("click", () => { music.muted = !music.muted; updateMusicControls(); });
  music.addEventListener("play", updateMusicControls);
  music.addEventListener("pause", updateMusicControls);
  updateMusicControls();
}

// Lightweight ambient canvas: draw a few soft, drifting lines rather than
// allocating a full-screen ImageData buffer on every animation frame.
const canvas = document.getElementById("flow-bg");
const context = canvas?.getContext("2d", { alpha:true });
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canvas && context && !reducedMotion) {
  let width = 0, height = 0, frame = 0;
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive:true });
  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = height * (.22 + i * .14) + Math.sin(frame * .004 + i) * 18;
      context.beginPath();
      context.strokeStyle = root.getAttribute("data-theme") === "dark"
        ? "rgba(169,197,174,.14)" : "rgba(88,119,101,.12)";
      for (let x = 0; x <= width + 12; x += 12) {
        const py = y + Math.sin(x * .006 + frame * .006 + i) * 13;
        if (x === 0) context.moveTo(x, py); else context.lineTo(x, py);
      }
      context.stroke();
    }
    frame++;
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
