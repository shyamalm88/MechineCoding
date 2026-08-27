# Why state looks "one render behind"

```js
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
console.log(count)     // still the OLD value
// count increases by 1, not 3
```

Two separate things are happening, and conflating them is the usual confusion.

## 1. `count` is a const from this render

```js
const [count, setCount] = useState(0)
```

`count` is a **snapshot**, captured when this render ran. `setCount` cannot
reassign a const in a closure that has already executed. Reading `count` after
setting it always gives the old value — not because the update is "slow", but
because you are reading a variable that will never change.

The new value arrives as a **new `count` const in the next render**.

## 2. Three calls, one stale base

All three read the same `count` (say 0), so all three queue "set to 1". React
processes the queue and lands on 1.

**Functional updaters compose** because each receives the pending value rather
than the closure's:

```js
setCount(c => c + 1)   // 0 → 1
setCount(c => c + 1)   // 1 → 2
setCount(c => c + 1)   // 2 → 3
```

Rule of thumb: **if the next state depends on the previous state, use the
functional form.**

## Batching

React 18 batches updates from **any** source — event handlers, promises,
timeouts, native listeners — into a single re-render. Before 18, only React
event handlers were batched.

Batching is why you never see an intermediate render at count 1 and 2. Escape
it with `flushSync` when you must read the DOM immediately after an update
(measuring a just-rendered element) — sparingly, since it forces a synchronous
render.

## The bail-out

```js
setCount(0)   // when count is already 0
```

React compares with `Object.is` and **skips the re-render**. It may still render
once more before bailing out, so this is an optimisation, not a guarantee — do
not rely on it to prevent an infinite loop.

## Getting the value you just set

Do not chase it. Either compute it locally:

```js
const next = count + 1
setCount(next)
doSomethingWith(next)
```

or react to it in an effect keyed on the value. Trying to read state back out of
React right after setting it is fighting the model.
