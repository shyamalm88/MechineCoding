class PubSub {
  constructor() {
    this.events = {};
  }

  // SUBSCRIBE: "I want to listen to this topic"
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return an unsubscribe function for convenience
    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  }

  // PUBLISH: "Here is some data for this topic"
  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

// --- USAGE ---

const events = new PubSub();

// 1. Component A subscribes (doesn't know about Component B)
const unsubscribe = events.subscribe("userLoggedIn", (data) => {
  console.log(`Welcome back, ${data.name}!`);
});

// 2. Component B publishes (doesn't know about Component A)
events.publish("userLoggedIn", { name: "Alice" });
// Output: "Welcome back, Alice!"

// 3. Cleanup
unsubscribe();
