/**
 * ============================================================================
 * PROBLEM: Reliable Notification System
 * ============================================================================
 *
 * INTUITION:
 * Sending notifications (email/SMS) is unreliable and rate-limited by providers.
 * We need a system that queues requests, handles failures (retries), and
 * respects rate limits.
 *
 * ALGORITHM:
 * 1. Queue: Store pending notifications.
 * 2. Process Loop:
 *    - Take item from queue.
 *    - Check TTL: If expired, drop.
 *    - Check Rate Limit: If limited, put back at front of queue & wait.
 *    - Attempt Send:
 *      - Success: Log it.
 *      - Fail: Decrement retries. If > 0, push back to queue. Else drop.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * 1. send(Msg1). Queue: [Msg1].
 * 2. process() starts. Pop Msg1.
 * 3. RateLimiter.allow()? -> False.
 *    - Unshift Msg1. Queue: [Msg1]. Sleep 100ms.
 * 4. Wake up. Pop Msg1. RateLimiter.allow()? -> True.
 * 5. fakeSend(Msg1) throws Error.
 *    - Retries left? Yes (2). Push Msg1. Queue: [Msg1].
 * ============================================================================
 */
class NotificationSystem {
  constructor({ rateLimiter, maxRetries = 3 }) {
    this.queue = [];
    this.rateLimiter = rateLimiter;
    this.maxRetries = maxRetries;
    this.processing = false;
  }

  send(notification) {
    const enriched = {
      ...notification,
      retriesLeft: this.maxRetries,
    };
    this.queue.push(enriched);
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
        // put back and wait
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
          console.log("Retrying:", notif.id);
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
