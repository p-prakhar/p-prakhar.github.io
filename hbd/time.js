// Prefer the server's clock so changing the device time doesn't skip the countdown.
export async function serverNow() {
  try {
    const r = await fetch(`${location.pathname}?t=${Date.now()}`, { method: "HEAD", cache: "no-store" });
    const t = Date.parse(r.headers.get("Date") || "");
    if (!Number.isNaN(t)) return { now: t, source: "server" };
  } catch { /* offline: fall back */ }
  return { now: Date.now(), source: "device" };
}

export function remaining(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
