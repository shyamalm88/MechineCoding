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

const steps = [
  {
    do: async () => {
      console.log("Reserve inventory");
    },
    undo: async () => {
      console.log("Release inventory");
    },
  },
  {
    do: async () => {
      console.log("Charge card");
      throw new Error("Payment failed");
    },
    undo: async () => {
      console.log("Refund card");
    },
  },
  {
    do: async () => {
      console.log("Create order");
    },
    undo: async () => {
      console.log("Delete order");
    },
  },
];

runWithRollback(steps).catch((err) => {
  console.error("Workflow failed:", err.message);
});
