// ─────────────────────────────────────────────
// CLASSES (ES2022+) — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: Private fields (#) — true encapsulation ──
class Account {
  #balance = 0; // private field — only accessible inside this class

  constructor(balance) {
    this.#balance = balance;
  }

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  get balance() {
    return this.#balance;
  }
}
const acc = new Account(100);
console.log(acc.deposit(50)); // 150
console.log(acc.balance); // 150
// console.log(acc.#balance); // SyntaxError at PARSE TIME — #balance not visible outside class
console.log(acc.balance2); // undefined — no such property, NOT an error (unlike #balance)
console.log(Object.keys(acc)); // [] — private fields are NOT enumerable, NOT in Object.keys

// ─── Q2: Static fields, static methods & static blocks ──
class Config {
  static #instances = 0; // private static — shared across ALL instances
  static defaultName = "config"; // public static

  static {
    // static initialization block (ES2022) — runs ONCE, at class definition
    console.log("static block runs");
    Config.defaultName = Config.defaultName.toUpperCase();
  }

  constructor() {
    Config.#instances++;
  }

  static getCount() {
    return Config.#instances;
  }
}
// "static block runs" logs IMMEDIATELY when the class is defined,
// before any instance is created.
console.log(Config.defaultName); // "CONFIG"
new Config();
new Config();
console.log(Config.getCount()); // 2 — static state shared across instances

// ─── Q3: Field initialization order ────────
class Base {
  baseField = console.log("Base field init") || "base";
  constructor() {
    console.log("Base constructor");
  }
}
class Derived extends Base {
  derivedField = console.log("Derived field init") || "derived";
  constructor() {
    super(); // MUST be called before `this` is accessible
    console.log("Derived constructor");
  }
}
new Derived();
// Output order:
// "Base field init"        <- instance fields run as part of the (implicit/explicit) constructor,
// "Base constructor"           AFTER super() resolves but BEFORE the rest of Base's constructor body
// "Derived field init"     <- Derived's own fields init right after super() returns
// "Derived constructor"

// ─── Q4: Accessing `this` before super() ───
class Animal {}
class Dog extends Animal {
  constructor() {
    // console.log(this); // ReferenceError: must call super before accessing 'this'
    super();
    console.log(this); // OK now
  }
}
new Dog(); // Dog {}

// ─── Q5: Getters/setters — computed on access, not enumerable ──
class Temperature {
  #celsius = 0;
  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }
  set fahrenheit(f) {
    this.#celsius = (f - 32) * 5 / 9;
  }
}
const t = new Temperature();
t.fahrenheit = 212;
console.log(t.fahrenheit); // 212  — getter recomputes from #celsius every access
console.log(Object.keys(t)); // [] — getters live on the prototype, not enumerable own props

// ─── Q6: `#x in obj` — private brand checks (ES2022) ──
class Box {
  #value;
  constructor(value) {
    this.#value = value;
  }
  static isBox(obj) {
    return #value in obj; // safe check — does NOT throw for non-Box objects
  }
}
console.log(Box.isBox(new Box(1))); // true
console.log(Box.isBox({})); // false — no TypeError, just false

// ─── Q7: Classes are NOT hoisted like functions ──
// console.log(new Early()); // ReferenceError: Cannot access 'Early' before initialization
class Early {}
// Class declarations ARE hoisted to the top of their scope, but stay in the
// Temporal Dead Zone (TDZ) until the declaration is evaluated — same as let/const.

// ─── Q8: Methods are non-enumerable, shared via prototype ──
class Greeter {
  greet() {
    return "hi";
  }
}
const g1 = new Greeter();
console.log(Object.keys(g1)); // [] — `greet` is on Greeter.prototype, not own
console.log(g1.hasOwnProperty("greet")); // false
console.log(Object.getPrototypeOf(g1).hasOwnProperty("greet")); // true
