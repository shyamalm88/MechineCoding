# Promise Progress Tracker

## Problem Statement

Build a **Promise Progress Tracker** component that executes multiple asynchronous operations concurrently and displays real-time progress as each operation completes.

This is a common pattern for:
- File upload progress with multiple files
- Batch API calls with progress indication
- Service health checks with visual feedback
- Data migration progress tracking

---

## Requirements

### Functional Requirements

1. **Multiple Concurrent Operations**
   - Execute 5 simulated service calls concurrently
   - Services: Auth, Payment, User Profile, Notifications, Analytics
   - Each service has random completion time (500ms - 3500ms)

2. **Progress Tracking**
   - Display a progress bar that fills incrementally
   - Progress updates as each promise resolves OR rejects
   - Progress = (completed promises / total promises) * 100

3. **Result Tracking**
   - Track success/failure status of each service
   - Display results as they complete
   - Show final summary when all complete

4. **UI Controls**
   - Start button to initiate all operations
   - Button disabled while operations are running
   - Visual feedback for running state

### Non-Functional Requirements

- Smooth progress bar animation
- Handle both resolved and rejected promises
- No blocking - UI remains responsive
- Clean state reset on restart

---

## Visual Representation

```
Initial State:
+------------------------------------------+
| [========================] 0%            |
|                                          |
| [ Start Services ]                       |
+------------------------------------------+

Running State (60% complete):
+------------------------------------------+
| [===============         ] 60%           |
|  ^^^^^^^^^^^^^ Blue fill                 |
|                                          |
| [ Processing... ] (disabled)             |
|                                          |
| Results:                                 |
| - Auth: Success                          |
| - Payment: Failed                        |
| - User Profile: Success                  |
+------------------------------------------+

Completed State (100%):
+------------------------------------------+
| [=========================] 100%         |
|  ^^^^^^^^^^^^^^^^^^^^^^^^^ Green fill    |
|                                          |
| [ Start Services ]                       |
|                                          |
| Results:                                 |
| - Auth: Success                          |
| - Payment: Failed                        |
| - User Profile: Success                  |
| - Notifications: Success                 |
| - Analytics: Success                     |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. Promise.allSettled vs Promise.all

```javascript
// Promise.all - Fails fast on first rejection
Promise.all(promises)  // Rejects if ANY promise rejects

// Promise.allSettled - Waits for ALL to complete
Promise.allSettled(promises)  // Always resolves with status array
// Returns: [
//   { status: 'fulfilled', value: result },
//   { status: 'rejected', reason: error }
// ]
```

**Why allSettled?** We want progress to reach 100% regardless of individual failures.

### 2. Progress Increment Pattern

```javascript
const TOTAL = 5;

// Each completion adds equal portion
.finally(() => {
    setProgress(prev => {
        const increment = 100 / TOTAL;
        return Math.min(prev + increment, 100);
    });
})
```

**Key insight:** Use `.finally()` to update progress on BOTH success and failure.

### 3. Chaining for Side Effects

```javascript
const promises = services.map(name => {
    return simulateService(name)
        .then(val => {
            // Side effect: track success
            setResults(prev => [...prev, { status: 'success', value: val }]);
        })
        .catch(err => {
            // Side effect: track failure
            setResults(prev => [...prev, { status: 'failed', value: err }]);
        })
        .finally(() => {
            // Always: update progress
            setProgress(prev => prev + increment);
        });
});
```

### 4. State Management Strategy

```javascript
const [progress, setProgress] = useState(0);      // 0-100
const [results, setResults] = useState([]);        // Array of outcomes
const [isRunning, setIsRunning] = useState(false); // Lock state

const handleStart = async () => {
    // 1. Reset state
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    // 2. Execute all
    await Promise.allSettled(promises);

    // 3. Unlock
    setIsRunning(false);
};
```

---

## Implementation Tips

### 1. Simulating Async Operations

```javascript
function simulateService(name) {
    return new Promise((resolve, reject) => {
        const duration = Math.random() * 3000 + 500; // 500-3500ms

        setTimeout(() => {
            if (Math.random() > 0.3) {  // 70% success rate
                resolve(`${name} Success`);
            } else {
                reject(`${name} Failed`);
            }
        }, duration);
    });
}
```

### 2. Progress Bar Styling

```css
.progress-track {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;  /* Keeps fill inside rounded corners */
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;  /* Smooth animation */
}
```

### 3. Dynamic Color Based on Progress

```jsx
<div
    className="progress-fill"
    style={{
        width: `${progress}%`,
        background: progress === 100 ? 'green' : 'blue'
    }}
/>
```

### 4. Preventing Race Conditions

```javascript
// Use functional updates to ensure correct state
setProgress(prev => Math.min(prev + increment, 100));
setResults(prev => [...prev, newResult]);
```

---

## Common Interview Questions

### Q1: Why use Promise.allSettled instead of Promise.all?

**Answer:** `Promise.all` short-circuits on the first rejection, which would prevent the progress bar from reaching 100% if any service fails. `Promise.allSettled` waits for all promises to complete regardless of outcome, ensuring accurate progress tracking.

### Q2: How would you add retry logic for failed services?

```javascript
async function withRetry(fn, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            await delay(1000 * Math.pow(2, i)); // Exponential backoff
        }
    }
    throw lastError;
}
```

### Q3: How would you implement cancellation?

```javascript
const [abortController, setAbortController] = useState(null);

const handleStart = () => {
    const controller = new AbortController();
    setAbortController(controller);

    promises.forEach(p => {
        if (controller.signal.aborted) return;
        // Execute promise
    });
};

const handleCancel = () => {
    abortController?.abort();
    setIsRunning(false);
};
```

### Q4: How would you show individual progress for each service?

```javascript
const [serviceProgress, setServiceProgress] = useState({
    Auth: { status: 'pending', progress: 0 },
    Payment: { status: 'pending', progress: 0 },
    // ...
});

// Update individual service progress
setServiceProgress(prev => ({
    ...prev,
    [name]: { status: 'running', progress: 50 }
}));
```

### Q5: How would you handle rate limiting (max 2 concurrent)?

```javascript
async function asyncPool(limit, items, fn) {
    const results = [];
    const executing = [];

    for (const item of items) {
        const p = fn(item);
        results.push(p);

        if (limit <= items.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }

    return Promise.allSettled(results);
}
```

---

## Edge Cases to Consider

1. **Rapid restarts** - What if user clicks Start before previous run completes?
2. **All failures** - Progress should still reach 100%
3. **Instantaneous completion** - Handle 0ms duration gracefully
4. **Memory leaks** - Clean up timeouts on unmount
5. **Floating point precision** - Use `Math.min(prev + increment, 100)` to cap at 100

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initialize | O(n) | O(n) |
| Track progress | O(1) per update | O(n) results |
| Render | O(n) | O(1) |

Where n = number of services

---

## Real-World Applications

1. **File Upload Progress** - Track multiple file uploads
2. **API Health Dashboard** - Monitor multiple endpoints
3. **Batch Processing** - Show progress of data transformations
4. **Deployment Pipelines** - Track CI/CD step completion
5. **Form Submission** - Multiple API calls with combined progress

---

## Related Patterns

- **Concurrent Request Limiting** - Control parallelism
- **Retry with Backoff** - Handle transient failures
- **Request Cancellation** - AbortController pattern
- **Optimistic Updates** - Show progress before confirmation
