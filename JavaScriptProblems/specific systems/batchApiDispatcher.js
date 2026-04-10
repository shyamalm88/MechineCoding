/**
 * ============================================================================
 * PROBLEM: Batch API Dispatcher
 * ============================================================================
 * Implement a dispatcher that collects individual items and sends them
 * together as a single batch to reduce API calls.
 *
 * Flush (send the batch) when EITHER:
 *   1. The batch reaches `batchSize` (size trigger)
 *   2. `batchDelay` ms pass with no new items (time trigger)
 *
 * REAL-WORLD USE CASES:
 *   - Analytics events: instead of POST /event 100 times, send one POST /events with 100
 *   - Log shipping: buffer logs, flush every 500ms or every 50 logs
 *   - DataLoader-style batching: collect all DB ids within one tick, fire one IN query
 *   - User activity tracking: keystrokes, mouse moves batched before sending
 * ============================================================================
 */

function batchDispatcher({ batchSize, batchDelay, dispatchFn }) {
  let queue = [];
  let timer = null;

  function flush() {
    if (queue.length === 0) return;

    const batch = queue;
    queue = [];               // reset queue BEFORE dispatching (re-entrant safe)

    clearTimeout(timer);      // cancel pending time-based flush
    timer = null;

    dispatchFn(batch);        // send the batch
  }

  function enqueue(item) {
    queue.push(item);

    // Trigger 1: batch is full — flush immediately
    if (queue.length >= batchSize) {
      flush();
      return;
    }

    // Trigger 2: start/reset the timer — flush after silence of batchDelay ms
    // KEY FIX: must clear previous timer before setting a new one.
    // Without clearTimeout, enqueueing 4 items creates 4 timers → flush() fires 4x.
    clearTimeout(timer);
    timer = setTimeout(flush, batchDelay);
  }

  // Manually flush remaining items (call on app shutdown / page unload)
  function flushNow() {
    flush();
  }

  return { enqueue, flushNow };
}

// ─── Usage 1: Analytics event tracker ────────────────────────────────────────

const analyticsDispatcher = batchDispatcher({
  batchSize:  5,                      // send when 5 events accumulate
  batchDelay: 2000,                   // or after 2 seconds of inactivity
  dispatchFn: (events) => {
    console.log(`[Analytics] Sending batch of ${events.length} events:`, events);
    // In production: fetch('/api/events', { method: 'POST', body: JSON.stringify(events) })
  },
});

// Simulate user actions firing rapidly
analyticsDispatcher.enqueue({ type: "click",    target: "buy-button" });
analyticsDispatcher.enqueue({ type: "scroll",   depth: 50 });
analyticsDispatcher.enqueue({ type: "hover",    target: "product-img" });
analyticsDispatcher.enqueue({ type: "click",    target: "add-to-cart" });
analyticsDispatcher.enqueue({ type: "pageview", url: "/checkout" });
// ↑ 5th enqueue hits batchSize=5 → flushes immediately
// [Analytics] Sending batch of 5 events: [...]

analyticsDispatcher.enqueue({ type: "click", target: "pay-button" });
// Only 1 item in queue — timer starts (2000ms)
// After 2 seconds with no new events → flushes automatically
// [Analytics] Sending batch of 1 events: [...]

// ─── Usage 2: Log shipper ─────────────────────────────────────────────────────

const logDispatcher = batchDispatcher({
  batchSize:  3,
  batchDelay: 500,
  dispatchFn: (logs) => {
    console.log(`[Logs] Shipping ${logs.length} logs →`, logs.map(l => l.msg).join(" | "));
  },
});

logDispatcher.enqueue({ level: "info",  msg: "User logged in" });
logDispatcher.enqueue({ level: "debug", msg: "Fetching cart" });
logDispatcher.enqueue({ level: "error", msg: "Payment failed" });
// 3rd log hits batchSize=3 → immediate flush
// [Logs] Shipping 3 logs → User logged in | Fetching cart | Payment failed

// ─── Usage 3: Flush on page unload ───────────────────────────────────────────

// window.addEventListener('beforeunload', () => {
//   analyticsDispatcher.flushNow(); // don't lose the last partial batch
// });

// ─── Usage 4: DataLoader-style — batch DB lookups ────────────────────────────
// All calls to loadUser() within the same synchronous tick
// get batched into a single DB query.

function createUserLoader() {
  const { enqueue } = batchDispatcher({
    batchSize:  50,
    batchDelay: 0,        // flush at end of current event loop tick (no wait)
    dispatchFn: async (requests) => {
      const ids = requests.map(r => r.id);
      console.log(`[DB] SELECT * FROM users WHERE id IN (${ids.join(",")})`);
      // const rows = await db.query(`SELECT * FROM users WHERE id IN (?)`, [ids]);
      // requests.forEach(r => r.resolve(rows.find(u => u.id === r.id)));
    },
  });

  return function loadUser(id) {
    return new Promise((resolve) => {
      enqueue({ id, resolve });
    });
  };
}

const loadUser = createUserLoader();
// These three calls happen synchronously — all batched into ONE query
loadUser(1);
loadUser(2);
loadUser(3);
// [DB] SELECT * FROM users WHERE id IN (1,2,3)   ← 1 query, not 3

/**
 * ─── How it works (mental model) ─────────────────────────────────────────────
 *
 *  enqueue("A")  → queue: ["A"]              timer started (2000ms)
 *  enqueue("B")  → queue: ["A","B"]          timer RESET (2000ms from now)
 *  enqueue("C")  → queue: ["A","B","C"]      timer RESET
 *  enqueue("D")  → queue: ["A","B","C","D"]  timer RESET
 *  enqueue("E")  → queue hits batchSize=5 → FLUSH IMMEDIATELY
 *                  dispatchFn(["A","B","C","D","E"]) called
 *                  timer cleared, queue reset to []
 *
 *  enqueue("F")  → queue: ["F"]              new timer started
 *  ...2000ms pass with no new items...
 *  timer fires → FLUSH
 *  dispatchFn(["F"]) called
 *
 * ─── What was wrong in the original ──────────────────────────────────────────
 *  Bug: timer was never cleared before setting a new one.
 *       Enqueue 4 items = 4 separate timers running simultaneously.
 *       All 4 fire → flush() called 4 times.
 *       First call sends the batch. Next 3 calls: queue is empty → dispatchFn([]).
 *  Fix: clearTimeout(timer) BEFORE setTimeout → only ever ONE pending timer.
 *
 * ─── Interview talking points ─────────────────────────────────────────────────
 * 1. "Two flush triggers: size (immediate) and time (debounced). Size trigger
 *     prevents unbounded memory growth. Time trigger handles low-volume tails."
 *
 * 2. "Critical: queue = [] BEFORE calling dispatchFn. If dispatchFn throws
 *     or re-enqueues synchronously, we don't lose new items or double-send."
 *
 * 3. "batchDelay: 0 is a valid config — batches everything enqueued in the
 *     same synchronous tick, then flushes at the next event loop turn.
 *     This is exactly how Facebook's DataLoader works."
 *
 * 4. "Always expose flushNow() for cleanup — call it on beforeunload or
 *     process SIGTERM to avoid losing the last partial batch."
 */
