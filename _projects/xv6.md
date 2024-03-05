---
name: xv6 Operating System
tools: [System Prog, C, OS]
description: Implemented kernel threads, synchronization primitives, and scheduling policies for an operating system course project.
---

## Overview
Implemented core operating system functionalities as part of a course project. The project involved adding kernel threads, synchronization primitives, and scheduling policies to the xv6 operating system. The project was implemented in C and x86 assembly. The souce code is available on GitHub in the form of patch files.

## Threads and Synchronization
Implemented kernel threads with POSIX-compatible synchronization primitives including:
- Spinlocks
- Mutexes

## Scheduling
Implemented the following scheduling policies:
- SJF (Shortest Job First)
- Hybrid (Combination of Round Robin and SJF Scheduling)

## Memory Management
- Added paging and swapping mechanisms using Least Recently Used (LRU) policy for page replacement.
- Enabled Lazy Memory Allocation which enhances flexibility and efficiency of memory usage.

<p class="text-center">
{% include elements/button.html link="https://github.com/p-prakhar/xv6OS" text="Source Code" %}
</p>