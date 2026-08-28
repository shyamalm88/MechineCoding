# Browser storage quotas and eviction

## The short answer

Storage is **per origin** and the limit is **derived from free disk space** —
typically up to ~60% of it in Chrome, shared across Cache Storage, IndexedDB and
friends. There is no fixed number to memorise, so you query it:

```js
const { quota, usage } = await navigator.storage.estimate()
// quota: 12_000_000_000, usage: 4_200_000  (bytes)
```

By default that storage is **best-effort**: under disk pressure the browser can
throw it away.

## Best-effort vs persistent

```js
const persisted = await navigator.storage.persist()   // → true / false
```

| | Best-effort (default) | Persistent |
|---|---|---|
| Evicted under disk pressure | **Yes** | No |
| Eviction order | Least recently used origin | — |
| Granularity | **The whole origin at once** | — |

That granularity is the part people miss: **eviction is all-or-nothing per
origin**. You do not lose "some rows" — your site's entire Cache Storage and
IndexedDB go together. An offline-first app must be able to rebuild from the
network, not assume partial survival.

`persist()` is a *request*, not a command. Browsers grant it based on signals
like being installed as a PWA, being bookmarked, having push permission, or high
engagement. You cannot simply demand it.

## Handle QuotaExceededError

Writes **fail**; they do not silently no-op:

```js
try {
  await cache.put(request, response)
} catch (err) {
  if (err.name === 'QuotaExceededError') await evictOldEntries()
  else throw err
}
```

Code that assumes writes always succeed will silently stop caching and you will
never know.

## The Safari behaviour that catches people out

Safari's Intelligent Tracking Prevention **deletes all script-writable storage
after 7 days without user interaction** with the site. That includes IndexedDB,
Cache Storage, localStorage and service worker registrations.

For an offline-first app this is a real product constraint, not a footnote: a
user who opens your PWA fortnightly effectively starts fresh every time. Being
installed to the home screen exempts you.

## localStorage is separate — and small

`localStorage` has its own **~5MB** limit and is **not** part of the large quota.
It is also **synchronous**, so it blocks the main thread — a 2MB JSON round trip
there is measurable jank.

For anything of size, use IndexedDB: async, far larger, and structured.

## Private browsing

Incognito/private windows get a much smaller quota and are wiped on close.
Historically Safari's private mode *threw* on any `localStorage` write, which is
why defensive `try/catch` around storage access is still worth writing.

## How to answer this out loud

"Quota is per origin and derived from free disk space, so you query it with
`navigator.storage.estimate()` rather than assuming a number. By default storage
is best-effort — the browser can evict it under disk pressure, and crucially it
evicts the whole origin at once, so an offline app has to be able to rebuild
from the network. `navigator.storage.persist()` requests exemption but it's
granted on engagement signals, not on demand. The practical gotchas are handling
QuotaExceededError, remembering localStorage is a separate ~5MB synchronous
bucket, and Safari's ITP wiping script-writable storage after 7 days of no
interaction."

## Follow-ups to expect

- *How would you cap your own cache?* LRU eviction inside Cache Storage with a
  max entry count, plus a TTL — the browser will not manage it for you.
- *Where do cookies fit?* Separate, ~4KB each, and sent on every matching
  request — see the storage comparison problem.
- *How do you clear everything?* `caches.keys()` + delete, `indexedDB.deleteDatabase`,
  and unregistering the service worker.
