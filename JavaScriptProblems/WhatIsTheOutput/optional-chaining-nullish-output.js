// ─────────────────────────────────────────────
// OPTIONAL CHAINING (?.) & NULLISH COALESCING (??) — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: ?. short-circuits to undefined, no throw ──
const user = { profile: { name: "Alice" } };
console.log(user.profile?.name); // "Alice"
console.log(user.address?.city); // undefined — `address` is undefined, chain stops safely
// console.log(user.address.city); // TypeError: Cannot read properties of undefined

// ─── Q2: ?? vs || — the key difference ─────
console.log(0 || "default"); // "default" — 0 is falsy, || falls back
console.log(0 ?? "default"); // 0         — 0 is NOT null/undefined, ?? keeps it

console.log("" || "default"); // "default" — "" is falsy
console.log("" ?? "default"); // ""        — "" is not nullish

console.log(null || "default"); // "default"
console.log(null ?? "default"); // "default" — both treat null as "missing"

console.log(false ?? "default"); // false — only null/undefined trigger ??

// ─── Q3: ??= — assign only if currently null/undefined ──
const settings = { theme: "dark", fontSize: 0 };
settings.theme ??= "light"; // theme is "dark", not nullish -> unchanged
settings.fontSize ??= 14; // fontSize is 0, NOT nullish -> unchanged!
settings.lineHeight ??= 1.5; // lineHeight is undefined -> assigned
console.log(settings); // { theme: 'dark', fontSize: 0, lineHeight: 1.5 }

// Contrast with ||= which WOULD overwrite 0 and "":
const s2 = { fontSize: 0 };
s2.fontSize ||= 14;
console.log(s2.fontSize); // 14 — ||= treats 0 as "missing", ??= would not

// ─── Q4: ?.() optional call — skips invocation if nullish ──
const api = {
  onSuccess: () => console.log("success!"),
  onError: null,
};
api.onSuccess?.(); // "success!" — called normally
api.onError?.(); // (nothing) — onError is null, call is skipped entirely, no TypeError
// api.onError(); // TypeError: api.onError is not a function

// ─── Q5: ?.[] optional computed member access ──
const data = { list: [10, 20, 30] };
console.log(data.list?.[0]); // 10
console.log(data.missing?.[0]); // undefined — short-circuits before indexing

// ─── Q6: Short-circuiting skips the ENTIRE rest of the chain ──
let sideEffectRan = false;
function sideEffect() {
  sideEffectRan = true;
  return "called";
}
const obj = { a: null };
console.log(obj.a?.b.c(sideEffect())); // undefined
console.log(sideEffectRan); // false
// Why: once `obj.a` is nullish, EVERYTHING after `?.` is skipped —
// `.c(...)` is never reached, so `sideEffect()` (its argument) never runs.

// ─── Q7: Mixing ?? with || or && directly is a SyntaxError ──
// console.log(null ?? true || false); // SyntaxError: Unexpected token '||'
console.log((null ?? true) || false); // true — parentheses required to disambiguate
console.log(null ?? (true || false)); // true

// ─── Q8: Optional chaining with function calls ──
const obj2 = {
  getName() {
    return "Bob";
  },
};
console.log(obj2.getName?.()); // "Bob"
console.log(obj2.getAge?.()); // undefined — getAge doesn't exist, ?.() skips the call
// console.log(obj2.getAge()); // TypeError: obj2.getAge is not a function

// ─── Q9: Deep chains — only ONE undefined check needed ──
const deeply = { a: { b: { c: null } } };
console.log(deeply?.a?.b?.c?.d?.e); // undefined — stops cleanly at `c` (null)
console.log(deeply?.x?.y?.z?.w); // undefined — stops at the very first missing link (`x`)
