class Subject {
  constructor() {
    this.observers = []; // The list of subscribers
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

// Usage
const newsChannel = new Subject();

const subscriber1 = (data) => console.log(`Sub1 received: ${data}`);
const subscriber2 = (data) => console.log(`Sub2 received: ${data}`);

newsChannel.subscribe(subscriber1);
newsChannel.subscribe(subscriber2);

newsChannel.notify("Breaking News!");
// Both execute.
