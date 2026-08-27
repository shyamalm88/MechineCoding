# Lazy initial state (and the useRef equivalent)

```js
useState(expensiveInit())        // ✗ runs on EVERY render
useState(() => expensiveInit())  // ✓ runs once
```

## Why the first is wrong

The argument to `useState` is evaluated **before** `useState` is called — that is
just how JavaScript argument evaluation works. So `expensiveInit()` executes on
every render; React simply *ignores* the result after the first.

The state is still correct. The cost is silent and invisible, which is what
makes it a good interview question: nothing is broken, you are just doing the
work N times.

Passing a **function** lets React decide when to call it — and it only does so
on mount.

## When it matters

- Parsing `localStorage`, reading cookies
- Building a large derived structure (a Map from a big array)
- Any measurable computation

For `useState(0)` or `useState('')` the lazy form is pointless noise — creating
a closure costs more than the literal.

## The same trap with useRef

`useRef` has **no** lazy form:

```js
const ref = useRef(new IntersectionObserver(cb))   // ✗ constructs one PER RENDER
```

A new observer is allocated every render and immediately discarded. The idiom:

```js
const ref = useRef(null)
if (ref.current === null) ref.current = new IntersectionObserver(cb)
```

Initialising during render like this is acceptable precisely because it is
idempotent and has no external effect.

## Related: the functional updater is a different thing

```js
useState(() => expensiveInit())   // lazy INITIALISER — runs once
setCount(c => c + 1)              // functional UPDATER — computes the next state
```

Both take a function; they are unrelated mechanisms. Confusing them leads to
`setCount(() => 5)` when you meant `setCount(5)` — which happens to work, and
`useState(() => fn)` when you wanted to *store* a function, which does not
(React calls it). To store a function in state you need
`useState(() => () => fn)`.
