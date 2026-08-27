# Hydration mismatches

> Text content did not match. Server: "10:04:31" Client: "10:04:32"

## What hydration is

The server sends HTML. The client renders the same tree and **attaches** to the
existing DOM rather than recreating it — adopting nodes and wiring up events.
The premise is that both renders produce identical output.

## What happens on a mismatch

React 18+ treats it as a **client-side error and re-renders the whole subtree
from scratch**. So the visible symptom is not just a console warning: it is a
flash, lost input focus, and the performance benefit of SSR being thrown away
for that subtree.

It cannot patch the difference — the tree it built no longer corresponds to the
DOM it was told to adopt.

## The usual causes

| Cause | Example |
|---|---|
| Time / dates | `new Date().toLocaleTimeString()` |
| Randomness | `Math.random()`, `uuid()` |
| Browser-only APIs | `window.innerWidth`, `localStorage` |
| Locale / timezone | server UTC, client local |
| `typeof window !== 'undefined'` branches | different tree on each side |
| Invalid nesting | `<p><div></div></p>` — the parser *moves* the div |
| Browser extensions | injecting attributes into the DOM |

The invalid-nesting one is worth knowing: the HTML parser silently restructures
illegal markup, so the DOM the client sees genuinely differs from what was sent.

## The fixes

**Render the same thing on both passes, then update after mount:**

```js
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
return <span>{mounted ? new Date().toLocaleTimeString() : null}</span>
```

Deliberately costs one extra client render — that is the price of correctness.

**`suppressHydrationWarning`** for a genuinely unavoidable, single-element
difference (a timestamp). It silences the warning for that element only; it does
not fix anything, so use it sparingly.

**`useId`** for generated ids, so server and client agree:

```js
const id = useId()   // stable across both renders
```

`Math.random()` for ids is a guaranteed mismatch.

**Client-only components** — in Next.js, `dynamic(() => import('./X'), { ssr: false })`.

## The deeper point

A hydration mismatch means your render is **not a pure function of props and
state** — it depends on something ambient (clock, environment, randomness). The
warning is telling you about impurity; the framework is the messenger.
