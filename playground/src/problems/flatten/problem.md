# Flatten an array, and flatten a nested object

Two classic variants that are usually asked together.

## Flattening an array

```js
arr.reduce((acc, item) =>
  acc.concat(Array.isArray(item) ? flatten(item, depth - 1) : item), [])
```

The **depth parameter** is what separates a complete answer. Native
`Array.prototype.flat()` defaults to depth 1, not infinity — `flat()` on
`[1,[2,[3]]]` gives `[1,2,[3]]`.

### The iterative version

Deep recursion can blow the call stack. A stack-based loop avoids it:

```js
while (stack.length) {
  const item = stack.pop()
  if (Array.isArray(item)) stack.push(...item)
  else out.push(item)
}
```

Note `pop()` takes from the end, so results come out reversed and need a final
`reverse()` — an easy detail to miss.

## Flattening an object

Turn `{a: {b: {c: 1}}}` into `{'a.b.c': 1}`:

```js
const path = prefix ? `${prefix}.${key}` : key
```

**The trap is `typeof`.** Both `null` and arrays report `'object'`:

```js
typeof null      // 'object'  ← recursing into it throws
typeof [1,2]     // 'object'  ← usually you want to keep arrays as values
```

Hence the guard: `value !== null && typeof value === 'object' && !Array.isArray(value)`.

## Follow-ups worth anticipating

- **Unflatten** — the inverse, splitting keys on `.` and rebuilding nesting.
- **Key collisions** — a literal key containing a dot (`{'a.b': 1}`) is
  indistinguishable from nesting after flattening.
- Circular references will recurse forever without a `seen` set.
