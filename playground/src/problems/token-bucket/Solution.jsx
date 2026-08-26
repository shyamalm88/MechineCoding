import { useEffect, useRef, useState } from "react";

/**
 * ============================================================================
 * PROBLEM: Token Bucket Rate Limiter
 * ============================================================================
 *
 * INTUITION:
 * Imagine a physical bucket that holds "tokens".
 * 1. The bucket has a maximum capacity (e.g., 10 tokens).
 * 2. Tokens are added to the bucket at a fixed rate (e.g., 1 token per second).
 * 3. When a request arrives, it must consume a token to proceed.
 * 4. If the bucket has tokens, one is removed, and the request is allowed.
 * 5. If the bucket is empty, the request is dropped (rate limited).
 *
 * WHY IT'S USEFUL:
 * - Allows for "bursts" of traffic up to the bucket capacity.
 * - Enforces a long-term average rate.
 * - Very efficient (O(1) time complexity).
 *
 * ALGORITHM (Lazy Refill):
 * Instead of a background timer constantly adding tokens (which is expensive),
 * we calculate the number of tokens to add ONLY when a request comes in or
 * when we need to check the state.
 *
 * Formula:
 * NewTokens = (CurrentTime - LastRefillTime) * RefillRate
 * CurrentTokens = Math.min(Capacity, OldTokens + NewTokens)
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Settings: Capacity = 3, Refill Rate = 1 token/sec
 * Start: T=0s, Tokens=3 (Full)
 *
 * 1. T=0.1s: Request A arrives.
 *    - Refill: (0.1 - 0) * 1 = 0.1 tokens added. Total = 3.1 -> Cap at 3.
 *    - Consume: 3 - 1 = 2 tokens left.
 *    - Result: ✅ Allowed
 *
 * 2. T=0.2s: Request B arrives.
 *    - Refill: (0.2 - 0.1) * 1 = 0.1 tokens added. Total = 2.1.
 *    - Consume: 2.1 - 1 = 1.1 tokens left.
 *    - Result: ✅ Allowed
 *
 * 3. T=0.3s: Request C arrives.
 *    - Refill: (0.3 - 0.2) * 1 = 0.1 tokens added. Total = 1.2.
 *    - Consume: 1.2 - 1 = 0.2 tokens left.
 *    - Result: ✅ Allowed
 *
 * 4. T=0.4s: Request D arrives.
 *    - Refill: (0.4 - 0.3) * 1 = 0.1 tokens added. Total = 0.3.
 *    - Consume: Not enough tokens (0.3 < 1).
 *    - Result: ❌ Blocked
 *
 * 5. T=1.4s: Request E arrives.
 *    - Refill: (1.4 - 0.4) * 1 = 1.0 tokens added. Total = 1.3.
 *    - Consume: 1.3 - 1 = 0.3 tokens left.
 *    - Result: ✅ Allowed
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

export default function TokenBucketDemo() {
  // Use useRef to keep the bucket instance alive across re-renders
  // without resetting its state (tokens, lastRefill).
  const bucketRef = useRef(new TokenBucket(5, 1));
  const [tokens, setTokens] = useState(5);
  const [logs, setLogs] = useState([]);

  const sendRequest = () => {
    const allowed = bucketRef.current.allow();
    setTokens(bucketRef.current.tokens.toFixed(2));

    setLogs((prev) => [
      `${allowed ? "✅ Allowed" : "❌ Blocked"} at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ]);
  };

  // UI auto-refresh token count
  // This is purely for visualization so the user sees the number go up.
  // The actual algorithm works without this interval.
  useEffect(() => {
    const id = setInterval(() => {
      bucketRef.current.refill();
      setTokens(bucketRef.current.tokens.toFixed(2));
    }, 100); // Update UI every 100ms for smoothness

    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>🪣 Token Bucket Rate Limiter</h2>
      <p>
        <b>Capacity:</b> 5 tokens | <b>Refill Rate:</b> 1 token/sec
      </p>

      <p><b>Tokens:</b> {tokens}</p>
      <button onClick={sendRequest}>Send Request</button>

      <div style={{ marginTop: 16 }}>
        {logs.slice(0, 6).map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
