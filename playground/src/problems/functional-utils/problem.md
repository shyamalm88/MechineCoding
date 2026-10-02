# pipe, compose, groupBy, once, and chunk

A cluster of small utilities that come up constantly as warm-ups.

## pipe vs compose

```js
pipe(a, b)(x)     // b(a(x))  — left to right, reading order
compose(a, b)(x)  // a(b(x))  — right to left, maths convention
```

Same `reduce`, opposite nesting: `nextFn(prevFn(...args))` for pipe,
`a(b(...args))` for compose. `pipe` reads more
naturally for data flow; `compose` matches `f ∘ g` notation. Mixing them up is
the whole trick of the question.

## groupBy

```js
if (!result[key]) result[key] = []
result[key].push(item)
```

The bucket is created only when absent. The iteratee can be a function or a
property name. Note object keys are **coerced to
strings** — `groupBy([1.2, 1.8], Math.floor)` produces the key `"1"`, not `1`.
A `Map` preserves key types if that matters.

## once

```js
function once(fn) {
  let called = false, result
  return function (...args) {
    if (!called) { result = fn.apply(this, args); called = true }
    return result
  }
}
```

Different from memoisation: arguments are ignored entirely and `fn` runs at
most one time. Only the **first** call's arguments are used. Good for one-time
init.

## chunk

Walk the array in steps of `size`, slicing one group per step. `slice` clamps
to the array bounds, so the last, shorter chunk needs no special case.
`chunk([1,2,3,4,5], 2)` is `[[1,2],[3,4],[5]]`; a `size` below 1 returns `[]`.
