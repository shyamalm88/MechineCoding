// ─────────────────────────────────────────────
// GENERATORS & ITERATORS — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: Basic generator execution ─────────
function* gen() {
  console.log("before 1");
  yield 1;
  console.log("before 2");
  yield 2;
  console.log("done");
  return 3;
}

const g = gen();
// Nothing logged yet — generator body doesn't run until next() is called

console.log(g.next()); // "before 1" → { value: 1, done: false }
console.log(g.next()); // "before 2" → { value: 2, done: false }
console.log(g.next()); // "done"     → { value: 3, done: true }
console.log(g.next()); //             → { value: undefined, done: true }

// ─── Q2: return value NOT included in for...of ──
function* nums() {
  yield 1;
  yield 2;
  return 3; // ignored by for...of and spread
}

console.log([...nums()]); // [1, 2]  — return value excluded

for (const n of nums()) {
  console.log(n); // 1, 2   — return not iterated
}

// ─── Q3: Passing values into generator via next() ──
function* calculator() {
  const a = yield "Enter a:"; // pauses, returns prompt; resumes with passed value
  const b = yield "Enter b:";
  return a + b;
}

const calc = calculator();
console.log(calc.next());      // { value: "Enter a:", done: false }
console.log(calc.next(10));    // { value: "Enter b:", done: false }  — a = 10
console.log(calc.next(20));    // { value: 30, done: true }           — b = 20

// Key: the value passed to next() becomes the RESULT of the yield expression
// First next() value is ignored (no yield to receive it yet)

// ─── Q4: Generator as infinite sequence ────
function* naturals(start = 0) {
  while (true) {
    yield start++;
  }
}

const nat = naturals(1);
console.log(nat.next().value); // 1
console.log(nat.next().value); // 2
console.log(nat.next().value); // 3
// Never terminates — only call next() when you need the next value

// Take first n values:
function take(n, iter) {
  const result = [];
  for (const val of iter) {
    result.push(val);
    if (result.length >= n) break;
  }
  return result;
}
console.log(take(5, naturals(10))); // [10, 11, 12, 13, 14]

// ─── Q5: yield* — delegate to another generator ──
function* inner() {
  yield "a";
  yield "b";
}

function* outer() {
  yield 1;
  yield* inner(); // delegates to inner — flattens values
  yield 2;
}

console.log([...outer()]); // [1, "a", "b", 2]

// yield* also works with any iterable:
function* withArray() {
  yield* [10, 20, 30];
  yield* "hello";
}
console.log([...withArray()]); // [10, 20, 30, "h", "e", "l", "l", "o"]

// ─── Q6: return() and throw() ──────────────
function* g2() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("finally"); // runs on return() or throw()
  }
}

const gen2 = g2();
console.log(gen2.next());         // { value: 1, done: false }
console.log(gen2.return("done")); // "finally" → { value: "done", done: true }
console.log(gen2.next());         // { value: undefined, done: true }

// throw() injects an error at the yield point:
function* g3() {
  try {
    yield 1;
  } catch (e) {
    console.log("caught:", e);
    yield 2;
  }
}
const gen3 = g3();
gen3.next();              // { value: 1, done: false }
gen3.throw("oops");       // "caught: oops" → { value: 2, done: false }

// ─── Q7: Custom iterator protocol ──────────
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

console.log([...range]);           // [1, 2, 3, 4, 5]
for (const n of range) console.log(n); // 1 2 3 4 5

// ─── Q8: Generator memory efficiency ───────
// Traditional: builds entire array in memory
function fibArray(n) {
  const arr = [0, 1];
  for (let i = 2; i < n; i++) arr.push(arr[i-1] + arr[i-2]);
  return arr;
}

// Generator: one value at a time
function* fib() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

console.log(take(8, fib())); // [0, 1, 1, 2, 3, 5, 8, 13]
