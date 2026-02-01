
class Singleton {
  static instance;

  constructor() {
    if (Singleton.instance) {
      throw new Error("Use Singleton.getInstance()");
    }
    this.name = "I am the active instance";
    Singleton.instance = this;
  }

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}


// Usage
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
