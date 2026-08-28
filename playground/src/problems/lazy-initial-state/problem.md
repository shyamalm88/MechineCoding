# Lazy initial state (and the useRef equivalent)

## The short answer

```js
useState(expensiveInit())        // ✗ runs on EVERY render
useState(() => expensiveInit())  // ✓ runs once, on mount
```

Both hold the same value. The first one just does the work over and over and
throws the result away.

Run the demo: click "Re-render" a few times and watch the eager counter climb
while the lazy one stays at 1.

## Why the first version is wrong

Arguments are evaluated **before** the function is called — that is ordinary
JavaScript, nothing React-specific:

```js
useState(expensiveInit())
//       └── this runs FIRST, every single render
//           React then ignores the result after the first
```

Passing a **function** hands React the *ability* to call it, and it only chooses
to on mount.

The insidious part: **the state is still correct**. Nothing is broken. You are
simply doing the work N times for no reason, and nothing in the UI tells you.

## When it matters

- parsing `localStorage` / cookies on mount
- building a large derived structure (a `Map` from a big array)
- creating expensive objects
- anything you would notice in a profile

For `useState(0)` or `useState('')` the lazy form is pointless noise — creating
a closure costs more than the literal.

## The same trap with useRef — and no lazy form

```js
const ref = useRef(new IntersectionObserver(cb))   // ✗ a NEW observer per render
```

A fresh observer is constructed on every render and immediately discarded. Worse
than `useState`, because constructing an observer/WebSocket/class instance can
have side effects.

`useRef` has **no** lazy variant, so the idiom is:

```js
const ref = useRef(null)
if (ref.current === null) {
  ref.current = new IntersectionObserver(cb)
}
```

Initialising during render like this is acceptable precisely because it is
**idempotent and has no external effect** — it is the one sanctioned exception
to "don't write refs during render".

## Two functions, unrelated mechanisms

```js
useState(() => expensiveInit())   // lazy INITIALISER — runs once
setCount(c => c + 1)              // functional UPDATER — computes next state
```

Both take a function; they are different features. Confusing them leads to:

**Storing a function in state** — the classic gotcha:

```js
const [fn, setFn] = useState(myFunction)      // ✗ React CALLS it as an initialiser
const [fn, setFn] = useState(() => myFunction) // ✗ still calls it — returns myFunction, ok by luck
setFn(myFunction)                              // ✗ treated as an updater!
setFn(() => myFunction)                        // ✓ the only correct form
```

Because React cannot distinguish "a function you want stored" from "a function
you want called", storing functions in state always needs the extra wrapper.

## How to answer this out loud

"`useState(expensiveInit())` calls the function on every render and React
discards the result after the first — the state is right, you're just repeating
the work invisibly. Passing a function instead lets React call it only on mount.
The same trap hits `useRef`, which has no lazy form at all, so the idiom is a
null check and assign during render. It's safe there because it's idempotent."

## Follow-ups to expect

- *Is it always worth it?* No — for a primitive literal the closure costs more.
- *Does the initialiser re-run in Strict Mode?* Yes, twice in development, which
  is another reason it must be pure.
- *How would you notice this in a real app?* A profile showing time in a
  function that has no business running on re-render.
