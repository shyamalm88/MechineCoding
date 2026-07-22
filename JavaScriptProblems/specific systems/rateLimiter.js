class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity; // Max tokens the bucket can hold
    this.refillRate = refillRate; // Tokens added per second
    this.tokens = capacity; // Start full
    this.lastRefill = Date.now(); // Timestamp of last update
  }

  /**
   * Lazy Refill Strategy:
   * Instead of a setInterval adding tokens every second, we calculate
   * how many tokens *should* have been added since the last time we checked.
   */
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // Convert ms to seconds
    const add = elapsed * this.refillRate; // Rate * Time = Tokens

    // Add tokens, but don't exceed capacity
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.lastRefill = now;
  }

  /**
   * Attempt to consume 1 token.
   * Returns true if allowed, false if blocked.
   */
  allow() {
    this.refill(); // Always update state before checking
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

/**
 * ============================================================================
 * PROBLEM: Global Rate Limiter
 * ============================================================================
 *
 * INTUITION:
 * Manages multiple TokenBuckets, usually one per User ID or IP address.
 *
 * ALGORITHM:
 * 1. Maintain a Map: Key (UserID) -> Value (TokenBucket Instance).
 * 2. When a request comes for User A:
 *    - Get or Create bucket for User A.
 *    - Call bucket.allow().
 * 3. Cleanup: Periodically remove stale buckets to prevent memory leaks.
 *
 * USAGE:
 * const limiter = new RateLimiter({ capacity: 10, refillRate: 1 });
 * if (limiter.allow("user_123")) { ... }
 * ============================================================================
 */
class RateLimiter {
  constructor({ capacity, refillRate }) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.buckets = new Map(); // key -> TokenBucket
  }

  getBucket(key) {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, new TokenBucket(this.capacity, this.refillRate));
    }
    return this.buckets.get(key);
  }

  allow(key) {
    const bucket = this.getBucket(key);
    return bucket.allow();
  }

  cleanup(ttlMs = 60000) {
    const now = Date.now();
    for (let [key, bucket] of this.buckets) {
      if (now - bucket.lastRefill > ttlMs) {
        this.buckets.delete(key);
      }
    }
  }
}

// ---- Real-life usage: protecting a login API from brute-force attempts ----
// Real Express route would look like:
//
//   const limiter = new RateLimiter({ capacity: 5, refillRate: 5 / 60 }); // 5 attempts/min
//
//   app.post("/login", (req, res) => {
//     if (!limiter.allow(req.ip)) {
//       return res.status(429).send("Too many attempts, try again later");
//     }
//     // ... verify username/password
//   });
//
// Simulated below (no refill, so capacity is a hard cap) so it's runnable with plain `node`:
const limiter = new RateLimiter({ capacity: 3, refillRate: 0 }); // 3 login attempts allowed

function handleLoginRequest(ip) {
  if (!limiter.allow(ip)) {
    console.log(`[${ip}] 429 Too Many Requests - blocked`);
    return;
  }
  console.log(`[${ip}] 200 OK - checking credentials`);
}

// Attacker script hammering the login endpoint from the same IP:
for (let i = 1; i <= 5; i++) {
  handleLoginRequest("203.0.113.42");
}
// -> first 3 attempts pass through to the credential check,
//    the last 2 are rejected before ever touching the database.

// A different IP is unaffected - it has its own bucket:
handleLoginRequest("198.51.100.7"); // 200 OK
