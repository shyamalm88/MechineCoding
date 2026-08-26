# Cache eviction beyond LRU: LFU and TTL

## LFU — least frequently used

LRU asks *how recently*; LFU asks *how often*. Ties in frequency are broken by
recency.

**Why LFU exists:** a one-off scan over many keys (a crawler, a report) pollutes
an LRU and evicts genuinely hot entries. LFU is resistant to that, because the
scanned keys only ever reach frequency 1.

### The O(1) design

Three structures, and all of them are needed:

```
keyMap:  key  -> { value, freq }
freqMap: freq -> Map<key, true>    // insertion-ordered ⇒ first entry is LRU
minFreq: smallest frequency in use
```

`Map` preserving insertion order is what gives the **LRU tiebreak for free** —
the first key in the minimum-frequency bucket is both least frequent and least
recently used.

**The subtle bit:** `minFreq` only needs to *increase by one* when you empty the
current minimum bucket during a touch — a key's frequency can only rise by 1, so
no search is required. And **inserting a new key always resets `minFreq` to 1**,
which is the line people forget.

### LFU's weakness

An entry that was hot yesterday keeps a high count forever and never gets
evicted, even if nothing has touched it since. Real systems age or decay counts
(**LFU with ageing**), or use a windowed variant like W-TinyLFU.

## TTL — time-based expiry

Orthogonal to LRU/LFU: entries expire regardless of use.

**Expire lazily, on read.** A `setTimeout` per key does not scale to thousands
of entries and keeps the process busy. Checking `Date.now() > expiresAt` when
the key is read costs nothing and is what production caches do.

The trade-off is that an expired-but-never-read entry occupies memory until it
is touched or evicted — so most caches also sweep periodically.

Prefer evicting an already-expired entry over a live one when at capacity.

## Choosing

| Policy | Evicts | Good for |
|---|---|---|
| LRU | Least recently used | General purpose, temporal locality |
| LFU | Least frequently used | Stable hot sets, scan-resistant |
| TTL | Anything stale | Data with a correctness deadline |
| FIFO | Oldest inserted | Simple, rarely optimal |

Production caches usually combine them: LRU **plus** TTL is the common default.
