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

## Worked example: why your native listener fires first

```jsx
<div onClick={() => log('3. React parent')}>
  <button
    ref={el => el?.addEventListener('click', () => log('1. native on button'))}
    onClick={() => log('2. React button')}
  />
</div>
```

The native listener runs **before both React handlers**, because React's handler
is not on the button at all — the event has to bubble up to the React root
before React dispatches it through the component tree.

## How to answer this out loud

"React doesn't attach a listener per element — it attaches one per event type at
the root container and dispatches from there, which is event delegation. That
moved from `document` to the root in React 17 so multiple React versions and
embedded apps stop interfering. The consequences are that a native listener on
the same element fires before your React handler, and `stopPropagation` in React
won't stop native listeners on ancestors, because the event already reached the
root. Pooling was removed in 17, so `e.persist()` is a no-op now — though the old
advice still circulates."

## Follow-ups to expect

- *Why do `onFocus`/`onBlur` bubble in React?* React delegates the bubbling
  `focusin`/`focusout` equivalents, unlike native `focus`/`blur`.
- *How do you add a passive or capture listener?* Drop to a ref and
  `addEventListener` with options — React does not expose them.
- *Why is `onChange` different?* React's `onChange` is the native `input` event,
  so it fires per keystroke rather than on blur.
