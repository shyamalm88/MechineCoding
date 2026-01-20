async function executeWithLimit(tasks, limit) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);

  await Promise.all(workers);
  return results;
}

const tasks = [
  () => new Promise((res) => setTimeout(() => res(1), 300)),
  () => new Promise((res) => setTimeout(() => res(2), 200)),
  () => new Promise((res) => setTimeout(() => res(3), 100)),
  () => new Promise((res) => setTimeout(() => res(4), 400)),
];

executeWithLimit(tasks, 2).then(console.log);
// Output order preserved: [1, 2, 3, 4]
