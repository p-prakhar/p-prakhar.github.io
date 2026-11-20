const DIMENSIONS = {
  1: { width: 390, height: 255, origin: [96, 126], vectors: [[198, 0]] },
  2: { width: 390, height: 255, origin: [95, 188], vectors: [[0, -112], [200, 0]] },
  3: { width: 390, height: 255, origin: [63, 164], vectors: [[0, -93], [92, 46], [151, -31]] },
  4: { width: 430, height: 205, origin: [26, 132], vectors: [[0, -62], [54, 30], [100, -21], [222, 0]] }
};

export const bits = (state, dimension) => state.toString(2).padStart(dimension, "0");
const point = ([x, y]) => x + "," + y;
const percent = new Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 1 });
export const formatMass = (value) => percent.format(value);

function vertices(dimension) {
  const { origin, vectors } = DIMENSIONS[dimension];
  return Array.from({ length: 2 ** dimension }, (_, state) => {
    const position = [...origin];
    for (const [bit, [dx, dy]] of vectors.entries()) {
      if (state & (1 << bit)) {
        position[0] += dx;
        position[1] += dy;
      }
    }
    return position;
  });
}

export function drawGraph(element, dimension, allowed, options = {}) {
  const { width, height } = DIMENSIONS[dimension];
  const layout = vertices(dimension);
  const edges = [];
  const nodes = [];
  const selection = options.edge || [];
  const includes = new Set(allowed);
  const minima = new Set(options.minima);
  for (const [state, [x, y]] of layout.entries()) {
    const legal = includes.has(state);
    for (let bit = 0; bit < dimension; bit++) {
      const neighbor = state ^ (1 << bit);
      if (neighbor <= state) continue;
      let edgeClass = legal && includes.has(neighbor) ? " mix-graph__edge--allowed" : "";
      if (selection.includes(state) && selection.includes(neighbor)) {
        edgeClass = options.blocked ? " mix-graph__edge--blocked" : " mix-graph__edge--selected";
      }
      edges.push('<path class="mix-graph__edge' + edgeClass + '" d="M' + point(layout[state]) + ' L' + point(layout[neighbor]) + '"/>');
    }
    const variant = minima.has(state) ? "--minimum" : legal ? "--allowed" : "";
    const radius = dimension === 4 ? 4.5 : 6;
    nodes.push('<circle class="mix-graph__node' + (variant ? " mix-graph__node" + variant : "") + '" data-vertex="' + state +
      '" cx="' + x + '" cy="' + y + '" r="' + radius + '"/>');
    if (options.mass && legal) {
      nodes.push('<circle class="mix-graph__mass" data-mass="' + state + '" cx="' + x + '" cy="' + y + '" r="0"/>');
    }
    if (dimension < 4 || minima.has(state)) {
      const above = dimension === 1 || Boolean(state & 1);
      const labelY = y + (above ? -15 : 22);
      nodes.push('<text class="mix-graph__label' + (legal ? " mix-graph__label--allowed" : "") +
        '" x="' + x + '" y="' + labelY + '" text-anchor="middle">' + bits(state, dimension) + '</text>');
    }
  }

  if (options.blocked) {
    const [x, y] = layout[selection[1]];
    nodes.push('<path class="mix-graph__rejected" d="M' + (x - 6) + ' ' + (y - 6) + 'l12 12m0 -12l-12 12"/>');
  }

  if (options.player !== undefined) {
    const [x, y] = layout[options.player];
    nodes.push('<circle class="mix-graph__arrival" cx="' + x + '" cy="' + y + '" r="14"/>' +
      '<circle class="mix-graph__player" cx="' + x + '" cy="' + y + '" r="8" data-player/>');
  }

  const caption = options.caption ? '<text class="mix-graph__annotation" x="' + width / 2 + '" y="' + (height - 12) +
    '" text-anchor="middle">' + options.caption + '</text>' : "";
  element.innerHTML = '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="' + options.label + '">' +
    edges.join("") + nodes.join("") + caption + '</svg>';
  return layout;
}

export function setMass(element, states, mass, scale) {
  for (const [index, state] of states.entries()) {
    const node = element.querySelector('[data-mass="' + state + '"]');
    node.setAttribute("r", (Math.sqrt(mass[index]) * scale).toFixed(2));
  }
}

export function animateAlong(node, from, to, duration, easing) {
  if (typeof node.animate !== "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  return node.animate(
    [{ transform: "translate(" + -dx + "px," + -dy + "px)" }, { transform: "translate(0,0)" }],
    { duration, easing }
  );
}

export function chart(element, primary, options) {
  const { cursor = null, secondary, yMax, label } = options;
  const left = 53, right = 575, top = 15, bottom = 139;
  const last = primary.length - 1;
  const x = (time) => left + (right - left) * time / last;
  const y = (value) => bottom - (bottom - top) * value / yMax;
  const line = (values) => Array.from(values, (value, time) =>
    (time === 0 ? "M" : "L") + x(time).toFixed(2) + " " + y(value).toFixed(2)).join(" ");
  const text = (value, tx, ty, anchor = "middle") =>
    '<text x="' + tx + '" y="' + ty + '" text-anchor="' + anchor + '">' + value + '</text>';
  const threshold = y(0.25);
  const cursorMarkup = cursor === null ? "" :
    '<line class="mix-plot__cursor" x1="' + x(cursor) + '" x2="' + x(cursor) + '" y1="' + top + '" y2="' + bottom + '"/>' +
    '<circle class="mix-plot__dot" cx="' + x(cursor) + '" cy="' + y(primary[cursor]) + '" r="4.5"/>';
  element.innerHTML = '<svg class="mix-plot" viewBox="0 0 600 174" role="img" aria-label="' + label + '">' +
    '<path class="mix-plot__axis" d="M' + left + " " + top + "V" + bottom + "H" + right + '"/>' +
    '<path class="mix-plot__guide" d="M' + left + " " + threshold + "H" + right + '"/>' +
    text(yMax, left - 8, top + 5, "end") + text("¼", left - 8, threshold + 5, "end") +
    text(0, left - 8, bottom + 5, "end") + text("0", left, 162) +
    text(Math.floor(last / 2), x(Math.floor(last / 2)), 162) + text(last + " steps", right, 162, "end") +
    '<path class="mix-plot__selected" d="' + line(primary) + '"/>' +
    (secondary ? '<path class="mix-plot__worst" d="' + line(secondary) + '"/>' : "") + cursorMarkup + '</svg>';
}
