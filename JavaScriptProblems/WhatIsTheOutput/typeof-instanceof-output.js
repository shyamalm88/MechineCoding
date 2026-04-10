// ─────────────────────────────────────────────
// typeof / instanceof — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: typeof — the full table ───────────
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"    ← bug in JS spec, never fixed
console.log(typeof true);        // "boolean"
console.log(typeof 42);          // "number"
console.log(typeof NaN);         // "number"    ← NaN is a number type!
console.log(typeof "string");    // "string"
console.log(typeof Symbol());    // "symbol"
console.log(typeof 42n);         // "bigint"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"    ← arrays are objects
console.log(typeof function(){}); // "function"  ← functions are callable objects
console.log(typeof class {});    // "function"  ← classes are syntactic sugar for functions

// ─── Q2: typeof undeclared variable ────────
console.log(typeof undeclaredVar); // "undefined"  — no ReferenceError!
// Why: typeof is the ONLY operator that can safely access undeclared variables.
// console.log(undeclaredVar); // ReferenceError

// ─── Q3: instanceof — prototype chain check ──
console.log([] instanceof Array);    // true
console.log([] instanceof Object);   // true  — Array.prototype is in Object's chain
console.log(function(){} instanceof Function); // true
console.log(function(){} instanceof Object);   // true  — functions are objects

console.log(null instanceof Object); // false  — null has no prototype chain

// ─── Q4: instanceof across iframes (the gotcha) ──
// Arrays from different iframes have different Array constructors:
// const iframe = document.createElement('iframe');
// const iframeArray = iframe.contentWindow.Array;
// [] instanceof iframeArray  → false even though it IS an array
// Fix: Array.isArray([]) → always true regardless of realm

// ─── Q5: Custom instanceof with Symbol.hasInstance ──
class EvenNumber {
  static [Symbol.hasInstance](value) {
    return typeof value === "number" && value % 2 === 0;
  }
}
console.log(4 instanceof EvenNumber);  // true
console.log(3 instanceof EvenNumber);  // false
console.log(2 instanceof EvenNumber);  // true

// ─── Q6: constructor property ──────────────
console.log((42).constructor === Number);       // true
console.log("str".constructor === String);      // true
console.log(true.constructor === Boolean);      // true
console.log([].constructor === Array);          // true
console.log({}.constructor === Object);         // true

// But constructor can be overwritten:
function Foo() {}
Foo.prototype = {}; // replaces entire prototype, loses constructor
const f = new Foo();
console.log(f.constructor === Foo);    // false — now Object
console.log(f.constructor === Object); // true

// ─── Q7: Array.isArray vs typeof vs instanceof ──
const arr = [1, 2, 3];
console.log(typeof arr);           // "object"  — not useful
console.log(arr instanceof Array); // true  — but fails cross-realm
console.log(Array.isArray(arr));   // true  — the correct way

// ─── Q8: null checks ───────────────────────
const val = null;
console.log(typeof val === "null");      // false — there's no "null" type string
console.log(typeof val === "object");    // true  — the bug
console.log(val === null);               // true  — correct null check
console.log(val == null);                // true  — also matches undefined

// ─── Q9: typeof with Symbol ─────────────────
const sym = Symbol("id");
console.log(typeof sym);           // "symbol"
console.log(sym.toString());       // "Symbol(id)"
console.log(sym.description);      // "id"

// Symbols are not coerced to string:
// console.log(`${sym}`);          // TypeError: Cannot convert Symbol to string
console.log(String(sym));          // "Symbol(id)"  — explicit conversion works

// ─── Q10: Object.prototype.toString — reliable type detection ──
const toString = Object.prototype.toString;
console.log(toString.call(null));        // "[object Null]"
console.log(toString.call(undefined));   // "[object Undefined]"
console.log(toString.call([]));          // "[object Array]"
console.log(toString.call({}));          // "[object Object]"
console.log(toString.call(/regex/));     // "[object RegExp]"
console.log(toString.call(new Date())); // "[object Date]"
console.log(toString.call(Promise.resolve())); // "[object Promise]"
// This is the most reliable type-checking mechanism in JS.
