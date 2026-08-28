# HTTP/1.1 vs HTTP/2 vs HTTP/3

## The short answer

Each version fixed the previous one's **head-of-line blocking**, one layer down:

| | Fixes | Still blocked by |
|---|---|---|
| **HTTP/1.1** | — | one request at a time per connection |
| **HTTP/2** | request-level blocking (multiplexing) | **TCP** packet loss |
| **HTTP/3** | transport-level blocking (QUIC over UDP) | — |

## HTTP/1.1: one at a time

A connection handles one request/response at a time. A slow response holds up
everything queued behind it — **head-of-line blocking at the request level**.

Browsers work around it by opening ~6 parallel connections per origin, which is
why the old best practices existed:

- **concatenate** everything into one bundle (fewer requests)
- **sprite sheets** for images
- **domain sharding** — serve assets from `static1.`, `static2.` to get more
  than 6 connections

Every one of those is now counter-productive.

## HTTP/2: multiplexing

- **Multiplexing** — many independent streams share **one** TCP connection, so
  100 small files cost roughly what 1 file did. Bundling everything into one
  giant file now *hurts*, because a one-byte change busts the cache for
  everything.
- **Header compression (HPACK)** — repeated headers stop costing full bytes on
  every request.
- **Server push** — largely a failure in practice (it pushed things the client
  already had cached) and removed from Chrome.

**But head-of-line blocking moved down to TCP.** All streams share one TCP
connection, and TCP guarantees in-order delivery — so a single lost packet
stalls **every** stream while it is retransmitted.

On a clean network HTTP/2 is clearly better. On a lossy mobile connection it can
be **worse than HTTP/1.1**, because HTTP/1.1's six connections meant a loss only
stalled one of them.

## HTTP/3: QUIC

Replaces TCP with **QUIC**, which runs over UDP and implements streams itself.
Because QUIC knows about streams, a lost packet only stalls **the stream it
belonged to** — finally eliminating head-of-line blocking end to end.

Two more wins that matter:

- **TLS is built in** — 1 round trip to establish, 0-RTT on resumption, versus
  TCP handshake *then* TLS handshake.
- **Connection migration** — the connection is identified by a connection ID,
  not the IP/port tuple, so switching from Wi-Fi to cellular **keeps the same
  connection** instead of starting over.

## What this changes in practice

```
HTTP/1.1 era:  bundle everything, sprite images, shard domains
HTTP/2+ era:   split sensibly for caching, one origin, no sharding
```

Domain sharding is now actively harmful — each extra origin costs a DNS lookup,
TCP handshake and TLS handshake, and splits your multiplexing across
connections.

## How to answer this out loud

"Each version pushed head-of-line blocking down a layer. HTTP/1.1 does one
request at a time per connection, so browsers opened six and we bundled
everything. HTTP/2 multiplexes many streams over one connection, which makes
bundling and domain sharding counter-productive — but all streams share one TCP
connection, so a single lost packet stalls all of them. HTTP/3 swaps TCP for
QUIC over UDP, where streams are independent, so loss only affects one stream.
QUIC also has TLS built in and survives a network change, which matters a lot on
mobile."

## Follow-ups to expect

- *Should I still bundle?* Yes, but for compression ratio and fewer cache
  entries — not to dodge request limits. Split by change frequency.
- *How do I know which version I'm on?* DevTools Network panel → Protocol column
  (`h2`, `h3`).
- *Why UDP?* TCP is implemented in OS kernels and effectively unchangeable; UDP
  let QUIC ship the new transport in user space.
