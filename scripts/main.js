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
