# Implement useState / useEffect (a mini hooks runtime)

Building the runtime is the clearest possible explanation of **why the rules of
hooks exist**.

## Hooks are identified by call order

```js
const cells = []      // one slot per hook call
let cursor = 0        // reset to 0 before EVERY render
```

There is no name, no key — `useState` simply takes `cells[cursor++]`. That single
design decision explains everything:

```js
if (cond) useState(0)   // ✗ shifts every later hook's index
useState(1)             // now reads the wrong cell
```

A conditional hook desynchronises the cursor, so hook #2 reads hook #1's state.
That is the "Rendered fewer hooks than expected" error, and why the linter rule
is not merely stylistic.

## useEffect's dependency logic

```js
const changed = !prev || !deps || deps.some((d, i) => !Object.is(d, prev.deps[i]))
```

Three cases, and the distinction matters:

- **no deps argument** → run after every render
- **`[]`** → run once (nothing can ever change)
- **`[a, b]`** → run when any entry changes, compared with `Object.is`

Comparison is **shallow**, which is exactly why an inline object or array in a
dependency array re-runs the effect every render — a fresh reference is never
`Object.is`-equal.

## Cleanup ordering

```js
prev?.cleanup?.()   // BEFORE the next setup
const cleanup = effect()
```

React runs the previous cleanup before the next effect, not after. Getting this
backwards produces a window where two subscriptions are live at once — the bug
Strict Mode's double-invoke is designed to expose.

## Batching

`setState` here schedules a microtask rather than re-rendering synchronously, so
several calls in one turn produce one render. That is React 18's automatic
batching in miniature.

Note the bail-out: `Object.is(next, current)` and the update is dropped
entirely — React does the same, which is why setting state to its current value
does not always re-render.

## What this omits

Fibers, reconciliation, priority lanes, concurrent interruption, and per-
component instances (this runtime has exactly one). The hook *semantics*,
though, are genuinely these ~60 lines.
