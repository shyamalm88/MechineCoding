# Token Bucket Rate Limiter

Allow bursts up to a capacity while enforcing a steady long-run rate.

## Requirements

- The bucket holds up to `capacity` tokens.
- Tokens refill at a fixed rate.
- A request consumes one token; with none available it is rejected.

## How it works

The key idea is **lazy refill**. A background timer ticking tokens in would be
wasteful and imprecise. Instead the token count is computed on demand from
elapsed time:

```
newTokens = (now - lastRefill) * refillRate
tokens    = Math.min(capacity, tokens + newTokens)
```

That makes every check O(1), exact regardless of timer drift, and cheap enough
to run per request.

Because the bucket can hold a full `capacity`, traffic may **burst** up to that
many requests instantly — then it is throttled to the refill rate. That burst
tolerance is the property that distinguishes token bucket from a fixed window.

## Interview traps

- Forgetting to clamp at `capacity`, letting tokens accumulate forever and
  destroying the rate limit.
- Using a background interval instead of lazy refill (wasteful, and drifts).
- **Token bucket vs leaky bucket:** token bucket permits bursts; leaky bucket
  smooths output to a constant rate. Interviewers ask for the difference.
