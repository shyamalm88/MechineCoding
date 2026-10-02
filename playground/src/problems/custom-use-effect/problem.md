# Implement useEffect (a polyfill)

`useEffect` runs a function when its dependencies change, and runs the previous
run's **cleanup** first. Rebuilding it shows what the dependency array actually
does.

## A closure holds the previous run

```js
function createUseEffect() {
  let prevDeps
  let cleanup

  return function useEffect(effect, deps) { ... }
}
```

`prevDeps` and `cleanup` live in the closure — one pair per hook instance. Real
React stores them per component in a fiber, indexed by **call order**, which is
why hooks cannot be called conditionally.

## useEffect's dependency logic

```js
const hasNoDeps = !deps
const depsChanged = !prevDeps || deps.some((dep, i) => dep !== prevDeps[i])
if (hasNoDeps || depsChanged) { ... }
```

Three cases, and the distinction matters:

- **no deps argument** → run after every render
- **`[]`** → run once (nothing can ever change)
- **`[a, b]`** → run when any entry changes (`!==`)

Comparison is **shallow**, which is exactly why an inline object or array in a
dependency array re-runs the effect every render — a fresh reference is never
equal to the previous one. (React uses `Object.is`, which also treats `NaN` as
equal to itself.)

## Cleanup ordering

```js
if (typeof cleanup === "function") cleanup()   // BEFORE the next setup
cleanup = effect()
prevDeps = deps
```

React runs the previous cleanup before the next effect, not after. Getting this
backwards produces a window where two subscriptions are live at once — the bug
Strict Mode's double-invoke is designed to expose.

## What this omits

- **Unmount cleanup** — there is no way to tell this hook the component is gone.
- **Running after paint** — React runs effects asynchronously after the browser
  paints; this runs `effect()` synchronously.
- `useState`, batching, fibers and per-component instances.
