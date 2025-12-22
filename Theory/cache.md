# Caching Strategies: A Senior Engineer's Guide

A comprehensive guide to caching at every layer — from browser to CDN to database — for system design interviews.

---

## 1. Client-Side: The "Edge of the Edge"

At a senior level, client-side caching isn't just about `localStorage`; it's about **interception and background synchronization**.

### Service Workers (The Programmable Proxy)

Service Workers live between the browser and the network, allowing you to implement complex caching logic.

```js
// Stale-While-Revalidate pattern
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('v1').then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      // Fetch fresh data in background
      const fetchPromise = fetch(event.request).then((response) => {
        cache.put(event.request, response.clone());
        return response;
      });

      // Return cached immediately, update in background
      return cachedResponse || fetchPromise;
    })
  );
});
```

### Strategy by Request Type

Use `request.destination` to apply different strategies:

| Destination | Strategy | Example |
|-------------|----------|---------|
| `font` | Cache-Only | Self-hosted web fonts (never change) |
| `image` | Cache-First | Product images, logos |
| `document` | Network-First | HTML pages (need fresh content) |
| `fetch` (API) | Network-First | Real-time stock/API data |

### Browser HTTP Cache

Controlled by `Cache-Control` headers.

**Fingerprinting Strategy:**

```
# Immutable assets with hash in filename
main.a4f2b3c.js  →  Cache-Control: max-age=31536000, immutable

# HTML files (need revalidation)
index.html      →  Cache-Control: no-cache
```

**Result:** Users only download core platform logic once per release.

---

## 2. Networking & Infrastructure Layers

This is where you manage the **"Thundering Herd"** problem and geographical latency.

### The Caching Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  Browser Cache                                              │
│  └─▶ Service Worker Cache                                   │
│      └─▶ Forward Proxy (ISP/Corporate)                      │
│          └─▶ CDN Edge (Cloudflare, Akamai)                  │
│              └─▶ Reverse Proxy (Nginx/Varnish)              │
│                  └─▶ Application Cache (Redis)              │
│                      └─▶ Database                           │
└─────────────────────────────────────────────────────────────┘
```

### Forward Proxy Cache (ISP/Corporate Layer)

Caches requests made by users behind a firewall.

**The Trap:** You have **zero control** here. If you don't use fingerprinted filenames, a corporate proxy might serve an old version of your React app for weeks.

**Fix:** Always use content-hashed filenames for static assets.

### Reverse Proxy Cache (Gateway Layer)

Your Nginx/Varnish fleet sitting in front of application servers.

**Micro-caching Pattern:**

```nginx
# Cache for just 1 second
proxy_cache_valid 200 1s;
```

For viral real-time endpoints (trending news feed), this collapses **10,000 simultaneous requests into a single origin hit**, protecting your backend.

### CDN (Edge Caching)

#### Dynamic Content with ESI (Edge Side Includes)

Assemble pages where some parts are cached longer than others:

```html
<!-- Header cached globally for 24 hours -->
<esi:include src="/fragments/header" />

<!-- User profile fetched dynamically per-request -->
<esi:include src="/fragments/user-profile" />

<!-- Footer cached globally for 24 hours -->
<esi:include src="/fragments/footer" />
```

#### Surrogate Keys (Smart Purging)

Instead of purging URLs one by one, tag your assets:

```
Cache-Tag: product-123, category-electronics
```

When the product price changes, send **one "Purge by Tag" command** to clear every related asset globally.

---

## 3. Application & Data Layers

### Redis vs. Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| **Data Structures** | Lists, Sets, Hashes, Sorted Sets | Key-Value only |
| **Persistence** | Yes (RDB/AOF) | No |
| **Pub/Sub** | Yes | No |
| **Threading** | Single-threaded | Multi-threaded |
| **Use Case** | Complex state, real-time leaderboards | High-throughput simple caching |

**When to use Redis:**
- Sorted Set for real-time leaderboard
- Pub/Sub to invalidate local caches across 100 app servers
- Session storage with TTL

**When to use Memcached:**
- Pure object caching
- Maximum throughput for simple key-value lookups

### ElastiCache (AWS Managed)

Provides Redis/Memcached with:
- Automatic sharding
- High availability
- Multi-AZ replication

---

## 4. Cache Consistency Patterns

| Pattern | How It Works | Trade-off |
|---------|--------------|-----------|
| **Cache-Aside** | App checks cache first, fetches from DB on miss, writes to cache | Simple but risk of stale data |
| **Write-Through** | Write to cache AND DB simultaneously | Consistent but slower writes |
| **Write-Behind** | Write to cache immediately, flush to DB async | Fast writes but risk of data loss |
| **Read-Through** | Cache fetches from DB on miss automatically | Simpler app code |

### Write-Behind Example (View Counters)

```js
// Increment in Redis immediately (fast)
await redis.incr(`views:article:${id}`);

// Background job flushes to DB every 5 minutes
// Risk: Data loss if Redis fails before flush
```

---

## 5. Special Case: Video Streaming (HLS/DASH)

Streaming requires a **"binary-first" caching mindset**.

### Different TTLs for Different Files

| File Type | Purpose | TTL |
|-----------|---------|-----|
| `.m3u8` / `.mpd` (Manifest) | "Map" of the stream | 1-2 seconds |
| `.ts` / `.m4s` (Segments) | Actual video chunks | Long-term (immutable) |

### Why Manifests Need Short TTL

```
#EXTM3U
#EXT-X-TARGETDURATION:6
#EXTINF:6.0,
segment001.ts    ← Already cached at edge
segment002.ts    ← Already cached at edge
segment003.ts    ← NEW! User needs to see this
```

If manifest is cached too long, users fall behind the **live edge**.

### Low-Latency HLS (LL-HLS)

Uses **Blocking Playlist Reload**:

```
1. Client requests manifest
2. CDN sees next segment isn't ready yet
3. CDN HOLDS the request open (doesn't return 404)
4. When segment is ready, CDN returns updated manifest
```

**CDN Config Required:** Must support "holding" requests, not immediately returning stale/404.

---

## 6. Quick Reference: Cache Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Cache-Control` | Main caching directive | `max-age=3600, public` |
| `ETag` | Content fingerprint for validation | `"abc123"` |
| `Last-Modified` | Timestamp-based validation | `Wed, 21 Oct 2024 07:28:00 GMT` |
| `Vary` | Cache separately by header | `Vary: Accept-Encoding` |
| `Surrogate-Control` | CDN-specific directives | `max-age=86400` |
| `Cache-Tag` | For tag-based purging | `product-123` |

---

## 7. Interview Tip

> "Caching is about trade-offs between freshness and speed. I use fingerprinted assets with immutable caching for static files, short TTLs with stale-while-revalidate for API data, and micro-caching at the reverse proxy to handle thundering herds. For complex invalidation, I use surrogate keys to purge by tag rather than URL. At the data layer, I choose Redis for complex structures and Pub/Sub invalidation, Memcached for pure throughput."
