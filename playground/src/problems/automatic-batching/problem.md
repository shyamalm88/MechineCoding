# Automatic batching in React 18

## What changed

**React 17**: multiple `setState` calls were batched only inside React event
handlers. Anywhere else — promises, `setTimeout`, native listeners — each
triggered its own render.

```js
function handleClick() {          // 17 and 18: one render
  setA(1); setB(2)
}

setTimeout(() => {
  setA(1); setB(2)                // 17: TWO renders. 18: one.
}, 0)
```

**React 18** batches updates from **any** source. Fewer renders, no intermediate
inconsistent states, no code change required — you just need `createRoot`
(`ReactDOM.render` keeps legacy behaviour).

## Opting out

```js
flushSync(() => setValue(x))   // commit synchronously, before continuing
```

Needed when you must read the DOM immediately after an update — measuring an
element you just rendered, or scrolling to it. Use sparingly: `flushSync`
forces a synchronous render and defeats the batching you otherwise want.

## The mental model people get wrong

Batching does not mean updates are "delayed" or "merged into one value". Each
`setState` is queued; React processes the whole queue then renders once with the
final result. State is still updated in order — you just do not see intermediate
renders.

This is also why reading state right after setting it shows the old value: the
variable in the current closure never changes. `setCount(c => c + 1)` exists
precisely so successive updates compose correctly within a batch.
