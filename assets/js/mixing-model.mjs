export const PRESETS = {
  majority: [3, 5, 6],
  shapeA: [6, 10, 12],
  shapeB: [5, 10, 12]
};

export function upwardClosure(dimension, minima) {
  return Array.from({ length: 2 ** dimension }, (_, state) => state)
    .filter((state) => minima.some((minimum) => (state & minimum) === minimum));
}

export function minimalVertices(generators) {
  return generators.filter((state) => !generators.some(
    (other) => other !== state && (state & other) === other
  ));
}

export function makeChain(dimension, minima, laziness) {
  const states = upwardClosure(dimension, minima);
  const index = new Map(states.map((state, position) => [state, position]));
  const moveWeight = (1 - laziness) / dimension;
  const matrix = states.map((state, position) => {
    const row = new Float64Array(states.length);
    let degree = 0;
    for (let bit = 0; bit < dimension; bit++) {
      const neighbor = index.get(state ^ (1 << bit));
      if (neighbor !== undefined) {
        row[neighbor] = moveWeight;
        degree += 1;
      }
    }
    row[position] = 1 - degree * moveWeight;
    return row;
  });
  return { dimension, laziness, states, index, matrix };
}

export function decideMove(chain, state, bit, coin) {
  const candidate = state ^ (1 << bit);
  if (coin < chain.laziness) return { candidate, state, outcome: "lazy" };
  if (!chain.index.has(candidate)) return { candidate, state, outcome: "blocked" };
  return { candidate, state: candidate, outcome: "move" };
}

export function refresh(state, bit, value) {
  const mask = 1 << bit;
  return value ? state | mask : state & ~mask;
}

export function totalVariation(mass) {
  const uniform = 1 / mass.length;
  return mass.reduce((sum, value) => sum + Math.abs(value - uniform), 0) / 2;
}

function advance(matrix, mass) {
  const next = new Float64Array(mass.length);
  for (let from = 0; from < mass.length; from++) {
    for (let to = 0; to < mass.length; to++) {
      next[to] += mass[from] * matrix[from][to];
    }
  }
  return next;
}

export function forecast(chain, start, limit) {
  const frames = [];
  const selected = [];
  const worst = new Float64Array(limit + 1);
  for (const [position, state] of chain.states.entries()) {
    let mass = new Float64Array(chain.states.length);
    mass[position] = 1;
    for (let time = 0; time <= limit; time++) {
      const distance = totalVariation(mass);
      worst[time] = Math.max(worst[time], distance);
      if (state === start) {
        frames.push(mass);
        selected.push(distance);
      }
      if (time < limit) mass = advance(chain.matrix, mass);
    }
  }
  // Include values that reach exactly 1/4 before floating-point rounding.
  const crossing = (values) => {
    const index = values.findIndex((value) => value <= 0.25 + 1e-12);
    return index === -1 ? null : index;
  };
  return { frames, selected, worst, mixedAt: crossing(selected), worstAt: crossing(worst) };
}
