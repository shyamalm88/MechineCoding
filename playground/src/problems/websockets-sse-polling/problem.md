# WebSockets vs SSE vs long polling

## The short answer

The question that picks the answer is: **which direction does data actually
flow?**

| | Long polling | SSE | WebSockets |
|---|---|---|---|
| Direction | client → server | **server → client only** | **bidirectional** |
| Protocol | HTTP | HTTP | upgrades to `ws://` |
| Data | any | **UTF-8 text only** | text **or binary** |
| Auto-reconnect | manual | **built in** | manual |
| Over HTTP/2 | yes | yes (multiplexed) | separate connection |
| Proxy friendliness | best | good | sometimes blocked |

## Long polling

The client opens a request; the server **holds it open** until it has data (or
times out), then responds. The client immediately reissues.

```
client ──request──▶ server   (held open, no data yet)
       ◀─response── server   (data arrives after 30s)
client ──request──▶ server   (immediately again)
```

Universally supported and proxy-friendly, but every message costs a full request
cycle — headers, and on HTTP/1.1 a connection slot. It is a **fallback**, or the
right answer for genuinely low-frequency updates.

## Server-Sent Events

A single long-lived HTTP response that the server writes to over time.

```js
const source = new EventSource('/stream')
source.onmessage = (e) => console.log(e.data)
```

You get a lot for free:

- **automatic reconnection** with backoff
- **`Last-Event-ID`** replay — the browser sends the last id it saw, so the
  server can resume from there without losing messages
- plain HTTP, so it works with existing auth, compression and infrastructure

Right for: notifications, live scores, log tailing, progress updates, AI token
streaming — anything where the client has nothing to say back.

## WebSockets

A genuine two-way channel after an HTTP upgrade handshake.

Right for: chat, collaborative editing, multiplayer games, trading. Anything
where the client sends frequently and latency matters.

The cost is that you own everything SSE gave you free: **reconnect logic,
exponential backoff, heartbeat/ping-pong to detect dead connections, and message
buffering while disconnected**. That is real work, which is why libraries like
Socket.IO exist.

## The trap: SSE over HTTP/1.1

Browsers cap connections at **~6 per origin** on HTTP/1.1. An SSE stream holds
one open **permanently** — so with six tabs open, the seventh page hangs with no
obvious cause.

Over **HTTP/2 it multiplexes** and the problem disappears. This is a favourite
follow-up because it is a real production incident people hit.

## Choosing — the short version

```
Does the client need to send messages frequently?
  yes → WebSockets
  no  → is it just server pushing updates?
          yes → SSE
          no  → plain fetch / polling
```

Reaching for WebSockets on a one-directional feed is over-engineering: you take
on reconnection, heartbeats and a protocol that some corporate proxies block, in
exchange for a capability you never use.

## How to answer this out loud

"The deciding question is which direction data flows. If the server just pushes
— notifications, live scores, streaming tokens — SSE is the right fit: it's
plain HTTP, reconnects automatically, and replays from `Last-Event-ID`. If the
client also sends frequently — chat, collaborative editing — you want
WebSockets, but you're then responsible for reconnect, backoff and heartbeats.
Long polling is the fallback for old infrastructure or genuinely infrequent
updates. The gotcha with SSE is the six-connection-per-origin limit on HTTP/1.1,
which multiplexing on HTTP/2 solves."

## Follow-ups to expect

- *How do you authenticate a WebSocket?* Cookies on the handshake, or a token in
  the first message — you cannot set custom headers from the browser API.
- *How do you scale WebSockets?* Sticky sessions or a shared pub/sub layer
  (Redis) so any server can reach any client.
- *What about WebTransport?* A newer QUIC-based API offering unreliable and
  unordered streams — useful for games.
