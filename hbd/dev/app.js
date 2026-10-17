import { unlock, fetchOpen } from "./crypto.js";
import { serverNow, remaining } from "./time.js";
import { render } from "./render.js";

const $ = sel => document.querySelector(sel);
const setState = s => { document.body.dataset.state = s; };

function countdown(unlockAt, offset) {
  return new Promise(resolve => {
    $("#countdown").hidden = false;
    setState("countdown");
    let timer = null;
    const tick = () => {
      const left = unlockAt - (Date.now() + offset);
      if (left <= 0) {
        if (timer) clearInterval(timer);
        $("#countdown").hidden = true;
        resolve();
        return true;
      }
      const r = remaining(left);
      $("#cd-d").textContent = r.d;
      $("#cd-h").textContent = r.h;
      $("#cd-m").textContent = r.m;
      $("#cd-s").textContent = r.s;
      return false;
    };
    if (!tick()) timer = setInterval(tick, 1000);
  });
}

function showLock(lock) {
  $("#hint").textContent = lock.hint || "";
  $("#hint").hidden = true;
  let misses = 0;
  $("#lock").hidden = false;
  setState("lock");
  const form = $("#lock-form"), btn = $("#open-btn"), msg = $("#lock-msg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!window.crypto || !crypto.subtle) {
      msg.textContent = "this link isn't secure; open the https:// address instead 🔒";
      return;
    }
    btn.disabled = true;
    msg.textContent = "checking…";
    try {
      const key = await unlock(lock, $("#pass").value);
      if (!key) {
        msg.textContent = "nope! 🐇 try again";
        if (++misses >= 2 && lock.hint) { $("#hint").hidden = false; msg.textContent = "nope! here's a hint 🐇"; }
        form.classList.remove("wobble");
        void form.offsetWidth;
        form.classList.add("wobble");
        return;
      }
      const data = JSON.parse(new TextDecoder().decode(await fetchOpen(key, `${lock.base || ""}data.bin?v=${Date.now()}`, { cache: "no-store" })));
      $("#lock").hidden = true;
      render($("#story"), data, pid => fetchOpen(key, `${lock.base || ""}p/${pid}.bin`));
      setState("open");
      window.scrollTo(0, 0);
    } catch {
      msg.textContent = "something went wrong while loading. Try again?";
    } finally {
      btn.disabled = false;
    }
  });
}

async function main() {
  const lock = await (await fetch(`lock.json?v=${Date.now()}`, { cache: "no-store" })).json();
  if (lock.unlockAt) {
    const { now } = await serverNow();
    if (now < lock.unlockAt) await countdown(lock.unlockAt, now - Date.now());
  }
  showLock(lock);
}

main().catch(() => {
  setState("error");
  document.body.append("Could not load this page.");
});
