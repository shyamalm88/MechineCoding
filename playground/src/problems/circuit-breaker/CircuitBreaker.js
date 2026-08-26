/**
 * Circuit breaker: stop hammering a service that is already failing.
 *
 *   CLOSED ──failures ≥ threshold──▶ OPEN ──after resetTimeout──▶ HALF_OPEN
 *      ▲                                                             │
 *      └──────────────── trial succeeds ─────────────────────────────┘
 *                        trial fails ──▶ back to OPEN
 */
export class CircuitBreaker {
  constructor(fn, { failureThreshold = 3, resetTimeout = 3000 } = {}) {
    this.fn = fn
    this.failureThreshold = failureThreshold
    this.resetTimeout = resetTimeout

    this.state = 'CLOSED'
    this.failureCount = 0
    this.nextAttemptTime = 0
    this.halfOpenInFlight = false
  }

  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        // Fail fast -- no request is made at all. This is the whole point:
        // it protects the failing service AND the caller's latency budget.
        throw new Error('Circuit is OPEN — failing fast')
      }
      this.state = 'HALF_OPEN'
      this.halfOpenInFlight = false
    }

    if (this.state === 'HALF_OPEN' && this.halfOpenInFlight) {
      // Only ONE trial request is allowed through, or a recovering service
      // gets a stampede the instant the timer expires.
      throw new Error('Circuit is HALF_OPEN — trial already in flight')
    }
    if (this.state === 'HALF_OPEN') this.halfOpenInFlight = true

    try {
      const result = await this.fn(...args)
      this.#onSuccess()
      return result
    } catch (error) {
      this.#onFailure()
      throw error
    }
  }

  #onSuccess() {
    this.failureCount = 0
    this.state = 'CLOSED'
    this.halfOpenInFlight = false
  }

  #onFailure() {
    this.failureCount++
    this.halfOpenInFlight = false
    // A failed trial in HALF_OPEN re-opens immediately, without waiting to
    // accumulate threshold failures again.
    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
      this.nextAttemptTime = Date.now() + this.resetTimeout
    }
  }
}
