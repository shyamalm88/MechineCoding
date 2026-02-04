/**
 * ============================================================================
 * PROBLEM: Token Bucket Algorithm
 * ============================================================================
 *
 * INTUITION:
 * Used for Rate Limiting. Imagine a bucket that holds tokens.
 * - Tokens are added at a fixed rate (refillRate).
 * - The bucket has a max capacity.
 * - Every request needs 1 token to proceed.
 * - If bucket is empty, request is denied.
 *
 * ALGORITHM (Lazy Refill):
 * Instead of a background timer adding tokens every second (expensive),
 * we calculate tokens *on demand* when a request comes in.
 *
 * NewTokens = (TimeNow - LastRefillTime) * RefillRate
 * CurrentTokens = min(Capacity, OldTokens + NewTokens)
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * Capacity: 3, Rate: 1 token/sec. Start: 3 tokens.
 *
 * 1. T=0s: Request comes.
 *    - Refill: (0 - 0) * 1 = 0. Tokens = 3.
 *    - Consume 1. Tokens = 2. ALLOWED.
 *
 * 2. T=0.5s: Request comes.
 *    - Refill: (0.5 - 0) * 1 = 0.5. Tokens = 2 + 0.5 = 2.5.
 *    - Consume 1. Tokens = 1.5. ALLOWED.
 *
 * 3. T=0.6s: Request comes.
 *    - Refill: (0.6 - 0.5) * 1 = 0.1. Tokens = 1.5 + 0.1 = 1.6.
 *    - Consume 1. Tokens = 0.6. ALLOWED.
 * ============================================================================
 */

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
