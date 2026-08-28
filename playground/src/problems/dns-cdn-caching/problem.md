# DNS resolution and CDN edge caching

## The short answer

Before a single byte of your site is requested, the browser must turn a hostname
into an IP address. That lookup walks a chain of caches:

```
browser cache → OS cache → router → resolver (ISP / 8.8.8.8)
   → root → TLD (.com) → authoritative nameserver
```

Each hop caches the answer for its own TTL, so most lookups never reach the
authoritative server. But a **cold lookup can cost 20–120ms before your server
is even contacted** — which is why third-party origins are so expensive.

## Why this matters for performance

Every distinct origin on your page costs, in the worst case:

```
DNS lookup → TCP handshake → TLS handshake → then finally the request
   ~50ms         ~50ms           ~100ms
```

That is why adding one font provider, one analytics host and one ad network can
add hundreds of milliseconds before anything downloads — and why **domain
sharding is now an anti-pattern**.

Mitigations:

```html
<link rel="dns-prefetch" href="https://cdn.example.com">   <!-- DNS only -->
<link rel="preconnect" href="https://cdn.example.com">     <!-- DNS + TCP + TLS -->
```

Use `preconnect` for origins you are *certain* you will use (your CDN, your font
host) — it is not free, so preconnecting to ten origins is counter-productive.

## How the CDN gets involved

Your authoritative DNS answer is usually a CNAME to the CDN, which returns an
**edge IP close to the user** — chosen by anycast routing or by the resolver's
location.

The user then talks to a nearby edge server instead of your origin, which cuts
round-trip time dramatically for distant users.

## Cache headers that drive the edge

```http
Cache-Control: public, max-age=31536000, immutable   # hashed build assets
Cache-Control: public, max-age=0, s-maxage=300       # HTML: fresh for users, 5 min at edge
Cache-Control: private, no-store                     # personalised
```

- **`s-maxage`** applies to **shared** caches only. This is the useful one: the
  edge can cache aggressively while browsers revalidate, so you get CDN offload
  without serving stale HTML from a user's disk.
- **`immutable`** tells the browser not even to revalidate — correct for
  content-hashed filenames, wrong for anything else.
- **`stale-while-revalidate`** serves slightly stale content instantly while
  refreshing behind the scenes; excellent for perceived performance.

## The trap: Vary destroys hit rate

```http
Vary: Cookie      # ✗ every distinct cookie value = a separate cache entry
```

With per-user cookies, that is effectively one cache entry per user — the hit
rate collapses to nearly zero and your CDN becomes a very expensive proxy.

`Vary: Accept-Encoding` is fine. `Vary: Cookie` almost never is.

## Invalidation

Purging is **eventually consistent** across points of presence — do not rely on
instant global invalidation.

The better strategy is to **never need to purge**: content-hash your assets
(`app.a1b2c3.js`) so a new deploy is a new URL. Purge only for things whose URL
cannot change, like an HTML page or an API response.

A low **DNS TTL** is what makes failover fast — worth setting before you need it,
since lowering it during an incident does not help resolvers that already cached
the old value.

## How to answer this out loud

"DNS resolution walks a chain of caches, and a cold lookup can cost 20–120ms
before your server is contacted at all — so every extra third-party origin costs
DNS plus TCP plus TLS before anything downloads. That's why sharding is now
harmful and why `preconnect` matters for origins you know you'll use. On the CDN
side, `s-maxage` lets the edge cache aggressively while browsers revalidate, and
the big trap is `Vary: Cookie`, which fragments the cache per user and destroys
hit rate. I'd prefer immutable hashed URLs over purging, since purging is
eventually consistent."

## Follow-ups to expect

- *What is anycast?* One IP announced from many locations; routing sends the user
  to the nearest.
- *How do you cache personalised pages?* Cache the shell at the edge and fetch
  the personalised part client-side, or use ESI/edge functions.
- *Why is `immutable` safe?* Because the filename contains a content hash, so the
  content at that URL can never change.
