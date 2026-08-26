# Leaky bucket rate limiter

Requests enter a fixed-capacity queue and drain at a **constant** rate. When the
bucket is full, new requests are dropped.

## Leaky bucket vs token bucket

This is the entire point of the question, and the two are routinely confused:

| | Token bucket | Leaky bucket |
|---|---|---|
| Bursts | **Allowed** up to capacity | **Never** — output is always smooth |
| Models | Saved-up allowance | A queue draining at a fixed rate |
| Output rate | Bursty then throttled | Constant |
| Full bucket means | Requests rejected | Requests **queued**, then dropped |

**Token bucket** accumulates tokens while idle, so an idle client can fire a
whole burst instantly. Good for APIs where occasional bursts are acceptable.

**Leaky bucket** guarantees the *downstream* never sees a spike, whatever the
input looks like. Good when the thing you are protecting genuinely cannot
handle bursts — a legacy service, a hardware device, an outbound SMS gateway.

A useful one-liner: token bucket limits the **average** rate and tolerates
bursts; leaky bucket enforces the **instantaneous** rate.

## Implementation notes

- The queue is what makes it "leaky": requests wait rather than being rejected
  immediately, so latency rises before anything is dropped.
- **Stop the interval when the queue empties.** A permanently running timer for
  an idle limiter is wasteful, and in Node it keeps the process alive.
- Capacity is a latency bound in disguise: capacity ÷ leak rate is the worst
  case a queued request waits.

## Traps

- Dropping silently is bad API design — return `429` with `Retry-After`.
- Client-side rate limiting is a courtesy, never a control. Enforce on the
  server; anyone can bypass the browser.
- In a distributed system the counter must be shared (Redis), or N instances
  permit N× the intended rate.
