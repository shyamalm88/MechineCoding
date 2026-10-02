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

## The implementation

`SearchSuggestionCache(maxSize).getResults(term)`:

1. **Hit** — delete and re-set the key (move to most-recent) and return it.
2. **Miss** — `await this.fetchFromDatabase(term)`, evict the first key if
   `cache.size >= maxSize`, then store the result.

`fetchFromDatabase` is a mock that resolves after 500ms; in real code it is your
API call.

## Known gap: in-flight deduplication

Two keystrokes can produce the same query before the first request resolves
(type `a`, backspace, type `a`). This version only caches **after** the fetch
completes, so both calls miss and fire **two** identical requests. The fix is to
store the *promise*:

```js
if (inFlight.has(query)) return inFlight.get(query)
```

so every concurrent caller shares one request, and to clear it in `.finally()`
so a failure does not cache a rejected promise forever.

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
