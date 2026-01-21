/**
 * ============================================================================
 * PROBLEM: Retry with Exponential Backoff
 * ============================================================================
 * Implement a function that retries a failed async operation with increasing
 * delays between attempts.
 *
 * ============================================================================
 * INTUITION: Exponential Backoff
 * ============================================================================
 * Instead of retrying immediately or with a fixed delay, we wait longer
 * after each failure (e.g., 100ms, 200ms, 400ms, 800ms).
 * This prevents overwhelming a struggling server ("thundering herd problem").
 *
 * Formula: delay = baseDelay * 2^attempt
 */
async function retryWithBackoff(fn, retries, baseDelay = 100) {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      attempt++;
    }
  }
}

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

let callCount = 0;
const unstableApi = async () => {
  callCount++;
  if (callCount < 4) {
    throw new Error("Server Overloaded");
  }
  return "Success Data";
};

console.log("--- Starting Retry with Backoff ---");
retryWithBackoff(unstableApi, 5, 100)
  .then((res) => console.log("Final Result:", res))
  .catch((err) => console.error("Final Error:", err.message));

// Expected Output:
// Attempt 1 failed. Retrying in 100ms...
// Attempt 2 failed. Retrying in 200ms...
// Attempt 3 failed. Retrying in 400ms...
// Final Result: Success Data
