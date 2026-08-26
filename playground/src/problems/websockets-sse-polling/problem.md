# WebSockets vs SSE vs long polling

## Comparison

| | Long polling | SSE | WebSockets |
|---|---|---|---|
| Direction | Client → server | **Server → client only** | **Bidirectional** |
| Protocol | HTTP | HTTP | Upgrades from HTTP to `ws://` |
| Data | Any | **UTF-8 text only** | Text **or binary** |
| Auto-reconnect | Manual | **Built in** | Manual |
| Works over HTTP/2 | Yes | Yes (multiplexed) | Separate connection |
| Proxy friendliness | Best | Good | Sometimes blocked |

## When each is right

**Long polling** — a fallback, or genuinely low-frequency updates. The client
holds a request open until data arrives or it times out, then immediately
reissues. Simple and universally supported, but each message costs a full
request cycle.

**SSE** — server-pushed streams where the client has nothing to say back:
notifications, live scores, log tailing, progress. `EventSource` reconnects
automatically and resumes from `Last-Event-ID`, which is a lot of reliability
for free.

**WebSockets** — genuine two-way, low-latency exchange: chat, collaborative
editing, multiplayer, trading. You pay for it with your own reconnect,
heartbeat, and backoff logic.

## The trap

SSE over **HTTP/1.1** is limited by the ~6-connections-per-origin cap — six
tabs and the seventh hangs. Over HTTP/2 it multiplexes and the problem
disappears. This is a favourite follow-up question.

Also: choosing WebSockets for a one-directional feed is over-engineering.
"Which direction does data actually flow?" is the question that picks the
answer.
