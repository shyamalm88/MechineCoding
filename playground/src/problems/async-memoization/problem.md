# Memoizing an async function

Superficially the same as sync memoisation. Three things make it different, and
each is a bug if you get it wrong.

## 1. Cache the promise, not the value

```js
cache.set(key, fn(...args))   // the PROMISE goes in immediately
```

Caching only the resolved value leaves a window: three callers arriving before
the first resolves all see a miss and all fire a request. Caching the promise
means callers 2 and 3 await the *same* in-flight work.

This single line is both memoisation **and** in-flight coalescing.

## 2. Do not cache rejections by default

A cached rejected promise **poisons the key forever** — one transient network
blip and every future call for that key fails instantly, with no request ever
being made again.

```js
promise.catch(() => { if (cache.get(key)?.promise === promise) cache.delete(key) })
```

The identity check matters: without it, a slow failure can evict a *newer*
successful entry that has since replaced it.

## 3. Async results go stale

Sync memoisation of a pure function is valid forever. `fetchUser(1)` is a
snapshot — the user changes. So async caches need a **TTL**, explicit
invalidation after mutations, or both. That is the entire premise of React Query
and SWR.

## Traps

- Unbounded growth: pair with LRU eviction for anything long-lived.
- `JSON.stringify` keys are order-sensitive — `{a:1,b:2}` and `{b:2,a:1}` are
  different keys for equivalent input.
- Storing the promise means the cache retains whatever the promise closes over
  until it settles.

## Related

`stale-while-revalidate` — return the cached value immediately *and* refresh in
the background — is usually the better UX than a hard TTL, since the user never
waits.
