# JavaScript Event Loop & Promise Output Questions

A collection of tricky JavaScript output questions focusing on the **Event Loop**, **Promises**, **async/await**, and **microtask vs macrotask** execution order.

---

## Table of Contents

1. [Event Loop Basics](#event-loop-basics)
2. [Question 1: Promise Chain vs Async/Await](#question-1-promise-chain-vs-asyncawait)
3. [Question 2: Nested Promises](#question-2-nested-promises)
4. [Question 3: Promise.all vs Sequential](#question-3-promiseall-vs-sequential)
5. [Question 4: Microtask Queue Ordering](#question-4-microtask-queue-ordering)
6. [Question 5: setTimeout vs setImmediate vs process.nextTick](#question-5-settimeout-vs-setimmediate-vs-processnexttick)
7. [Key Takeaways](#key-takeaways)

---

## Event Loop Basics

```
┌───────────────────────────┐
│        Call Stack         │
└───────────────────────────┘
              ↓
┌───────────────────────────┐
│     Microtask Queue       │  ← Promise.then, await, queueMicrotask
│  (Higher Priority)        │
└───────────────────────────┘
              ↓
┌───────────────────────────┐
│     Macrotask Queue       │  ← setTimeout, setInterval, I/O
│  (Lower Priority)         │
└───────────────────────────┘
```

**Execution Order:**
1. Execute all synchronous code (Call Stack)
2. Execute ALL microtasks (until queue is empty)
3. Execute ONE macrotask
4. Repeat from step 2

---

## Question 1: Promise Chain vs Async/Await

### Code

```javascript
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
```

### Output

```
start
async start
end
promise1
async end
promise2
timeout
```

### Explanation

#### Phase 1: Synchronous Execution

| Step | Code | Output | Queue State |
|------|------|--------|-------------|
| 1 | `console.log("start")` | `start` | - |
| 2 | `setTimeout(...)` | - | Macrotask: [timeout] |
| 3 | `Promise.resolve().then(...)` | - | Microtask: [promise1-cb] |
| 4 | `console.log("async start")` | `async start` | - |
| 5 | `await Promise.resolve()` | - | Microtask: [promise1-cb, async-continuation] |
| 6 | `console.log("end")` | `end` | - |

#### Phase 2: Microtask Processing (FIFO)

```
Initial Queue: [promise1-callback, async-continuation]

Step 1: Execute promise1-callback
        → Output: "promise1"
        → Chains .then() → adds promise2-callback to END of queue

Queue: [async-continuation, promise2-callback]

Step 2: Execute async-continuation
        → Output: "async end"

Queue: [promise2-callback]

Step 3: Execute promise2-callback
        → Output: "promise2"

Queue: [] (empty)
```

#### Phase 3: Macrotask Processing

```
Execute timeout callback
→ Output: "timeout"
```

### Key Insight

```javascript
Promise.resolve()
  .then(() => console.log("promise1"))   // Queued immediately
  .then(() => console.log("promise2"));  // Queued AFTER promise1 runs!

await Promise.resolve();                  // Queued immediately
console.log("async end");
```

| Callback | When Queued |
|----------|-------------|
| promise1 | During sync execution |
| async end | During sync execution (at `await`) |
| promise2 | **After** promise1 completes |

Since `async end` was queued BEFORE `promise2`, it runs first!

---

## Question 2: Nested Promises

### Code

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => {
  console.log("3");
  Promise.resolve().then(() => console.log("4"));
});

Promise.resolve().then(() => console.log("5"));

console.log("6");
```

### Output

```
1
6
3
5
4
2
```

### Explanation

```
SYNC:     1 → 6
          Microtask Queue: [cb-3, cb-5]

MICRO 1:  cb-3 runs → logs "3" → queues cb-4
          Queue: [cb-5, cb-4]

MICRO 2:  cb-5 runs → logs "5"
          Queue: [cb-4]

MICRO 3:  cb-4 runs → logs "4"
          Queue: []

MACRO:    logs "2"
```

### Key Insight

Nested `.then()` callbacks are added to the **end** of the current microtask queue, not executed immediately.

---

## Question 3: Promise.all vs Sequential

### Code

```javascript
const delay = (ms, val) => new Promise(resolve =>
  setTimeout(() => {
    console.log(val);
    resolve(val);
  }, ms)
);

console.log("start");

// Sequential
(async () => {
  await delay(100, "A");
  await delay(100, "B");
  console.log("sequential done");
})();

// Parallel
Promise.all([
  delay(100, "X"),
  delay(100, "Y")
]).then(() => console.log("parallel done"));

console.log("end");
```

### Output

```
start
end
A
X
Y
parallel done
B
sequential done
```

### Timeline

```
0ms:    "start", "end" (sync)
100ms:  "A" (sequential first)
        "X", "Y" (parallel - started at same time)
        "parallel done" (Promise.all resolves)
200ms:  "B" (sequential second)
        "sequential done"
```

### Key Insight

- **Sequential `await`**: Each waits for the previous to complete
- **`Promise.all`**: All promises start simultaneously

---

## Question 4: Microtask Queue Ordering

### Code

```javascript
Promise.resolve()
  .then(() => {
    console.log("1");
    return Promise.resolve("2");
  })
  .then((val) => console.log(val));

Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));
```

### Output

```
1
3
4
2
```

### Explanation

This is tricky! When you `return Promise.resolve()` from a `.then()`, it takes **2 extra microtasks** to unwrap.

```
Initial Queue: [cb-1, cb-3]

MICRO 1: cb-1 → logs "1" → returns Promise.resolve("2")
         Queue: [cb-3, <unwrap-1>]

MICRO 2: cb-3 → logs "3" → queues cb-4
         Queue: [<unwrap-1>, cb-4]

MICRO 3: <unwrap-1> → internal unwrapping
         Queue: [cb-4, <unwrap-2>]

MICRO 4: cb-4 → logs "4"
         Queue: [<unwrap-2>]

MICRO 5: <unwrap-2> → resolves, queues cb-2
         Queue: [cb-2]

MICRO 6: cb-2 → logs "2"
```

### Key Insight

Returning a Promise from `.then()` adds extra microtasks for "unwrapping". This is why `2` prints last!

---

## Question 5: setTimeout vs setImmediate vs process.nextTick

### Code (Node.js)

```javascript
console.log("start");

setTimeout(() => console.log("timeout"), 0);

setImmediate(() => console.log("immediate"));

process.nextTick(() => console.log("nextTick"));

Promise.resolve().then(() => console.log("promise"));

console.log("end");
```

### Output

```
start
end
nextTick
promise
timeout      // or immediate (order not guaranteed)
immediate    // or timeout
```

### Priority Order

```
1. Synchronous code
2. process.nextTick (highest priority microtask)
3. Promise microtasks
4. setTimeout / setImmediate (macrotasks - order varies)
```

### Key Insight

- `process.nextTick` runs BEFORE Promise microtasks
- `setTimeout(0)` vs `setImmediate` order depends on system timing

---

## Bonus: queueMicrotask

### Code

```javascript
console.log("1");

queueMicrotask(() => console.log("2"));

Promise.resolve().then(() => console.log("3"));

queueMicrotask(() => console.log("4"));

console.log("5");
```

### Output

```
1
5
2
3
4
```

### Key Insight

`queueMicrotask` and `Promise.then` use the **same** microtask queue, processed in FIFO order.

---

## Key Takeaways

### 1. Execution Priority

```
Sync Code  >  Microtasks  >  Macrotasks
```

### 2. Microtask Sources

- `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `await` (continuation after await)
- `queueMicrotask()`
- `process.nextTick()` (Node.js - even higher priority)

### 3. Macrotask Sources

- `setTimeout()`, `setInterval()`
- `setImmediate()` (Node.js)
- I/O operations
- UI rendering (browsers)

### 4. Common Gotchas

| Gotcha | Explanation |
|--------|-------------|
| Chained `.then()` | Each `.then()` is queued AFTER the previous resolves |
| `return Promise.resolve()` | Adds 2 extra microtasks for unwrapping |
| `await` vs `.then()` | `await` continuation queued at the point of await |
| Nested microtasks | Added to END of current queue, not executed immediately |

### 5. Mental Model

```javascript
// Think of it as:
await Promise.resolve();
console.log("after await");

// Is equivalent to:
Promise.resolve().then(() => {
  console.log("after await");
});
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────┐
│                    EVENT LOOP                           │
├─────────────────────────────────────────────────────────┤
│  1. Run all SYNC code                                   │
│  2. Run ALL microtasks (until empty)                    │
│     - process.nextTick (Node.js)                        │
│     - Promise callbacks                                 │
│     - queueMicrotask                                    │
│  3. Run ONE macrotask                                   │
│     - setTimeout/setInterval                            │
│     - setImmediate (Node.js)                            │
│     - I/O callbacks                                     │
│  4. Go to step 2                                        │
└─────────────────────────────────────────────────────────┘
```
