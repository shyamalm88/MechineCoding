# Implement a curry utility

`curry(fn)` turns `f(a, b, c)` into a form callable as `f(a)(b)(c)` — or any
partial combination like `f(a, b)(c)`.

## How it works

The whole mechanism rests on **`fn.length`** — a function's declared arity.
Collect arguments until you have at least that many, then invoke:

```js
if (args.length >= fn.length) return fn.apply(this, args)
return (...rest) => curried(...args, ...rest)
```

## Infinite currying

`add(1)(2)(3)(4)` with no fixed end is a different problem: there is no arity to
compare against, so nothing tells you when to stop.

The trick is that the returned value is a **function with a custom `valueOf`**.
It stays callable forever, and the moment it is used in a context that coerces
to a primitive (`+ 0`, template literal, `String()`), JavaScript calls `valueOf`
and the accumulated sum appears.

```js
const next = (b) => infiniteAdd(a + b)
next.valueOf = () => a
```

That is why `add(1)(2)(3)` logs as a function but `add(1)(2)(3) + 0` gives 6.

## Traps

- **`fn.length` ignores rest and default parameters.** `(a, b = 1) => …` has
  length 1, so currying it behaves unexpectedly.
- Losing `this` — use `fn.apply(this, args)` if the curried function may be a
  method.
- Currying is not the same as partial application: currying transforms arity
  one argument at a time; partial application fixes some arguments and returns a
  function taking the rest.
