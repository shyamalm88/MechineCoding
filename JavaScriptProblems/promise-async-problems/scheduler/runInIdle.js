/**
 * ============================================================================
 * PROBLEM: Run Tasks During Browser Idle Time
 * ============================================================================
 * Implement a function that executes a queue of tasks using `requestIdleCallback`.
 * This ensures that non-critical background tasks do not interfere with
 * high-priority work like animations and user input.
 *
 * `requestIdleCallback` queues a function to be called during a browser's
 * idle periods. The function receives a `deadline` object which can be used
 * to check how much time is left for execution.
 *
 * ============================================================================
 * INTUITION: Cooperative Scheduling
 * ============================================================================
 * 1. We have a queue of `tasks` (functions) to execute.
 * 2. We schedule a `process` function to run via `requestIdleCallback`.
 * 3. Inside `process`, we get a `deadline` object.
 * 4. We run tasks from the queue as long as `deadline.timeRemaining() > 0`
 *    and there are tasks left. This is "cooperative" because we are yielding
 *    back to the main thread before the deadline is exceeded.
 * 5. If tasks still remain after the idle period ends, we schedule another
 *    call to `process` for the next idle period.
 * 6. This continues until the task queue is empty.
 */
function runInIdle(tasks) {
  /**
   * The core processing function that runs tasks.
   * @param {IdleDeadline} deadline - An object with timeRemaining() and didTimeout.
   */
  const process = (deadline) => {
    // Loop while there's time left in the idle period and we have tasks.
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      const task = tasks.shift();
      console.log(`Executing task: ${task.name || "anonymous"}`);
      task(); // Execute one task.
    }

    // If there are still tasks left, schedule the next batch.
    if (tasks.length > 0) {
      console.log("Idle time expired, scheduling next batch.");
      requestIdleCallback(process); // Schedule remaining for next idle period.
    } else {
      console.log("All tasks completed.");
    }
  };

  // Kick off the first idle callback.
  requestIdleCallback(process);
}

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================
// NOTE: This code must be run in a browser environment that supports
// `requestIdleCallback`. It will not work in Node.js.

// Create an array of tasks to be executed.
const tasks = [
  function task1() {
    console.log("Task 1 executed.");
  },
  function task2() {
    console.log("Task 2 executed.");
  },
  function task3() {
    console.log("Task 3 executed.");
  },
  function task4() {
    // A slightly longer task
    const end = Date.now() + 10;
    while (Date.now() < end) {
      // blocking for 10ms
    }
    console.log("Task 4 (long) executed.");
  },
  function task5() {
    console.log("Task 5 executed.");
  },
  function task6() {
    console.log("Task 6 executed.");
  },
];

// To see `runInIdle` in action, you can run this in your browser's console.
// If the main thread is not busy, all tasks might run in the first idle callback.
console.log("Scheduling tasks to run in idle time...");
runInIdle([...tasks]); // Pass a copy to allow re-running the test

// To better observe the scheduling, you can make the main thread busy.
// After calling `runInIdle`, quickly run this blocking code in the console:
/*
function blockMainThread(duration) {
  console.log("Blocking main thread...");
  const start = Date.now();
  while (Date.now() - start < duration) {
    // Looping to block
  }
  console.log("Main thread unblocked.");
}

// Block for 200ms. You'll see the idle tasks run after this completes.
// blockMainThread(200);
*/
