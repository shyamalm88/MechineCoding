class AnalyticsSDK {
  constructor({ batchSize = 5, flushInterval = 3000, retryCount = 3 } = {}) {
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.retryCount = retryCount;

    this.queue = [];
    this.timer = null;
    this.sending = false;

    this.setupUnloadHandlers();
  }

  track(event) {
    this.queue.push(event);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  async flush() {
    if (this.sending || this.queue.length === 0) return;

    clearTimeout(this.timer);
    this.timer = null;

    const batch = this.queue.splice(0, this.batchSize);
    this.sending = true;

    try {
      await this.sendWithRetry(batch);
    } finally {
      this.sending = false;
      if (this.queue.length > 0) {
        this.startTimer();
      }
    }
  }

  async sendWithRetry(batch) {
    let attempt = 0;

    while (attempt <= this.retryCount) {
      try {
        await this.send(batch);
        return;
      } catch (err) {
        if (attempt === this.retryCount) {
          console.error("Failed to send analytics", batch);
          return;
        }
        attempt++;
        await this.delay(2 ** attempt * 100);
      }
    }
  }

  async send(batch) {
    // Simulated network request
    console.log("Sending batch", batch);
    await new Promise((res) => setTimeout(res, 200));

    // Uncomment to simulate failure
    // throw new Error("Network error");
  }

  delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  setupUnloadHandlers() {
    window.addEventListener("beforeunload", () => {
      this.flushSync();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flushSync();
      }
    });
  }

  flushSync() {
    if (this.queue.length === 0) return;

    // In real SDKs:
    // navigator.sendBeacon(url, JSON.stringify(this.queue))
    console.log("Flushing synchronously", this.queue);
    this.queue = [];
  }
}

const analytics = new AnalyticsSDK({
  batchSize: 3,
  flushInterval: 2000,
});

analytics.track({ event: "page_view" });
analytics.track({ event: "click" });
analytics.track({ event: "scroll" }); // triggers flush

analytics.track({ event: "hover" });
