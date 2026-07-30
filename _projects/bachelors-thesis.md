---
name: "Bachelor's Thesis: Mixing under Monotone Censoring"
order: 10
tools:
  - Python
  - Markov chains
  - Probability
  - Research
repository_url: "https://github.com/p-prakhar/LazyRandomWalk"
description: >-
  A literature and simulation study of lazy random walks on large monotone
  subsets of the hypercube, working from the prior O(n³) mixing-time bound.
---

## The question

With Pratham Pekamwar and under Dr. Benny George K's supervision at IIT
Guwahati, I studied lazy simple random walks on monotone subsets
\(V \subseteq \{0,1\}^n\) containing at least half of the hypercube.

The project examined the earlier \(O(n^3)\) upper bound and the path toward the
conjectured \(O(n \log n)\) behaviour. It did not claim a new proof. We surveyed
coupling, censoring, and strong-stationary-time techniques and built a Python
simulation framework over explicit transition matrices to understand where the
structure of the subset makes a tighter analysis difficult.
