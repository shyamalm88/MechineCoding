# pipe, compose, groupBy, balanced brackets, and QuickSort

A cluster of small utilities that come up constantly as warm-ups.

## pipe vs compose

```js
pipe(a, b)(x)     // b(a(x))  — left to right, reading order
compose(a, b)(x)  // a(b(x))  — right to left, maths convention
```

Same operation, opposite direction: `reduce` vs `reduceRight`. `pipe` reads more
naturally for data flow; `compose` matches `f ∘ g` notation. Mixing them up is
the whole trick of the question.

## groupBy

```js
(acc[key] ??= []).push(item)
```

`??=` initialises the bucket only when absent. Note object keys are **coerced to
strings** — `groupBy([1.2, 1.8], Math.floor)` produces the key `"1"`, not `1`.
A `Map` preserves key types if that matters.

## Balanced brackets

A **stack**, not a counter. `([)]` has equal counts of every bracket yet is
invalid — the closer must match the *most recent* opener, which is exactly what
a stack encodes.

Two failure modes to handle: a mismatch during the scan, and a **non-empty
stack at the end** (unclosed openers). Forgetting the second means `"(("` passes.

## QuickSort

Average O(n log n), worst case **O(n²)** on already-sorted input with a
first-element pivot — the standard follow-up. Fixes: random pivot, or
median-of-three.

The version here is out-of-place (filter into `left`/`right`) for readability,
which costs O(n) extra memory per level. The classic in-place Lomuto/Hoare
partition is O(log n) stack only.

Also note: it is **not stable**, whereas `Array.prototype.sort` is required to
be stable in modern engines.
