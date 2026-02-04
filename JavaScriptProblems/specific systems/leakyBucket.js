/**
 * ============================================================================
 * PROBLEM: Leaky Bucket Algorithm
 * ============================================================================
 *
 * INTUITION:
 * Imagine a bucket with a hole in the bottom.
 * - Water (requests) is poured in at irregular rates.
 * - Water leaks out (processed) at a constant rate.
 * - If the bucket overflows, water is lost (requests dropped).
 *
 * USE CASE:
 * Traffic shaping. It converts bursty traffic into a smooth, constant flow.
 *
 * ALGORITHM:
 * 1. Queue represents the bucket.
 * 2. `leak()`: Calculate how many items *could* have been processed since last check.
 *    - Remove that many items from the queue.
 * 3. `allow()`:
 *    - Run leak() to update state.
 *    - If queue has space, push request. Else drop.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * Cap=3, Rate=1/sec.
 * 1. T=0s: allow(Req1). Leak=0. Queue=[Req1]. (Size 1/3) -> OK.
 * 2. T=0.1s: allow(Req2). Leak=0. Queue=[Req1, Req2]. (Size 2/3) -> OK.
 * 3. T=0.2s: allow(Req3). Leak=0. Queue=[Req1, Req2, Req3]. (Size 3/3) -> OK.
 * 4. T=0.3s: allow(Req4). Leak=0. Queue Full. -> DROP.
 * 5. T=1.1s: allow(Req5).
 *    - Leak: (1.1 - 0) * 1 = 1 item. Remove Req1. Queue=[Req2, Req3].
 *    - Push Req5. Queue=[Req2, Req3, Req5]. -> OK.
 * ============================================================================
 */
class LeakyBucket {
  constructor(capacity, leakRate) {
    this.capacity = capacity; // max queue size
    this.leakRate = leakRate; // requests per second
    this.queue = [];
    this.lastLeak = Date.now();
  }

  leak() {
    const now = Date.now();
    const elapsed = (now - this.lastLeak) / 1000;
    const leaks = Math.floor(elapsed * this.leakRate);

    if (leaks > 0) {
      this.queue.splice(0, leaks); // remove processed requests
      this.lastLeak = now;
    }
  }

  allow(request) {
    this.leak();

    if (this.queue.length < this.capacity) {
      this.queue.push(request);
      return true;
    }
    return false;
  }
}
