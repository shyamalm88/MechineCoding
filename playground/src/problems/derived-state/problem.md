# The derived-state anti-pattern

## The short answer

If you can **compute** a value from existing state and props, it is **not
state**. Storing it separately creates two sources of truth that drift.

```jsx
// ✗ derived state
const [items, setItems] = useState([])
const [filtered, setFiltered] = useState([])
useEffect(() => { setFiltered(items.filter(matches)) }, [items, query])

// ✓ derived during render
const filtered = items.filter(matches)
```

## Why the effect version is worse

**1. It renders twice.** Render with stale `filtered` → effect runs → setState →
render again. The user can see the intermediate frame, which shows the *old*
filtered list under the *new* query.

**2. Two sources of truth.** Any update path that forgets to refresh `filtered`
silently desynchronises them. Every new feature is another chance to forget.

**3. More code for a worse result.** The derived version is one line, always
correct, and impossible to forget to update.

## What should not be state

Ask: *can I compute this from what I already have?*

| Not state | Compute it |
|---|---|
| Filtered / sorted lists | `items.filter(...)` |
| Totals and counts | `items.length`, `reduce` |
| `isValid`, `hasErrors` | from the field values |
| Formatted strings | from the raw value |
| Whether submit is disabled | from validity + pending |
| "Are all visible rows selected?" | from `selected` + `visible` |

The demo keeps only `query` and `selected` in state; everything on screen is
derived, so nothing can disagree.

## Do I need useMemo?

Only when the computation is genuinely expensive, or the identity is consumed by
something that compares it.

```js
items.filter(...)   // 50 items — cheaper than the memo bookkeeping
```

Reach for `useMemo` after measuring, not by default. Wrapping every derivation
in `useMemo` is its own anti-pattern.

## When syncing IS legitimate

**Resetting state when identity changes** — a form draft that starts from
`user.name` but must then diverge. Do not use an effect; use `key`:

```jsx
<ProfileForm key={user.id} user={user} />
```

**Adjusting state during render** — the rare escape hatch React documents:

```jsx
const [prevId, setPrevId] = useState(id)
if (id !== prevId) {          // during render, not in an effect
  setPrevId(id)
  setSelection(null)
}
```

React re-runs the component immediately **without committing** the first pass,
so there is no visible intermediate frame. Strictly better than an effect for
this case — and worth knowing, because most people only know the effect version.

## The bigger heuristic

**Minimise state.** The best state is the smallest set of values from which
everything else follows. Most "React is hard to keep in sync" pain is really
"we stored derived values in state".

A useful test: could you delete this piece of state and recompute it? If yes,
delete it.

## How to answer this out loud

"If a value can be computed from existing state and props, it shouldn't be
state. Syncing it with an effect renders twice — once with the stale value —
and creates two sources of truth that drift. I'd derive during render, and only
add `useMemo` if it's genuinely expensive. The legitimate case for 'syncing' is
resetting independent state when identity changes, and there the answer is a
`key`, or adjusting state during render, which avoids the extra committed
render."

## Follow-ups to expect

- *What about `getDerivedStateFromProps`?* The class-era version of the same
  trap; the docs now steer you to `key` or derivation.
- *Isn't recomputing every render wasteful?* Usually far cheaper than an extra
  render plus the bug surface.
