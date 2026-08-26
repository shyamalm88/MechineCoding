# Memoize a function (numbers, strings, and object args)

Cache a pure function's results so repeated calls with the same arguments skip
the work.

## The naive key, and why it breaks

```js
const key = args.join(',')
```

- `f(1, 2)` and `f("1", "2")` collide — different types, same key.
- `f([1,2], 3)` and `f(1, [2,3])` both produce `"1,2,3"`.
- Any object becomes `"[object Object]"`, so every object collides with every
  other object.

`JSON.stringify(args)` fixes the first two — it quotes strings, so `1` and `"1"`
differ — but it is expensive, and property order matters, so `{a:1,b:2}` and
`{b:2,a:1}` produce different keys for equivalent objects.

## Object arguments and memory

Keying objects by a serialised string keeps a reference alive in the `Map`
**forever** — a genuine leak in a long-lived app. A `WeakMap` keyed by the
object itself lets the entry be collected when the object is:

```js
const objectCache = new WeakMap()  // key by identity, no leak
```

The trade-off is that `WeakMap` compares by **identity**, so two structurally
identical but distinct objects are separate cache entries.

## The escape hatch

Real libraries let you supply a key function:

```js
memoize(fetchUser, (user) => user.id)
```

That is usually the right answer in production — the caller knows what makes
two calls equivalent far better than a generic serialiser.

## Traps

- **Never memoise an impure function.** Caching a function that reads the clock,
  does I/O, or mutates state produces stale results.
- Unbounded caches grow forever — production memoisers need an LRU bound or TTL.
- A cached `undefined` return is indistinguishable from a miss if you test with
  `cache[key] !== undefined`; use `map.has(key)`.
