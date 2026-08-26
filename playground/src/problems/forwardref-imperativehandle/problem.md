# forwardRef and useImperativeHandle

## The problem

`ref` is not a prop. Putting `ref` on a function component historically warned
and gave you nothing, because there was no instance to attach.

```js
const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />
})
```

`forwardRef` passes the ref through to a DOM node inside.

> **React 19 note:** `ref` is now a regular prop for function components, so
> `forwardRef` is no longer required for the common case. Existing code still
> works; new code can just destructure `ref` from props.

## useImperativeHandle — narrowing the surface

Exposing the raw DOM node hands the parent *everything*, including the ability
to mutate styles or read layout. `useImperativeHandle` exposes a deliberate API
instead:

```js
const Input = forwardRef(function Input(props, ref) {
  const inner = useRef(null)
  useImperativeHandle(ref, () => ({
    focus: () => inner.current.focus(),
    clear: () => { inner.current.value = '' },
  }), [])
  return <input ref={inner} {...props} />
})
```

The parent can `focus()` and `clear()`, and nothing else. That is the point:
it is an encapsulation tool, not a convenience.

## When imperative is legitimate

React is declarative, and imperative handles are an escape hatch — but a
necessary one for things that are genuinely commands, not state:
`focus()`, `scrollIntoView()`, `play()`/`pause()`, `select()`.

## Traps

- Omitting the dependency array recreates the handle every render, so a parent
  holding the ref sees a changing object.
- Reaching for a ref to *set values* usually means state should have been lifted
  instead — that is the smell interviewers probe for.
