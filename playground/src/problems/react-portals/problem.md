# React Portals — use cases and event bubbling

```js
createPortal(children, document.body)
```

Renders children into a **different DOM node** while keeping them in the same
**React tree**.

## Why they exist

`overflow: hidden`, `z-index` stacking contexts, and `transform` on an ancestor
will clip or mis-stack a modal, dropdown, or tooltip. A portal escapes the
ancestor's DOM position entirely — rendering to `document.body` — so no parent
CSS can trap it.

## The counter-intuitive part

**Events bubble through the React tree, not the DOM tree.**

```jsx
<div onClick={handleClick}>          {/* fires! */}
  {createPortal(<button/>, document.body)}
</div>
```

Clicking that button triggers the parent's `onClick`, even though in the DOM the
button is a child of `<body>`, nowhere near the div. React's synthetic event
system propagates along the component hierarchy it knows about.

That is usually desirable (context, handlers, and state all keep working), but
it surprises people implementing click-outside: a native listener on `document`
sees the real DOM position, while React's handler sees the tree position.

## What still works, and what doesn't

- **Works**: context, state, refs, error boundaries — everything React-tree based.
- **Doesn't**: CSS inheritance and selectors from the original parent, since the
  node genuinely lives elsewhere.

## Accessibility

A portal solves layout, not semantics. A modal still needs `role="dialog"`,
`aria-modal`, focus moved into it, a focus trap, `Escape` to close, and focus
restored to the trigger. `aria-labelledby` cannot point at an id that is not in
the accessibility tree.
