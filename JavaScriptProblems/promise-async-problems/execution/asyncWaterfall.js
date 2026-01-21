/**
 * ============================================================================
 * PROBLEM: Async Waterfall
 * ============================================================================
 * Execute a list of async tasks sequentially, passing the result of one
 * as the argument to the next.
 *
 * ============================================================================
 * INTUITION: Array.reduce
 * ============================================================================
 * We can use `reduce` to chain promises.
 * The accumulator is a promise that resolves to the result of the previous task.
 * We await the accumulator, then run the current task with that result.
 */
async function asyncWaterfall(tasks, initialValue) {
  return tasks.reduce(async (accumulatorPromise, currentTask) => {
    const previousResult = await accumulatorPromise;
    return currentTask(previousResult);
  }, Promise.resolve(initialValue));
}

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

const addFive = (num) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Adding 5 to ${num}`);
      resolve(num + 5);
    }, 100);
  });

const double = (num) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Doubling ${num}`);
      resolve(num * 2);
    }, 100);
  });

const tasks = [addFive, double, addFive];

console.log("Starting waterfall with initial value 0...");
asyncWaterfall(tasks, 0).then((result) => {
  console.log("Final Result:", result);
});
// Expected Output:
// Adding 5 to 0 -> 5
// Doubling 5 -> 10
// Adding 5 to 10 -> 15
// Final Result: 15
