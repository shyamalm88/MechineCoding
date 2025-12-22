console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => console.log("promise1"))
  .then(() => console.log("promise2"));

(async () => {
  console.log("async start");
  await Promise.resolve();
  console.log("async end");
})();

console.log("end");

// start
// async start
// end
// promise1
// async end
// promise2
// timeout

// Execution Timeline
// 1. Synchronous Code Runs First

// start           ← sync
// async start     ← sync (async function runs until first await)
// end             ← sync
// 2. After Sync Code, Microtask Queue Contains:

// Queue: [promise1-callback, async-continuation]
//         ↑                   ↑
//         Added by .then()    Added by await
// Both were queued during synchronous execution.
// 3. Processing Microtasks (FIFO Order)

// Step 1: Run promise1-callback
//         → logs "promise1"
//         → .then() adds promise2-callback to END of queue

// Queue now: [async-continuation, promise2-callback]
//                                 ↑ just added

// Step 2: Run async-continuation
//         → logs "async end"

// Step 3: Run promise2-callback
//         → logs "promise2"
// The Key Insight

// Promise.resolve()
//   .then(() => console.log("promise1"))   // ← Queued immediately
//   .then(() => console.log("promise2"));  // ← Queued AFTER promise1 runs

// await Promise.resolve();                  // ← Queued immediately
// console.log("async end");
// Callback	When Queued
// promise1	During sync execution
// async end	During sync execution (at await)
// promise2	After promise1 completes
// Since async end was queued before promise2 (which only gets queued when promise1 finishes), it runs first.
// Visual Timeline

// SYNC:     start → async start → end
//           [queue: promise1, async-end]

// MICRO 1:  promise1 runs → queues promise2
//           [queue: async-end, promise2]

// MICRO 2:  async end runs
//           [queue: promise2]

// MICRO 3:  promise2 runs

// MACRO:    timeout runs
