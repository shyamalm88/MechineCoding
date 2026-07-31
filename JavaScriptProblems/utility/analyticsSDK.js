// Analytics SDK — batch events, flush on size or interval

class Analytics {
  constructor(batchSize = 5, flushInterval = 3000, maxQueueSize = 500) {
    this.queue = [];
    this.batchSize = batchSize;
    this.maxQueueSize = maxQueueSize;
    this.intervalId = setInterval(() => this.flush(), flushInterval);
    this.onUnload = () => this.flush(true);
    window.addEventListener("beforeunload", this.onUnload);
  }

  track(event, data = {}) {
    this.queue.push({ event, data, timestamp: Date.now() });
    this._enforceCap();
    if (this.queue.length >= this.batchSize) this.flush();
  }

  // drop oldest events once the queue exceeds maxQueueSize, so a prolonged
  // outage (repeated failed flushes re-queuing events) can't grow it forever
  _enforceCap() {
    const overflow = this.queue.length - this.maxQueueSize;
    if (overflow > 0) this.queue.splice(0, overflow);
  }

  flush(useBeacon = false) {
    if (!this.queue.length) return;
    const payload = this.queue.splice(0);            // drain queue atomically
    const body = JSON.stringify(payload);

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon("/analytics", body);      // survives page close
    } else {
      fetch("/analytics", { method: "POST", body, keepalive: true })
        .catch(() => {
          this.queue.unshift(...payload);            // retry on failure
          this._enforceCap();
        });
    }
  }

  destroy() {
    clearInterval(this.intervalId);
    window.removeEventListener("beforeunload", this.onUnload);
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
// 5. maxQueueSize caps unbounded growth if the endpoint stays down and
//    failed batches keep getting re-queued (drops oldest events first)
// 6. destroy() clears the interval and unload listener — call it on
//    teardown to avoid leaking timers across instances (HMR, SPA unmount)
