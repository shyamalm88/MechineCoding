# Synthetic events and delegation

`onClick` does **not** attach a listener to that DOM node. React attaches one
listener per event type and dispatches from there — classic event delegation.

## The change in React 17 that still catches people

- **React ≤16**: handlers delegated to `document`.
- **React ≥17**: delegated to the **root container** (`createRoot(el)`).

Why it mattered: with two React versions on one page, or React inside a non-React
app, a `stopPropagation()` in the outer app could never stop React 16 handlers
(they were already at `document`), and nested roots interfered with each other.
Root-level attachment made React embeddable.

## The consequences

**A native listener on the same element fires *before* the React handler**,
because React's is up at the root and the event has to bubble there first. That
ordering surprises people mixing the two.

**`e.stopPropagation()` in a React handler does not stop native listeners on
ancestors** that were registered directly — the event already reached the root
to trigger React's dispatch.

To stop everything, you need the native event:
`e.nativeEvent.stopImmediatePropagation()`.

## SyntheticEvent

A cross-browser wrapper with a normalised API. `e.nativeEvent` is always the
real event underneath.

**Pooling is gone.** React ≤16 recycled event objects, so reading `e.target`
asynchronously gave `null` and you needed `e.persist()`. React 17 removed
pooling — but `e.persist()` still exists as a no-op, and the old advice is still
repeated in interviews.

## Events that cannot be delegated

Some do not bubble — `scroll` (on an element), `focus`/`blur`, `mouseenter`,
media events. React handles the focus family by delegating the bubbling
`focusin`/`focusout` equivalents, which is why `onFocus`/`onBlur` *do* bubble in
React while native `focus`/`blur` do not. That difference alone causes real
confusion in form code.

## Portals bubble through the React tree

An event inside a portal propagates to the portal's **React** parent, not its DOM
parent — because propagation follows the component hierarchy React knows about.
See the React Portals problem.

## Practical notes

- Prefer React handlers; drop to native (via a ref + `addEventListener`) for
  non-passive listeners, `wheel`, or when you need capture semantics React does
  not expose.
- A native listener added in an effect must be removed in the cleanup.
- `onChange` in React is really the native `input` event — it fires on every
  keystroke, unlike native `change`, which fires on blur.
