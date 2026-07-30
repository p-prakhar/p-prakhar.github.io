---
title: "xv6 Operating System"
order: 20
tools:
  - C
  - x86 assembly
  - Operating systems
  - Systems programming
repository_url: "https://github.com/p-prakhar/xv6OS"
description: >-
  Kernel threads, synchronisation primitives, scheduling policies, lazy memory
  allocation, and LRU paging for an xv6 course project.
---

## Overview

Implemented operating-system functionality in C and x86 assembly, distributed
as patch files against xv6.

## Threads and Synchronization

Implemented kernel threads with synchronisation primitives including:

- Spinlocks
- Mutexes

## Scheduling

Implemented two scheduling policies:

- SJF (Shortest Job First)
- A hybrid of Round Robin and SJF

## Memory Management

- Added paging and swapping with LRU page replacement.
- Added lazy memory allocation.

[Browse the source and patch files](https://github.com/p-prakhar/xv6OS).