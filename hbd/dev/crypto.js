// Must match hbd-tools/hbdtools/cryptobox.py.
export function normalise(p) {
  return p.normalize("NFC")
    .replace(/[\u2018\u2019\u201b\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .trim().toLowerCase().replace(/\s+/g, " ");
}

const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function kek(pass, salt, iterations) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(normalise(pass)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, base,
    { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
}

export function openBlob(key, buf) {
  const u = new Uint8Array(buf);
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, key, u.slice(12));
}

export async function unlock(lock, pass) {
  for (const e of lock.entries) {
    try {
      const raw = await openBlob(await kek(pass, b64(e.salt), lock.iter), b64(e.wrapped));
      return await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
    } catch (e) {
      if (e.name !== "OperationError") throw e; // wrong passphrase for this entry
    }
  }
  return null;
}

export async function fetchOpen(key, url, init) {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`fetch ${r.status}`);
  return openBlob(key, await r.arrayBuffer());
}
