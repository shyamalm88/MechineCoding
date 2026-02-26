class DynamicExecutor {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  push(task) {
    return new Promise((resolve, reject) => {
      const runTask = async () => {
        this.running++;
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          this._drain(); // 🔥 refill capacity
        }
      };

      this.queue.push(runTask);
      this._drain(); // 🔥 try scheduling immediately
    });
  }

  setConcurrency(newLimit) {
    this.concurrency = newLimit;
    this._drain(); // 🔥 dynamic update works here
  }

  _drain() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      nextTask();
    }
  }
}

const delayTask = (id, ms) => async () => {
  console.log("start", id);
  await new Promise((r) => setTimeout(r, ms));
  console.log("end", id);
};

const ex = new DynamicExecutor(2);

ex.push(delayTask("A", 1000));
ex.push(delayTask("B", 800));
ex.push(delayTask("C", 600));
ex.push(delayTask("D", 400));

setTimeout(() => {
  console.log("⬆️ Increasing concurrency to 3");
  ex.setConcurrency(3);
}, 300);

setTimeout(() => {
  console.log("⬇️ Reducing concurrency to 1");
  ex.setConcurrency(1);
}, 700);
