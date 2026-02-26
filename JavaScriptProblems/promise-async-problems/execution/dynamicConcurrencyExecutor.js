function DynamicExecutor(concurrency) {
  this.concurrency = concurrency;
  this.running = 0;
  this.queue = [];
}

DynamicExecutor.prototype.push = function (task) {
  return new Promise((resolve, reject) => {
    this.queue.push({ task, resolve, reject });
    this._schedule();
  });
};

DynamicExecutor.prototype.setConcurrency = function (newLimit) {
  this.concurrency = newLimit;
  this._schedule(); // try scheduling immediately
};

DynamicExecutor.prototype._schedule = function () {
  while (this.running < this.concurrency && this.queue.length > 0) {
    const { task, resolve, reject } = this.queue.shift();
    this.running++;

    Promise.resolve()
      .then(task)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--;
        this._schedule(); // reschedule after completion
      });
  }
};

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
