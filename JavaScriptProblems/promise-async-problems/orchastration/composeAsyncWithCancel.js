/**
 * Composes multiple async functions into a single pipeline with cancellation support.
 *
 * @param {...Function} fns - Async functions to compose. Each receives (input, signal).
 * @returns {Function} A function that takes (input, signal) and returns a Promise.
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
