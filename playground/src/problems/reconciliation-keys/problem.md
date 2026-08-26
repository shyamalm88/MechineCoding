# Reconciliation, keys, and list rendering

## The two heuristics

A general tree diff is O(n³). React reaches O(n) by assuming:

1. **Different types → different trees.** `<div>` becoming `<span>` unmounts the
   entire subtree and rebuilds it, discarding all state within.
2. **Keys give children stable identity** across renders.

## Why index keys break

```js
{items.map((item, i) => <Row key={i} item={item} />)}
```

Prepend an item and every index shifts. React sees "the element at key 0 changed
its props" rather than "a new element was inserted", so it **reuses the existing
component instances** and just updates props.

For pure display that is merely wasteful. When rows hold internal state it is a
real bug: a checked checkbox, focused input, or half-typed text stays attached
to the *position*, not the item — so it visibly jumps to the wrong row.

Index keys are safe only when the list is static: never reordered, inserted
into, or filtered.

## Key uses beyond lists

Changing a `key` on any element forces React to unmount and remount it —
the idiomatic way to reset a component's internal state:

```js
<ProfileForm key={userId} user={user} />   // switching user resets the form
```

## Traps

- Keys must be unique **among siblings**, not globally.
- `key={Math.random()}` remounts every row on every render — destroying state,
  focus, and performance.
- Keys are consumed by React and are not readable as `props.key`.
