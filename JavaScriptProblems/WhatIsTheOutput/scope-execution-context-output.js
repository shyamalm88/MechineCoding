// ─────────────────────────────────────────────
// SCOPE & EXECUTION CONTEXT — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: Block scope with let/const ────────
let x = "global";
{
  let x = "block"; // separate binding — does not affect outer x
  console.log(x);  // "block"
}
console.log(x);    // "global"

// ─── Q2: Function scope vs block scope ─────
function test() {
  if (true) {
    var a = "var";   // function-scoped — leaks out of if block
    let b = "let";   // block-scoped — stays in if block
  }
  console.log(a); // "var"
  console.log(b); // ReferenceError
}

// ─── Q3: Execution context — IIFE ──────────
var count = 0;
(function() {
  var count = 10; // own function scope — doesn't affect outer count
  count++;
  console.log(count); // 11
})();
console.log(count); // 0  — outer count unchanged

// ─── Q4: Lexical scope — closure reads outer ──
let n = 1;
function outer() {
  let n = 2;
  function inner() {
    let n = 3;
    console.log(n); // 3 — inner's own n
  }
  inner();
  console.log(n);   // 2 — outer's n
}
outer();
console.log(n);     // 1 — global n

// ─── Q5: let in switch — one block ─────────
switch (true) {
  case true:
    let val = "one"; // defined in the switch block
    console.log(val);
    break;
  case false:
    // console.log(val); // can see val — same block! (TDZ though)
    let val2 = "two"; // fine — different name
}

// ─── Q6: Shadowing — inner hides outer ─────
const fn = () => {
  const msg = "outer";
  {
    const msg = "inner"; // shadows outer msg in this block
    console.log(msg);   // "inner"
  }
  console.log(msg);     // "outer"
};
fn();

// ─── Q7: Function declaration in block ─────
// Behavior is non-standard across environments — avoid this!
if (true) {
  function surprise() { return "inside if"; }
}
// In non-strict: surprise may be hoisted to function scope
// In strict mode: surprise is block-scoped

// ─── Q8: arguments object vs rest params ───
function argsTest() {
  console.log(arguments[0], arguments[1]); // 1 2
  // arguments is NOT available in arrow functions
}
argsTest(1, 2);

const arrowTest = (...args) => {
  // console.log(arguments); // ReferenceError in arrow functions
  console.log(args); // [1, 2] — rest params instead
};
arrowTest(1, 2);

// ─── Q9: Temporal Dead Zone across blocks ───
function tdz() {
  console.log(typeof x); // ReferenceError! NOT "undefined"
  // typeof is safe for undeclared variables, but NOT for TDZ variables
  let x = 5;
}
// tdz(); // would throw

function safe() {
  console.log(typeof y); // "undefined" — y is undeclared (no TDZ)
}
safe();

// ─── Q10: Module scope vs global scope ─────
// In ES Modules (.mjs or type="module"):
//   - Top-level variables are module-scoped, not global
//   - `this` at module top level is undefined (not window)
//   - strict mode is on by default

// In scripts:
//   - Top-level var adds to window
//   var globalVar = "I'm global";
//   console.log(window.globalVar); // "I'm global"

// In modules:
//   var moduleVar = "I'm module-scoped";
//   console.log(window.moduleVar); // undefined

// ─── Q11: eval scope ───────────────────────
function withEval() {
  eval("var injected = 42"); // var inside eval leaks into enclosing function scope
  console.log(injected); // 42 — eval injected into function scope
}
withEval();

// In strict mode:
function strictEval() {
  "use strict";
  eval("var strictVar = 99");
  // console.log(strictVar); // ReferenceError — strict eval has its own scope
}

// ─── Q12: Dynamic vs lexical scope ─────────
// JavaScript uses LEXICAL scope (static) — functions close over where they are DEFINED.
// NOT dynamic scope (where they are CALLED).

const name = "global";

function getName() {
  return name; // resolves to lexical scope — where getName is DEFINED
}

function runInContext() {
  const name = "local";
  return getName(); // caller's `name` doesn't matter
}

console.log(runInContext()); // "global" — lexical scope wins
