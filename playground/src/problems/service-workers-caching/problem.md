# Service Workers and caching strategies

## The short answer

A service worker is a **programmable network proxy that you write**, sitting
between your page and the network. It runs on its own thread, has no DOM access,
and persists after the page closes.

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request) || fetch(event.request))
})
```

That single hook is what enables offline support, custom caching, and background
sync.

## The lifecycle — and the part that confuses everyone

```
install ──▶ waiting ──▶ activate ──▶ handling fetch events
```

A **new** service worker does not take over immediately. It **waits** until
every tab controlled by the old one is closed. A reload is **not** enough — the
old worker is still controlling the page during the reload.

That is deliberate: two versions of your app must not be live at once, because
the new worker might serve assets the old page cannot use.

```js
self.skipWaiting()      // in install: take over immediately
clients.claim()         // in activate: control existing pages
```

Use these only when you are sure the new assets are compatible with the running
page — otherwise you can serve a mismatched bundle to an already-loaded app.

## The strategies

| Strategy | Behaviour | Use for |
|---|---|---|
| **Cache-first** | Cache, fall back to network | Hashed, immutable assets |
| **Network-first** | Network, fall back to cache | HTML, frequently-changing data |
| **Stale-while-revalidate** | Serve cache now, refresh in background | Avatars, feeds, non-critical data |
| **Network-only** | Never cache | Analytics, mutations |
| **Cache-only** | Never hit network | Precached app shell |

**Stale-while-revalidate** is usually the best default for content that should
feel instant but must not go stale forever:

```js
const cached = await caches.match(request)
const fresh = fetch(request).then(res => { cache.put(request, res.clone()); return res })
return cached ?? fresh          // instant if cached, correct eventually
```

Note the `res.clone()` — a Response body is a **stream that can only be read
once**, so caching it and returning it requires two copies. Forgetting this is a
very common bug.

## The mistake that bricks your deploy

**Caching your HTML cache-first.** Users keep the old shell indefinitely and
never learn a new version exists — and because the service worker itself is only
checked on navigation, they may never get the new worker either.

If it happens, your only remedy is code you shipped *previously*, which is why
people fear service workers. Rules that avoid it:

- HTML → **network-first** (or stale-while-revalidate with a short life)
- hashed assets → cache-first
- always ship a kill switch (a worker that unregisters itself) in your first
  version

## Cleanup

Old caches are **not** removed automatically. Delete them in `activate`, or you
leak storage across every version you have ever shipped:

```js
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CURRENT).map(k => caches.delete(k)))))
})
```

## Constraints

- **HTTPS only** (localhost exempted) — it can rewrite responses, so it must be
  on a trusted origin.
- **No DOM access** — communicate via `postMessage`.
- Counts against origin storage quota, and can be **evicted** under disk
  pressure.

## How to answer this out loud

"A service worker is a proxy you write for your own network requests, running on
its own thread and persisting after the page closes. The lifecycle is the part
that catches people: a new worker waits until every tab with the old one is
closed, so a reload isn't enough — `skipWaiting` plus `clients.claim` bypasses
that but risks two versions being live. For strategies I'd use cache-first for
hashed assets, network-first for HTML, and stale-while-revalidate as a good
default. The classic disaster is caching HTML cache-first, which pins users to
an old build with no way to update them."

## Follow-ups to expect

- *How do you update a service worker safely?* Version your caches, clean up in
  `activate`, and prompt the user to reload rather than force it.
- *What is the app shell pattern?* Precache the UI skeleton, fetch content
  dynamically.
- *What else can it do?* Background Sync, Push notifications, offline fallbacks.
