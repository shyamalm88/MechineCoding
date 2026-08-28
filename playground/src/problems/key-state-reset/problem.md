# Resetting component state with `key`

## The short answer

```jsx
<ProfileForm key={userId} user={user} />
```

Changing a `key` makes React **unmount the old component and mount a new one**,
discarding all of its internal state. It is the idiomatic way to reset a
subtree — and it is not limited to lists.

## The bug it fixes

```jsx
function ProfileForm({ user }) {
  const [draft, setDraft] = useState(user.name)   // read ONLY on mount
  return <input value={draft} onChange={e => setDraft(e.target.value)} />
}
```

Switching users re-renders with a new prop, but `useState`'s initial value is
**ignored on every render after the first**. So the form still shows the previous
user's half-typed edits.

To the user this looks like the app leaked someone else's data — a genuinely
alarming bug, and one that only appears when you switch records, which is why it
survives casual testing.

Run the demo: type in both boxes, then switch user. The unkeyed form keeps what
you typed; the keyed one starts fresh.

## Why not sync with an effect?

```jsx
useEffect(() => { setDraft(user.name) }, [user])   // ✗
```

This is the derived-state anti-pattern:

1. It renders **twice** — once with the stale value, then again after the effect.
2. The user can **see** the stale frame.
3. You now have two sources of truth that can disagree.

React's own docs point at `key` as the better answer. The effect version also
quietly breaks if the user edits and *then* the prop changes for an unrelated
reason.

## Why not derive it during render?

Sometimes you should — if the value is *purely* derived, do not put it in state
at all.

But a form draft is genuinely independent state once the user starts typing: it
must be *allowed* to diverge from the prop. That is exactly the case `key` is
for — "reset this independent state when the identity changes".

## Other uses

- **Replaying an animation** — bump the key to remount and re-trigger it.
- **Resetting an uncontrolled input**, whose `defaultValue` is also mount-only.
- **Retrying after an error** — a new key gives the error boundary a fresh
  subtree.
- **Forcing a third-party widget to re-initialise** with new options.

## Cautions

- Remounting is **not free**: the whole subtree is destroyed and rebuilt, losing
  focus, scroll position, and every child's state too. Scope the key to the
  smallest component that needs resetting.
- **`key={Math.random()}`** remounts on *every* render — destroying state and
  performance. A surprisingly common accident.
- The key must be **stable and meaningful**. It is identity, not a cache-buster.

## How to answer this out loud

"Changing a component's `key` makes React treat it as a different component, so
it unmounts and remounts with fresh state. The classic case is a form whose
initial state comes from a prop — `useState` only reads that on mount, so
switching records leaves the previous record's edits on screen. People reach for
an effect to sync it, but that renders twice and can flash the stale value;
`key` is the documented fix. The trade-off is that remounting throws away
everything in the subtree, so I'd key the smallest component that needs it."

## Follow-ups to expect

- *When would you sync with an effect instead?* Almost never for this; if you
  must adjust state on a prop change, doing it *during render* with a previous-
  value comparison avoids the extra committed render.
- *Does this work for uncontrolled inputs?* Yes — that is often the only way,
  since `defaultValue` is mount-only.
