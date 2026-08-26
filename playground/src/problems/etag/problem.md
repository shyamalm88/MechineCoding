# What is an ETag?

A response header that acts as a **version fingerprint** for a resource, so the
browser can ask "has this changed?" instead of re-downloading it.

## The exchange

```http
GET /app.js                        →
                                   ← 200 OK
                                     ETag: "a1b2c3"
                                     (body: 200 KB)

GET /app.js                        →
If-None-Match: "a1b2c3"
                                   ← 304 Not Modified
                                     (no body)
```

The 304 costs a round trip but transfers no body. That is the win.

## Strong vs weak

- `ETag: "a1b2c3"` — **strong**: byte-for-byte identical.
- `ETag: W/"a1b2c3"` — **weak**: semantically equivalent, but bytes may differ
  (e.g. regenerated with a different timestamp inside). Weak tags cannot be used
  for range requests, because a partial fetch needs exact bytes.

## ETag vs Last-Modified

`Last-Modified` has one-second granularity and breaks for resources that change
more than once a second, or whose timestamp changes without the content
changing (a redeploy). ETags are content-derived, so they are precise. When both
are present, `If-None-Match` wins.

## ETags vs immutable hashed filenames

For build assets the better answer is usually **not** ETags at all:
`app.a1b2c3.js` with `Cache-Control: max-age=31536000, immutable` avoids even
the revalidation round trip. ETags shine for resources whose URL cannot change —
API responses, user-uploaded content.

## Traps

- Load-balanced servers generating different ETags for the same content (e.g.
  from inode numbers) destroys caching. Derive them from content hashes.
- ETags can be used as a tracking vector, which is why some privacy modes
  strip them.
