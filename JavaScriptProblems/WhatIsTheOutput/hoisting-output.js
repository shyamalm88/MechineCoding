// ─────────────────────────────────────────────
// HOISTING — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: var hoisting ──────────────────────
console.log(a); // undefined  (not ReferenceError — var is hoisted, value is not)
var a = 5;
console.log(a); // 5

// ─── Q2: let / const — Temporal Dead Zone (TDZ) ──
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
// Why: let is hoisted to the block's top but NOT initialized.
//      Accessing it before declaration = TDZ = ReferenceError.

// ─── Q3: function declaration vs function expression ──
foo(); // "foo"  — function declarations are fully hoisted
bar(); // TypeError: bar is not a function

function foo() { console.log("foo"); }
var bar = function() { console.log("bar"); };
// Why: `var bar` is hoisted as undefined.
//      Calling undefined() = TypeError, not ReferenceError.

// ─── Q4: Function declaration overrides var ──
console.log(typeof baz); // "function"  (not "undefined")
var baz = 5;
function baz() {}
console.log(typeof baz); // "number"
// Why: function declarations are hoisted ABOVE var declarations.
//      After execution, the var assignment overwrites it.

// ─── Q5: var inside block ──────────────────
{
  var x = 1;
  let y = 2;
}
console.log(x); // 1   — var leaks out of the block
console.log(y); // ReferenceError — let is block-scoped

// ─── Q6: Hoisting inside function scope ────
function test() {
  console.log(val); // undefined  — hoisted within function scope
  var val = "hello";
  console.log(val); // "hello"
}
test();

// ─── Q7: Class — also has TDZ ──────────────
const obj = new MyClass(); // ReferenceError: Cannot access 'MyClass' before initialization
class MyClass {}
// Why: class declarations are NOT hoisted like functions.
//      They have TDZ just like let/const.

// ─── Q8: Named function expression — name not hoisted ──
console.log(typeof namedFn); // "undefined"  (the var is hoisted)
var namedFn = function inner() {};
console.log(typeof namedFn); // "function"
console.log(typeof inner);   // "undefined"  — inner is local to the function body only

// ─── Q9: Duplicate var declarations ────────
var c = 1;
var c = 2; // no error — var allows redeclaration
console.log(c); // 2

let d = 1;
let d = 2; // SyntaxError: Identifier 'd' has already been declared

// ─── Q10: Hoisting evaluation order ────────
console.log(typeof fn); // "function" — function hoisted above var
var fn = 42;
function fn() {}
console.log(typeof fn); // "number" — var assignment runs
