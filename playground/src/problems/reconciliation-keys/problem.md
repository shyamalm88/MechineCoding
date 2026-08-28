# Reconciliation, keys, and list rendering

## The short answer

**Reconciliation** is how React decides what changed between two renders. It
compares the new element tree with the previous one and works out the minimum
set of DOM operations.

Comparing two arbitrary trees properly is **O(n³)** — unusable. React gets it
down to **O(n)** by making two assumptions.

## Heuristic 1: different type means throw it away

```jsx
<div><Counter /></div>     →     <span><Counter /></span>
```

The root changed from `div` to `span`, so React **destroys the entire subtree
and rebuilds it** — it does not try to match up the children. `Counter` unmounts
and remounts, losing all its state.

This is usually what you meant, and it makes the comparison cheap. But it is
also why conditionally swapping a wrapper element resets everything inside it.

## Heuristic 2: keys give children identity

Without keys, React compares children **by position**:

```
before:  [A, B, C]
after:   [X, A, B, C]      ← inserted at the front

position 0: A → X   "changed"
position 1: B → A   "changed"
position 2: C → B   "changed"
position 3: —  → C  "added"
```

Four operations for what was really **one insertion**. With keys, React matches
`A`→`A`, `B`→`B`, `C`→`C` and just inserts `X`.

## Why index keys are a bug

```jsx
{items.map((item, i) => <Row key={i} item={item} />)}
```

Using the index makes the key **equal to the position** — which throws away
exactly the identity information keys exist to provide. You have told React
"the thing at position 0 is called 0", which it already knew.

For pure display output this is merely wasteful. It becomes a **visible bug**
when rows hold internal state:

```
before:  key=0 → "Buy milk"   [✓ checked]
         key=1 → "Walk dog"   [ ]

prepend "Call mum":

after:   key=0 → "Call mum"   [✓ checked]   ← the tick moved!
         key=1 → "Buy milk"   [ ]
```

React reused the component instance at key 0 and just changed its props. The
checkbox state, focus, scroll position and any half-typed text stay attached to
the **position**, not the item.

Index keys are safe **only** when the list is never reordered, inserted into,
filtered, or sorted — i.e. a static list, where they buy you nothing anyway.

## Keys are not just for lists

Changing a `key` on *any* element forces React to unmount and remount it. That
is the idiomatic way to reset a component's internal state:

```jsx
<ProfileForm key={userId} user={user} />   // switching user gives a fresh form
```

See "Resetting State with key" for when this beats syncing with an effect.

## Traps

- **Keys must be unique among siblings**, not globally. Two different lists may
  both use key `1`.
- **`key={Math.random()}`** remounts every row on every render — destroying
  state, focus and performance. Surprisingly common.
- **Keys are consumed by React**; you cannot read `props.key` inside the
  component. Pass the id as a separate prop if you need it.
- A key must be **stable across renders** — deriving it from array position or
  render time defeats the purpose.

## How to answer this out loud

"Reconciliation is React diffing the new element tree against the old one. A
general tree diff is O(n³), so React assumes two things: a different element
type means replace the whole subtree, and keys identify children across renders.
Index keys are the classic bug — they encode position rather than identity, so
inserting at the front makes React reuse the wrong component instances and state
like checkbox ticks visibly attaches to the wrong row."

## Follow-ups to expect

- *When are index keys fine?* Static lists that never reorder — but then a
  stable id costs nothing either.
- *Does React diff the real DOM?* No — it diffs its own element trees and then
  applies the minimal DOM operations.
- *What is the Virtual DOM's role here?* It is the cheap representation being
  compared; see the Virtual DOM problem.
