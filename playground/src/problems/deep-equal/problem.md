# Deep equality check

Structural comparison — two values are equal if they have the same shape and
equivalent contents.

## Start with Object.is, not ===

```js
NaN === NaN       // false  ← but they ARE structurally the same
0 === -0          // true   ← but they are distinguishable values
Object.is(NaN, NaN)  // true
Object.is(0, -0)     // false
```

`Object.is` gets both right, which is why it is the first line.

## What a complete answer covers

- **Prototype check.** `[]` and `{}` both have zero keys; without comparing
  prototypes they compare equal, which is wrong.
- **Date** — compare `getTime()`, not the object.
- **RegExp** — compare `source` and `flags`.
- **Map/Set** — size plus per-entry comparison. Note `Set` comparison here uses
  `has()`, which is reference-based for object members; truly deep Set equality
  needs an O(n²) pairwise match.
- **`Reflect.ownKeys`** to include symbols.
- **Cycles** — a `WeakMap` of pairs already being compared, or a circular
  structure recurses forever.

## The cycle guard is subtle

If we are already comparing `a` against `b` further up the stack, returning
`true` is correct: any genuine difference will be found by some *other* branch
of the traversal. Returning `false` would wrongly reject two structurally
identical circular objects.

## Traps

- `key in b` also finds inherited properties — use
  `Object.prototype.hasOwnProperty.call(b, key)`.
- Comparing only `Object.keys(a).length` misses keys that exist in `b` but not
  `a` unless both lengths are checked.
- Deep equality is O(n). Inside a React render or a hot loop it is often the
  wrong tool — normalised state or referential stability usually is.
