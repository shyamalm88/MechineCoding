class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);

    // Return unsubscribe function (Bonus points)
    return () => this.off(event, listener);
  }

  off(event, listenerRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listenerRemove);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener.apply(this, args));
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper); // Remove self after running
    };
    this.on(event, wrapper);
  }
}
