# How does memory allocation work in JavaScript?

## Stack vs heap

- **Stack** — fixed-size frames for primitives and *references*. Fast, LIFO,
  freed automatically when the frame pops.
- **Heap** — objects, arrays, closures, functions. Dynamically sized, managed by
  the garbage collector.

```js
let a = 10          // value on the stack
let b = { x: 1 }    // object on the heap, reference on the stack
let c = b           // reference copied -- SAME heap object
c.x = 2             // b.x is now 2
```

This is the whole explanation for "why did changing `c` change `b`".

## Garbage collection: reachability, not counting

V8 does **not** use reference counting (which cannot collect cycles). It uses
**mark-and-sweep** from a set of roots (globals, the current stack, closures):
anything unreachable from a root is collectable — cycles included.

## Generational collection

V8 splits the heap on the *generational hypothesis*: most objects die young.

- **New space (scavenger)** — small, collected very frequently, survivors get
  promoted. Cheap because most objects are already dead.
- **Old space (mark-compact)** — larger, collected rarely, with incremental and
  concurrent phases so it does not block the main thread for long.

## Common leaks

- **Forgotten timers and listeners** — an interval holds its closure forever.
- **Detached DOM nodes** — removed from the document but still referenced by a
  JS variable, so the whole subtree is retained.
- **Unbounded caches** — a `Map` keyed by user id that is never evicted.
- **Closures over large objects** — capturing one field retains the entire scope.
- **Accidental globals** — `x = 1` without a declaration in sloppy mode.

## WeakMap / WeakSet / WeakRef

Weak references do **not** prevent collection, which makes them the right tool
for metadata keyed by objects you do not own:

```js
const meta = new WeakMap()
meta.set(domNode, { seen: true })   // node can still be collected
```

`FinalizationRegistry` can notify after collection, but timing is not
guaranteed — never use it for essential cleanup.

## Measuring

Chrome DevTools → Memory. Take a heap snapshot, interact, snapshot again, and
compare. The **retainer path** in a snapshot tells you exactly which reference
is keeping an object alive — that is how you find the leak rather than guess.
