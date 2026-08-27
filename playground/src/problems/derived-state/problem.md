# The derived-state anti-pattern

```js
const [items, setItems] = useState([])
const [filtered, setFiltered] = useState([])          // ✗ derived state
useEffect(() => { setFiltered(items.filter(...)) }, [items, query])
```

## Why it is wrong

1. **Two renders per change.** Render with stale `filtered`, run the effect,
   set state, render again. The user can see the intermediate frame.
2. **Two sources of truth that can disagree.** Any update path that forgets to
   refresh `filtered` silently desynchronises them.
3. **More code** for a worse result.

The fix is to compute it during render:

```js
const filtered = items.filter(...)                    // ✓ cannot go stale
```

No effect, one render, impossible to desynchronise.

## The rule

**Ask: can I compute this from existing state and props? Then it is not state.**

Common things that should *not* be state: filtered/sorted lists, totals and
counts, `isValid`, `hasSelection`, formatted strings, whether a button should be
disabled.

## Do I need useMemo?

Only when the computation is genuinely expensive or the identity is consumed by
something that compares it. `items.filter(...)` on 50 items every render is
cheaper than the memo bookkeeping. Reach for `useMemo` after measuring, not by
default.

## When syncing IS legitimate

**Resetting state when a prop changes** — a form draft that must start from
`user.name` but then diverge. Do not use an effect; use `key`:

```jsx
<ProfileForm key={user.id} user={user} />
```

**Adjusting state during render** (the rare escape hatch React documents):

```js
const [prevId, setPrevId] = useState(id)
if (id !== prevId) { setPrevId(id); setSelection(null) }   // no effect needed
```

React re-runs the component immediately without committing the first pass, so
there is no visible intermediate frame — strictly better than an effect.

## The bigger heuristic

Minimise state. The best state is the smallest set of values from which
everything else follows. Most "React is hard to keep in sync" pain is really
"we stored derived values in state".
