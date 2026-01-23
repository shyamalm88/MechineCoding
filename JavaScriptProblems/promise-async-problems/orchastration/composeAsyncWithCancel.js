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

// --- Test Data ---

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const step1 = async (val, signal) => {
  console.log("Step 1 running...");
  await sleep(100);
  return val + 1;
};

const step2 = async (val, signal) => {
  console.log("Step 2 running...");
  // Check signal before starting expensive work
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  await sleep(100);
  return val * 2;
};

const pipeline = composeAsyncWithCancel(step1, step2);
const controller = new AbortController();

console.log("Starting pipeline...");
pipeline(5, controller.signal)
  .then((res) => console.log("Result:", res))
  .catch((err) => console.error("Error:", err.message));

// Uncomment to test cancellation:
// setTimeout(() => controller.abort(), 50);
