# Output question: object keys are coerced to strings

```js
const a = {}
const b = { key: 'b' }
const c = { key: 'c' }
a[b] = 123
a[c] = 456
console.log(a[b])   // 456  ← not 123
```

## Why

Object property keys can only be **strings or symbols**. Anything else is
coerced via `String()`:

```js
String({ key: 'b' })   // '[object Object]'
String({ key: 'c' })   // '[object Object]'   ← identical
```

Both objects produce the same key, so the second assignment overwrites the
first. `Object.keys(a)` is `['[object Object]']` — a single entry.

## The array version

```js
arr[0] = 'zero'
arr['0'] = 'overwritten'   // SAME property
arr.length                  // 1
```

Array indices are string keys too. `arr[0]` and `arr['0']` are the same slot —
which is also why `1` and `'1'` collide in a naive memoisation cache key.

## Key ordering

`Object.keys` does not return insertion order unconditionally:

1. **Integer-like keys first, ascending numerically**
2. then string keys in insertion order
3. symbols are **never** returned by `Object.keys` (use
   `Object.getOwnPropertySymbols` or `Reflect.ownKeys`)

So `{ b: 1, 2: 2, a: 3, 1: 4 }` yields `['1', '2', 'b', 'a']`.

## The fix

Use a **`Map`** when keys are objects. `Map` keys are compared by identity, hold
any type, preserve insertion order, and are directly iterable:

```js
const m = new Map()
m.set(b, 'B'); m.set(c, 'C')   // two distinct entries
```

`WeakMap` additionally lets the keys be garbage collected — the right choice for
attaching metadata to objects you do not own.
