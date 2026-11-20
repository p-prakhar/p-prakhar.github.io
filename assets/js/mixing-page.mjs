import { PRESETS, decideMove, forecast, makeChain, minimalVertices, refresh, upwardClosure } from "./mixing-model.mjs";
import { animateAlong, bits, chart, drawGraph, formatMass, setMass } from "./mixing-visuals.mjs";

const majority = makeChain(3, PRESETS.majority, 0.5);
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const easing = "cubic-bezier(.2,.65,.35,1)";
const steps = (time) => time + (time === 1 ? " step" : " steps");

function setupCube(lab) {
  let dimension = 1;
  const selections = { 1: new Set([0]), 2: new Set([0]), 3: new Set(PRESETS.majority) };
  const graph = lab.querySelector("[data-cube-graph]");
  const buttons = lab.querySelector("[data-bases]");
  const result = lab.querySelector("[data-cube-result]");
  const dimensions = lab.querySelectorAll("[data-dimension]");
  const list = new Intl.ListFormat("en");

  function draw(newlyShown = []) {
    const generators = [...selections[dimension]];
    const allowed = upwardClosure(dimension, generators);
    const minima = minimalVertices(generators);
    drawGraph(graph, dimension, allowed, {
      minima,
      caption: "Solid edges join allowed states",
      label: dimension + "-dimensional cube with " + allowed.length + " allowed vertices"
    });
    for (const state of newlyShown) {
      const node = graph.querySelector('[data-vertex="' + state + '"]');
      if (!motion.matches && typeof node.animate === "function") {
        node.animate([{ opacity: .12 }, { opacity: 1 }], { duration: 360, easing });
      }
    }
    if (allowed.length === 0) {
      result.textContent = "No states allowed. Choose a vertex to build an upward-closed set.";
      return;
    }
    const minimumList = list.format(minima.map((vertex) => bits(vertex, dimension)));
    result.textContent = allowed.length + " of " + 2 ** dimension + " states allowed (" +
      formatMass(allowed.length / 2 ** dimension) + "). " +
      (minima.length === 1 ? "Minimal vertex is " : "Minimal vertices are ") + minimumList + ".";
  }

  function selectDimension(next, animate) {
    dimension = next;
    for (const button of dimensions) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.dimension) === dimension));
    }
    buttons.replaceChildren();
    for (let state = 0; state < 2 ** dimension; state++) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = bits(state, dimension);
      button.setAttribute("aria-pressed", String(selections[dimension].has(state)));
      button.addEventListener("click", () => {
        const selection = selections[dimension];
        const before = upwardClosure(dimension, [...selection]);
        if (selection.has(state)) selection.delete(state);
        else selection.add(state);
        button.setAttribute("aria-pressed", String(selection.has(state)));
        const added = upwardClosure(dimension, [...selection]).filter((vertex) => !before.includes(vertex));
        draw(added);
      });
      buttons.append(button);
    }
    draw();
    if (animate && !motion.matches && typeof graph.animate === "function") {
      graph.animate([{ opacity: 0.58, transform: "scale(.975)" }, { opacity: 1, transform: "scale(1)" }],
        { duration: 260, easing });
    }
  }

  for (const button of dimensions) {
    button.addEventListener("click", () => selectDimension(Number(button.dataset.dimension), true));
  }
  lab.querySelector("[data-majority]").addEventListener("click", () => {
    selections[3] = new Set(PRESETS.majority);
    selectDimension(3, true);
  });
  selectDimension(1, false);
}

function setupWalk(lab) {
  let state = 3;
  let time = 0;
  let interval = null;
  const graph = lab.querySelector("[data-walk-graph]");
  const result = lab.querySelector("[data-walk-result]");
  const play = lab.querySelector('[data-walk-action="play"]');

  function draw(previous, move) {
    const label = "Walker at " + bits(state, 3) + " on the three-bit majority set";
    const layout = drawGraph(graph, 3, majority.states, {
      player: state,
      edge: move && move.outcome !== "lazy" ? [previous, move.candidate] : [],
      blocked: move?.outcome === "blocked",
      caption: "Violet dot shows the walker",
      label
    });
    if (move?.outcome === "move") {
      animateAlong(graph.querySelector("[data-player]"), layout[previous], layout[state], 400, easing);
    }
    if (move?.outcome === "blocked" && !motion.matches) {
      const edge = graph.querySelector(".mix-graph__edge--blocked");
      edge.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 300, easing });
    }
  }

  function step(bit = Math.floor(Math.random() * 3), coin = Math.random()) {
    const previous = state;
    const move = decideMove(majority, state, bit, coin);
    const candidate = bits(move.candidate, 3);
    state = move.state;
    time += 1;
    const reason = {
      move: "Flipped to " + candidate + ".",
      blocked: candidate + " is outside the set. Stayed at " + bits(previous, 3) + ".",
      lazy: "The lazy coin says stay at " + bits(previous, 3) + "."
    };
    result.textContent = "Step " + time + " · Bit " + (3 - bit) + ". " + reason[move.outcome];
    draw(previous, move);
  }

  function pause() {
    if (interval === null) return;
    clearInterval(interval);
    interval = null;
    play.textContent = "Play";
    play.setAttribute("aria-pressed", "false");
    result.setAttribute("aria-live", "polite");
  }

  function reset() {
    pause();
    state = 3;
    time = 0;
    result.textContent = "Starting at 011. Bits are numbered from left to right.";
    draw();
  }

  const actions = {
    step: () => { pause(); step(); },
    reset,
    play: () => {
      if (interval !== null) { pause(); return; }
      result.setAttribute("aria-live", "off");
      play.textContent = "Pause";
      play.setAttribute("aria-pressed", "true");
      step();
      interval = setInterval(() => step(), 850);
    },
    move: () => { reset(); step(2, 0.75); },
    blocked: () => { reset(); step(0, 0.75); },
    lazy: () => { reset(); step(2, 0.25); }
  };
  for (const button of lab.querySelectorAll("[data-walk-action]")) {
    button.addEventListener("click", actions[button.dataset.walkAction]);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    }).observe(lab);
  }
  reset();
}

function setupBalance(lab) {
  const graph = lab.querySelector("[data-balance-graph]");
  const readout = lab.querySelector("[data-balance-result]");
  const label = "Symmetric probability flow between vertices 011 and 111";
  const layout = drawGraph(graph, 3, majority.states, {
    edge: [3, 7], caption: "One allowed edge, two equal flows", label
  });
  lab.querySelector("[data-balance-play]").addEventListener("click", () => {
    const svg = graph.querySelector("svg");
    for (const node of svg.querySelectorAll("[data-flux]")) node.remove();
    for (const [from, to, offset] of [[3, 7, -7], [7, 3, 7]]) {
      const start = [layout[from][0], layout[from][1] + offset];
      const end = [layout[to][0], layout[to][1] + offset];
      const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      particle.setAttribute("class", "mix-graph__player");
      particle.setAttribute("data-flux", "");
      particle.setAttribute("cx", end[0]);
      particle.setAttribute("cy", end[1]);
      particle.setAttribute("r", "6.5");
      svg.append(particle);
      animateAlong(particle, start, end, 780, easing);
    }
    readout.textContent = "Each endpoint sends and receives 1/24. Its mass stays the same.";
  });
}

function setupMixing(lab) {
  const graph = lab.querySelector("[data-mixing-graph]");
  const start = lab.querySelector("[data-mixing-start]");
  const scrub = lab.querySelector("[data-mixing-scrub]");
  const timeOutput = lab.querySelector("[data-mixing-time]");
  const bars = lab.querySelector("[data-mixing-bars]");
  const plot = lab.querySelector("[data-mixing-chart]");
  const result = lab.querySelector("[data-mixing-result]");
  let series;
  drawGraph(graph, 3, majority.states, {
    mass: true, caption: "Larger circles carry more probability", label: "Probability mass on the majority set"
  });
  for (const state of majority.states) {
    const row = document.createElement("li");
    row.innerHTML = '<span>' + bits(state, 3) + '</span><span class="mix-bar" aria-hidden="true"><i></i></span><span></span>';
    bars.append(row);
  }

  function render() {
    const time = Number(scrub.value);
    const mass = series.frames[time];
    timeOutput.textContent = steps(time);
    setMass(graph, majority.states, mass, 24);
    for (const [index, row] of Array.from(bars.children).entries()) {
      row.querySelector("i").style.width = mass[index] * 100 + "%";
      row.lastElementChild.textContent = formatMass(mass[index]);
    }
    chart(plot, series.selected, {
      cursor: time, secondary: series.worst, yMax: 1,
      label: "Total variation for the selected start and the worst start, with threshold one quarter"
    });
    result.textContent = "At step " + time + ", TV is " + series.selected[time].toFixed(3) + " from " +
      bits(Number(start.value), 3) + " and " + series.worst[time].toFixed(3) + " from the worst start. " +
      "Threshold reached in " + steps(series.mixedAt) + " from this start and " + steps(series.worstAt) + " from every start.";
  }

  function pickStart() {
    series = forecast(majority, Number(start.value), Number(scrub.max));
    render();
  }
  start.addEventListener("change", pickStart);
  scrub.addEventListener("input", render);
  pickStart();
}

function setupCoupling(lab) {
  const board = lab.querySelector("[data-couple-bits]");
  const result = lab.querySelector("[data-couple-result]");
  const next = lab.querySelector('[data-couple-action="step"]');
  const coordinates = [[1, 0], [1, 1], [2, 1], [0, 0]];
  let walkers = [0, 7];
  let time = 0;
  let latest = -1;

  function render() {
    const rows = walkers.map((state, index) => {
      const digits = [...bits(state, 3)].map((value, index) => {
        const bit = 2 - index;
        const agree = ((walkers[0] ^ walkers[1]) & (1 << bit)) === 0;
        return '<span class="mix-couple-bit' + (agree ? " mix-couple-bit--shared" : "") +
          (bit === latest ? " mix-couple-bit--latest" : "") + '">' + value + '</span>';
      });
      return '<div class="mix-couple-row"><span class="mix-couple-name">Walker ' + (index + 1) + '</span>' + digits.join("") + '</div>';
    });
    board.innerHTML = rows.join("");
    if (latest >= 0 && !motion.matches) {
      for (const bit of board.querySelectorAll(".mix-couple-bit--latest")) {
        bit.animate([{ transform: "scale(.85)" }, { transform: "scale(1)" }], { duration: 270, easing });
      }
    }
    next.disabled = time === coordinates.length;
  }

  next.addEventListener("click", () => {
    const [bit, value] = coordinates[time];
    latest = bit;
    walkers = walkers.map((state) => refresh(state, bit, value));
    time++;
    result.textContent = "Set bit " + (3 - bit) + " to " + value + " in both walks. " +
      (walkers[0] === walkers[1] ? "They meet at " + bits(walkers[0], 3) + " and will stay together." :
        "The walks are now at " + bits(walkers[0], 3) + " and " + bits(walkers[1], 3) + ".");
    render();
  });

  function reset() {
    walkers = [0, 7];
    time = 0;
    latest = -1;
    result.textContent = "Walkers start at 000 and 111. Step through one possible sequence of shared refreshes.";
    render();
  }
  lab.querySelector('[data-couple-action="reset"]').addEventListener("click", reset);
  reset();
}

function setupLaziness(lab) {
  const slider = lab.querySelector("[data-lazy-slider]");
  const value = lab.querySelector("[data-lazy-value]");
  const plot = lab.querySelector("[data-lazy-chart]");
  const result = lab.querySelector("[data-lazy-result]");

  function render() {
    const laziness = Number(slider.value) / 100;
    const series = forecast(makeChain(1, [0], laziness), 0, 60);
    value.textContent = formatMass(laziness);
    chart(plot, series.selected, { yMax: 0.5, label: "Total variation over 60 steps at " + value.textContent + " laziness" });
    if (laziness === 0) result.textContent = "The walk alternates between the two states, so TV stays at 0.5.";
    else if (laziness === 1) result.textContent = "The walk never leaves its starting state, so TV stays at 0.5.";
    else result.textContent = series.worstAt === null
      ? "The walk has yet to reach a TV of 1/4 after 60 steps."
      : "The walk reaches a TV of 1/4 or less in " + steps(series.worstAt) + ".";
  }
  slider.addEventListener("input", render);
  render();
}

function setupGeometry(lab) {
  const scrub = lab.querySelector("[data-geometry-scrub]");
  const timeOutput = lab.querySelector("[data-geometry-time]");
  const plot = lab.querySelector("[data-geometry-chart]");
  const shapes = [PRESETS.shapeA, PRESETS.shapeB].map((minima, index) => {
    const id = index === 0 ? "a" : "b";
    const graph = lab.querySelector('[data-geometry-graph="' + id + '"]');
    const stat = lab.querySelector('[data-geometry-stat="' + id + '"]');
    const chain = makeChain(4, minima, 0.5);
    const series = forecast(chain, 10, Number(scrub.max));
    drawGraph(graph, 4, chain.states, {
      minima, mass: true, caption: "Two slices of the four-bit cube",
      label: "Four-bit upward closure of " + minima.map((state) => bits(state, 4)).join(", ")
    });
    return { graph, stat, states: chain.states, series };
  });

  function render() {
    const time = Number(scrub.value);
    timeOutput.textContent = steps(time);
    for (const shape of shapes) {
      setMass(shape.graph, shape.states, shape.series.frames[time], 16);
      shape.stat.textContent = "Worst-start TV " + shape.series.worst[time].toFixed(3) + " · mixes in " + steps(shape.series.worstAt);
    }
    chart(plot, shapes[0].series.worst, {
      cursor: time, secondary: shapes[1].series.worst, yMax: 1,
      label: "Worst-start total variation curves for both eight-state shapes"
    });
  }
  scrub.addEventListener("input", render);
  render();
}

for (const [selector, setup] of [
  ["[data-cube]", setupCube], ["[data-walk]", setupWalk], ["[data-balance]", setupBalance],
  ["[data-mixing]", setupMixing], ["[data-coupling]", setupCoupling], ["[data-laziness]", setupLaziness],
  ["[data-geometry]", setupGeometry]
]) {
  const lab = document.querySelector(selector);
  if (lab) {
    setup(lab);
    lab.hidden = false;
  }
}
