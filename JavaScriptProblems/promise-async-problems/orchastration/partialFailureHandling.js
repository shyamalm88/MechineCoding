/**
 * runWithPartialFailure
 *
 * Executes tasks and collects successes and failures.
 */
async function runWithPartialFailure(tasks) {
  const results = await Promise.allSettled(
    tasks.map((task) => Promise.resolve().then(task)),
  );

  const success = [];
  const failed = [];

  results.forEach((res, index) => {
    if (res.status === "fulfilled") {
      success.push(res.value);
    } else {
      failed.push({
        index,
        error: res.reason,
      });
    }
  });

  return { success, failed };
}

const tasks = [
  () => Promise.resolve("A"),
  () => Promise.reject("B"),
  () => Promise.resolve("C"),
];

runWithPartialFailure(tasks).then(console.log);
