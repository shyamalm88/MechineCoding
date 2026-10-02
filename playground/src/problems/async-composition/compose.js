// ---- composeAsync.js ----
// Dry run for composeAsync(add1, mul2, sub3) called with composed(5)
//
// Step 1:
// composeAsync(add1, mul2, sub3) returns an async function
//
// Step 2:
// composed(5) is called
// initialValue = 5
// result = 5
//
// Step 3: Loop over functions
//
// Iteration 1:
// fn = add1
// result = await add1(5)
// add1 returns 6
// result becomes 6
//
// Iteration 2:
// fn = mul2
// result = await mul2(6)
// mul2 returns 12
// result becomes 12
//
// Iteration 3:
// fn = sub3
// result = await sub3(12)
// sub3 returns 9
// result becomes 9
//
// Step 4:
// Loop ends
// return result
//
// Final output:
// composed(5) resolves to 9

function composeAsync(...fns) {
  return async function (initialValue) {
    let result = initialValue;

    for (const fn of fns) {
      result = await fn(result);
    }

    return result;
  };
}

/**
 * Alternative Approach
 */

function composeAsyncReduce(...fns) {
  return function (initialValue) {
    return fns.reduce(
      (promise, fn) => promise.then(fn),
      Promise.resolve(initialValue),
    );
  };
}


// ---- pipeAsync.js ----
const pipeAsync = (...funcs) => {
  return (initialValue) =>
    funcs.reduce(
      (promise, fn) => promise.then(fn),
      Promise.resolve(initialValue)
    );
};

// ---- asyncWaterfall.js ----
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
  let result = initialValue;

  for (const task of tasks) {
    result = await task(result);
  }

  return result;
}

// ---- composeAsyncWithCancel.js ----
/**
 * Composes multiple async functions into a single pipeline with cancellation support.
 *
 * @param {...Function} fns - Async functions to compose. Each receives (input, signal).
 * @returns {Function} A function that takes (input, signal) and returns a Promise.
 *
 * INTUITION:
 * Standard composition is f(g(x)). Async composition is await f(await g(x)).
 * With cancellation, we must check the `AbortSignal` at every step.
 * If `signal.aborted` is true, we stop the pipeline immediately and throw.
 *
 * DRY RUN:
 * Pipeline: [step1, step2]. Input: 5.
 *
 * 1. Start. result = 5.
 * 2. Loop fn = step1.
 *    - Check signal: not aborted.
 *    - result = await step1(5, signal). Returns 6.
 * 3. Loop fn = step2.
 *    - Check signal: not aborted.
 *    - result = await step2(6, signal). Returns 12.
 * 4. Loop ends. Resolve 12.
 *
 * If signal was aborted before step2, it would throw immediately.
 */
function composeAsyncWithCancel(...fns) {
  return function (input, signal) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = input;

        for (const fn of fns) {
          if (signal.aborted) {
            throw new DOMException("Aborted", "AbortError");
          }
          result = await fn(result, signal);
        }

        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  };
}

export { composeAsync, composeAsyncReduce, pipeAsync, asyncWaterfall, composeAsyncWithCancel }
