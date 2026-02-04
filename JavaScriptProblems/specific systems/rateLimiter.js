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
