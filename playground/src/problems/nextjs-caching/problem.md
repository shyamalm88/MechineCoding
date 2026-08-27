# The four caches in Next.js App Router

> Next.js 15. Caching defaults changed significantly in 15 — verify against the
> version you are on, because most tutorials describe 13/14 behaviour.

The single most confusing part of the App Router. There are **four** distinct
caches and "it's cached" is meaningless without saying which.

| Cache | Where | Lifetime | Caches |
|---|---|---|---|
| **Request Memoization** | Server | One render pass | Duplicate `fetch`es in one request |
| **Data Cache** | Server | Persistent, across requests/deploys | `fetch` results |
| **Full Route Cache** | Server | Until revalidated/redeployed | Rendered HTML + RSC payload |
| **Router Cache** | **Client** | Session (in memory) | RSC payloads for visited routes |

## 1. Request Memoization

Two components both call `fetch('/api/user')` in the same render → **one**
request. Deduplication scoped to a single render pass, automatic, React-level.

This is why "fetch where you need it" is fine in RSC — no prop drilling of data
just to avoid duplicate calls.

## 2. Data Cache

Persists `fetch` results **across requests**.

**The Next 15 change:** `fetch` is **no longer cached by default** (it was in
13/14). Opt in explicitly:

```js
fetch(url, { cache: 'force-cache' })
fetch(url, { next: { revalidate: 60 } })
fetch(url, { next: { tags: ['posts'] } })
```

Also in 15: `GET` Route Handlers are no longer cached by default, and the client
Router Cache no longer caches page segments by default.

## 3. Full Route Cache

The rendered output of a static route. Invalidated by `revalidatePath`,
`revalidateTag`, or a deploy. A route that opts into dynamic rendering has no
Full Route Cache at all.

## 4. Router Cache (client)

Prefetched and visited RSC payloads, so back/forward and `<Link>` navigation are
instant. It is why data can look stale after a mutation even though the server is
correct — you are seeing the client cache.

`router.refresh()` clears it for the current route.

## Invalidation

```js
revalidateTag('posts')      // everything tagged 'posts'
revalidatePath('/blog')     // a specific path
router.refresh()            // client-side, current route
```

**Tags are the good tool.** Tag a fetch, then invalidate from a Server Action or
webhook the moment the data actually changes — far better than guessing a
`revalidate` interval.

## The debugging question

When someone says "my data is stale", ask **which cache**:

- Stale after a mutation in the same session → Router Cache → `router.refresh()`
- Stale for everyone → Data Cache / Full Route Cache → `revalidateTag`
- Duplicate identical requests in one render → memoization is not applying
  (different URL or options, or not using `fetch`)

Non-`fetch` data access (a direct DB query) is **not** in the Data Cache. Wrap it
in React `cache()` for per-request memoization, or `unstable_cache` for
persistence.
