---
title: "Mini-C Compiler"
order: 30
tools:
  - C
  - Flex
  - Bison
  - x86 assembly
description: >-
  A small compiler pipeline with a Flex lexer, Bison parser, quad intermediate
  representation, symbol tables, backpatching, and x86 code generation.
---

Built as a systems course project, the compiler translates a subset of C
through a machine-independent quad representation and then emits x86 assembly
that can be linked with GCC. The project covers the path from lexical analysis
and parsing through symbol management, control-flow backpatching, and target
code generation.
