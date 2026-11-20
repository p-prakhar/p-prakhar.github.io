---
layout: mixing
section: work
title: "How a Random Walk Forgets"
order: 10
case_study: true
tools:
  - Python
  - Markov chains
  - Probability
  - Research
repository_url: "https://github.com/p-prakhar/LazyRandomWalk"
description: >-
  An interactive guide to our bachelor's thesis on mixing under monotone
  censoring, from a single bit flip to the sharp mixing-time bound.
---

<section class="mix-chapter" id="cube" aria-labelledby="cube-heading">
  <div class="mix-copy">
    <h2 id="cube-heading">From bits to a cube</h2>
    <p>One bit gives you two points, 0 and 1. Add a bit and you get two copies of that line, joined into a square. Add another and you get a cube. In <var>n</var> dimensions, each of the 2<sup><var>n</var></sup> vertices is a binary string. An edge flips exactly one bit.</p>
    <p>An <strong>upward-closed</strong> set keeps every vertex you can reach from an allowed vertex by turning 0s into 1s. Its <strong>minimal vertices</strong> are the allowed vertices with no smaller allowed vertex below them. These are the base points in our report.</p>
  </div>
  <div class="mix-lab mix-lab--split" data-enhanced data-cube hidden>
    <div class="mix-board mix-board--graph" data-cube-graph></div>
    <div class="mix-lab__controls">
      <fieldset class="mix-field">
        <legend>Dimension</legend>
        <div class="mix-buttons" data-dimensions>
          <button type="button" data-dimension="1" aria-pressed="true">1 bit</button>
          <button type="button" data-dimension="2" aria-pressed="false">2 bits</button>
          <button type="button" data-dimension="3" aria-pressed="false">3 bits</button>
        </div>
      </fieldset>
      <fieldset class="mix-field">
        <legend>Generating vertices</legend>
        <div class="mix-buttons mix-bits" data-bases></div>
        <p class="mix-hint">Select any vertex to include every string above it. Rings show the actual minimal vertices.</p>
      </fieldset>
      <p class="mix-readout" data-cube-result aria-live="polite"></p>
      <button type="button" data-majority>Show three-bit majority</button>
    </div>
  </div>
  <div class="mix-note">
    <strong>Try it on the majority set.</strong> Starting from <code>011</code>, the only string strictly above it is <code>111</code>. From <code>101</code> or <code>110</code>, you arrive at the same top vertex. Those three minimal vertices generate exactly half the cube.
  </div>
</section>

<section class="mix-chapter" id="walk" aria-labelledby="walk-heading">
  <div class="mix-copy">
    <h2 id="walk-heading">Take a step, or stay put</h2>
    <p>Pick one coordinate uniformly. With probability <var>ℓ</var>, stay where you are. Otherwise, try the flip. If that flip leaves the allowed set, stay at the original vertex. The next step uses only the current state, so this is a Markov chain.</p>
    <p>At <var>ℓ</var> = 1/2, you can think of the same rule as picking a coordinate and giving it a fresh fair bit. A refresh can leave the bit unchanged. Here the walk starts at <code>011</code>.</p>
  </div>
  <div class="mix-lab mix-lab--split" data-enhanced data-walk hidden>
    <div class="mix-board mix-board--graph" data-walk-graph></div>
    <div class="mix-lab__controls">
      <div class="mix-buttons">
        <button type="button" class="mix-button--primary" data-walk-action="step">Step</button>
        <button type="button" data-walk-action="play" aria-pressed="false">Play</button>
        <button type="button" data-walk-action="reset">Reset</button>
      </div>
      <p class="mix-readout" data-walk-result aria-live="polite"></p>
      <fieldset class="mix-field">
        <legend>Try a particular outcome</legend>
        <div class="mix-buttons">
          <button type="button" data-walk-action="move">Allowed flip</button>
          <button type="button" data-walk-action="blocked">Rejected flip</button>
          <button type="button" data-walk-action="lazy">Lazy stay</button>
        </div>
      </fieldset>
    </div>
  </div>
</section>

<section class="mix-chapter" id="proof" aria-labelledby="proof-heading">
  <div class="mix-copy">
    <h2 id="proof-heading">Why every vertex gets the same share</h2>
    <p>In the majority set, <code>011</code> holds the walker with probability 5/6, while <code>111</code> holds it with probability 1/2. Yet they each have stationary probability 1/4. To see why, look at the two directions of a single edge.</p>
  </div>
  <div class="mix-lab mix-lab--split" data-enhanced data-balance hidden>
    <div class="mix-board mix-board--graph" data-balance-graph></div>
    <div class="mix-lab__controls">
      <div class="mix-flux"><span>011</span><span>⇄</span><span>111</span></div>
      <p class="mix-readout">Mass sent each way<br><strong>1/4 × 1/6 = 1/24</strong></p>
      <button type="button" class="mix-button--primary" data-balance-play>Send mass both ways</button>
      <p class="mix-hint" data-balance-result aria-live="polite">Each dot represents the same amount of probability.</p>
    </div>
  </div>
  <div class="mix-proof">
    <h3>The detailed-balance argument</h3>
    <p>Each allowed flip has probability (1 − <var>ℓ</var>)/<var>n</var> in either direction. A rejected proposal adds to the probability of staying. Put mass 1/|<var>V</var>| at every vertex. Across every edge, the mass leaving in one direction equals the mass arriving in the other.</p>
    <div class="mix-equation" aria-label="pi of x times P of x y equals pi of y times P of y x">π(<var>x</var>) <var>P</var>(<var>x</var>, <var>y</var>) = π(<var>y</var>) <var>P</var>(<var>y</var>, <var>x</var>)</div>
    <p>Adding up these equalities gives π<var>P</var> = π. Every allowed state can reach the all-ones vertex by upward moves, and every edge can be traversed in reverse. This gives irreducibility for <var>ℓ</var> &lt; 1. For 0 &lt; <var>ℓ</var> &lt; 1 there is also a positive chance to stay at each vertex, so the chain is aperiodic and converges to the unique uniform stationary law.</p>
    <details>
      <summary>Why changing the laziness preserves stationarity</summary>
      <p>If π<var>P</var> = π, then applying the mixture <var>ℓI</var> + (1 − <var>ℓ</var>)<var>P</var> to π gives <var>ℓ</var>π + (1 − <var>ℓ</var>)π = π. The identity part simply returns the same distribution.</p>
    </details>
  </div>
</section>

<section class="mix-chapter" id="mixing" aria-labelledby="mixing-heading">
  <div class="mix-copy">
    <h2 id="mixing-heading">Watch the walk forget</h2>
    <p>Follow the probability mass from one start. Each bar is the chance that the walker is at that vertex after the selected number of steps. The marker on each bar is its uniform target. <strong>Total variation</strong> is the sum of the extra mass above those targets, or half the sum of all absolute differences. It is also the biggest gap between the two probabilities you can assign to any one event. Choose the event consisting of all vertices above their target to see why.</p>
    <p>Mixing time asks when every possible start is within a chosen distance of uniform. At a total variation threshold of 1/4, <code>111</code> reaches it in one step. Each of the three leaves takes six steps, so six is the mixing time for the chain.</p>
  </div>
  <div class="mix-lab" data-enhanced data-mixing hidden>
    <div class="mix-lab__toolbar">
      <label>Starting vertex <select data-mixing-start>
        <option value="3">011 · leaf</option>
        <option value="5">101 · leaf</option>
        <option value="6">110 · leaf</option>
        <option value="7">111 · center</option>
      </select></label>
      <label class="mix-range">Time <output data-mixing-time>0 steps</output>
        <input type="range" aria-label="Elapsed steps" min="0" max="16" value="0" data-mixing-scrub>
      </label>
    </div>
    <div class="mix-dashboard">
      <div class="mix-board mix-board--graph" data-mixing-graph></div>
      <div class="mix-distribution">
        <h3>Probability by vertex</h3>
        <ul class="mix-bars" data-mixing-bars></ul>
        <p class="mix-hint">The tick on each bar marks the uniform target of 25%.</p>
      </div>
    </div>
    <div class="mix-chart-panel">
      <h3>Total variation distance</h3>
      <div class="mix-legend"><span class="mix-key mix-key--selected">Selected start</span><span class="mix-key mix-key--worst">Worst start</span><span class="mix-key mix-key--threshold">Mixing threshold</span></div>
      <div data-mixing-chart></div>
      <p class="mix-readout" data-mixing-result aria-live="polite"></p>
    </div>
  </div>
  <div class="mix-copy mix-copy--follow">
    <h3>Give two walkers the same randomness</h3>
    <p>A <strong>coupling</strong> runs two walks together while keeping the correct rule for each. On the full cube, give both walks the same coordinate and fresh bit each step. They agree at that coordinate immediately. Once every coordinate has been refreshed, the walks meet and stay together. The chance they still disagree bounds the total variation distance between their laws. In fact, total variation is the smallest disagreement probability over all couplings of two distributions.</p>
  </div>
  <div class="mix-lab mix-lab--split" data-enhanced data-coupling hidden>
    <div class="mix-board mix-board--bits" data-couple-bits></div>
    <div class="mix-lab__controls">
      <div class="mix-buttons">
        <button type="button" class="mix-button--primary" data-couple-action="step">Refresh next bit</button>
        <button type="button" data-couple-action="reset">Reset</button>
      </div>
      <p class="mix-readout" data-couple-result aria-live="polite"></p>
    </div>
  </div>
  <p class="mix-note">With <var>k</var> untouched coordinates left, finding a new one takes <var>n</var>/<var>k</var> steps on average. Summing these waits gives <var>n</var>(1 + 1/2 + ⋯ + 1/<var>n</var>), of order <var>n</var> log <var>n</var>. On a censored cube the same refresh can be rejected for one walker and accepted for the other, so the full-cube argument needs more work.</p>
</section>

<section class="mix-chapter" id="experiments" aria-labelledby="experiments-heading">
  <div class="mix-copy">
    <h2 id="experiments-heading">What changes the mixing time?</h2>
    <p>In our B.Tech project we built transition matrices, repeatedly applied them to starting distributions, and measured total variation distance from uniform. We varied the laziness, the cube dimension, and the base points. Equilibrium was uniform throughout the converging examples. The time to reach it could change substantially.</p>
  </div>
  <div class="mix-experiment">
    <div class="mix-copy">
      <h3>Too little waiting can slow you down</h3>
      <p>On the one-bit cube, at zero laziness the walker alternates deterministically. At full laziness it never moves. At 1/2 it becomes uniform in one step. The exact distance at time <var>t</var> is |2<var>ℓ</var> − 1|<sup><var>t</var></sup>/2.</p>
    </div>
    <div class="mix-lab mix-lab--experiment" data-enhanced data-laziness hidden>
      <label class="mix-range">Laziness <output data-lazy-value>50%</output>
        <input type="range" aria-label="Laziness percentage" min="0" max="100" value="50" data-lazy-slider>
      </label>
      <div class="mix-legend"><span class="mix-key mix-key--selected">Total variation</span><span class="mix-key mix-key--threshold">Mixing threshold</span></div>
      <div data-lazy-chart></div>
      <p class="mix-readout" data-lazy-result aria-live="polite"></p>
    </div>
  </div>
  <div class="mix-experiment">
    <div class="mix-copy">
      <h3>Move one base point</h3>
      <p>Both shapes keep eight of the sixteen vertices and have three minimal vertices. Start with <code>0110</code>, <code>1010</code>, and <code>1100</code>. Replace <code>0110</code> with <code>0101</code>. At half laziness, the worst-start mixing time goes from eight to ten steps. These small examples illustrate the geometry dependence we observed.</p>
    </div>
    <div class="mix-lab mix-lab--experiment" data-enhanced data-geometry hidden>
      <div class="mix-lab__toolbar">
        <label class="mix-range">Shared time <output data-geometry-time>0 steps</output>
          <input type="range" aria-label="Geometry comparison elapsed steps" min="0" max="18" value="0" data-geometry-scrub>
        </label>
      </div>
      <div class="mix-geometry-shapes">
        <div><h4>0110 · 1010 · 1100</h4><div class="mix-board mix-board--graph" data-geometry-graph="a"></div><p data-geometry-stat="a"></p></div>
        <div><h4>0101 · 1010 · 1100</h4><div class="mix-board mix-board--graph" data-geometry-graph="b"></div><p data-geometry-stat="b"></p></div>
      </div>
      <div class="mix-legend"><span class="mix-key mix-key--selected">Original shape</span><span class="mix-key mix-key--worst">Moved base point</span><span class="mix-key mix-key--threshold">Mixing threshold</span></div>
      <div data-geometry-chart></div>
      <p class="mix-hint">Graphs show mass from <code>1010</code>, a worst-case start for both shapes. The curves use the maximum over all starts.</p>
    </div>
  </div>
  <div class="mix-proof">
    <h3>Further tools from the report</h3>
    <details>
      <summary>Symmetry, lumping, and the Ehrenfest model</summary>
      <p>On the full cube, grouping by the number of 1s gives another Markov chain. Every state in a group has the same probability of moving to each other group. On a general upward-closed subset, two states of the same weight can have different legal neighbors, so this grouping needs additional symmetry.</p>
    </details>
    <details>
      <summary>Spectral gap</summary>
      <p>For a reversible lazy walk, the largest nonconstant eigenvalue describes its slowest-decaying mode. The spectral gap is one minus that eigenvalue. A larger gap helps bound how quickly the distribution approaches equilibrium, and the 2025 result used a better gap bound to improve the mixing bound.</p>
    </details>
    <details>
      <summary>Strong stationary times</summary>
      <p>A strong stationary time is a randomized stopping time whose terminal state has the stationary law and is independent of the stopping time, for a fixed start. On the full cube, the first time every coordinate has been refreshed is such a time. Its tail bounds the remaining distance from stationarity.</p>
    </details>
  </div>
</section>

<section class="mix-chapter mix-research" id="research" aria-labelledby="research-heading">
  <div class="mix-copy">
    <h2 id="research-heading">The question we left open</h2>
    <p>Pratham Pekamwar and I studied this problem for our 2024 B.Tech project at IIT Guwahati under Dr. Benny George K. We proved uniform stationarity for the walk, surveyed the available techniques, and explored laziness and subset geometry numerically. Our goal was to understand whether a large monotone subset could retain the full cube’s mixing scale.</p>
  </div>
  <ol class="mix-timeline">
    <li><time datetime="2014">2014</time><strong>O(<var>n</var><sup>3</sup>)</strong><p>Ding and Mossel give the first bound and ask whether the full-cube order still holds.</p><a href="https://doi.org/10.1214/ECP.v19-3157">Read the paper</a></li>
    <li><time datetime="2025">2025</time><strong>O(<var>n</var><sup>2</sup>)</strong><p>Fei and Ferreira Pinto Jr. improve the upper bound by strengthening the spectral gap estimate.</p><a href="https://doi.org/10.4230/LIPIcs.APPROX/RANDOM.2025.42">Read the paper</a></li>
    <li><time datetime="2026-09-15">2026</time><strong>Θ(<var>n</var> log <var>n</var>)</strong><p>Yiming Chen’s preprint gives the sharp order for every increasing subset of fixed positive density. An appendix by Yuval Peres sharpens the dependence on density.</p><a href="https://arxiv.org/abs/2609.16515">Read the preprint</a></li>
  </ol>
  <p class="mix-note">The 2026 theorem covers the thesis setting of at least half the cube and the same half-lazy walk. Its proof relates mixing to the time needed to hit sets of substantial stationary mass. The preprint also proves a matching-order lower bound.</p>
  <div class="mix-resources">
    <a class="mix-button" href="{{ '/assets/doc/Mixing Under Monotone Censoring (BTP).pdf' | relative_url | uri_escape }}">Read the thesis PDF</a>
    <a class="mix-button" href="{{ page.repository_url }}">Browse the Python simulations</a>
  </div>
</section>
