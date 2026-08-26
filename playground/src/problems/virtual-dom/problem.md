# Why is React fast? What is the Virtual DOM?

## The honest answer

**React is not faster than hand-written DOM updates.** A carefully hand-tuned
imperative update will always beat React, because React does strictly more work:
it builds a virtual tree, diffs it, *then* touches the DOM.

What React gives you is **predictable performance with a declarative model**.
You write UI as a function of state; React makes the resulting updates
reasonably efficient without you tracking which nodes changed. That trade —
giving up a little peak speed for a lot of correctness and maintainability — is
the actual pitch.

## What the Virtual DOM is

A lightweight JS object tree describing what the UI should look like. On update,
React builds a new tree and **diffs** it against the previous one, producing a
minimal set of real DOM operations.

Why bother? Real DOM nodes are heavyweight objects with hundreds of properties,
and reading layout properties can force synchronous reflow. Comparing plain JS
objects is cheap by comparison, and batching the resulting mutations avoids
repeated layout thrashing.

## The diffing heuristics

A general tree-diff is O(n³). React gets O(n) with two assumptions:

1. **Different element types produce different trees.** `<div>` → `<span>`
   means tear down the subtree and rebuild — no attempt to match children.
2. **Keys identify children across renders.** Stable keys let React move nodes
   instead of destroying and recreating them.

## The trap

"Virtual DOM is fast" is the wrong framing, and interviewers listen for it.
Svelte and Solid skip the virtual DOM entirely and are faster. The virtual DOM
is a *means to a declarative programming model*, not a performance feature in
its own right.
