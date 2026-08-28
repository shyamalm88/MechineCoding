# Automatic batching in React 18

## The short answer

**Batching** means React collects several state updates and performs **one**
re-render instead of one per update.

React 17 only did this inside React event handlers. **React 18 batches updates
from anywhere** — promises, `setTimeout`, native event listeners, everything.

```jsx
function handleClick() {          // React 17 AND 18: one render
  setCount(c => c + 1)
  setFlag(f => !f)
}

setTimeout(() => {
  setCount(c => c + 1)            // React 17: render #1
  setFlag(f => !f)                // React 17: render #2  ← wasteful
}, 0)                             // React 18: ONE render
```

## Why the old behaviour was a problem

Two renders is not just slower — it means the UI briefly exists in a state where
`count` has updated but `flag` has not. If those two values are meant to change
together, that intermediate frame is **visibly inconsistent**.

The reason 17 behaved that way was implementation detail, not design: React
controlled its own event handlers so it could wrap them, but it had no hook into
a random `setTimeout` callback. React 18's new root (`createRoot`) let it batch
universally.

## Getting it

You need the new root API:

```js
// React 18 behaviour
ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// legacy behaviour, still only batches React events
ReactDOM.render(<App />, document.getElementById('root'))
```

No other code changes required — this is why it is called *automatic*.

## Opting out with flushSync

Occasionally you must render **now**, because you need to read the DOM
immediately afterwards:

```js
flushSync(() => setItems(next))     // commit synchronously
listRef.current.scrollTop = listRef.current.scrollHeight  // measure the new DOM
```

Without `flushSync` the DOM has not updated yet, so you would measure the old
content.

Use it sparingly. It forces a synchronous render and defeats exactly the
batching you otherwise want; wrapping everything in `flushSync` recreates React
17's performance profile.

## The mental model people get wrong

Batching does **not** mean updates are delayed, merged, or lossy. Each
`setState` call is **queued**; React then processes the whole queue and renders
once with the final result.

That is a different thing from this:

```js
setCount(count + 1)
setCount(count + 1)   // still 1, not 2
```

That is not batching's fault — both calls read the same stale `count` from the
current render's closure. Functional updaters compose correctly because each
receives the pending value:

```js
setCount(c => c + 1)
setCount(c => c + 1)   // now 2
```

## The bail-out

```js
setCount(0)   // when count is already 0
```

React compares with `Object.is` and **skips the re-render**. It may still render
once more before bailing out, so treat this as an optimisation, not a guarantee —
do not rely on it to break an infinite loop.

## How to answer this out loud

"Batching means multiple state updates produce one re-render. React 17 only
batched inside its own event handlers, so updates in a promise or setTimeout each
caused their own render. React 18 batches everywhere once you use `createRoot` —
fewer renders and no inconsistent intermediate states. If you genuinely need the
DOM updated before the next line, `flushSync` opts out, but it's a last resort."

## Follow-ups to expect

- *Why can't I read state right after setting it?* The variable is a const from
  this render; the new value arrives as a new const in the next render.
- *Does batching apply to `useReducer`?* Yes — same queue.
- *How does this relate to concurrent rendering?* Batching is about grouping
  updates; concurrency is about being able to interrupt the resulting render.
  Both were enabled by the Fiber architecture.
