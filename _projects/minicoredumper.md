---
name: "PAX Support to MiniCoreDumper"
tools: [C, Nutanix, System Prog, Open Source]
description: Added POSIX archive format support to minicoredumper project, enhancing minicoredumper to efficiently handle cores > 8GB. Did it as part of my intern at Nutanix.
style: fill
color: info
---

# PAX Support to MiniCoreDumper

---

### What is `MiniCoreDumper`?

`MiniCoreDumper` is an open-source project aimed at creating `minicores` instead of full `cores` during a `coredump`.

But what exactly is a `coredump`? When a process encounters a signal like a segmentation fault, the kernel can capture a snapshot of the process's memory, register values, and other crucial information into a file, known as a `coredump`.

However, not all parts of this file are equally important. For instance, when debugging later, the call trace holds greater significance than heap data. This is where `minicoredumper` comes in, enabling us to selectively extract useful data from the `coredump`.

---

### What does this fork do?

The limitation of `minicoredumper` was that **it could only support cores up to 8GB**. I have removed this limitation using the `PAX archive format` that is also compatible with all commonly used versions of `GNU tar`. **In this fork, there is no upper** limit on the core size.


<p class="text-center">
{% include elements/button.html link="https://github.com/prakhar-pandey-nutanix/minicoredumper/tree/PAX_support" text="See Fork Here" %}
</p>


