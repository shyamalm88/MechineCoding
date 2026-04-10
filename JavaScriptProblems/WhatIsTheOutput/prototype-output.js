// ─────────────────────────────────────────────
// PROTOTYPE CHAIN — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: hasOwnProperty vs prototype ───────
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() { return `${this.name} speaks`; };

const dog = new Animal("Dog");

console.log(dog.hasOwnProperty("name"));  // true  — own property
console.log(dog.hasOwnProperty("speak")); // false — on prototype
console.log("speak" in dog);              // true  — in checks full chain
console.log(dog.speak());                 // "Dog speaks"

// ─── Q2: Prototype chain lookup ────────────
function A() {}
A.prototype.x = 1;

function B() {}
B.prototype = Object.create(A.prototype); // B inherits from A
B.prototype.y = 2;

const b = new B();
console.log(b.x); // 1   — found on A.prototype via chain
console.log(b.y); // 2   — found on B.prototype
console.log(b.z); // undefined — not in chain, returns undefined (no error)

// Chain: b → B.prototype → A.prototype → Object.prototype → null

// ─── Q3: Overriding prototype method ───────
function Shape() {}
Shape.prototype.getArea = function() { return 0; };

function Circle(r) { this.r = r; }
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.getArea = function() { return Math.PI * this.r ** 2; };

const c = new Circle(5);
console.log(c.getArea()); // 78.539...  — Circle.prototype.getArea found first
// Shape.prototype.getArea is shadowed but not overwritten

// ─── Q4: __proto__ vs prototype ────────────
function Foo() {}
const obj = new Foo();

console.log(obj.__proto__ === Foo.prototype);         // true
console.log(Foo.prototype.constructor === Foo);       // true
console.log(obj.__proto__.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__);              // null — end of chain

// ─── Q5: Object.create(null) ───────────────
const bare = Object.create(null);
bare.name = "bare object";

console.log(bare.name);           // "bare object"
console.log(bare.hasOwnProperty); // undefined — no Object.prototype!
console.log(Object.getPrototypeOf(bare)); // null
// Used for pure hash maps — no prototype pollution possible

// ─── Q6: Class — syntactic sugar proof ─────
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hi, I'm ${this.name}`; }
}

console.log(typeof Person); // "function" — class IS a function
console.log(Person.prototype.greet); // [Function: greet]

const p = new Person("Alice");
console.log(p.__proto__ === Person.prototype); // true
console.log(p.greet === Person.prototype.greet); // true — shared, not per-instance

// ─── Q7: Mutation of prototype affects all instances ──
function Car(brand) { this.brand = brand; }

const car1 = new Car("Toyota");
const car2 = new Car("Honda");

Car.prototype.drive = function() { return `${this.brand} drives`; };

console.log(car1.drive()); // "Toyota drives" — prototype added AFTER instances
console.log(car2.drive()); // "Honda drives"

// Mutating prototype at runtime reflects on all existing instances immediately

// ─── Q8: Property shadowing ─────────────────
function Base() {}
Base.prototype.val = 42;

const inst = new Base();
console.log(inst.val); // 42 — reads from prototype

inst.val = 100; // creates OWN property, shadows prototype
console.log(inst.val);             // 100 — own property shadows prototype
console.log(Base.prototype.val);   // 42  — prototype unchanged

delete inst.val; // removes OWN property
console.log(inst.val); // 42 — prototype value visible again

// ─── Q9: constructor property gotcha ───────
function Foo() {}
const f = new Foo();
console.log(f.constructor === Foo);    // true

// Replace prototype:
Foo.prototype = { bar: 1 }; // loses constructor
const g = new Foo();
console.log(g.constructor === Foo);    // false — now Object
console.log(g.constructor === Object); // true

// Fix:
Foo.prototype = { constructor: Foo, bar: 1 };

// ─── Q10: instanceof after prototype change ──
function MyClass() {}
const instance = new MyClass();

console.log(instance instanceof MyClass); // true

MyClass.prototype = {}; // change prototype after instantiation

console.log(instance instanceof MyClass); // false!
// Why: instanceof checks current MyClass.prototype against instance's chain.
//      instance's __proto__ still points to the OLD prototype.
