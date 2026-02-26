/**
 * ============================================================================
 * DEADLINE PROPAGATION (INTERVIEW-READY)
 * ============================================================================
 *
 * GOAL:
 * - Enforce a SINGLE global deadline across a chain / graph of async calls
 * - Prevent downstream operations from exceeding the original time budget
 *
 * CORE IDEA:
 * - Deadline is an ABSOLUTE timestamp (Date.now() + budget)
 * - Every async function receives the SAME deadline context
 * - Each operation computes remaining time dynamically
 *
 * WHY THIS MATTERS:
 * - Prevents cascading latency
 * - Prevents wasted work after request timeout
 * - Used in real systems (gRPC, Google APIs, AWS SDKs)
 *
 * ============================================================================
 */

/* ============================================================================
 * DEADLINE CONTEXT
 * ============================================================================
 *
 * Carries the absolute deadline across async boundaries.
 * This object is immutable in intent (do not modify deadline).
 */
class DeadlineContext {
  constructor(deadlineTimestamp) {
    this.deadline = deadlineTimestamp;
  }

  // Remaining time budget in milliseconds
  timeRemaining() {
    return this.deadline - Date.now();
  }

  // Whether deadline is already exceeded
  isExpired() {
    return this.timeRemaining() <= 0;
  }
}

/* ============================================================================
 * DEADLINE-AWARE EXECUTION WRAPPER
 * ============================================================================
 *
 * Executes a task only within the remaining deadline budget.
 * If the task resolves AFTER the deadline → result is ignored.
 */
function runWithDeadline(task, ctx) {
  return new Promise((resolve, reject) => {
    const remaining = ctx.timeRemaining();

    // Fail fast if no time left
    if (remaining <= 0) {
      reject(new Error("Deadline exceeded"));
      return;
    }

    let settled = false;

    // Timer fires exactly when deadline is hit
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("Deadline exceeded"));
      }
    }, remaining);

    // Execute the actual task
    Promise.resolve()
      .then(task)
      .then((value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      });
  });
}

/* ============================================================================
 * SAMPLE DOWNSTREAM SERVICES
 * ============================================================================
 *
 * Each service:
 * - Accepts the SAME deadline context
 * - Uses runWithDeadline
 * - Does NOT invent its own timeout
 */

async function serviceA(ctx) {
  return runWithDeadline(async () => {
    await sleep(200);
    return "A";
  }, ctx);
}

async function serviceB(ctx) {
  return runWithDeadline(async () => {
    await sleep(300);
    return "B";
  }, ctx);
}

async function serviceC(ctx) {
  return runWithDeadline(async () => {
    await sleep(250);
    return "C";
  }, ctx);
}

/* ============================================================================
 * REQUEST HANDLER (PROPAGATION POINT)
 * ============================================================================
 *
 * This function represents an API handler / controller.
 * It creates the deadline ONCE and passes it everywhere.
 */
async function handleRequest(ctx) {
  const a = await serviceA(ctx);
  const b = await serviceB(ctx);
  const c = await serviceC(ctx);
  return a + b + c;
}

/* ============================================================================
 * UTILITY
 * ============================================================================
 */

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ============================================================================
 * ENTRY POINT (SIMULATION)
 * ============================================================================
 */

(async function main() {
  // Global deadline: 600ms from now
  const ctx = new DeadlineContext(Date.now() + 600);

  try {
    const result = await handleRequest(ctx);
    console.log("SUCCESS:", result);
  } catch (err) {
    console.error("FAILED:", err.message);
  }
})();
