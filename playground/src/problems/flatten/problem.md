# Flatten an array, and flatten a nested object

Two classic variants that are usually asked together.

## Flattening an array — `myFlat(depth = 1)`

```js
if (Array.isArray(item) && depth > 0) {
  result.push(...item.myFlat(depth - 1))
} else {
  result.push(item)
}
```

The **depth parameter** is what separates a complete answer. Native
`Array.prototype.flat()` defaults to depth 1, not infinity — `flat()` on
`[1,[2,[3]]]` gives `[1,2,[3]]`. `Infinity` works as a depth because
`Infinity - 1` is still `Infinity`.

`if (!(i in this)) continue` skips holes, which is also what native `flat`
does.

## Flattening an object

Turn `{a: {b: {c: 1}}}` into `{'a.b.c': 1}` with a depth-first walk that carries
the path down:

```js
const newKey = path ? `${path}.${key}` : key
```

**The trap is `typeof`.** `null` reports `'object'`, so the guard is
`value !== null && typeof value === 'object'`. Arrays also pass that guard, so
they are walked by index: `f: [1, 2]` becomes `'f.0'` and `'f.1'`.

## Follow-ups worth anticipating

- **Unflatten** — the inverse, splitting keys on `.` and rebuilding nesting.
- **Key collisions** — a literal key containing a dot (`{'a.b': 1}`) is
  indistinguishable from nesting after flattening.
- **Keeping arrays as values** — add `!Array.isArray(value)` to the guard.
- Circular references will recurse forever without a `seen` set.
