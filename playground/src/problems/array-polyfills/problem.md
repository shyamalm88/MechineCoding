# Array polyfills: map, filter, reduce, forEach, find, flat

Anyone can write the happy path. These are the details interviewers actually
probe.

## The full callback signature

```js
callback(element, index, array)
```

Forgetting `index` and `array` breaks real code — and `thisArg` is a second
parameter of `map`, `filter`, `forEach` and `find` (though not `reduce`). Every
version also throws a `TypeError` up front if the callback is not a function.

## Sparse arrays: holes are skipped

```js
[1, , 3].map(x => x * 2)   // [2, <hole>, 6] — the callback runs TWICE, not 3 times
```

A hole is not `undefined`; it is the *absence* of the index. That is why `map`,
`forEach` and `flat` test `if (i in this)`. Using `this[i] !== undefined`
instead is wrong — it would also skip a real, explicitly-stored `undefined`.

`find` is the odd one out: the spec makes it visit holes as `undefined`.
`myFilter` and `myReduce` here do not check for holes.

## reduce without an initial value

Two behaviours to get right:

1. The first element becomes the accumulator and iteration starts at index 1.
2. An **empty array with no initial value throws**.

Detect "no initial value" with `arguments.length < 2` — checking
`initialValue === undefined` is wrong, because `reduce(fn, undefined)` is a
legitimate call that *did* supply one.

## flat and depth

`myFlat(depth = 1)` recurses with `depth - 1` and only unwraps arrays while
`depth > 0`. `Infinity` flattens fully.

## Trap

Real `map` preserves the array length including holes. The version here uses
`new Array(length)` so the length is right, and skipped indices stay holes
rather than becoming `undefined`.
