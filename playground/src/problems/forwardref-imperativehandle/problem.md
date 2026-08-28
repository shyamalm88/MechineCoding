# forwardRef and useImperativeHandle

## The short answer

`forwardRef` lets a parent's `ref` reach a DOM node **inside** your component.
`useImperativeHandle` lets you expose a **deliberate API** on that ref instead of
the raw node.

> **React 19:** `ref` is now a regular prop for function components, so
> `forwardRef` is no longer needed for the common case. Existing code still
> works. Know both — most codebases are still on the older pattern.

## The problem forwardRef solves

`ref` is not a normal prop. React intercepts it, so it never appears in `props`:

```jsx
function Input(props) {
  return <input {...props} />       // props.ref is undefined
}

<Input ref={myRef} />               // historically: warning, ref is null
```

There is no instance to attach a ref to on a function component. `forwardRef`
explicitly passes it through as a second argument:

```jsx
const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />
})

inputRef.current.focus()            // now works
```

## Why useImperativeHandle exists

Forwarding the raw DOM node hands the parent **everything** — it can mutate
styles, read layout, change the value, remove the element. That is a leaky
abstraction, and any of it becomes something you cannot change later.

`useImperativeHandle` narrows the surface to a deliberate contract:

```jsx
const Input = forwardRef(function Input(props, ref) {
  const inner = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => inner.current.focus(),
    clear: () => { inner.current.value = '' },
  }), [])

  return <input ref={inner} {...props} />
})
```

The parent can `focus()` and `clear()`. It cannot reach into the DOM. **This is
an encapsulation tool, not a convenience** — that framing is the answer
interviewers want.

## When imperative is legitimate

React is declarative, and refs are an escape hatch — but a necessary one.
Some things are genuinely **commands**, not state:

- `focus()`, `blur()`, `select()`
- `scrollIntoView()`, scroll position
- `play()`, `pause()` on media
- triggering an animation
- opening a `<dialog>` via `showModal()`

You cannot express "focus this now" as a piece of state, because focusing is an
event in time, not a value. Trying to model it as state (`shouldFocus: true`)
leads to awkward reset logic.

## The smell to watch for

Reaching for a ref to **set a value** usually means state should have been lifted
instead:

```jsx
// ✗ imperative for something that is really state
inputRef.current.setValue('hello')

// ✓ just pass it down
<Input value={value} onChange={setValue} />
```

Interviewers probe exactly this: can you tell "command" from "state"?

## Traps

- **Omitting the dependency array** recreates the handle every render, so a
  parent holding the ref sees a changing object — and any effect depending on it
  re-runs.
- The handle **only exists after mount**, so `ref.current` is `null` during the
  first render.
- `forwardRef` components show as `ForwardRef(Input)` in DevTools unless you
  name the inner function — worth doing.

## React 19 changes

```jsx
// React 19: ref is just a prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

Also new: **ref callbacks may return a cleanup function**, which removes a
whole class of "the ref fired with null and I forgot to handle it" bugs:

```jsx
<div ref={(node) => {
  const observer = new ResizeObserver(…)
  observer.observe(node)
  return () => observer.disconnect()    // 19 only
}} />
```

## How to answer this out loud

"`ref` isn't a normal prop — React intercepts it — so `forwardRef` was how you
passed one through to a DOM node inside a component. `useImperativeHandle` then
lets you expose a specific API like `focus()` and `clear()` rather than the raw
node, which is really about encapsulation. In React 19 `ref` became a regular
prop so `forwardRef` isn't needed for the common case. I'd use an imperative
handle only for genuine commands — focus, scroll, play — because anything that's
really state should be lifted instead."

## Follow-ups to expect

- *When would you not use a ref?* Anything expressible as state.
- *How do you merge two refs?* A callback ref that assigns to both, or a
  `useMergedRefs` helper — common when a library and your code both need one.
- *What is a callback ref good for?* Measuring a node the moment it attaches,
  without a separate effect.
