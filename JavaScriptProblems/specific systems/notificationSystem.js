/**
 * ============================================================================
 * PROBLEM: Reliable Notification System
 * ============================================================================
 *
 * INTUITION:
 * Sending notifications (email/SMS) is unreliable and rate-limited by providers.
 * We need a system that queues requests, handles failures (retries), and
 * respects per-user rate limits.
 *
 * ALGORITHM:
 * 1. Notification: value object carrying id, userId, message, expiresAt,
 *    retriesLeft.
 * 2. RateLimiter: token-bucket per userId, refills over time.
 * 3. Queue: FIFO array of pending Notifications.
 * 4. Process Loop:
 *    - Take item from queue.
 *    - Check TTL: If expired, drop.
 *    - Check Rate Limit: If limited, put back at front of queue & wait.
 *    - Attempt Send:
 *      - Success: Log it.
 *      - Fail: Decrement retries. If > 0, push back to queue. Else drop.
 *
 * DRY RUN
 * 1. send({userId:'u1', message:'hi'}). Queue: [N1(retriesLeft=3)].
 * 2. process() starts. Pop N1.
 * 3. rateLimiter.allow('u1')? -> False (bucket empty).
 *    - Unshift N1. Queue: [N1]. Sleep 100ms.
 * 4. Wake up. Pop N1. rateLimiter.allow('u1')? -> True (refilled).
 * 5. fakeSend(N1) throws.
 *    - retriesLeft-- (=2). Push N1. Queue: [N1].
 * 6. ...repeats until sent, or retriesLeft hits 0 and it's dropped.
 *
 * COMPLEXITY:
 * - send(): O(1) amortized (array push).
 * - process(): O(k) per full drain, k = total (re)enqueues across retries.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Rate Limiter — token bucket per user
// ---------------------------------------------------------------------------
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity; // max tokens the bucket can hold
    this.refillRate = refillRate; // tokens added per second
    this.tokens = capacity; // start full
    this.lastRefill = Date.now();
  }

  // Lazy refill: compute tokens earned since last check instead of a timer.
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const add = elapsed * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.lastRefill = now;
  }

  allow() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

class RateLimiter {
  constructor({ capacity, refillRate }) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.buckets = new Map(); // userId -> TokenBucket
  }

  getBucket(key) {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, new TokenBucket(this.capacity, this.refillRate));
    }
    return this.buckets.get(key);
  }

  allow(key) {
    return this.getBucket(key).allow();
  }
}

// ---------------------------------------------------------------------------
// Notification — value object
// ---------------------------------------------------------------------------
let notificationSeq = 0;

class Notification {
  constructor({ userId, message, ttlMs = 5000, maxRetries = 3 }) {
    this.id = `n${++notificationSeq}`;
    this.userId = userId;
    this.message = message;
    this.createdAt = Date.now();
    this.expiresAt = this.createdAt + ttlMs;
    this.retriesLeft = maxRetries;
  }
}

// ---------------------------------------------------------------------------
// fakeSend — simulates an unreliable email/SMS provider
// ---------------------------------------------------------------------------
function fakeSend(notification) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.4) {
        reject(new Error(`Provider error for ${notification.id}`));
      } else {
        resolve();
      }
    }, 10);
  });
}

// ---------------------------------------------------------------------------
// NotificationSystem
// ---------------------------------------------------------------------------
class NotificationSystem {
  constructor({ capacity, refillRate, maxRetries = 3 }) {
    this.queue = [];
    this.rateLimiter = new RateLimiter({ capacity, refillRate });
    this.maxRetries = maxRetries;
    this.processing = false;
  }

  send({ userId, message, ttlMs = 5000 }) {
    const notification = new Notification({
      userId,
      message,
      ttlMs,
      maxRetries: this.maxRetries,
    });
    this.queue.push(notification);
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length) {
      const notif = this.queue.shift();

      // TTL check
      if (Date.now() > notif.expiresAt) {
        console.log("Dropped (expired):", notif.id);
        continue;
      }

      // Rate limit check
      if (!this.rateLimiter.allow(notif.userId)) {
        this.queue.unshift(notif);
        await this.sleep(100);
        continue;
      }

      try {
        await fakeSend(notif);
        console.log("Sent:", notif.id);
      } catch {
        notif.retriesLeft--;
        if (notif.retriesLeft > 0) {
          console.log("Retrying:", notif.id, `(${notif.retriesLeft} left)`);
          this.queue.push(notif);
        } else {
          console.log("Dropped (failed):", notif.id);
        }
      }
    }

    this.processing = false;
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Happy path — several notifications for one user, some retried
// because fakeSend randomly fails (~40% of the time).
{
  console.log("--- Test 1: basic send with retries ---");
  const system = new NotificationSystem({
    capacity: 3,
    refillRate: 5, // burst 3, refill 5/sec
    maxRetries: 3,
  });

  for (let i = 1; i <= 5; i++) {
    system.send({ userId: "user_1", message: `Hello #${i}`, ttlMs: 5000 });
  }
}

// Test 2: TTL expiry — a notification created already expired is dropped
// immediately, without ever touching the rate limiter or fakeSend.
setTimeout(() => {
  console.log("\n--- Test 2: expired notification is dropped ---");
  const system = new NotificationSystem({ capacity: 5, refillRate: 5 });

  system.send({ userId: "user_2", message: "too late", ttlMs: -1 });
}, 500);

// Test 3: Rate limiting — bursting past bucket capacity forces the extra
// notifications to wait (unshift + sleep) until tokens refill.
setTimeout(() => {
  console.log("\n--- Test 3: rate-limited burst ---");
  const system = new NotificationSystem({
    capacity: 1,
    refillRate: 1, // 1 token/sec
    maxRetries: 1,
  });

  for (let i = 1; i <= 3; i++) {
    system.send({ userId: "user_3", message: `Burst #${i}`, ttlMs: 5000 });
  }
}, 1000);
