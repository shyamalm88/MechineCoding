/**
 * runWithRollback
 *
 * Executes steps sequentially.
 * Rolls back completed steps if any step fails.
 */
async function runWithRollback(steps) {
  const completed = [];

  try {
    for (const step of steps) {
      await step.do();
      completed.push(step);
    }
  } catch (error) {
    // Rollback in reverse order
    for (let i = completed.length - 1; i >= 0; i--) {
      try {
        await completed[i].undo();
      } catch (rollbackError) {
        // Rollback failures should be logged, not swallowed
        console.error("Rollback failed:", rollbackError);
      }
    }
    throw error; // propagate original failure
  }
}

export { runWithRollback }
