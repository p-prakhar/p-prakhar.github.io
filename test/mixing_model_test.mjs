import test from "node:test";
import assert from "node:assert/strict";
import {
  PRESETS, decideMove, forecast, makeChain, minimalVertices, refresh, totalVariation
} from "../assets/js/mixing-model.mjs";

const majority = makeChain(3, PRESETS.majority, 0.5);
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} ≠ ${expected}`);

test("the majority subset is the upward closure of the three two-bit states", () => {
  assert.deepEqual(majority.states, [3, 5, 6, 7]);
});

test("rejected and lazy proposals stay in place, while legal flips move", () => {
  assert.deepEqual(decideMove(majority, 3, 0, 0.75), { candidate: 2, state: 3, outcome: "blocked" });
  assert.deepEqual(decideMove(majority, 3, 2, 0.75), { candidate: 7, state: 7, outcome: "move" });
  assert.deepEqual(decideMove(majority, 3, 2, 0.25), { candidate: 7, state: 3, outcome: "lazy" });
});

test("detailed balance preserves uniform mass with unequal holding probabilities", () => {
  for (const row of majority.matrix) near(row.reduce((a, b) => a + b), 1);
  for (let i = 0; i < majority.states.length; i++) {
    near(majority.matrix.reduce((sum, row) => sum + row[i] / 4, 0), 1 / 4);
    for (let j = 0; j < majority.states.length; j++) {
      near(majority.matrix[i][j], majority.matrix[j][i]);
    }
  }
  near(majority.matrix[0][0], 5 / 6);
  near(majority.matrix[3][3], 1 / 2);
  near(majority.matrix[0][3], 1 / 6);
});

test("probability bars and worst-start variation agree with the majority example", () => {
  const leaf = forecast(majority, 3, 15);
  const center = forecast(majority, 7, 15);
  near(leaf.frames[1][0], 5 / 6);
  near(leaf.frames[1][3], 1 / 6);
  near(leaf.selected[1], 7 / 12);
  assert.equal(leaf.mixedAt, 6);
  assert.equal(center.mixedAt, 1);
  assert.equal(center.worstAt, 6);
  for (let t = 0; t < 15; t++) assert.ok(leaf.worst[t] >= leaf.worst[t + 1] - 1e-12);
});

test("equal-density four-cube examples have worst-start times 8 and 10", () => {
  const first = makeChain(4, PRESETS.shapeA, 0.5);
  const second = makeChain(4, PRESETS.shapeB, 0.5);
  assert.equal(first.states.length, 8);
  assert.equal(second.states.length, 8);
  assert.equal(forecast(first, 10, 20).worstAt, 8);
  assert.equal(forecast(second, 10, 20).worstAt, 10);
});

test("two-state laziness matches the exact contraction formula at each endpoint", () => {
  for (const lazy of [0, 0.1, 0.5, 0.9, 1]) {
    const series = forecast(makeChain(1, [0], lazy), 0, 8);
    for (let t = 0; t <= 8; t++) near(series.selected[t], 0.5 * Math.abs(2 * lazy - 1) ** t);
  }
  assert.equal(forecast(makeChain(1, [0], 1), 0, 10).worstAt, null);
});

test("a one-state walk is mixed immediately", () => {
  assert.equal(forecast(makeChain(3, [7], 0.5), 7, 2).worstAt, 0);
  near(totalVariation([1]), 0);
});

test("shared coordinate refresh coalesces the uncensored walks", () => {
  let left = 0, right = 7;
  for (const [bit, value] of [[2, true], [0, false], [1, true]]) {
    left = refresh(left, bit, value);
    right = refresh(right, bit, value);
  }
  assert.equal(left, right);
  assert.equal(left, 6);
});

test("redundant selected generators are not marked as minimal vertices", () => {
  assert.deepEqual(minimalVertices([3, 5, 6, 7]), [3, 5, 6]);
  assert.deepEqual(minimalVertices([3, 0, 6]), [0]);
});
