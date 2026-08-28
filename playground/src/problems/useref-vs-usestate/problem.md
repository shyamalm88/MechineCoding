# useRef vs useState

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render | **Yes** | **No** |
| Value across renders | New const each render | **Same object**, `.current` mutable |
| Update timing | Async (batched) | **Synchronous** |
| Read during render | Yes | Discouraged |

## The rule

**If it should appear on screen, it is state. If it only needs to survive
renders, it is a ref.**

Mutating `ref.current` does not schedule a render — which is exactly why the
demo's counter looks stuck until something else re-renders and happens to read
it. That is not a bug, it is the defining property.

## Legitimate ref use

- **DOM nodes** — `<input ref={inputRef} />`, then `.focus()` / `.scrollIntoView()`
- **Timer and observer ids** — not render output, and storing them in state
  would re-render per tick
- **The "previous value"** pattern
- **Mutable boxes to escape stale closures** — see the Stale Closures problem
- **Instance-like values** that must not be recreated per render

## Reading and writing during render

React asks that you not read or write `ref.current` **during render** — a ref
mutated in render makes the render impure, and under concurrent rendering the
render may run twice or be thrown away, so the value becomes unpredictable.

The one sanctioned exception is lazy initialisation, because it is idempotent:

```js
if (ref.current === null) ref.current = expensiveThing()
```

Reading a ref during render (like `renders.current` in the demo) is fine for a
debug display but is technically impure — the value shown can lag.

## Two things people get wrong

**A ref does not need to hold a DOM node.** `useRef(0)` is a perfectly normal
mutable box; the DOM association is just its most visible use.

**`useRef` has no lazy initialiser.** `useRef(new Foo())` constructs a `Foo` on
every render and throws all but the first away — unlike `useState(() => …)`,
there is no function form. Use the null-check idiom above.

## Callback refs

For measuring a node the moment it mounts, a callback ref fires at attach time
and is often better than `useRef` + `useEffect`:

```jsx
<div ref={node => { if (node) setHeight(node.getBoundingClientRect().height) }} />
```

In React 19 a callback ref may also return a cleanup function.

## Worked example: why the ref counter looks broken

In the demo, clicking "ref.current +1" appears to do nothing — then clicking
"setState +1" makes the accumulated ref value suddenly appear.

That is not a bug. Mutating a ref does not schedule a render, so nothing
re-reads it. When something *else* triggers a render, the new value is picked up.
This is the defining difference in one observable behaviour.

## How to answer this out loud

"Both survive re-renders; the difference is that state triggers a re-render and a
ref doesn't. So the rule is: if it should appear on screen, it's state; if it
just needs to persist — a timer id, a DOM node, the previous value, a mutable box
to escape a stale closure — it's a ref. React also asks you not to read or write
refs during render, because a render can run twice or be discarded; the one
sanctioned exception is lazy init with a null check, since that's idempotent."

## Follow-ups to expect

- *Why does `useRef` have no lazy initialiser?* An oversight in practice; the
  null-check idiom is the accepted workaround.
- *Can a ref hold non-DOM values?* Yes — `useRef(0)` is just a mutable box.
- *What is a callback ref for?* Measuring a node the instant it attaches, without
  a separate effect; in React 19 it can return a cleanup.
