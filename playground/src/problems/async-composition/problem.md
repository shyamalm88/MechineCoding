# Async composition: pipeAsync, composeAsync, waterfall

## The sync version does not work

```js
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)
```

With async functions each step returns a **promise**, so the next function
receives a `Promise` rather than a value. Two correct spellings:

```js
// for..of with await -- clearer
for (const fn of fns) acc = await fn(acc)

// reduce over a promise chain -- same thing
fns.reduce((chain, fn) => chain.then(fn), Promise.resolve(input))
```

## Sequential on purpose

This is **not** `Promise.all`. Each step depends on the previous result, so they
cannot overlap — the total time is the sum, not the max. If your steps are
independent, you want `Promise.all`, and using a pipeline is needlessly slow.

Saying which one applies is the real question behind this exercise.

## Waterfall

A pipeline where each step also receives the accumulated history, so a later
step can reference an earlier result rather than only the immediately preceding
one. That is what distinguishes `waterfall` from plain `pipeAsync` in libraries
like async.js.

## Cancellation between steps

An in-flight promise cannot be interrupted, but the chain can stop *between*
steps:

```js
chain.then(acc => { if (signal?.aborted) throw AbortError; return fn(acc) })
```

So an abort takes effect at the next boundary. For genuine mid-request
cancellation the signal must be threaded into `fetch` itself.

## Error handling

One rejection short-circuits the whole chain — later steps never run, and the
returned promise rejects. If you need partial progress, each step must catch its
own failure and return a sentinel, which is a different (and usually worse)
design.
