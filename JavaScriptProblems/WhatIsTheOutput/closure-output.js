// ─────────────────────────────────────────────
// CLOSURES — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: var in loop ───────────────────────
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 3 3 3
// Why: var is function-scoped — all 3 callbacks close over the SAME `i`.
//      By the time setTimeout fires, the loop has finished and i === 3.

// Fix 1 — use let (block-scoped, new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 0 1 2

// Fix 2 — IIFE captures value at each iteration
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i);
}
// Output: 0 1 2

// ─── Q2: Closure captures reference, not value ──
function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}
const counter = makeCounter();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.value()); // 1
// Why: all three methods close over the SAME `count` variable.

// ─── Q3: Classic stale closure trap ────────
function createFunctions() {
  const result = [];
  for (var i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }
  return result;
}
const fns = createFunctions();
console.log(fns[0]()); // 3
console.log(fns[1]()); // 3
console.log(fns[2]()); // 3
// Why: same as Q1 — all functions share the same `i` reference.

// ─── Q4: Closure in object method ──────────
function outer() {
  let x = 10;
  function inner() {
    console.log(x);
  }
  x = 20; // changes AFTER inner is defined
  inner();
}
outer(); // 20
// Why: inner closes over the BINDING of x, not its value at definition time.

// ─── Q5: Immediately invoked with closure ───
const add = (function() {
  let count = 0;
  return function(n) {
    count += n;
    return count;
  };
})();

console.log(add(5));  // 5
console.log(add(3));  // 8
console.log(add(2));  // 10
// Why: IIFE runs once, returns a closure over `count`.
//      Each call to add() shares and mutates the same count.

// ─── Q6: Closure in async ──────────────────
function fetchData() {
  let data = null;

  setTimeout(() => {
    data = "loaded";
  }, 100);

  return () => data; // closes over `data`
}
const getData = fetchData();
console.log(getData()); // null   (called immediately — timeout hasn't fired)
setTimeout(() => {
  console.log(getData()); // "loaded"  (called after 100ms)
}, 200);
