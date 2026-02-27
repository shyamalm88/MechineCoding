class BackpressureQueue {
  constructor(concurrency, maxQueueSize) {
    this.concurrency = concurrency;
    this.maxQueueSize = maxQueueSize;

    this.running = 0;
    this.queue = [];
    this.waitingProducers = [];
  }
  push(task) {
    return new Promise((resolve, reject) => {
      const enqueue = () => {
        this.queue.push({ task, resolve, reject });
        this._schedule();
      };

      // If queue has space, enqueue immediately
      if (this.queue.length < this.maxQueueSize) {
        enqueue();
      } else {
        // Apply backpressure: block producer
        this.waitingProducers.push(enqueue);
      }
    });
  }
  _schedule() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;

      Promise.resolve()
        .then(task)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--;

          // Release ONE waiting producer (backpressure relief)
          if (this.waitingProducers.length > 0) {
            const wakeProducer = this.waitingProducers.shift();
            wakeProducer();
          }

          this._schedule();
        });
    }
  }
}

const q = new BackpressureQueue(2, 3);

const createTask = (id, delay) => async () => {
  console.log("start", id);
  await new Promise((r) => setTimeout(r, delay));
  console.log("end", id);
};

q.push(createTask("A", 1000));
q.push(createTask("B", 800));
q.push(createTask("C", 600));
q.push(createTask("D", 400)); // may WAIT
q.push(createTask("E", 200)); // may WAIT
