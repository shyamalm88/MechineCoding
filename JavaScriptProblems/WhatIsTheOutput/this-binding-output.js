// ─────────────────────────────────────────────
// `this` BINDING — Tricky Output Questions
// ─────────────────────────────────────────────

// Four rules (priority order):
// 1. new binding
// 2. explicit binding (call / apply / bind)
// 3. implicit binding (object method call)
// 4. default binding (global / undefined in strict)

// ─── Q1: Implicit vs default binding ───────
const obj = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};
obj.greet(); // "Alice"  — implicit binding: obj is the receiver

const fn = obj.greet;
fn(); // undefined (non-strict) or TypeError (strict)
// Why: fn is called without a receiver — default binding.
//      In non-strict: this = global, global.name = undefined.

// ─── Q2: Arrow function — lexical `this` ───
const obj2 = {
  name: "Bob",
  greet: function() {
    const inner = () => console.log(this.name);
    inner(); // "Bob" — arrow captures `this` of greet (obj2)
  },
  greetArrow: () => {
    console.log(this.name); // undefined — arrow at object literal level
    // `this` is captured from outer (module/global) scope, NOT obj2
  },
};
obj2.greet();       // "Bob"
obj2.greetArrow();  // undefined

// ─── Q3: setTimeout loses `this` ───────────
const timer = {
  name: "Timer",
  start() {
    setTimeout(function() {
      console.log(this.name); // undefined — regular function, default binding
    }, 0);

    setTimeout(() => {
      console.log(this.name); // "Timer" — arrow captures `this` of start()
    }, 0);
  },
};
timer.start();

// ─── Q4: explicit binding — call/apply/bind ──
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}
const user = { name: "Charlie" };

greet.call(user, "Hello");   // "Hello, Charlie"
greet.apply(user, ["Hi"]);   // "Hi, Charlie"

const boundGreet = greet.bind(user);
boundGreet("Hey");           // "Hey, Charlie"

// bind cannot be overridden
const boundFn = greet.bind(user);
boundFn.call({ name: "Dave" }, "Yo"); // "Yo, Charlie" — bind wins

// ─── Q5: new binding ───────────────────────
function Person(name) {
  this.name = name;
}
const p = new Person("Eve");
console.log(p.name); // "Eve"
// new creates a fresh object, sets this = that object, returns it

// ─── Q6: Class method — `this` is not auto-bound ──
class Counter {
  count = 0;
  increment() {
    this.count++;
    console.log(this.count);
  }
}
const c = new Counter();
c.increment(); // 1 — works fine

const { increment } = c;
increment(); // TypeError: Cannot read properties of undefined
// Why: destructured method loses its receiver.
// Fix: bind in constructor or use class field arrow:
//   increment = () => { this.count++; }

// ─── Q7: Chained method calls ──────────────
const chain = {
  val: 0,
  add(n) { this.val += n; return this; }, // returning `this` enables chaining
  double()  { this.val *= 2; return this; },
  result()  { return this.val; },
};
console.log(chain.add(5).double().add(3).result()); // 13
// (0+5)*2+3 = 13

// ─── Q8: `this` in IIFE ────────────────────
const obj3 = {
  name: "IIFE",
  run() {
    (function() {
      console.log(this.name); // undefined — IIFE is a regular function, default binding
    })();

    (() => {
      console.log(this.name); // "IIFE" — arrow captures run()'s `this`
    })();
  },
};
obj3.run();

// ─── Q9: Prototype method `this` ───────────
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} speaks`; };

const dog = new Animal("Dog");
console.log(dog.speak()); // "Dog speaks"

const speak = dog.speak;
console.log(speak()); // "undefined speaks" — lost receiver

// ─── Q10: Event handler `this` (browser) ───
// button.addEventListener('click', function() {
//   console.log(this); // the button element — implicit binding
// });
// button.addEventListener('click', () => {
//   console.log(this); // window — arrow captures outer this
// });
