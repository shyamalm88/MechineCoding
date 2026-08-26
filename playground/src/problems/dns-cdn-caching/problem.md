# DNS resolution and CDN edge caching

## Resolution order

```
browser cache → OS cache → router → resolver (ISP/8.8.8.8)
   → root → TLD (.com) → authoritative nameserver
```

Each hop is cached with its own TTL, so most lookups never reach the
authoritative server. A cold, uncached lookup can cost 20–120 ms **before a
single byte of your site is requested** — which is why `dns-prefetch` and
`preconnect` matter for third-party origins.

## How the CDN gets involved

The authoritative answer for your hostname is usually a CNAME to the CDN, which
returns an edge IP close to the user — chosen by anycast routing or by the
resolver's location.

## Cache headers that drive the edge

```http
Cache-Control: public, max-age=31536000, immutable    # hashed assets
Cache-Control: public, max-age=0, s-maxage=300        # HTML: fresh for users, 5 min at edge
Cache-Control: private, no-store                      # personalised
```

- `s-maxage` applies to **shared** caches only, letting the edge cache
  aggressively while browsers revalidate.
- `stale-while-revalidate` serves slightly stale content instantly while
  refreshing behind the scenes — excellent for perceived performance.

## Traps

- **`Vary: Cookie` destroys edge caching** — every distinct cookie value
  becomes a separate cache entry, so hit rate collapses.
- Purging is eventually consistent across POPs; do not rely on instant global
  invalidation. Prefer immutable, versioned URLs so you never need to purge.
- A low TTL on the DNS record itself is what makes failover fast.
