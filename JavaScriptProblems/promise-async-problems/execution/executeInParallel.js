async function executeInParallel(tasks) {
  const promises = tasks.map((task) => task());
  return Promise.all(promises);
}

const tasks = [
  () => new Promise((res) => setTimeout(() => res(1), 300)),
  () => new Promise((res) => setTimeout(() => res(2), 100)),
  () => Promise.resolve(3),
];

executeInParallel(tasks).then(console.log);
// [1, 2, 3]
