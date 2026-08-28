# What is React Fiber and why was it introduced?

## The short answer

Fiber is React's **reimplementation of the reconciler** (React 16) that made
rendering **interruptible**.

Before Fiber, once React started rendering it could not stop until it finished.
Fiber lets React pause after any unit of work, hand control back to the browser,
and resume — or throw the work away and restart with newer input.

## The problem with the old reconciler

The pre-16 reconciler walked the component tree using the **JavaScript call
stack** — recursive function calls. That is simple and fast, but the call stack
cannot be paused. Once you enter the recursion, you are committed.

For a deep tree that means a long synchronous task. During it the browser
cannot:

- paint
- respond to clicks or typing
- run animations

The result is dropped frames and an input box that ignores you mid-render.

## What Fiber changed

Fiber reimplements the traversal as a **linked list of work units** that React
manages itself, instead of relying on the call stack:

```js
fiber = {
  type, stateNode,          // what this is
  child, sibling, return,   // tree links — the traversal state
  alternate,                // the previous version of this fiber
  flags                     // what changed
}
```

Because the traversal state lives in these objects rather than in stack frames,
React can stop between units, check whether it has time left (or whether
something more urgent arrived), and continue later.

The `alternate` pointer implements **double buffering**: React builds the
work-in-progress tree alongside the current one and swaps them on commit — the
same idea as a graphics back buffer.

## Two phases

| Phase | Interruptible? | What happens |
|---|---|---|
| **Render / reconcile** | **Yes** | Build the work-in-progress tree, compute changes |
| **Commit** | **No** | Apply changes to the DOM, run layout effects |

The render phase may be **paused, aborted, or restarted**, which means anything
in it can run **more than once**. That is precisely why:

- render must be pure
- side effects in render are a bug
- Strict Mode double-invokes renders to expose impurity

The commit phase is synchronous and uninterruptible so the user never sees a
half-updated UI.

## What it enabled

Fiber is the **foundation**, not the feature. Everything built on it needs
interruptible rendering:

- concurrent rendering
- `useTransition` and `useDeferredValue`
- Suspense and streaming SSR
- automatic batching
- time slicing and priority lanes

## The trap in how people describe it

"Fiber made React faster" is imprecise. Raw throughput is comparable — Fiber
actually adds bookkeeping. What it bought is **scheduling**: the ability to
prioritise urgent work (a keystroke) over non-urgent work (re-filtering a big
list), so the app *feels* responsive even when total work is unchanged.

Responsiveness and throughput are different things, and Fiber traded a little of
the second for a lot of the first.

## How to answer this out loud

"Fiber is the rewrite of React's reconciler in v16 that made rendering
interruptible. The old one walked the tree with the call stack, so once a render
started it ran to completion — a deep tree meant a long task where the browser
couldn't paint or handle input. Fiber keeps the traversal state in linked node
objects React manages itself, so it can pause, yield, and resume or restart. It
split work into an interruptible render phase and a synchronous commit phase,
and that's what made concurrent features, Suspense and transitions possible."

## Follow-ups to expect

- *Why must render be pure?* It can be run multiple times or thrown away.
- *What is a lane?* The priority mechanism Fiber uses to decide what to work on.
- *Is the Virtual DOM the same thing?* No — the vnode tree is the description;
  Fiber is the machinery that processes it.
