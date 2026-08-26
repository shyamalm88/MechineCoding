# Circuit breaker

Stop sending requests to a service that is already failing. Retries make an
outage *worse*; a breaker is the counterpart that makes it better.

## Three states

```
CLOSED ──failures ≥ threshold──▶ OPEN ──after resetTimeout──▶ HALF_OPEN
   ▲                                                             │
   └──────────────── trial succeeds ─────────────────────────────┘
                     trial fails ──▶ back to OPEN
```

- **CLOSED** — normal. Count consecutive failures.
- **OPEN** — **fail fast without making the request at all.** This is the whole
  point: it protects the struggling service *and* stops the caller burning its
  latency budget waiting for a timeout it knows is coming.
- **HALF_OPEN** — after a cooldown, let **one** request through to test the water.

## The two details that separate answers

**Only one trial request in HALF_OPEN.** If every queued caller is let through
the instant the timer expires, the recovering service is immediately stampeded
and knocked over again. Gate it so exactly one probe goes out.

**A failed trial re-opens immediately** — it does not need to accumulate
`failureThreshold` failures again. One probe failing is sufficient evidence the
service is still down.

## Breaker vs retry

They are complements, and using retry alone is the classic mistake:

- **Retry** handles a *transient* blip — a dropped packet, one bad instance.
- **Breaker** handles a *sustained* outage, where retrying is actively harmful.

Retry-without-breaker turns a partial outage into a self-inflicted DDoS. The
usual production stack is: timeout → retry with jittered backoff → circuit
breaker → fallback.

## Follow-ups

- **Failure-rate** thresholds (>50% of the last N) rather than consecutive
  counts, so an intermittently failing service still trips.
- Per-endpoint or per-host breakers, not one global breaker.
- A **fallback** — cached data or degraded UI — for when the circuit is open.
- Metrics on state transitions; a flapping breaker is a signal in itself.
