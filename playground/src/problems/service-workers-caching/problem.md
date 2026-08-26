# Service Workers and caching strategies

A service worker is a **proxy that you write**, sitting between the page and
the network, running on its own thread with no DOM access.

## Lifecycle

```
install ──▶ waiting ──▶ activate ──▶ fetch events
```

A new worker **waits** until every tab controlled by the old one closes — a
reload is not enough. `self.skipWaiting()` plus `clients.claim()` bypasses that,
but then two versions of your app can be live at once, so only do it when the
cached assets are compatible.

## The strategies

| Strategy | Behaviour | Use for |
|---|---|---|
| Cache-first | Cache, fall back to network | Hashed, immutable assets |
| Network-first | Network, fall back to cache | HTML, frequently-changing data |
| Stale-while-revalidate | Serve cache now, refresh in background | Avatars, feeds |
| Network-only | Never cache | Analytics, mutations |
| Cache-only | Never hit network | Precached app shell |

Stale-while-revalidate is usually the best default for content that should feel
instant but must not go stale forever.

## Traps

- **Caching the HTML cache-first bricks your deploy.** Users keep the old shell
  indefinitely and never learn a new version exists.
- Cache storage counts against origin quota; old caches must be deleted in
  `activate` or you leak storage across versions.
- Service workers require HTTPS (localhost exempted).
- They cannot access the DOM — communication is via `postMessage`.
