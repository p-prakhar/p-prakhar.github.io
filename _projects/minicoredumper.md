---
name: "PAX Support for minicoredumper"
order: 120
tools:
  - C
  - Linux
  - POSIX pax
  - Open source
external_url: "https://github.com/diamon/minicoredumper/pull/10"
description: >-
  Upstream POSIX pax sparse-map and extended-header support that removed the
  legacy ustar size limit for generated core archives.
---

## What is `minicoredumper`?

`minicoredumper` is an open-source project for creating targeted minicores
instead of writing every mapped byte of a process during a core dump.

When a process receives a signal such as a segmentation fault, a core captures
its memory, registers, and other state for later debugging. Not every byte is
equally useful, so a minicore can retain the information needed for diagnosis
while staying much smaller.

## What changed?

The archive writer used the `ustar` format, whose field limits prevented it
from representing sufficiently large core files. I added POSIX pax 1.0 sparse
maps and extended headers so those files can be represented in archives that
remain compatible with common GNU tar versions.

[Read the upstream pull request](https://github.com/diamon/minicoredumper/pull/10).
