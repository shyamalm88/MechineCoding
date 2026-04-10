// Analytics SDK — batch events, flush on size or interval

class Analytics {
  constructor(batchSize = 5, flushInterval = 3000) {
    this.queue = [];
    this.batchSize = batchSize;
    setInterval(() => this.flush(), flushInterval);
    window.addEventListener("beforeunload", () => this.flush(true));
  }

  track(event, data = {}) {
    this.queue.push({ event, data, timestamp: Date.now() });
    if (this.queue.length >= this.batchSize) this.flush();
  }

  flush(useBeacon = false) {
    if (!this.queue.length) return;
    const payload = this.queue.splice(0);            // drain queue atomically
    const body = JSON.stringify(payload);

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon("/analytics", body);      // survives page close
    } else {
      fetch("/analytics", { method: "POST", body, keepalive: true })
        .catch(() => this.queue.unshift(...payload)); // retry on failure
    }
  }
}

// Usage
const sdk = new Analytics(5, 3000);
sdk.track("click", { button: "buy" });
sdk.track("pageview", { url: "/home" });

// Key talking points:
// 1. Two flush triggers: batchSize (immediate) and interval (time-based tail)
// 2. splice(0) drains queue before async fetch — prevents double-send on retry
// 3. sendBeacon for page unload — fetch gets cancelled by browser on tab close
// 4. keepalive: true lets fetch outlive the page in modern browsers
