/**
 * runWithDeadline
 *
 * Executes an async task with a hard deadline.
 * Rejects if the task finishes after the deadline.
 */
function runWithDeadline(task, deadlineTimestamp) {
  return new Promise((resolve, reject) => {
    const now = Date.now();

    // Step 1: If deadline already missed
    if (now >= deadlineTimestamp) {
      reject(new Error("Deadline exceeded"));
      return;
    }

    let finished = false;

    // Step 2: Timer that fires exactly at deadline
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        reject(new Error("Deadline exceeded"));
      }
    }, deadlineTimestamp - now);

    // Step 3: Run the task
    Promise.resolve()
      .then(task)
      .then((value) => {
        if (finished) return;

        finished = true;
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        if (finished) return;

        finished = true;
        clearTimeout(timer);
        reject(err);
      });
  });
}

const slowTask = async () => {
  await new Promise((r) => setTimeout(r, 700));
  return "done";
};

runWithDeadline(slowTask, Date.now() + 500)
  .then(console.log)
  .catch(console.error);
