class AsyncQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  enqueue(task) {
    this.queue.push(task);
    this.run();
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await task(); // critical: await
    }

    this.running = false;
  }
}

const q = new AsyncQueue();

q.enqueue(async () => {
  console.log("Task 1 start");
  await new Promise((res) => setTimeout(res, 100));
  console.log("Task 1 end");
});

q.enqueue(() => {
  console.log("Task 2 (sync)");
});

q.enqueue(async () => {
  console.log("Task 3 start");
  await new Promise((res) => setTimeout(res, 50));
  console.log("Task 3 end");
});
