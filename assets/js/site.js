"use strict";

const THEME_STORAGE_KEY = "prakhar-theme";

function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function dailyIndex(items, date = new Date()) {
  if (!Array.isArray(items) || items.length === 0) return -1;
  return hashString(utcDayKey(date)) % items.length;
}

function normalizeTheme(value) {
  return value === "light" || value === "dark" ? value : null;
}

function noteFrequency(midi) {
  return Math.round(440 * (2 ** ((Number(midi) - 69) / 12)) * 100) / 100;
}

function storedTheme() {
  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch (_error) {
    return null;
  }
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (_error) {
    // Storage can be unavailable in privacy modes. The in-memory theme still works.
  }
}

function systemTheme() {
  if (!window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeButton(button, theme) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = button.querySelector("[data-theme-label]");
  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  button.setAttribute("aria-pressed", String(theme === "dark"));
  if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
}

function initThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  let theme = normalizeTheme(document.documentElement.dataset.theme) || storedTheme() || systemTheme();
  document.documentElement.dataset.theme = theme;
  updateThemeButton(button, theme);

  button.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    persistTheme(theme);
    updateThemeButton(button, theme);
  });

  if (window.matchMedia) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener?.("change", (event) => {
      if (storedTheme()) return;
      theme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      updateThemeButton(button, theme);
    });
  }
}

function initWritingFilters() {
  const buttons = Array.from(document.querySelectorAll("[data-writing-filter]"));
  const rows = Array.from(document.querySelectorAll("[data-article-category]"));
  if (buttons.length === 0 || rows.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.writingFilter || "all";

      buttons.forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      rows.forEach((row) => {
        row.hidden = selected !== "all" && row.dataset.articleCategory !== selected;
      });
    });
  });
}

function initDailyMusic() {
  const root = document.querySelector("[data-music-pick]");
  const payload = root?.querySelector("[data-music-data]");
  if (!root || !payload) return;

  let tracks;
  try {
    tracks = JSON.parse(payload.textContent);
  } catch (_error) {
    return;
  }

  const index = dailyIndex(tracks);
  if (index < 0) {
    root.hidden = true;
    return;
  }

  const track = tracks[index];
  const title = root.querySelector("[data-music-title]");
  const artist = root.querySelector("[data-music-artist]");
  const link = root.querySelector("[data-music-link]");
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;
  if (link) {
    if (track.url) {
      link.href = track.url;
    } else {
      link.removeAttribute("href");
    }
  }
}

function initStarNotes() {
  document.querySelectorAll("[data-star-note]").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const connected = button.classList.toggle("is-connected");
      button.setAttribute("aria-pressed", String(connected));
    });
  });
}

function initPiano() {
  const piano = document.querySelector("[data-piano]");
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!piano || !AudioContextClass) return;

  const status = piano.querySelector("[data-piano-status]");
  let audioContext = null;

  function play(button) {
    try {
      audioContext ||= new AudioContextClass();
      const now = audioContext.currentTime;
      const frequency = noteFrequency(button.dataset.midi);
      const master = audioContext.createGain();
      const sine = audioContext.createOscillator();
      const triangle = audioContext.createOscillator();
      const triangleGain = audioContext.createGain();

      sine.type = "sine";
      triangle.type = "triangle";
      sine.frequency.setValueAtTime(frequency, now);
      triangle.frequency.setValueAtTime(frequency, now);
      triangleGain.gain.setValueAtTime(0.18, now);
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      sine.connect(master);
      triangle.connect(triangleGain);
      triangleGain.connect(master);
      master.connect(audioContext.destination);
      sine.start(now);
      triangle.start(now);
      sine.stop(now + 0.36);
      triangle.stop(now + 0.36);

      button.classList.add("is-playing");
      window.setTimeout(() => button.classList.remove("is-playing"), 180);
      if (status) status.textContent = button.getAttribute("aria-label");
    } catch (_error) {
      if (status) status.textContent = "Audio is unavailable in this browser.";
    }
  }

  piano.querySelectorAll("[data-piano-key]").forEach((button) => {
    button.addEventListener("click", () => play(button));
  });
}

function initPrintControls() {
  document.querySelectorAll("[data-print]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => window.print());
  });
}

function initSite() {
  [
    initThemeToggle,
    initWritingFilters,
    initDailyMusic,
    initStarNotes,
    initPiano,
    initPrintControls,
  ].forEach((initializer) => {
    try {
      initializer();
    } catch (error) {
      console.warn(`Skipped ${initializer.name}:`, error);
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    utcDayKey,
    hashString,
    dailyIndex,
    normalizeTheme,
    noteFrequency,
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite, {once: true});
  } else {
    initSite();
  }
}
