class UberDriver {
  constructor() {
    this.tasks = [];
    this.priorityTasks = [];

    // Run after chaining finishes
    Promise.resolve().then(() => this.run());
  }

  _add(task, priority = false) {
    (priority ? this.priorityTasks : this.tasks).push(task);
    return this;
  }

  async run() {
    for (const task of this.priorityTasks) {
      await task();
    }

    for (const task of this.tasks) {
      await task();
    }
  }

  pick(name) {
    return this._add(() => {
      console.log(`Picking up ${name}`);
    });
  }

  drop(name) {
    return this._add(() => {
      console.log(`Dropping ${name}`);
    });
  }

  drive(minutes) {
    return this._add(async () => {
      console.log(`Driving for ${minutes} minutes`);
      await this._sleep(minutes);
    });
  }

  rest(minutes) {
    return this._add(async () => {
      console.log(`Resting for ${minutes} minutes`);
      await this._sleep(minutes);
    });
  }

  coffeeBreak(minutes) {
    return this._add(
      async () => {
        console.log(`☕ Coffee break for ${minutes} minutes`);
        await this._sleep(minutes);
      },
      true // priority
    );
  }

  _sleep(seconds) {
    return new Promise((res) => setTimeout(res, seconds * 1000));
  }
}
