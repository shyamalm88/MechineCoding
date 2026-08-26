# Virtual DOM tree diff

Compare two vnode trees and emit the minimal set of DOM operations. This is the
reconciliation half of a framework (the other half is `renderDom`).

## Why O(n) and not O(n³)

The general tree-edit-distance problem is **O(n³)** — unusable. React gets O(n)
by making two assumptions and accepting the cases they get wrong:

**Heuristic 1 — different type ⇒ replace the whole subtree.**
`<div>` becoming `<span>` tears down everything inside and rebuilds it, without
attempting to match children. Cheap, and almost always what you meant.

**Heuristic 2 — keys give children stable identity.**
Without keys, children are compared **by position**. Insert an item at the front
and every position mismatches, so the entire list is rewritten. With keys, the
same change is a set of `MOVE`s.

That is the whole reason index keys are a bug: they make the key *equal* to the
position, which throws away the identity information keys exist to provide.

## The patch types

| Patch | When |
|---|---|
| `CREATE` | node exists only in the new tree |
| `REMOVE` | node exists only in the old tree |
| `REPLACE` | same position, different type |
| `TEXT` | text content changed |
| `PROPS` | attribute/prop values changed |
| `MOVE` | keyed node changed position |

## Prop diffing

Iterate the **union** of old and new keys — walking only the new props misses
removals, which must be emitted as `null` so the patcher removes the attribute.

## What real implementations add

- A **two-ended** comparison (React/Vue walk from both ends inwards) to handle
  prepend/append cheaply before falling back to the key map.
- Batching patches and applying them in one pass, in the commit phase.
- Component boundaries — this diff only covers host elements.

## The bigger point

Diffing is not free — it is a trade. You spend CPU comparing objects to avoid
touching the DOM, which is more expensive still. Svelte and Solid skip it
entirely by compiling precise updates, which is why "the virtual DOM is fast"
is the wrong framing: it is a *predictable* way to get declarative UI.
