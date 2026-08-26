# How do closures work in JavaScript?

A closure is a function together with the **lexical scope it was created in**.
Because that scope is captured by reference, the inner function keeps the outer
variables alive after the outer function has returned.

```js
function makeCounter() {
  let count = 0
  return { inc: () => ++count, get: () => count }
}
```

`count` outlives `makeCounter()` and is reachable **only** through the returned
functions — genuine private state, which is the mechanism behind the module
pattern.

## The interview question: var in a loop

```js
for (var i = 0; i < 3; i++) fns.push(() => i)
fns.map(f => f())   // [3, 3, 3]

for (let j = 0; j < 3; j++) fns.push(() => j)
fns.map(f => f())   // [0, 1, 2]
```

`var` is function-scoped: all three closures capture **the same binding**, which
is 3 by the time they run. `let` creates a **new binding per iteration**, so each
closure captures its own.

Pre-ES6 the fix was an IIFE to manufacture a fresh scope:

```js
for (var i = 0; i < 3; i++) (function (i) { fns.push(() => i) })(i)
```

## Captured by reference, not by value

This is the point people state incorrectly. A closure does not snapshot the
value at creation time; it holds a live reference to the variable. Mutating the
variable afterwards is visible inside the closure.

## Where closures show up

- **Private state** — module pattern, `useState`'s implementation.
- **Function factories** — `debounce`, `throttle`, `once`, `memoize` all keep
  their bookkeeping in a closure.
- **Stale closures in React** — an effect with `[]` deps captures the first
  render's props and state forever. That bug is a closure behaving exactly as
  specified.

## Memory

Closures keep their entire enclosing scope alive. A closure over one field of a
huge object retains the whole object — an occasional and hard-to-spot leak.
