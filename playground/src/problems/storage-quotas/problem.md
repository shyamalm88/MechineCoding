# Browser storage quotas and eviction

## How much you get

Quota is **per origin** and derived from free disk space — typically up to ~60%
of it in Chrome, shared across Cache Storage, IndexedDB, and friends. There is
no fixed number to memorise; query it:

```js
const { quota, usage } = await navigator.storage.estimate()
```

## Best-effort vs persistent

By default storage is **best-effort**: under disk pressure the browser evicts
whole origins, usually least-recently-used first. Eviction is all-or-nothing
per origin — you do not lose "some" rows, you lose the origin's data.

```js
const persisted = await navigator.storage.persist()
```

`persist()` requests exemption from automatic eviction. Browsers grant it based
on signals like being installed as a PWA, being bookmarked, or having high
engagement — it is not something you can simply demand.

## Traps

- **Handle `QuotaExceededError`.** Writes fail; they do not silently no-op.
- Private/incognito windows get a much smaller quota and are cleared on close.
- Safari evicts script-writable storage after **7 days** of no user interaction
  with the site (ITP) — a real problem for offline-first apps.
- `localStorage` has its own small, separate ~5 MB limit and is *not* part of
  the large quota.
