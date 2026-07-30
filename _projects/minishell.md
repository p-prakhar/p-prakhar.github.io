---
title: "Minishell for Linux"
order: 40
tools:
  - C++
  - POSIX processes
  - Shell
  - Systems programming
description: >-
  A compact POSIX-style shell with process creation, pipes, redirection,
  signal handling, and a built-in archive command.
external_url: "https://github.com/p-prakhar/minishell-in-C-"
---

The shell uses the POSIX process model to execute programs with `fork` and
`exec`, connect commands through pipes, redirect files, and handle interactive
signals. It also includes built-in commands, including a small archive
facility, rather than delegating every operation to another executable.

Building it made process groups, file descriptors, and the order in which a
shell applies redirections much more concrete than using those features from a
terminal.

[Browse the source](https://github.com/p-prakhar/minishell-in-C-).