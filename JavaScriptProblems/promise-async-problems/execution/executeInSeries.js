async function executeInSeries(tasks) {
  const results = [];

  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }

  return results;
}

const tasks = [
  () => Promise.resolve(1),
  () => new Promise((res) => setTimeout(() => res(2), 100)),
  () => Promise.resolve(3),
];

executeInSeries(tasks).then(console.log);
// [1, 2, 3]
