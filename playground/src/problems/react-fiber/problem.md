# What is React Fiber and why was it introduced?

## The problem with the old reconciler

Pre-16 React used the call stack to walk the component tree. Once rendering
began it **could not stop** — a deep tree meant a long synchronous task, and the
browser could not paint, handle input, or run animations until it finished.
That is dropped frames and unresponsive typing.

## What Fiber changed

Fiber reimplements the tree walk as a **linked-list of work units** React
manages itself, rather than relying on the JS call stack:

```
fiber = { type, stateNode, child, sibling, return, alternate, flags }
```

Because the traversal state lives in these objects, React can **pause** after
any unit, hand control back to the browser, and **resume** later — or throw the
work away and restart with newer, higher-priority input.

## Two phases

1. **Render / reconcile** — build the work-in-progress tree, compute changes.
   **Interruptible.** May be paused, aborted, or restarted, so anything here can
   run more than once — this is why render must be pure and why side effects in
   render are a bug.
2. **Commit** — apply changes to the DOM. **Synchronous and uninterruptible**,
   so the user never sees a half-updated UI.

The `alternate` pointer implements double buffering: React builds the new tree
alongside the current one and swaps on commit.

## What it enabled

Fiber is the foundation, not the feature. It made possible: concurrent
rendering, `useTransition`, `useDeferredValue`, Suspense, automatic batching,
and time slicing — all of which need the ability to interrupt rendering.

## Trap

"Fiber made React faster" is imprecise. Raw throughput is comparable; what Fiber
bought is **scheduling** — the ability to prioritise urgent work over
non-urgent, so the app *feels* responsive.
