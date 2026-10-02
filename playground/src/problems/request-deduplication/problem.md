# Request deduplication and async race conditions

Distinct problems that get conflated, each with its own fix. The code covers the
first two (`coalescedFetch`, `createLatestFetcher`); the third is the follow-up.

## 1. Coalescing — N identical calls, one request

Three components mount and all ask for user 42. Without coalescing that is three
identical network requests.

```js
if (pendingRequests.has(url)) return pendingRequests.get(url)
```

Store the **promise**, not the result, so concurrent callers share the in-flight
work. Clear it in `.finally()` (`pendingRequests.delete(url)`) — leaving a rejected promise cached means every
future caller gets the old failure.

## 2. Latest-only — the out-of-order response bug

The single most common async bug in search UIs:

```
type "a"  → request A (slow, 200ms) ─────────────▶ lands SECOND
type "ab" → request B (fast, 40ms)  ──▶ lands FIRST
```

Responses arrive out of order, so the UI ends up showing results for `"a"`
while the box says `"ab"`. Nothing is "wrong" with either request — the bug is
that **the last response to arrive wins** instead of the newest request.

The fix is a monotonic ticket:

```js
latestId += 1
const currentId = latestId
// ...on resolve:
if (currentId === latestId) return value   // otherwise a newer request superseded me
```

A superseded call resolves with `undefined` rather than rejecting — callers must
treat `undefined` as "ignore me". Note debouncing **reduces** this but does not fix it — two requests can still be
in flight, and network latency is not bounded by your debounce interval.

## 3. Abort — actually cancel

`createLatestFetcher` still lets the stale request complete; it just ignores it. To stop
the work:

```js
controller?.abort()
controller = new AbortController()
fetch(url, { signal: controller.signal })
```

That frees a connection and saves the server work. Remember an aborted `fetch`
rejects with an `AbortError`, which must be filtered out of your error handling
or you show the user an error for something you cancelled yourself.

## Choosing

| Problem | Fix |
|---|---|
| Duplicate concurrent identical requests | Coalesce |
| Out-of-order responses | Latest-only ticket |
| Wasted server work | AbortController |
| Too many requests while typing | Debounce |

Production typeaheads use all four. React Query and SWR give you coalescing and
latest-only out of the box, which is a large part of why they exist.
