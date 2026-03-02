/**
 * ============================================================================
 * PROBLEM: Analytics SDK
 * ============================================================================
 * Design a production-ready Analytics SDK that:
 * 1. Batches events to reduce network traffic.
 * 2. Flushes automatically based on time or batch size.
 * 3. Retries failed requests with exponential backoff.
 * 4. Ensures data delivery on page unload (using Beacon API).
 * 5. Enriches events with metadata (timestamp, session ID).
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * - Batching: Network calls are expensive. Grouping events (e.g., 10 at a time)
 *   is more efficient than sending 10 separate requests.
 * - Reliability: Users close tabs. `fetch` is often cancelled on unload.
 *   `navigator.sendBeacon` is designed specifically to outlive the page.
 * - Concurrency: We need to ensure we don't have multiple flush operations
 *   modifying the queue simultaneously, but we also shouldn't block tracking.
 */

class AnalyticsSDK {
  constructor({
    url = "https://api.analytics.com/v1/events",
    batchSize = 5,
    flushInterval = 3000,
    retryCount = 3,
  } = {}) {
    this.url = url;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.retryCount = retryCount;

    this.queue = [];
    this.timer = null;
    this.isSending = false;
    this.sessionId = this._generateSessionId();

    // Bind methods to ensure 'this' context
    this.flush = this.flush.bind(this);
    this.handleUnload = this.handleUnload.bind(this);

    this.setupLifecycleListeners();
  }

  /**
   * Public API to track an event.
   */
  track(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
    };

    this.queue.push(event);
    console.log(`[Analytics] Tracked: ${eventName}`, event);

    // If queue is full, flush immediately.
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  /**
   * Schedules a flush if one isn't already scheduled.
   */
  scheduleFlush() {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Flushes the queue.
   * If a flush is already in progress, it returns early (concurrency control).
   */
  async flush() {
    if (this.isSending || this.queue.length === 0) return;

    // Clear timer since we are flushing now
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.isSending = true;

    // Take a batch from the queue
    const batch = this.queue.splice(0, this.batchSize);

    try {
      await this.sendWithRetry(batch);
    } catch (error) {
      console.error("[Analytics] Failed to send batch after retries", error);
      // Strategy: Re-queue events if critical, or persist to localStorage
      // For this demo, we just log the loss.
    } finally {
      this.isSending = false;

      // If there are more events (e.g., added while sending), flush again immediately
      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (this.queue.length > 0) {
        this.scheduleFlush();
      }
    }
  }

  /**
   * Sends data with exponential backoff retries.
   */
  async sendWithRetry(batch, attempt = 0) {
    try {
      await this.send(batch);
      console.log(
        `[Analytics] Successfully sent batch of ${batch.length} events`,
      );
    } catch (err) {
      if (attempt < this.retryCount) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
        console.warn(`[Analytics] Send failed, retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        return this.sendWithRetry(batch, attempt + 1);
      }
      throw err; // Propagate error after max retries
    }
  }

  /**
   * Actual network request simulation.
   */
  async send(batch) {
    // In production:
    // await fetch(this.url, { method: 'POST', body: JSON.stringify(batch), keepalive: true });

    // Simulation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 10% failure rate
        if (Math.random() > 0.9) reject(new Error("Simulated Network Error"));
        else resolve();
      }, 500);
    });
  }

  /**
   * Handles page unload/visibility change.
   * Uses `navigator.sendBeacon` for reliability during page transitions.
   */
  handleUnload() {
    if (this.queue.length === 0) return;

    // sendBeacon is reliable during unload, unlike fetch
    // It sends data asynchronously without blocking the unload
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(this.queue)], {
        type: "application/json",
      });
      const success = navigator.sendBeacon(this.url, blob);

      if (success) {
        console.log(
          `[Analytics] Flushed ${this.queue.length} events via Beacon`,
        );
        this.queue = [];
      }
    } else {
      console.warn("[Analytics] Beacon not supported, data might be lost");
    }
  }

  setupLifecycleListeners() {
    if (typeof document === "undefined") return;

    // Modern reliable unload detection
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.handleUnload();
      }
    });
  }

  _generateSessionId() {
    return "sess_" + Math.random().toString(36).substr(2, 9);
  }
}

// ============================================================================
// DEMO / TEST
// ============================================================================

const analytics = new AnalyticsSDK({
  batchSize: 3,
  flushInterval: 2000,
});

console.log("--- 1. Tracking initial events ---");
analytics.track("page_view", { url: "/home" });
analytics.track("button_click", { id: "signup" });

// Simulate rapid events to trigger batch flush
setTimeout(() => {
  console.log("\n--- 2. Rapid events (should trigger batch flush) ---");
  for (let i = 0; i < 5; i++) {
    analytics.track("scroll", { depth: i * 20 });
  }
}, 1000);

// Simulate unload
setTimeout(() => {
  console.log("\n--- 3. Simulating Page Unload (Beacon) ---");
  analytics.track("page_exit", { duration: 5000 });

  // Manually calling for demo since we can't close the browser window via script
  analytics.handleUnload();
}, 4000);
