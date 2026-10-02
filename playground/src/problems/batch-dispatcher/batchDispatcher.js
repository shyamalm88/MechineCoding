// ---- batchApiDispatcher.js ----
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

// DataLoader-style usage: all calls in one tick are batched into ONE query
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

export { batchDispatcher, createUserLoader }
