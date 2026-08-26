# Search suggestion cache that drops the oldest unused query

A typeahead fires a request per keystroke. Cache the results — but a plain
object grows forever, so bound it with **LRU** eviction.

## Why LRU specifically

Typing "banana" produces the prefixes `b`, `ba`, `ban`… Backspacing revisits
them, so recency is a genuinely good predictor of reuse here. Evicting the
**least recently used** query keeps exactly the ones the user is moving between.

`Map` gives this almost free: it iterates in insertion order, so re-inserting on
every hit puts the least-recently-used key first.

```js
cache.delete(query); cache.set(query, value)     // refresh recency
cache.delete(cache.keys().next().value)          // evict LRU
```

## In-flight deduplication — the part usually missed

Two keystrokes can produce the same query before the first request resolves
(type `a`, backspace, type `a`). Without dedupe you fire **two** identical
requests:

```js
if (inFlight.has(query)) return inFlight.get(query)
```

Store the *promise*, not just the result, and every concurrent caller shares one
request. Clear it in `.finally()` so a failure does not cache a rejected promise
forever.

## What this does NOT replace

Caching is not debouncing. They solve different halves:

- **Debounce** stops requests being made while the user is still typing.
- **Cache** stops repeating requests already made.

A production typeahead uses both, plus cancellation of stale in-flight requests
(`AbortController`) so an old response cannot overwrite a newer one — the
out-of-order response bug.

## Follow-ups

- **Stale-while-revalidate**: serve the cached value instantly, refresh behind it.
- **TTL**: suggestions go stale; LRU alone never expires a hot entry.
- Prefix-tree reuse: results for `ban` are a subset of `ba`, so you can filter
  locally instead of refetching.
