// ─────────────────────────────────────────────
// DESTRUCTURING & SPREAD — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: Default values — undefined only ───
const { a = 10, b = 20 } = { a: null, b: undefined };
console.log(a); // null   — default only applies for undefined, NOT null
console.log(b); // 20     — undefined triggers default

// ─── Q2: Rename + default ──────────────────
const { x: myX = 5 } = {};
console.log(myX); // 5   — x is undefined → default → 5
// console.log(x);  // ReferenceError — x is the source, myX is the binding

// ─── Q3: Nested destructuring ──────────────
const { a: { b: deep } = {} } = { a: { b: 42 } };
console.log(deep); // 42

// Gotcha — what if nested path doesn't exist?
const { a: { c } = {} } = {}; // outer a is undefined → fallback {} → c is undefined
console.log(c); // undefined

const { a: { d } } = {}; // TypeError! a is undefined, cannot destructure undefined
// Fix: always provide defaults at each nesting level

// ─── Q4: Array destructuring skips ─────────
const [, second, , fourth = "default"] = [1, 2, 3];
console.log(second); // 2
console.log(fourth); // "default" — position 3 doesn't exist

// ─── Q5: Swap with destructuring ───────────
let p = 1, q = 2;
[p, q] = [q, p];
console.log(p, q); // 2 1

// ─── Q6: Spread — shallow copy ─────────────
const arr = [1, [2, 3]];
const copy = [...arr];
copy[0] = 99;
copy[1][0] = 99; // mutates nested array — it's the same reference!

console.log(arr[0]);    // 1    — primitive, not affected
console.log(arr[1][0]); // 99   — nested array IS affected

// ─── Q7: Object spread — shallow merge ─────
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { ...obj1, d: 3 };

obj2.b.c = 99; // mutates shared nested reference
console.log(obj1.b.c); // 99 — shallow copy!

// ─── Q8: Spread order matters ──────────────
const base   = { x: 1, y: 2 };
const override = { y: 99, z: 3 };

const merged1 = { ...base, ...override };
const merged2 = { ...override, ...base };

console.log(merged1); // { x: 1, y: 99, z: 3 } — override wins
console.log(merged2); // { y: 2, z: 3, x: 1 }  — base wins (last write wins)

// ─── Q9: Rest in destructuring ─────────────
const { a: first, ...rest } = { a: 1, b: 2, c: 3 };
console.log(first); // 1
console.log(rest);  // { b: 2, c: 3 }

// Rest must be last:
// const { ...middle, z } = obj; // SyntaxError

// ─── Q10: Destructuring function params ────
function display({ name, age = 18, role: userRole = "user" } = {}) {
  console.log(name, age, userRole);
}
display({ name: "Alice", role: "admin" }); // "Alice" 18 "admin"
display({ name: "Bob" });                  // "Bob" 18 "user"
display();                                 // undefined 18 "user"  — param default {} prevents crash

// ─── Q11: Spread with strings ───────────────
const chars = [..."hello"];
console.log(chars); // ["h", "e", "l", "l", "o"]

const [first2, ...remaining] = "world";
console.log(first2);    // "w"
console.log(remaining); // ["o", "r", "l", "d"]

// ─── Q12: Computed property names ──────────
const key = "name";
const { [key]: value } = { name: "Dynamic" };
console.log(value); // "Dynamic"

// Useful for dynamic key destructuring
function pick(obj, ...keys) {
  return Object.fromEntries(keys.map(k => [k, obj[k]]));
}
console.log(pick({ a: 1, b: 2, c: 3 }, "a", "c")); // { a: 1, c: 3 }
