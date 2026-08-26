/**
 * Batch events and flush on EITHER a size threshold or a time interval,
 * whichever comes first.
 *
 * Size-only never sends a partial trailing batch; time-only sends too often
 * under load. Both together bound latency and request count.
 */
export class Analytics {
  constructor({ maxSize = 5, maxWaitMs = 2000, send } = {}) {
    this.maxSize = maxSize
    this.maxWaitMs = maxWaitMs
    this.send = send
    this.queue = []
    this.timer = null
  }

  track(event) {
    this.queue.push(event)

    if (this.queue.length >= this.maxSize) return this.flush('size')

    // Start the clock on the FIRST event of a batch, so max latency is bounded
    // by maxWaitMs. Restarting it per event would let a steady trickle delay
    // the batch forever.
    if (this.timer === null) {
      this.timer = setTimeout(() => this.flush('time'), this.maxWaitMs)
    }
  }

  flush(reason = 'manual') {
    if (this.timer !== null) { clearTimeout(this.timer); this.timer = null }
    if (this.queue.length === 0) return
    const batch = this.queue
    this.queue = []          // swap out BEFORE sending, so events tracked
    this.send(batch, reason) // during the send land in the next batch
  }
}
