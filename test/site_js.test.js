"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  utcDayKey,
  hashString,
  dailyIndex,
  normalizeTheme,
  noteFrequency,
} = require("../assets/js/site.js");

test("UTC day key ignores local timezone presentation", () => {
  assert.equal(utcDayKey(new Date("2026-07-30T23:59:59Z")), "2026-07-30");
  assert.equal(utcDayKey(new Date("2026-07-31T00:00:00Z")), "2026-07-31");
});

test("daily music selection is stable and bounded", () => {
  const tracks = ["a", "b", "c", "d"];
  const date = new Date("2026-07-30T12:00:00Z");
  const first = dailyIndex(tracks, date);

  assert.equal(first, dailyIndex(tracks, date));
  assert.ok(first >= 0 && first < tracks.length);
  assert.equal(dailyIndex([], date), -1);
});

test("hash is deterministic", () => {
  assert.equal(hashString("2026-07-30"), hashString("2026-07-30"));
  assert.notEqual(hashString("2026-07-30"), hashString("2026-07-31"));
});

test("theme accepts only light and dark", () => {
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("sepia"), null);
  assert.equal(normalizeTheme(null), null);
});

test("MIDI note 69 is concert A", () => {
  assert.equal(noteFrequency(69), 440);
});
