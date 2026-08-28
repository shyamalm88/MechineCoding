# What is an ETag?

## The short answer

An ETag is a **version fingerprint** for a resource. The browser can ask "has
this changed since the version I have?" instead of re-downloading it.

```http
GET /app.js                        →
                                   ← 200 OK
                                     ETag: "a1b2c3"
                                     Content-Length: 200000

# later, cache expired
GET /app.js                        →
If-None-Match: "a1b2c3"
                                   ← 304 Not Modified
                                     (no body!)
```

The 304 still costs a **round trip**, but transfers no body. That is the win —
and also the limitation.

## Strong vs weak

```http
ETag: "a1b2c3"      # strong: byte-for-byte identical
ETag: W/"a1b2c3"    # weak: semantically equivalent, bytes may differ
```

A weak ETag is for content that is *the same* but not *identical* — regenerated
with a different timestamp inside, say. Weak tags **cannot be used for range
requests**, because resuming a partial download needs exact bytes.

## ETag vs Last-Modified

```http
Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT
If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT
```

`Last-Modified` has **one-second granularity**, so it cannot express a resource
that changes more than once a second. It also breaks when a file's timestamp
changes without its content changing — which happens on **every redeploy** if
you copy files.

ETags are content-derived, so they are precise. When both are present,
`If-None-Match` takes priority.

## The better answer for build assets

For hashed files, ETags are usually the *wrong* tool:

```http
# app.a1b2c3.js
Cache-Control: max-age=31536000, immutable
```

The filename already encodes the version, so the browser never needs to ask —
**zero round trips**, versus one 304 round trip with ETags. On a page with 40
assets that is 40 saved round trips.

ETags shine where the **URL cannot change**: API responses, user-uploaded
content, `/index.html` itself.

## Traps

**Load balancers generating different ETags.** Some servers derive ETags from
the file's inode number and size. Two servers behind a load balancer then return
*different* ETags for identical content, so the browser's revalidation always
misses and it re-downloads every time. Derive them from a content hash.

**Compression changing the ETag.** If gzip and brotli variants get different
ETags without a matching `Vary: Accept-Encoding`, caches serve the wrong one.

**Privacy.** An ETag is an arbitrary server-controlled string the browser echoes
back — a tracking vector. Some privacy modes strip them for that reason.

## Worked example: when a 304 is still slow

A user on a 200ms-latency connection loading a page with 30 revalidated assets
pays 30 round trips of ~200ms. Even with zero bytes transferred, that is
seconds of waiting.

This is exactly why the modern strategy is **immutable hashed assets + a short
cache on the HTML**: the HTML revalidates (one round trip), and it points at
asset URLs the browser already has and never checks.

## How to answer this out loud

"An ETag is a version fingerprint the browser sends back as `If-None-Match`, so
the server can reply 304 with no body. It's more precise than `Last-Modified`,
which only has second granularity and changes on redeploy even when content
didn't. But for build assets the better answer is content-hashed filenames with
`immutable`, because that skips the revalidation round trip entirely — ETags are
for resources whose URL can't change, like API responses. The classic production
bug is load-balanced servers generating different ETags from inode numbers, so
revalidation always misses."

## Follow-ups to expect

- *What generates the ETag?* Ideally a hash of the response body.
- *Does a 304 hit your application code?* It should hit the cache layer, not
  regenerate the page — otherwise you save bandwidth but not CPU.
- *How does this interact with a CDN?* The edge can revalidate with the origin
  while serving cached content to users.
