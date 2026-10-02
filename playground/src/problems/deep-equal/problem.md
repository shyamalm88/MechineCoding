# Deep equality check

Structural comparison — two values are equal if they have the same shape and
equivalent contents.

## The algorithm

1. `a === b` — same reference or equal primitives, done.
2. If either side is `null` or not an `object`, they differ.
3. Compare `Object.keys` lengths — a different key count means not equal.
4. For each key of `a`, `b` must **own** it and the values must be deeply equal.

```js
if (!b.hasOwnProperty(key) || !deepEqual(a[key], b[key])) return false
```

## What this version does not handle

Good follow-up material — each is a known gap you should be able to name:

- **`NaN`** — `NaN === NaN` is false, so `deepEqual(NaN, NaN)` is false. Use
  `Object.is` as the first check to fix it (it also tells `0` and `-0` apart).
- **`[]` vs `{}`** — both have zero keys, so they compare equal. Compare
  prototypes to fix it.
- **Date / RegExp / Map / Set** — they have no own enumerable keys, so any two
  of the same kind compare equal. They need dedicated branches (`getTime()`,
  `source` + `flags`, size + per-entry).
- **Cycles** — a circular structure recurses forever. Track the pairs already
  being compared in a `WeakMap`.
- **Symbol keys** — `Object.keys` skips them; use `Reflect.ownKeys`.

## Traps

- `key in b` also finds inherited properties — use `hasOwnProperty`.
- Comparing only `keysA.length` is not enough on its own; the per-key
  `hasOwnProperty` check is what catches a key that exists in `a` but not `b`.
- Deep equality is O(n). Inside a React render or a hot loop it is often the
  wrong tool — normalised state or referential stability usually is.
