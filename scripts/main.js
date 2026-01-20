"use strict";
const nameEl = document.getElementById("scramble-name");

if (nameEl) {
const originalText = nameEl.dataset.text;

const chars = "!@#$%^&*()_+-=<>?/{}[]ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let scrambleInterval = null;
let assembling = false;

/* --- Continuous scramble --- */
function startScrambling() {
  scrambleInterval = setInterval(() => {
    nameEl.textContent = originalText
      .split("")
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  }, 30);
}

/* --- Assemble into real name --- */
function assembleText() {
  if (assembling) return;
  assembling = true;

  clearInterval(scrambleInterval);
  scrambleInterval = null;

  let iterations = 0;

  const interval = setInterval(() => {
    nameEl.textContent = originalText
      .split("")
      .map((char, index) => {
        if (index < iterations) return originalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    iterations++;

    if (iterations > originalText.length) {
      clearInterval(interval);
      nameEl.textContent = originalText;
      nameEl.style.letterSpacing = "";
      assembling = false;
    }
  }, 30);
}

/* --- Initial state: scrambling immediately --- */
nameEl.style.letterSpacing = "0.06em";
startScrambling();

/* --- Switch to assemble when CSS animation ends --- */
const animatedSection = document.querySelector(".loadanimation");

animatedSection.addEventListener(
  "animationend",
  () => {
    assembleText();
  },
  { once: true }
);

/* --- Optional: re-trigger on hover --- */
nameEl.addEventListener("mouseenter", () => {
  if (assembling || scrambleInterval) return;
  startScrambling();
  setTimeout(assembleText, 500);
});

nameEl.addEventListener("click", () => {
  if (assembling || scrambleInterval) return;
  startScrambling();
  setTimeout(assembleText, 500);
});
}

  // Fetch current year
  document.getElementById("year").textContent =
  new Date().getFullYear();

  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    // Use Font Awesome icons
	  toggleBtn.innerHTML =
	    theme === 'dark'
	      ? '<i class="fa-solid fa-circle"></i>'   // dark active, show light toggle
	      : '<i class="fa-solid fa-circle-half-stroke"></i>'; // light active, show dark toggle
   }

  // Initial theme
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Toggle on click
  toggleBtn.addEventListener('click', () => {
    const current =
      root.getAttribute('data-theme');
	  const next = current === 'dark' ? 'light' : 'dark';
	  setTheme(next)
    localStorage.setItem('theme', next);
  });

  // Scroll animations
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {threshold: 0.1, rootMargin: "0px 0px -50px 0px"};
    const appearOnScroll = new IntersectionObserver(function(entries, observer){
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      });
    }, appearOptions);

    faders.forEach(fader => {appearOnScroll.observe(fader);});

    // Animate skill bars
    const skillBars = document.querySelectorAll('.progress-bar div');
    window.addEventListener('scroll', ()=>{
      skillBars.forEach(bar=>{
        const barTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if(barTop < windowHeight-50){
          bar.style.width = bar.getAttribute('data-width');
        }
      });
    });

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const muteBtn = document.getElementById('music-mute');

/* ===== INITIAL ICON STATE ===== */

// Mute / Unmute icon
muteBtn.innerHTML = music.muted
  ? '<i class="fa-solid fa-volume-mute"></i>' // muted
  : '<i class="fa-solid fa-volume-up"></i>';  // unmuted

// Play / Pause icon
musicBtn.innerHTML = music.paused
  ? '<i class="fa-solid fa-play-circle"></i>'  // paused
  : '<i class="fa-solid fa-pause-circle"></i>'; // playing

/* ===== PLAY / PAUSE ===== */
musicBtn.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    musicBtn.innerHTML = '<i class="fa-solid fa-pause-circle"></i>';
  } else {
    music.pause();
    musicBtn.innerHTML = '<i class="fa-solid fa-play-circle"></i>';
  }
});

/* ===== MUTE / UNMUTE ===== */
muteBtn.addEventListener('click', () => {
  music.muted = !music.muted;

  muteBtn.innerHTML = music.muted
    ? '<i class="fa-solid fa-volume-mute"></i>'
    : '<i class="fa-solid fa-volume-up"></i>';

  musicBtn.style.opacity = music.muted ? "0.4" : "1";
});

const canvas = document.getElementById("flow-bg");
const ctx = canvas.getContext("2d");

let w, h;
let mouse = { x: -1000, y: -1000 };
let t = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Cursor / touch tracking
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("touchmove", e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: true });

// Respect reduced motion (DO NOT hide canvas)
const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile performance tuning
const isMobile = window.innerWidth < 768;

// DRAW LOOP — ALWAYS RUNS
function draw() {
  console.log("drawing", t);
  if (prefersReducedMotion) return;

  ctx.clearRect(0, 0, w, h);
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  const step = isMobile ? 6 : 3;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {

      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const angle =
        Math.sin(x * 0.002 + t) +
        Math.cos(y * 0.002 + t) +
        Math.sin(dist * 0.01);

      const value = 120 + Math.sin(angle) * 40;

      const i = (y * w + x) * 4;
      data[i] = value;
      data[i + 1] = value + 10;
      data[i + 2] = value + 5;
      data[i + 3] = 20;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  t += isMobile ? 0.0015 : 0.003;

  requestAnimationFrame(draw);
}

// START IMMEDIATELY
draw();
