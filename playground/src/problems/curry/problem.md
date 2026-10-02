# Implement a curry utility

`curry(fn)` turns `f(a, b, c)` into a form callable as `f(a)(b)(c)` — or any
partial combination like `f(a, b)(c)`.

## How it works

The whole mechanism rests on **`fn.length`** — a function's declared arity.
Collect arguments until you have at least that many, then invoke:

```js
if (args.length >= fn.length) return fn.apply(this, args)
return (...nextArgs) => curried.apply(this, args.concat(nextArgs))
```

## Traps

- **`fn.length` ignores rest and default parameters.** `(a, b = 1) => …` has
  length 1, so currying it behaves unexpectedly.
- Losing `this` — use `fn.apply(this, args)` if the curried function may be a
  method.
- Currying is not the same as partial application: currying transforms arity
  one argument at a time; partial application fixes some arguments and returns a
  function taking the rest.
