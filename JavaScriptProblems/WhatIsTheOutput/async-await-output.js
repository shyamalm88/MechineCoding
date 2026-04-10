// ─────────────────────────────────────────────
// ASYNC / AWAIT EDGE CASES — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: Promise constructor is synchronous ──
console.log("1");
new Promise((resolve) => {
  console.log("2"); // executor runs SYNCHRONOUSLY
  resolve();
}).then(() => console.log("3")); // .then is async (microtask)
console.log("4");
// Output: 1 2 4 3

// ─── Q2: async function always returns a Promise ──
async function greet() {
  return "hello"; // wrapped in Promise.resolve automatically
}
const result = greet();
console.log(result);          // Promise { 'hello' }
result.then(v => console.log(v)); // "hello"

// ─── Q3: await suspends only the current async function ──
async function inner() {
  console.log("inner start");
  await Promise.resolve();
  console.log("inner end");
}
async function outer() {
  console.log("outer start");
  inner(); // NOT awaited — outer continues immediately
  console.log("outer end");
}
outer();
// Output: outer start → inner start → outer end → inner end
// Why: inner() is called but not awaited — outer keeps running.

// ─── Q4: forEach doesn't await async callbacks ──
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log("start");

  [1, 2, 3].forEach(async (n) => {
    await delay(n * 100);
    console.log(n); // fires independently — forEach doesn't wait
  });

  console.log("done"); // printed BEFORE any n
}
run();
// Output: start → done → 1 → 2 → 3

// Fix: use for...of to sequence properly
async function runSequential() {
  for (const n of [1, 2, 3]) {
    await delay(n * 100);
    console.log(n);
  }
}

// ─── Q5: Unhandled rejection vs handled rejection ──
async function fails() {
  throw new Error("oops");
}
fails(); // UnhandledPromiseRejection — async throw = rejected promise

async function safeRun() {
  try {
    await fails();
  } catch (e) {
    console.log("caught:", e.message); // "caught: oops"
  }
}

// ─── Q6: Promise.all short-circuits on first rejection ──
async function demo() {
  try {
    const results = await Promise.all([
      Promise.resolve(1),
      Promise.reject("error"),
      Promise.resolve(3), // this never makes it into results
    ]);
    console.log(results);
  } catch (e) {
    console.log("caught:", e); // "caught: error"
  }
}
demo();
// Promise.all rejects as soon as ANY promise rejects.
// The other promises still run — Promise.all just ignores their results.

// ─── Q7: async/await vs .then ordering ─────
async function asyncFn() {
  console.log("A");
  await null; // one microtask tick
  console.log("B");
  await null; // second microtask tick
  console.log("C");
}
asyncFn();
Promise.resolve()
  .then(() => console.log("D"))
  .then(() => console.log("E"));
// Output: A → D → B → E → C
// Why: each `await null` yields one microtask.
//      .then chains also each take one tick.

// ─── Q8: return vs return await in try/catch ──
async function withoutAwait() {
  try {
    return Promise.reject("error"); // returns rejected promise WITHOUT catching
  } catch (e) {
    console.log("caught"); // NEVER runs
  }
}

async function withAwait() {
  try {
    return await Promise.reject("error"); // awaits — rejection caught here
  } catch (e) {
    console.log("caught:", e); // "caught: error"  — runs
  }
}
// return Promise.reject → rejection propagates to CALLER's catch
// return await Promise.reject → rejection caught by THIS function's try/catch

// ─── Q9: Promise.allSettled — never rejects ──
async function allSettledDemo() {
  const results = await Promise.allSettled([
    Promise.resolve(1),
    Promise.reject("error"),
    Promise.resolve(3),
  ]);
  results.forEach(r => console.log(r));
}
allSettledDemo();
// Output:
// { status: "fulfilled", value: 1 }
// { status: "rejected",  reason: "error" }
// { status: "fulfilled", value: 3 }

// ─── Q10: Async IIFE and top-level await ────
// Without top-level await (CommonJS):
(async () => {
  const data = await Promise.resolve("fetched");
  console.log(data); // "fetched"
})();

// With top-level await (ES Modules only):
// const data = await Promise.resolve("fetched");
// console.log(data);

// ─── Q11: Promise.race ──────────────────────
async function raceDemo() {
  const result = await Promise.race([
    new Promise(r => setTimeout(() => r("slow"), 200)),
    new Promise(r => setTimeout(() => r("fast"), 100)),
    new Promise((_, rj) => setTimeout(() => rj("error"), 150)),
  ]);
  console.log(result); // "fast" — resolves at 100ms before error at 150ms
}
raceDemo();

// ─── Q12: Promise.any ───────────────────────
async function anyDemo() {
  try {
    const result = await Promise.any([
      Promise.reject("err1"),
      Promise.resolve("success"), // first resolved — wins
      Promise.reject("err2"),
    ]);
    console.log(result); // "success"
  } catch (e) {
    // Only throws AggregateError if ALL reject
    console.log(e instanceof AggregateError);
  }
}
anyDemo();
