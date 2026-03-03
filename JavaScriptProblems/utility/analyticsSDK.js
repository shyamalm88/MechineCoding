/**
 * ============================================================================
 * PROBLEM: Analytics SDK
 * ============================================================================
 * Design a lightweight, production-ready Analytics SDK that:
 * 1. Batches events to reduce network traffic.
 * 2. Flushes automatically based on time or batch size.
 * 3. Supports auto-tracking of interactions (clicks, hovers).
 * 4. Ensures data delivery on page unload (using Beacon API).
 * 5. Handles retries on failure.
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * - Batching: Grouping events is more efficient than sending 1-by-1.
 * - Reliability: `fetch` can be cancelled on unload; `sendBeacon` is reliable.
 * - Event Delegation: Listen on `document` instead of every element for performance.
 * - Debounce: Prevent high-frequency events (like hover) from flooding the queue.
 */
// 1. The Utility: Shows you understand closures and the event loop
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 2. The Core Engine
class Analytics {
  constructor(batchSize = 5, flushInterval = 3000) {
    this.queue = [];
    this.batchSize = batchSize;

    // Bind methods to preserve 'this' context in event listeners
    this.flush = this.flush.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleHover = debounce(this.handleHover.bind(this), 500);

    this.handleVisibility = () => {
      if (document.visibilityState === "hidden") this.flush(true);
    };

    // Start background polling
    this.intervalId = setInterval(this.flush, flushInterval);
  }

  // Explicit Tracking
  track(eventName, data = {}) {
    this.queue.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      url: window.location.pathname,
      eventName,
      data,
      timestamp: Date.now(),
    });

    // Flush immediately if batch size is reached
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  // The Transport Layer
  async flush(isUnloading = false) {
    if (this.queue.length === 0) return;

    // Copy and clear the queue BEFORE async work to prevent duplicate sends
    const payload = [...this.queue];
    this.queue = [];

    try {
      if (isUnloading && navigator.sendBeacon) {
        // Guaranteed delivery on page exit
        navigator.sendBeacon("/analytics-endpoint", JSON.stringify(payload));
      } else {
        const res = await fetch("/analytics-endpoint", {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // Explicitly set header
          body: JSON.stringify(payload),
          keepalive: true,
        });

        // fetch doesn't throw on 4xx/5xx errors, so we manually throw to trigger the retry logic
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      }
    } catch (error) {
      // Put events back at the front of the queue if network fails
      this.queue.unshift(...payload);
    }
  }

  // --- Auto-Tracking (Event Delegation) ---

  initAutoTracking() {
    // Single listeners on the document (Event Delegation)
    document.addEventListener("click", this.handleEvent);
    document.addEventListener("mouseover", this.handleHover);

    // Handle tab close / navigation
    window.addEventListener("visibilitychange", this.handleVisibility);
  }

  destroy() {
    clearInterval(this.intervalId);
    document.removeEventListener("click", this.handleEvent);
    document.removeEventListener("mouseover", this.handleHover);
    window.removeEventListener("visibilitychange", this.handleVisibility);
    this.flush(true);
  }

  handleEvent(e) {
    // Look for elements with data-track attributes bubbling up
    const target = e.target.closest("[data-track]");
    if (target) {
      this.track(target.dataset.track, { type: e.type });
    }
  }

  handleHover(e) {
    const target = e.target.closest("[data-track-hover]");
    if (target) {
      this.track(target.dataset.trackHover, { type: "hover" });
    }
  }
}

// Usage in interview:
// const sdk = new Analytics(5, 3000);
// sdk.initAutoTracking();
