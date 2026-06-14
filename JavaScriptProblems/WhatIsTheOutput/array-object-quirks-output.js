// ─────────────────────────────────────────────
// ARRAY & OBJECT QUIRKS — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: Sparse arrays — holes vs undefined ──
const sparse = [1, , 3]; // hole at index 1
console.log(sparse.length); // 3
console.log(sparse[1]); // undefined
console.log(1 in sparse); // false — index 1 is a HOLE, not a stored `undefined`
console.log(Object.keys(sparse)); // ['0', '2'] — hole is skipped entirely

sparse.forEach((v) => console.log("forEach:", v)); // logs "1" and "3" only — holes skipped
console.log(sparse.map((v) => v * 2)); // [2, <1 empty item>, 6] — map PRESERVES holes

for (const v of sparse) console.log("for...of:", v); // 1, undefined, 3 — for...of does NOT skip holes!

// ─── Q2: delete vs splice ───────────────────
const a1 = [1, 2, 3];
delete a1[1]; // leaves a HOLE — does not shift elements
console.log(a1); // [1, <1 empty item>, 3]
console.log(a1.length); // 3 — length unchanged

const a2 = [1, 2, 3];
a2.splice(1, 1); // removes element AND shifts subsequent ones
console.log(a2); // [1, 3]
console.log(a2.length); // 2 — length changes

// ─── Q3: for...in vs for...of on arrays ────
const arr = ["a", "b", "c"];
arr.extra = "custom"; // adds a non-index, enumerable property

for (const key in arr) console.log("for...in:", key); // "0","1","2","extra" — string KEYS, includes custom props!
for (const val of arr) console.log("for...of:", val); // "a","b","c" — values only, ignores `extra`

// ─── Q4: Object.keys — integer keys ALWAYS come first, in ascending order ──
const obj = { b: 1, 2: "two", a: 3, 1: "one", 0: "zero" };
console.log(Object.keys(obj)); // ['0','1','2','b','a'] — numeric keys sorted ascending FIRST,
// then string keys in original insertion order — regardless of how they were written!

// ─── Q5: Object.freeze — shallow only ──────
const frozen = Object.freeze({ name: "Alice", address: { city: "NYC" } });
frozen.name = "Bob"; // silently fails (throws in strict mode)
console.log(frozen.name); // "Alice" — top-level mutation blocked

frozen.address.city = "LA"; // works! freeze is SHALLOW
console.log(frozen.address.city); // "LA" — nested object is still mutable

console.log(Object.isFrozen(frozen)); // true
console.log(Object.isFrozen(frozen.address)); // false

// ─── Q6: Array(n) vs Array.of(n) vs new Array(...items) ──
console.log(Array(3)); // [ <3 empty items> ] — creates sparse array of length 3
console.log(Array.of(3)); // [3] — single-element array containing 3
console.log(new Array(1, 2, 3)); // [1, 2, 3] — multiple args -> elements, not length
console.log(Array(3).length); // 3
console.log(Array(3).fill(0)); // [0, 0, 0] — common way to make a dense array

// ─── Q7: `in` operator vs array indices ────
const list = [1, 2, 3];
console.log(0 in list); // true  — index 0 exists
console.log(3 in list); // false — out of bounds
console.log("length" in list); // true — `length` is an own (non-enumerable) property
console.log(Object.keys(list)); // ['0','1','2'] — `length` is NOT enumerable, excluded

// ─── Q8: Array equality is reference-based ──
console.log([1, 2] === [1, 2]); // false — different array instances
console.log([] == ![]); // true — coercion: ![] -> false -> 0, [] -> "" -> 0

// ─── Q9: Comparing objects/arrays in sort() ──
console.log([10, 1, 2].sort()); // [1, 10, 2] — default sort is LEXICOGRAPHIC (string-based)!
console.log([10, 1, 2].sort((a, b) => a - b)); // [1, 2, 10] — numeric comparator required
