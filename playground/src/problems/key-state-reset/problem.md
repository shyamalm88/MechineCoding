# Resetting component state with `key`

```jsx
<ProfileForm key={userId} user={user} />
```

Changing a `key` makes React **unmount the old component and mount a new one**,
discarding all of its internal state. It is the idiomatic way to reset a
subtree, and it is not limited to lists.

## The bug it fixes

```js
function ProfileForm({ user }) {
  const [draft, setDraft] = useState(user.name)   // read ONLY on mount
```

Switching users re-renders with a new prop, but `useState`'s initial value is
ignored on every render after the first — so the form still shows the previous
user's half-typed edits. To the user it looks like the app leaked someone else's
data.

## Why not sync with an effect?

```js
useEffect(() => { setDraft(user.name) }, [user])   // ✗
```

This is the "derived state" anti-pattern. It renders **twice** (once with the
stale value, then again after the effect), can flash the wrong content, and
tangles two sources of truth. React's own docs call out `key` as the better fix.

## Why not derive it during render?

Sometimes you should — if the value is *purely* derived, do not put it in state
at all. But a form draft is genuinely independent state once the user starts
typing: it must diverge from the prop. That is exactly when `key` is right.

## Other uses

- Replaying an animation: bump the key to remount the element.
- Resetting an uncontrolled input, whose `defaultValue` is also mount-only.
- Forcing a fresh error boundary after a retry.

## Cautions

- Remounting is **not free** — the whole subtree is destroyed and rebuilt,
  losing focus, scroll position and any children's state too.
- `key={Math.random()}` remounts on **every** render, destroying state and
  performance. A surprisingly common accident.
- The key must be stable and meaningful — it is identity, not a cache-buster.
