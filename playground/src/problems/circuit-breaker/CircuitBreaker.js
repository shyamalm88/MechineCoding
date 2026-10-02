/**
 * INTERVIEW-READY CIRCUIT BREAKER
 *
 * States:
 *  - CLOSED     → normal operation
 *  - OPEN       → fail fast
 *  - HALF_OPEN  → allow one trial request
 */
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;

    // Configuration
    this.failureThreshold = options.failureThreshold ?? 3;
    this.resetTimeout = options.resetTimeout ?? 5000;

    // State
    this.state = "CLOSED";
    this.failureCount = 0;
    this.nextAttemptTime = 0;
    this.halfOpenInProgress = false;
  }

  async call(...args) {
    const now = Date.now();

    // -------------------------
    // OPEN → fail fast
    // -------------------------
    if (this.state === "OPEN") {
      if (now < this.nextAttemptTime) {
        throw new Error("Circuit breaker is OPEN");
      }

      // Move to HALF_OPEN after timeout
      this.state = "HALF_OPEN";
      this.halfOpenInProgress = false;
    }

    // -------------------------
    // HALF_OPEN → allow ONE trial
    // -------------------------
    if (this.state === "HALF_OPEN") {
      if (this.halfOpenInProgress) {
        throw new Error("Circuit breaker is HALF_OPEN");
      }
      this.halfOpenInProgress = true;
    }

    try {
      const result = await this.fn(...args);
      this._onSuccess();
      return result;
    } catch (err) {
      this._onFailure();
      throw err;
    }
  }

  // -------------------------
  // State transitions
  // -------------------------

  _onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
    this.halfOpenInProgress = false;
  }

  _onFailure() {
    this.failureCount++;

    if (this.state === "HALF_OPEN") {
      this._trip();
      return;
    }

    if (this.failureCount >= this.failureThreshold) {
      this._trip();
    }
  }

  _trip() {
    this.state = "OPEN";
    this.nextAttemptTime = Date.now() + this.resetTimeout;
    this.halfOpenInProgress = false;
  }
}

export { CircuitBreaker }
