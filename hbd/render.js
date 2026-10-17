const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "style") n.style.cssText = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c instanceof Node ? c : String(c));
  return n;
};

const MONTH = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" });
const DAY = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" });
const LONG = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", timeZone: "UTC" });
const utc = d => new Date(`${d}T00:00:00Z`);
const ABOUT = { favourite: "fav", dream: "dream", wish: "wish", dislike: "nope", habit: "habit", plan: "life motto" };
const FLOATERS = ["🍍", "🐇", "🌹", "🎈", "🎂", "🍎", "💌", "🎉", "✨"];
const rand = (a, b) => a + Math.random() * (b - a);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function markdown(src) {
  const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  return esc(src).split(/\n{2,}/).map(p => `<p>${p
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")}</p>`).join("");
}

export function confetti(n = 90) {
  if (reduced()) return;
  const box = el("div", { class: "confetti", "aria-hidden": "true" });
  for (let i = 0; i < n; i++) {
    const s = el("i");
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 0.8}s`;
    s.style.setProperty("--hue", Math.floor(Math.random() * 360));
    s.style.setProperty("--drift", `${rand(-60, 60)}px`);
    box.append(s);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 4500);
}

let io = null;
function lazy(img, loadPhoto, type = "image/webp") {
  io ??= new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const target = e.target;
      io.unobserve(target);
      loadPhoto(target.dataset.pid)
        .then(buf => { target.src = URL.createObjectURL(new Blob([buf], { type: target.dataset.type || type })); target.classList.add("loaded"); })
        .catch(() => target.classList.add("failed"));
    }
  }, { rootMargin: "600px 600px" });
  io.observe(img);
}

const section = (id, title, ...body) =>
  el("section", { id, class: "chapter" }, title ? el("h2", {}, title) : null, ...body);

function floaters() {
  const box = el("div", { class: "floaters", "aria-hidden": "true" });
  for (let i = 0; i < 18; i++) {
    box.append(el("span", {
      style: `left:${rand(0, 100)}%;animation-delay:${rand(0, 14)}s;animation-duration:${rand(12, 22)}s;font-size:${rand(18, 34)}px`,
    }, FLOATERS[i % FLOATERS.length]));
  }
  return box;
}

function opening(d) {
  const x = d.extras;
  let i = 0;
  const letters = "Happy Birthday".split(" ").map(word => el("span", { class: "word" },
    [...word].map(ch => el("span", { class: "bounce", style: `animation-delay:${i++ * 0.07}s` }, ch))));
  return el("section", { id: "opening", class: "hero" },
    x.marquee ? el("div", { class: "marquee", "aria-hidden": "true" }, el("span", {}, x.marquee.repeat(4))) : null,
    el("p", { class: "eyebrow" }, `${LONG.format(utc(d.meta.date))} · the real one`),
    el("h1", {}, el("span", { class: "hb" }, letters), d.meta.herName ? el("span", { class: "name wiggle" }, `${d.meta.herName}!`) : null),
    d.meta.opening ? el("p", { class: "lede" }, d.meta.opening) : null,
    el("button", { class: "party", type: "button", onclick: () => confetti(140) }, "🎉 more confetti?"),
    el("p", { class: "scroll-cue" }, "scroll down, birthday girl ↓"));
}

function onTime(d) {
  const x = d.extras;
  if (!x.lastYear?.length) return null;
  return section("ontime", x.onTimeTitle || "Last year, I was too early",
    el("div", { class: "phone" },
      el("div", { class: "phone-top" }, x.lastYearLabel || "last year"),
      x.lastYear.map(b => el("div", { class: `bubble ${b.from === "her" ? "her" : "me"}` }, b.text, el("small", {}, b.time || "")))),
    x.onTime ? el("p", { class: "stamp" }, x.onTime) : null);
}

function cake(d) {
  const n = Number(d.extras.candles) || 0;
  if (n < 1) return null;
  let left = n;
  const msg = el("p", { class: "wish-msg", hidden: true }, d.extras.wishMsg || "Wish made. It's legally binding now. ✨");
  const box = el("div", { class: "cake" });
  const candles = el("div", { class: "candles" }, Array.from({ length: n }, () =>
    el("button", { class: "candle", type: "button", "aria-label": "blow out candle", onclick: e => {
      const c = e.currentTarget;
      if (c.classList.contains("out")) return;
      c.classList.add("out");
      if (--left === 0) { box.classList.add("wished"); msg.hidden = false; confetti(160); }
    } }, el("span", { class: "flame" }))));
  box.append(candles, el("div", { class: "tier top" }), el("div", { class: "tier mid" }), el("div", { class: "tier base" }));
  return section("cake", "Make a wish", el("p", { class: "hint-small" }, "tap each candle to blow it out 🌬️"), box, msg);
}

function balloons(d) {
  const list = d.extras.balloons || [];
  if (!list.length) return null;
  const hues = [340, 20, 45, 160, 200, 270];
  return section("balloons", "Pop a balloon!",
    el("p", { class: "hint-small" }, "there's something inside every one 🎈"),
    el("div", { class: "balloon-field" }, list.map((t, i) =>
      el("button", { class: "balloon", type: "button", style: `--h:${hues[i % hues.length]};animation-delay:${i * 0.4}s`,
        onclick: e => { const b = e.currentTarget; if (b.classList.contains("popped")) return; b.classList.add("popped"); b.querySelector(".secret").hidden = false; } },
        el("span", { class: "skin", "aria-hidden": "true" }), el("span", { class: "secret", hidden: true }, t)))));
}

function stats(d) {
  const list = d.extras.stats || [];
  if (!list.length) return null;
  const fmt = new Intl.NumberFormat("en");
  const value = s => s.since ? Math.floor((Date.now() - Date.parse(`${s.since}T00:00:00Z`)) / 86400000) : Number(s.n) || 0;
  const cards = list.map(s => el("div", { class: "stat" },
    el("b", { class: "stat-n", "data-n": value(s), "data-prefix": s.prefix || "", "data-suffix": s.suffix || "" }, "0"),
    el("span", { class: "stat-label" }, s.label),
    s.note ? el("small", {}, s.note) : null));
  const obs = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      obs.unobserve(e.target);
      const b = e.target.querySelector(".stat-n"), target = Number(b.dataset.n), t0 = performance.now(), dur = 1400;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        b.textContent = b.dataset.prefix + fmt.format(Math.round(target * (1 - Math.pow(1 - p, 3)))) + b.dataset.suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.3 });
  cards.forEach(c => obs.observe(c));
  return section("stats", d.extras.statsTitle || "Birthday girl, by the numbers", el("div", { class: "stats" }, cards));
}

function how(d) {
  const h = d.howItStarted || {};
  if (!h.text) return null;
  return section("how", "How it started", el("p", { class: "story-card" }, h.text));
}

function pineapple(d) {
  if (!d.extras.pineapple) return null;
  return section("pineapple", "The Pineapple Files 🍍",
    el("div", { class: "file" }, el("span", { class: "file-tab" }, "CLASSIFIED"), el("p", {}, d.extras.pineapple)));
}

function lightbox(src, caption) {
  const box = el("div", { class: "lightbox", role: "dialog", onclick: () => box.remove() },
    el("img", { src, alt: caption || "" }), caption ? el("p", {}, caption) : null);
  document.body.append(box);
}

function wall(d, loadPhoto) {
  const pids = Object.keys(d.photos).sort((a, b) => d.photos[a].date.localeCompare(d.photos[b].date));
  if (!pids.length) return null;
  return section("wall", "Photos!", el("div", { class: "polaroids" }, pids.map((pid, i) => {
    const info = d.photos[pid];
    const img = info.video
      ? el("video", { "data-pid": pid, "data-type": info.type, playsinline: true, controls: true, muted: true, loop: true, autoplay: true, preload: "metadata" })
      : el("img", { alt: info.caption || "", width: info.w, height: info.h, "data-pid": pid });
    if (info.video) img.muted = true;
    lazy(img, loadPhoto);
    return el("figure", { class: "polaroid", style: `--tilt:${(i % 2 ? 1 : -1) * rand(1.5, 4.5)}deg`,
      onclick: () => !info.video && img.src && lightbox(img.src, info.caption) },
      img, el("figcaption", {}, info.caption || DAY.format(utc(info.date))));
  })));
}

function timeline(d) {
  if (!d.moments.length) return null;
  const months = new Map();
  for (const m of d.moments) {
    const k = m.date.slice(0, 7);
    if (!months.has(k)) months.set(k, []);
    months.get(k).push(m);
  }
  return section("timeline", "Little moments", ...[...months.keys()].sort().map(k =>
    el("div", { class: "month" },
      el("h3", { class: "month-title" }, MONTH.format(utc(`${k}-01`))),
      months.get(k).map(m => el("article", { class: `moment kind-${String(m.kind).replace(/[^a-z-]/g, "")}` },
        el("p", { class: "moment-date" }, DAY.format(utc(m.date))),
        el("h4", {}, m.title),
        el("p", {}, m.summary),
        m.quote ? el("blockquote", { class: "quote" }, `“${m.quote}”`) : null)))));
}

function crochet(d) {
  const c = d.extras.crochet;
  if (!c || !c.text) return null;
  const n = Math.max(1, Math.min(12, Number(c.blooms) || 5));
  const colours = ["#ff6fa3", "#ffb03a", "#b07cff", "#4fc3a1", "#ff8a5c", "#6fb8ff"];
  return section("crochet", c.title || "Flowers that never wilt",
    el("div", { class: "stitched" },
      el("div", { class: "garden", "aria-hidden": "true" }, Array.from({ length: n }, (_, i) =>
        el("span", { class: "bloom", style: `--c:${colours[i % colours.length]};animation-delay:${i * 0.3}s` },
          el("span", { class: "petals" }), el("span", { class: "stem" })))),
      el("p", {}, c.text)));
}

function mascot(d) {
  const lines = d.extras.bunnyLines || [];
  if (!lines.length) return null;
  const bubble = el("span", { class: "mascot-bubble", hidden: true });
  let last = -1, timer = null;
  return el("button", { class: "mascot", type: "button", "aria-label": "tap the bunny", onclick: e => {
    const b = e.currentTarget;
    let i = Math.floor(Math.random() * lines.length);
    if (lines.length > 1 && i === last) i = (i + 1) % lines.length;
    last = i;
    bubble.textContent = lines[i];
    bubble.hidden = false;
    b.classList.remove("hop"); void b.offsetWidth; b.classList.add("hop");
    clearTimeout(timer);
    timer = setTimeout(() => { bubble.hidden = true; }, 3500);
  } }, bubble, el("span", { class: "mascot-face", "aria-hidden": "true" }, "🐇"));
}

function scratchCard(text, i) {
  const key = `hbd-coupon-${i}`;
  const store = { get: () => { try { return localStorage.getItem(key); } catch { return null; } },
                  set: v => { try { localStorage.setItem(key, v); } catch { /* private mode */ } } };
  const card = el("div", { class: "coupon" });
  const redeem = el("button", { class: "redeem", type: "button", onclick: () => { card.classList.add("redeemed"); store.set("redeemed"); confetti(60); } }, "redeem 💌");
  const canvas = el("canvas", { "aria-label": "scratch to reveal" });
  const reveal = () => { if (card.classList.contains("revealed")) return; card.classList.add("revealed"); confetti(40); };
  card.append(el("p", { class: "coupon-head" }, "BIRTHDAY COUPON"), el("p", { class: "coupon-text" }, text), redeem, el("span", { class: "stamp-redeemed" }, "REDEEMED ✓"), canvas);
  if (store.get() === "redeemed") card.classList.add("revealed", "redeemed");
  requestAnimationFrame(() => {
    const r = card.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width)); canvas.height = Math.max(1, Math.round(r.height));
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, "#c9c3d6"); g.addColorStop(.5, "#efeaf6"); g.addColorStop(1, "#bdb6cc");
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#6b6380"; ctx.font = "700 16px Nunito, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("scratch me ✨", canvas.width / 2, canvas.height / 2 + 6);
    ctx.globalCompositeOperation = "destination-out";
    let down = false, strokes = 0;
    const scratch = ev => {
      const b = canvas.getBoundingClientRect();
      ctx.beginPath(); ctx.arc(ev.clientX - b.left, ev.clientY - b.top, 22, 0, Math.PI * 2); ctx.fill();
      if (++strokes % 6) return;
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let k = 3; k < px.length; k += 64) if (px[k] === 0) clear++;
      if (clear / (px.length / 64) > 0.45) reveal();
    };
    canvas.addEventListener("pointerdown", ev => { down = true; canvas.setPointerCapture?.(ev.pointerId); scratch(ev); });
    canvas.addEventListener("pointermove", ev => down && scratch(ev));
    canvas.addEventListener("pointerup", () => { down = false; });
    canvas.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") reveal(); });
    canvas.tabIndex = 0;
  });
  return card;
}

function coupons(d) {
  const list = d.extras.coupons || [];
  if (!list.length) return null;
  return section("coupons", "Birthday coupons",
    el("p", { class: "hint-small" }, "scratch to reveal, redeem whenever you want 🎟️"),
    el("div", { class: "coupons" }, list.map(scratchCard)));
}

function dice(d) {
  const plans = d.extras.plans || [];
  if (!plans.length) return null;
  const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const face = el("span", { class: "die", "aria-hidden": "true" }, "🎲");
  const out = el("p", { class: "dice-result", "aria-live": "polite" });
  let rolling = false;
  const btn = el("button", { class: "dice-btn", type: "button", onclick: () => {
    if (rolling) return;
    rolling = true; out.textContent = ""; face.classList.add("rolling");
    let n = 0;
    const spin = setInterval(() => {
      face.textContent = faces[Math.floor(Math.random() * 6)];
      if (++n >= (reduced() ? 1 : 12)) {
        clearInterval(spin); face.classList.remove("rolling");
        out.textContent = plans[Math.floor(Math.random() * plans.length)];
        rolling = false; confetti(30);
      }
    }, 80);
  } }, "roll the dice 🎲");
  return section("dice", d.extras.diceTitle || "What's our next date?", el("div", { class: "dice-box" }, face, btn), out);
}

function about(d) {
  if (!d.aboutHer.length) return null;
  return section("about", "Stuff I know about you",
    el("ul", { class: "stickers" }, d.aboutHer.map((x, i) =>
      el("li", { class: "sticker", style: `--tilt:${(i % 3 - 1) * 3}deg` },
        el("span", { class: "sticker-kind" }, ABOUT[x.kind] || x.kind), el("span", {}, x.text)))));
}

function quiz(d) {
  const qs = d.extras.quiz || [];
  if (!qs.length) return null;
  return section("quiz", "Pop quiz! (no pressure)", qs.map((q, qi) => {
    const fb = el("p", { class: "feedback", "aria-live": "polite" });
    return el("div", { class: "quiz-q" },
      el("p", { class: "q" }, `${qi + 1}. ${q.q}`),
      el("div", { class: "opts" }, q.options.map((o, oi) => el("button", { class: "opt", type: "button", onclick: e => {
        const right = oi === q.answer;
        e.currentTarget.parentElement.querySelectorAll(".opt").forEach(b => b.classList.remove("right", "wrong"));
        e.currentTarget.classList.add(right ? "right" : "wrong");
        fb.textContent = right ? q.yay : q.nay;
        if (right) confetti(50);
      } }, o))),
      fb);
  }));
}

function embedUrl(m) {
  try {
    const u = new URL(m.url);
    if (m.service === "youtube") {
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v)}` : null;
    }
    if (m.service === "spotify" && u.hostname === "open.spotify.com") {
      const [, type, id] = u.pathname.split("/");
      return type && id ? `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}` : null;
    }
  } catch { /* not a URL */ }
  return null;
}

function music(d) {
  const tracks = d.music.filter(m => /^https:\/\//.test(m.url));
  if (!tracks.length) return null;
  return section("music", "Your soundtrack 🎧", el("ol", { class: "tracks" }, tracks.map((m, i) => {
    const embed = embedUrl(m);
    const title = m.title || (m.fromHer ? "a song you sent me" : "a song for you");
    const play = embed
      ? el("button", { class: "play", type: "button", onclick: e => e.currentTarget.replaceWith(
          el("iframe", { src: embed, class: "embed", allow: "encrypted-media; autoplay", allowfullscreen: true,
            referrerpolicy: "strict-origin-when-cross-origin", title })) }, "▶ play")
      : el("a", { href: m.url, target: "_blank", rel: "noopener noreferrer", class: "play" }, "open ↗");
    return el("li", { class: "track" },
      el("span", { class: "vinyl", "aria-hidden": "true" }, String(i + 1).padStart(2, "0")),
      el("div", { class: "track-meta" }, el("span", { class: "track-title" }, title),
        m.artist ? el("span", { class: "track-artist" }, m.artist) : null,
        m.note ? el("span", { class: "track-note" }, m.note) : null),
      play);
  })));
}

function jokes(d) {
  const lang = d.extras.language || [];
  const cards = lang.length
    ? lang.map(c => ({ front: [el("span", { class: "card-emoji" }, c.emoji || "💬"), el("span", { class: "card-phrase" }, c.front)], back: c.back }))
    : d.jokes.map((j, i) => ({ front: ["🍍", "🐇", "🌹", "🤧", "☕", "🎂"][i % 6], back: j }));
  if (!cards.length && !d.nicknames.length) return null;
  return section("jokes", lang.length ? "Our little language (tap to flip)" : "Inside jokes (tap to flip)",
    d.nicknames.length ? el("div", { class: "nicks" },
      el("p", { class: "nick-head" }, "official list of names (pink: what I call you · yellow: what you call me):"),
      d.nicknames.map((n, i) => el("span", { class: `nick ${n.by === "B" ? "his" : "hers"}`, style: `--tilt:${(i % 3 - 1) * 4}deg` }, n.text))) : null,
    cards.length ? el("div", { class: "cards" }, cards.map(c =>
      el("button", { class: "card", type: "button", onclick: e => e.currentTarget.classList.toggle("flipped") },
        el("span", { class: "front" }, c.front),
        el("span", { class: "back" }, c.back)))) : null);
}

function letter(d) {
  if (!d.letter.trim()) return null;
  const body = el("div", { class: "letter-body", hidden: true });
  body.innerHTML = markdown(d.letter);
  const env = el("button", { class: "envelope", type: "button", "aria-label": "open the letter", onclick: () => {
    env.classList.add("opening");
    setTimeout(() => { env.remove(); body.hidden = false; confetti(180); }, reduced() ? 0 : 650);
  } }, el("span", { class: "flap" }), el("span", { class: "seal" }, "💌"), el("span", { class: "env-label" }, "open me"));
  return section("letter", "One more thing…", env, body,
    d.extras.signoff ? el("p", { class: "signoff" }, d.extras.signoff) : null);
}

export function render(root, data, loadPhoto) {
  data.extras = data.extras || {};
  document.documentElement.dataset.theme = data.meta.theme || "blush";
  document.body.append(floaters());
  const m = mascot(data);
  if (m) document.body.append(m);
  root.replaceChildren(...[opening(data), onTime(data), cake(data), balloons(data), stats(data), how(data),
    pineapple(data), wall(data, loadPhoto), timeline(data), crochet(data), about(data), coupons(data), dice(data), quiz(data), music(data), jokes(data),
    letter(data)].filter(Boolean));
  root.hidden = false;
  setTimeout(() => confetti(120), 400);
}
